# todo 3 parallel calls to 3 agents to generate knowledge for group chat agents

# Copyright (c) Microsoft. All rights reserved.

import asyncio

from dotenv import load_dotenv
from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion

agentLocal = ChatCompletionAgent(
    name="Assistant",
    instructions="You are a location assessment specialist. Generate some knowledge.",
)


agentCustomer = ChatCompletionAgent(
    service=AzureChatCompletion(deployment_name="gpt-4o"),
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

    with open("generated_knowledge_location.txt", "w", encoding="utf-8") as file:
        file.write(f"Location Assessment:\n{location_response}\n\n")

    with open("generated_knowledge_customer.txt", "w", encoding="utf-8") as file:
        file.write(f"Customer Assessment:\n{customer_response}\n")

    # # Print responses
    # print(f"# {location_response.name}: {location_response}")
    # print(f"# {customer_response.name}: {customer_response}")


if __name__ == "__main__":
    load_dotenv()
    asyncio.run(generate_knowledge())
