# Copyright (c) Microsoft. All rights reserved.

import asyncio
import sys

from semantic_kernel.agents import Agent, ChatCompletionAgent, GroupChatOrchestration
from semantic_kernel.agents.orchestration.group_chat import (
    BooleanResult,
    GroupChatManager,
    MessageResult,
    StringResult,
)
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.chat_completion_client_base import (
    ChatCompletionClientBase,
)
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion
from semantic_kernel.connectors.ai.prompt_execution_settings import (
    PromptExecutionSettings,
)
from semantic_kernel.contents import AuthorRole, ChatHistory, ChatMessageContent
from semantic_kernel.functions import KernelArguments
from semantic_kernel.kernel import Kernel
from semantic_kernel.prompt_template import KernelPromptTemplate, PromptTemplateConfig

if sys.version_info >= (3, 12):
    from typing import override  # pragma: no cover
else:
    from typing_extensions import override  # pragma: no cover


def get_agents() -> list[Agent]:
    """Return a list of agents that will participate in the group style discussion.

    Feel free to add or remove agents.
    """
    web_search_agent = ChatCompletionAgent(
        name="WebSearch",
        description="Search the web using Bing Search for possible customers.",
        instructions=(
            "Search the internet for similar customers."
        ),
        service=AzureChatCompletion(),
    )

    return [
        web_search_agent
    ]


