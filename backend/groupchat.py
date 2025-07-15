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

    Loads pre-generated knowledge from text files and incorporates it into agent instructions.
    """

    # Laden der vorgenerierten Wissensdateien
    try:
        with open(
            "backend/generated_knowledge_customer.txt", "r", encoding="utf-8"
        ) as file:
            customer_knowledge = file.read()
    except FileNotFoundError:
        try:
            with open(
                "generated_knowledge_customer.txt", "r", encoding="utf-8"
            ) as file:
                customer_knowledge = file.read()
        except FileNotFoundError:
            customer_knowledge = "Keine Kundeninformationen verfügbar."

    try:
        with open(
            "backend/generated_knowledge_location.txt", "r", encoding="utf-8"
        ) as file:
            location_knowledge = file.read()
    except FileNotFoundError:
        try:
            with open(
                "generated_knowledge_location.txt", "r", encoding="utf-8"
            ) as file:
                location_knowledge = file.read()
        except FileNotFoundError:
            location_knowledge = "Keine Standortinformationen verfügbar."

    try:
        with open(
            "backend/generated_knowledge_images.txt", "r", encoding="utf-8"
        ) as file:
            images_knowledge = file.read()
    except FileNotFoundError:
        try:
            with open("generated_knowledge_images.txt", "r", encoding="utf-8") as file:
                images_knowledge = file.read()
        except FileNotFoundError:
            images_knowledge = "Keine Bildinformationen verfügbar."

    # Erstellung der Agenten mit dem geladenen Wissen
    customer_agent = ChatCompletionAgent(
        name="CustomerExpert",
        description="Expert for potential buyers of the property.",
        instructions=(
            "You are an expert on real estate customer needs and preferences. "
            "You understand what buyers are looking for in properties and can highlight "
            "features that would appeal to different customer demographics. "
            "You have deep knowledge about customer behavior in real estate markets. "
            "Use this expertise to provide insights during discussions about properties.\n\n"
            f"Additional context about the property's customer assessment:\n{customer_knowledge}"
        ),
        service=AzureChatCompletion(),
    )
    location_agent = ChatCompletionAgent(
        name="LocationExpert",
        description="Expert for location of property.",
        instructions=(
            "You are an expert on property locations and neighborhoods. "
            "You have deep knowledge about different areas, including information on "
            "school districts, transportation access, local amenities, safety records, "
            "and future development plans that might affect property values. "
            "Use this knowledge to provide context about property locations during discussions.\n\n"
            f"Additional context about the property's location:\n{location_knowledge}"
        ),
        service=AzureChatCompletion(),
    )
    image_agent = ChatCompletionAgent(
        name="ImageExpert",
        description="Expert for images of the property.",
        instructions=(
            "You are an expert in visual property assessment and real estate photography. "
            "You can analyze property images to identify key features, architectural elements, "
            "potential issues, staging effectiveness, and overall property presentation. "
            "You understand how visual impressions impact buyer decisions and can provide "
            "insights about property images during discussions.\n\n"
            f"Additional context about the property's images:\n{images_knowledge}"
        ),
        service=AzureChatCompletion(),
    )

    return [
        customer_agent,
        location_agent,
        image_agent,
    ]


class ChatCompletionGroupChatManager(GroupChatManager):
    """A chat completion based group chat manager for property assessment.

    This group chat manager coordinates experts to generate a comprehensive property assessment
    including property description and price estimation.
    """

    service: ChatCompletionClientBase

    topic: str

    termination_prompt: str = (
        "Du bist ein Moderator, der eine Fachdiskussion zum Thema '{{$topic}}' leitet. "
        "Die Experten diskutieren eine Immobilie und tauschen ihre fachlichen Einschätzungen aus. "
        "Bestimme, ob die Diskussion ausreichend Informationen für eine fundierte Immobilienbewertung "
        "mit Beschreibung und Preisschätzung gesammelt hat. "
        "Wenn genügend Informationen zu Lage, Kundenpräferenzen und visuellen Aspekten der Immobilie "
        "diskutiert wurden, antworte mit True. Andernfalls mit False."
    )

    selection_prompt: str = (
        "Du bist ein Moderator, der eine Fachdiskussion zum Thema '{{$topic}}' leitet. "
        "Die Experten analysieren eine Immobilie aus ihren jeweiligen Fachperspektiven. "
        "Wähle den nächsten Teilnehmer aus, der sprechen soll, um die Bewertung zu vervollständigen. "
        "Berücksichtige dabei, welche Informationen für eine fundierte Immobilienbewertung noch fehlen. "
        "Hier sind die Namen und Beschreibungen der Teilnehmer: "
        "{{$participants}}\n"
        "Antworte nur mit dem Namen des Teilnehmers, den du auswählen möchtest."
    )

    result_filter_prompt: str = (
        "Du bist ein professioneller Immobilienbewerter, der eine ausführliche Immobilienbewertung "
        "basierend auf der vorangegangenen Expertendiskussion zum Thema '{{$topic}}' erstellt. "
        "Erstelle ein detailliertes JSON-Objekt mit folgender Struktur für die bewertete Immobilie:\n\n"
        "{\n"
        '  "property": {\n'
        '    "id": "[generiere eine eindeutige ID]",\n'
        '    "title": "[passender Titel für die Immobilie]",\n'
        '    "price": [Preisschätzung als Zahl ohne Trennzeichen],\n'
        '    "pricePerSqft": [Preis pro Quadratmeter als Zahl],\n'
        '    "location": {\n'
        '      "address": "[vollständige Adresse]",\n'
        '      "city": "[Stadt]",\n'
        '      "state": "[Bundesland]",\n'
        '      "zipCode": "[PLZ]",\n'
        '      "neighborhood": "[Stadtteil]",\n'
        '      "coordinates": {\n'
        '        "lat": [Breitengrad],\n'
        '        "lng": [Längengrad]\n'
        "      }\n"
        "    },\n"
        '    "details": {\n'
        '      "bedrooms": [Anzahl],\n'
        '      "bathrooms": [Anzahl],\n'
        '      "sqft": [Quadratmeter als Zahl],\n'
        '      "type": "[Immobilientyp]",\n'
        '      "yearBuilt": [Baujahr als Zahl],\n'
        '      "parking": [Anzahl Parkplätze],\n'
        '      "lotSize": [Grundstücksgröße]\n'
        "    },\n"
        '    "images": ["Platzhalter f��r Bilder"],\n'
        '    "features": ["Feature1", "Feature2", ...],\n'
        '    "description": "[ausführliche Beschreibung der Immobilie]",\n'
        '    "confidence_score": [Zahl zwischen 0 und 1],\n'
        '    "ai_suggestions": ["Vorschlag1", "Vorschlag2", ...],\n'
        '    "pricing_analysis": {\n'
        '      "market_position": "[Position im Markt]",\n'
        '      "confidence": [Zahl zwischen 0 und 1],\n'
        '      "price_difference_percentage": [Prozentsatz],\n'
        '      "comparable_properties": {\n'
        '        "avg_price": [Durchschnittspreis],\n'
        '        "min_price": [Mindestpreis],\n'
        '        "max_price": [Höchstpreis],\n'
        '        "sample_size": [Anzahl]\n'
        "      },\n"
        '      "market_insights": ["Insight1", "Insight2", ...]\n'
        "    }\n"
        "  },\n"
        '  "processing_time": [Zeit in Sekunden],\n'
        '  "recommendations": ["Empfehlung1", "Empfehlung2", ...]\n'
        "}\n\n"
        "Fülle alle Werte basierend auf der Expertendiskussion sinnvoll aus. Das JSON muss "
        "syntaktisch korrekt und maschinenlesbar sein. Achte besonders auf die korrekte "
        "Formatierung von Zahlen (ohne Anführungszeichen) und Zeichenketten (mit Anführungszeichen)."
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
                role=AuthorRole.SYSTEM,
                content=await self._render_prompt(
                    self.result_filter_prompt,
                    KernelArguments(topic=self.topic),
                ),
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


async def do_groupchat():
    """Main function to run the agents."""
    # 1. Create a group chat orchestration with the custom group chat manager
    agents = get_agents()
    group_chat_orchestration = GroupChatOrchestration(
        members=agents,
        manager=ChatCompletionGroupChatManager(
            topic="Welche Eigenschaften machen eine Immobilie besonders wertvoll?",
            service=AzureChatCompletion(),
            max_rounds=5,
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

    # Datei nur mit dem eigentlichen JSON-Inhalt speichern (ohne MessageResult-Wrapper)
    json_content = value.content
    with open("group_chat_result.txt", "w", encoding="utf-8") as file:
        file.write(json_content)

    # 5. Stop the runtime after the invocation is complete
    await runtime.stop_when_idle()


if __name__ == "__main__":
    asyncio.run(do_groupchat())
