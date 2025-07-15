# todo 3 parallel calls to 3 agents to generate knowledge for group chat agents

# Copyright (c) Microsoft. All rights reserved.

import asyncio

from dotenv import load_dotenv
from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion

from backend.main import Input

agentLocal = ChatCompletionAgent(
    service=AzureChatCompletion(deployment_name="gpt-4o"),
    name="Assistant",
    instructions="You are a location assessment specialist. Generate some knowledge.",
)


agentCustomer = ChatCompletionAgent(
    service=AzureChatCompletion(deployment_name="gpt-4o"),
    name="Assistant",
    instructions="You are a customer assessment specialist. Generate some knowledge.",
)


agentImages = ChatCompletionAgent(
    service=AzureChatCompletion(deployment_name="gpt-4o"),
    name="Assistant",
    instructions="You are a real estate image assessment specialist. Analyze the provided property images and describe the property features, condition, style, layout, and any notable aspects visible in the images.",
)


async def generate_knowledge(input: Input):
    # Parallel execution of both agent queries
    location_task = agentLocal.get_response(
        messages=[input.prompt],
    )

    customer_task = agentCustomer.get_response(
        messages=[input.prompt],
    )

    # Prepare images for the image agent (assuming input.images contains base64 encoded images)
    images_task = agentImages.get_response(
        messages=["Here are my images"],
        image_references=[
            {"image_data": {"url": f"data:image/jpeg;base64,{img}"}}
            for img in input.images
        ],
    )

    # Wait for all tasks to complete simultaneously
    location_response, customer_response, images_response = await asyncio.gather(
        location_task, customer_task, images_task
    )

    with open("generated_knowledge_location.txt", "w", encoding="utf-8") as file:
        file.write(f"Location Assessment:\n{location_response}\n\n")

    with open("generated_knowledge_customer.txt", "w", encoding="utf-8") as file:
        file.write(f"Customer Assessment:\n{customer_response}\n")

    with open("generated_knowledge_images.txt", "w", encoding="utf-8") as file:
        file.write(f"Images Assessment:\n{images_response}\n")

    # # Print responses
    # print(f"# {location_response.name}: {location_response}")
    # print(f"# {customer_response.name}: {customer_response}")


if __name__ == "__main__":
    load_dotenv()
    input = Input(
        prompt="STUNNING VILLA FOR SALE - PRIME LOCATION!!! Price: €2,850,000 (negotiable) was €3.2M - REDUCED FOR QUICK SALE! Property Details: Size: 450 sqm living space + 180 sqm terraces, Plot: 1,200 sqm private land, Bedrooms: 6 (master suite with walk-in closet), Bathrooms: 4.5 (3 full, 2 half baths), Built: 2018 (practically NEW!), Parking: 3-car garage + 2 outdoor spaces. Location & Views: Address: Via delle Rose 47, Tuscany Hills - 15 min to city center, 5 min walk to local shops, BREATHTAKING panoramic views of valley & mountains, South-facing orientation (sun ALL DAY), Quiet residential area but close to everything. Features & Amenities: Interior: Open concept kitchen with island (Miele appliances), Living room with fireplace, Formal dining room, Home office/study, Wine cellar (climate controlled), Laundry room, Storage rooms, High ceilings throughout, Marble floors downstairs, hardwood upstairs. Outdoor: Infinity pool (12m x 6m) with heating, Pool house with bar & BBQ area, Landscaped gardens with automatic irrigation, Olive trees (20+ mature trees), Multiple terraces & patios, Outdoor kitchen, Guest cottage (2 bed, 1 bath). Technical Specs: Heating: Underfloor heating + heat pump, Cooling: Central A/C throughout, Energy Rating: A+ (solar panels installed), Internet: Fiber optic ready, Security: Alarm system + cameras, Water: Private well + mains connection, Utilities: All connected (gas, electric, water, sewage). Condition & Maintenance: Move-in ready condition, Recently painted (2024), New roof tiles (2023), Pool renovated last year, Garden professionally maintained, All appliances included, Some furniture negotiable. Legal & Financial: Property Tax: €4,200/year, HOA Fees: None (private property), Utilities: ~€300/month average, Title: Clear, no liens, Permits: All building permits in order, Zoning: Residential (can't build commercial). Investment Potential: Rental income potential: €8,000-12,000/month (seasonal), Property values increasing 5-8% annually in area, Tourism growing in region, Perfect for vacation rental business, Could subdivide plot (subject to permits). Nearby Amenities: Schools: International school 10km, Shopping: Supermarket 2km, mall 15km, Healthcare: Hospital 20km, clinic 5km, Transport: Train station 12km, airport 45km, Recreation: Golf course 8km, beach 25km, Restaurants: 3 excellent restaurants within 5km. Contact & Viewing: Agent: Marco Rossi, Licensed Real Estate Professional, Phone: +39 055 123 4567, Email: marco@tuscanyvillas.com, Available: Mon-Sat 9AM-7PM, Viewings: By appointment only (24hr notice preferred). Additional Notes: Serious buyers only, Proof of funds required before viewing, International buyers welcome, Financing assistance available, Virtual tour available on request, Drone footage & professional photos available, Property inspection reports available, Comparable sales data provided upon request. MOTIVATED SELLER - OPEN TO REASONABLE OFFERS! Property ID: TV-2024-0847, Listed: January 2025, Last Updated: July 15, 2025. Disclaimer: All measurements approximate. Buyer to verify all information. Property sold as-is. Agent represents seller.",
        images=[],  # No images provided in this example
    )
    asyncio.run(generate_knowledge(input))
