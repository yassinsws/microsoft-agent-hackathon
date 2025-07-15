from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion

from backend.main import Input

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


async def generate_knowledge(input: Input):
    # Get property information from user input
    response = await agentParse.get_response(
        messages=[
            input.input_text if input.input_text else "My property is located at maximilianstrasse 1, 80333 München, Germany."
        ],
    )

    # Print structured property assessment
    print(response)
    return response
