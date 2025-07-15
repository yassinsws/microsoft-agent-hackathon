# todo 3 parallel calls to 3 agents to generate knowledge for group chat agents

# Copyright (c) Microsoft. All rights reserved.

import asyncio
import json

from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion

from azure.identity.aio import DefaultAzureCredential
from semantic_kernel.agents import AzureAIAgent, AzureAIAgentSettings

async def bing_search_agent():
    with open("agent_config.json", "r") as file:
        json_object = json.load(file)
    
    for obj in json_object:
        if obj["name"] == "bingAgent":
            bing_search_agent_id = obj["id"]

    print(bing_search_agent_id)
    async with (
        DefaultAzureCredential() as creds,
        AzureAIAgent.create_client(credential=creds) as client,
    ):
        agent_definition = await client.agents.get_agent(assistant_id=bing_search_agent_id)
        bing_agent = AzureAIAgent(client=client, definition=agent_definition)
    return bing_agent

bing_search_agent = asyncio.run(bing_search_agent())

agentLocal = ChatCompletionAgent(
    service=AzureChatCompletion(),
    name="Assistant",
    instructions="You are a location assessment specialist. Generate some knowledge.",
)


agentCustomer = ChatCompletionAgent(
    service=AzureChatCompletion(),
    name="Assistant",
    instructions="You are a customer assessment specialist. Generate some knowledge.",
)


async def generate_knowledge():
    # Parallel execution of both agent queries
    location_task = agentLocal.get_response(
        messages=[
            "My property is located at maximilianstrasse 1, 80333 München, Germany."
        ],
    )

    customer_task = agentCustomer.get_response(
        messages=["Central city location, close to public transport and amenities. "],
    )

    # Wait for both tasks to complete simultaneously
    location_response, customer_response = await asyncio.gather(
        location_task, customer_task
    )

    # Print responses
    print(f"# {location_response.name}: {location_response}")
    print(f"# {customer_response.name}: {customer_response}")


if __name__ == "__main__":
    asyncio.run(generate_knowledge())
