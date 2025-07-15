import asyncio
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel
from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion


class Input(BaseModel):
    """Input model for property assessment."""

    prompt: str
    images: list[str] = []


class PropertyAssessment(BaseModel):
    """Structured property assessment data model."""

    living_area: int
    lot_size_shape: Optional[str] = "No information provided"
    rooms_layout: Optional[str] = "No information provided"
    year_construction: Optional[str] = "No information provided"
    renovation_status: Optional[str] = "No information provided"
    fit_out_quality: Optional[str] = "No information provided"
    energy_efficiency: Optional[str] = "No information provided"
    special_features: Optional[str] = "No information provided"


agentParse = ChatCompletionAgent(
    service=AzureChatCompletion(),
    name="Assistant",
    instructions="""You are a real estate assessment specialist. 
    
When receiving property information, always respond with a structured assessment using exactly the following format:

```
Living and usable floor area: [measured to the applicable standard, e.g., DIN 277 or local code]

Lot size and shape: [details on lot size and configuration]

Number of rooms & floor plan layout: [number of rooms, open/closed kitchen, walkthrough rooms, etc.]

Year built & construction method: [year and construction type - solid masonry, timber frame, prefab, etc.]

Renovation / modernization status: [details about roof, heating, windows, plumbing, bathrooms, façade]

Fit‑out quality: [details about built‑in kitchen, hardwood floors, smart‑home features, spa bathroom, elevator]

Energy efficiency: [value from energy performance certificate, heating system, insulation]

Special features: [balcony/terrace, garden, parking garage, view, step‑free access]
```

Include all categories in your response even if information is missing for some of them. For missing information, indicate "No information provided".
    """,
)


async def parseInput(input: Input) -> PropertyAssessment:
    # Get property information from user input
    response = await agentParse.get_response(
        response_format=PropertyAssessment,
        messages=[input.prompt],
    )

    # Print structured property assessment
    print(response.message)
    return response


if __name__ == "__main__":
    load_dotenv()
    input = Input(
        prompt="STUNNING VILLA FOR SALE - PRIME LOCATION!!! Price: €2,850,000 (negotiable) was €3.2M - REDUCED FOR QUICK SALE! Property Details: Size: 450 sqm living space + 180 sqm terraces, Plot: 1,200 sqm private land, Bedrooms: 6 (master suite with walk-in closet), Bathrooms: 4.5 (3 full, 2 half baths), Built: 2018 (practically NEW!), Parking: 3-car garage + 2 outdoor spaces. Location & Views: Address: Via delle Rose 47, Tuscany Hills - 15 min to city center, 5 min walk to local shops, BREATHTAKING panoramic views of valley & mountains, South-facing orientation (sun ALL DAY), Quiet residential area but close to everything. Features & Amenities: Interior: Open concept kitchen with island (Miele appliances), Living room with fireplace, Formal dining room, Home office/study, Wine cellar (climate controlled), Laundry room, Storage rooms, High ceilings throughout, Marble floors downstairs, hardwood upstairs. Outdoor: Infinity pool (12m x 6m) with heating, Pool house with bar & BBQ area, Landscaped gardens with automatic irrigation, Olive trees (20+ mature trees), Multiple terraces & patios, Outdoor kitchen, Guest cottage (2 bed, 1 bath). Technical Specs: Heating: Underfloor heating + heat pump, Cooling: Central A/C throughout, Energy Rating: A+ (solar panels installed), Internet: Fiber optic ready, Security: Alarm system + cameras, Water: Private well + mains connection, Utilities: All connected (gas, electric, water, sewage). Condition & Maintenance: Move-in ready condition, Recently painted (2024), New roof tiles (2023), Pool renovated last year, Garden professionally maintained, All appliances included, Some furniture negotiable. Legal & Financial: Property Tax: €4,200/year, HOA Fees: None (private property), Utilities: ~€300/month average, Title: Clear, no liens, Permits: All building permits in order, Zoning: Residential (can't build commercial). Investment Potential: Rental income potential: €8,000-12,000/month (seasonal), Property values increasing 5-8% annually in area, Tourism growing in region, Perfect for vacation rental business, Could subdivide plot (subject to permits). Nearby Amenities: Schools: International school 10km, Shopping: Supermarket 2km, mall 15km, Healthcare: Hospital 20km, clinic 5km, Transport: Train station 12km, airport 45km, Recreation: Golf course 8km, beach 25km, Restaurants: 3 excellent restaurants within 5km. Contact & Viewing: Agent: Marco Rossi, Licensed Real Estate Professional, Phone: +39 055 123 4567, Email: marco@tuscanyvillas.com, Available: Mon-Sat 9AM-7PM, Viewings: By appointment only (24hr notice preferred). Additional Notes: Serious buyers only, Proof of funds required before viewing, International buyers welcome, Financing assistance available, Virtual tour available on request, Drone footage & professional photos available, Property inspection reports available, Comparable sales data provided upon request. MOTIVATED SELLER - OPEN TO REASONABLE OFFERS! Property ID: TV-2024-0847, Listed: January 2025, Last Updated: July 15, 2025. Disclaimer: All measurements approximate. Buyer to verify all information. Property sold as-is. Agent represents seller.",
        images=[],  # No images provided in this example
    )
    asyncio.run(parseInput(input))