class ChatCompletionGroupChatManager(GroupChatManager):
    """A simple chat completion base group chat manager.

    This chat completion service requires a model that supports structured output.
    """

    service: ChatCompletionClientBase

    topic: str

    termination_prompt: str = (
        "You are mediator that guides a discussion on the topic of '{{$topic}}'. "
        "You need to determine if the discussion has reached a conclusion. "
        "If you would like to end the discussion, please respond with True. Otherwise, respond with False."
    )

    selection_prompt: str = (
        "You are mediator that guides a discussion on the topic of '{{$topic}}'. "
        "You need to select the next participant to speak. "
        "Here are the names and descriptions of the participants: "
        "{{$participants}}\n"
        "Please respond with only the name of the participant you would like to select."
    )

    result_filter_prompt: str = (
        "You are mediator that guides a discussion on the topic of '{{$topic}}'. "
        "You have just concluded the discussion. "
        "Please summarize the discussion and provide a closing statement."
    )

    def __init__(self, topic: str, service: ChatCompletionClientBase, **kwargs) -> None:
        """Initialize the group chat manager."""
        super().__init__(topic=topic, service=service, **kwargs)

    async def _render_prompt(self, prompt: str, arguments: KernelArguments) -> str:
        """Helper to render a prompt with arguments."""
        prompt_template_config = PromptTemplateConfig(template=prompt)
        prompt_template = KernelPromptTemplate(
            prompt_template_config=prompt_template_config
        )
        return await prompt_template.render(Kernel(), arguments=arguments)

    @override
    async def should_request_user_input(
        self, chat_history: ChatHistory
    ) -> BooleanResult:
        """Provide concrete implementation for determining if user input is needed.

        The manager will check if input from human is needed after each agent message.
        """
        return BooleanResult(
            result=False,
            reason="This group chat manager does not require user input.",
        )

    @override
    async def should_terminate(self, chat_history: ChatHistory) -> BooleanResult:
        """Provide concrete implementation for determining if the discussion should end.

        The manager will check if the conversation should be terminated after each agent message
        or human input (if applicable).
        """
        should_terminate = await super().should_terminate(chat_history)
        if should_terminate.result:
            return should_terminate

        chat_history.messages.insert(
            0,
            ChatMessageContent(
                role=AuthorRole.SYSTEM,
                content=await self._render_prompt(
                    self.termination_prompt,
                    KernelArguments(topic=self.topic),
                ),
            ),
        )
        chat_history.add_message(
            ChatMessageContent(
                role=AuthorRole.USER, content="Determine if the discussion should end."
            ),
        )

        response = await self.service.get_chat_message_content(
            chat_history,
            settings=PromptExecutionSettings(response_format=BooleanResult),
        )

        termination_with_reason = BooleanResult.model_validate_json(response.content)

        print("*********************")
        print(
            f"Should terminate: {termination_with_reason.result}\nReason: {termination_with_reason.reason}."
        )
        print("*********************")

        return termination_with_reason

    @override
    async def select_next_agent(
        self,
        chat_history: ChatHistory,
        participant_descriptions: dict[str, str],
    ) -> StringResult:
        """Provide concrete implementation for selecting the next agent to speak.

        The manager will select the next agent to speak after each agent message
        or human input (if applicable) if the conversation is not terminated.
        """
        chat_history.messages.insert(
            0,
            ChatMessageContent(
                role=AuthorRole.SYSTEM,
                content=await self._render_prompt(
                    self.selection_prompt,
                    KernelArguments(
                        topic=self.topic,
                        participants="\n".join(
                            [f"{k}: {v}" for k, v in participant_descriptions.items()]
                        ),
                    ),
                ),
            ),
        )
        chat_history.add_message(
            ChatMessageContent(
                role=AuthorRole.USER,
                content="Now select the next participant to speak.",
            ),
        )

        response = await self.service.get_chat_message_content(
            chat_history,
            settings=PromptExecutionSettings(response_format=StringResult),
        )

        participant_name_with_reason = StringResult.model_validate_json(
            response.content
        )

        print("*********************")
        print(
            f"Next participant: {participant_name_with_reason.result}\nReason: {participant_name_with_reason.reason}."
        )
        print("*********************")

        if participant_name_with_reason.result in participant_descriptions:
            return participant_name_with_reason

        raise RuntimeError(f"Unknown participant selected: {response.content}.")

    @override
    async def filter_results(
        self,
        chat_history: ChatHistory,
    ) -> MessageResult:
        """Provide concrete implementation for filtering the results of the discussion.

        The manager will filter the results of the conversation after the conversation is terminated.
        """
        if not chat_history.messages:
            raise RuntimeError("No messages in the chat history.")

        chat_history.messages.insert(
            0,
            ChatMessageContent(
                role=AuthorRole.SYSTEM,
                content=await self._render_prompt(
                    self.result_filter_prompt,
                    KernelArguments(topic=self.topic),
                ),
            ),
        )
        chat_history.add_message(
            ChatMessageContent(
                role=AuthorRole.USER, content="Please summarize the discussion."
            ),
        )

        response = await self.service.get_chat_message_content(
            chat_history,
            settings=PromptExecutionSettings(response_format=StringResult),
        )
        string_with_reason = StringResult.model_validate_json(response.content)

        return MessageResult(
            result=ChatMessageContent(
                role=AuthorRole.ASSISTANT, content=string_with_reason.result
            ),
            reason=string_with_reason.reason,
        )


def agent_response_callback(message: ChatMessageContent) -> None:
    """Callback function to retrieve agent responses."""
    print(f"**{message.name}**\n{message.content}")


async def main():
    """Main function to run the agents."""
    # 1. Create a group chat orchestration with the custom group chat manager
    agents = get_agents()
    group_chat_orchestration = GroupChatOrchestration(
        members=agents,
        manager=ChatCompletionGroupChatManager(
            topic="What does a good life mean to you personally?",
            service=AzureChatCompletion(),
            max_rounds=10,
        ),
        agent_response_callback=agent_response_callback,
    )

    # 2. Create a runtime and start it
    runtime = InProcessRuntime()
    runtime.start()

    # 3. Invoke the orchestration with a task and the runtime
    orchestration_result = await group_chat_orchestration.invoke(
        task="Please start the discussion.",
        runtime=runtime,
    )

    # 4. Wait for the results
    value = await orchestration_result.get()
    print(value)

    # 5. Stop the runtime after the invocation is complete
    await runtime.stop_when_idle()


if __name__ == "__main__":
    asyncio.run(main())
