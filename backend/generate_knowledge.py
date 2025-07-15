# todo 3 parallel calls to 3 agents to generate knowledge for group chat agents

# Copyright (c) Microsoft. All rights reserved.

import asyncio

from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion


async def main():
    # 1. Create the agent by specifying the service
    agent = ChatCompletionAgent(
        service=AzureChatCompletion(),
        name="Assistant",
        instructions="You are a location assessment specialist. Generate some knowledge.",
    )

    response = await agent.get_response(
        messages=[
            "My property is located at maximilianstrasse 1, 80333 München, Germany."
        ],
    )
    # 3. Print the response
    # todo write to file
    print(f"# {response.name}: {response}")


if __name__ == "__main__":
    asyncio.run(main())
