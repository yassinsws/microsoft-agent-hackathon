import random
import uuid
from datetime import datetime
from typing import List, Optional, Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.generate_knowledge import generate_knowledge
from backend.groupchat import do_groupchat
from backend.models import Input  # Import der Input-Klasse aus models.py

load_dotenv()
# FastAPI-Instanz erstellen
app = FastAPI(
    title="Real Estate AI API",
    description="AI-powered real estate listing generation API",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request Models
class PropertyImageUpload(BaseModel):
    images: List[str]  # Base64 encoded images or URLs
    description: str
    user_prompt: Optional[str] = None


class PropertyGenerationRequest(BaseModel):
    property_id: str
    additional_info: Optional[str] = None


# Response Models
class PropertyLocation(BaseModel):
    address: str
    city: str
    state: str
    zipCode: str
    neighborhood: Optional[str] = None
    coordinates: Optional[dict] = None


class PropertyDetails(BaseModel):
    bedrooms: int
    bathrooms: int
    sqft: int
    type: str
    yearBuilt: Optional[int] = None
    parking: Optional[int] = None
    lotSize: Optional[int] = None


class PropertyListing(BaseModel):
    datePosted: str
    daysOnMarket: int
    status: str
    agent: dict


class PricingAnalysis(BaseModel):
    market_position: Literal["competitive", "below_market", "above_market"]
    confidence: float
    price_difference_percentage: float
    comparable_properties: dict
    recommendations: List[str]
    market_insights: List[str]


class AIGeneratedProperty(BaseModel):
    id: str
    title: str
    price: int
    pricePerSqft: Optional[int] = None
    location: PropertyLocation
    details: PropertyDetails
    images: List[str]
    features: List[str]
    description: str
    listing: PropertyListing
    confidence_score: float
    ai_suggestions: List[str]
    pricing_analysis: PricingAnalysis


class PropertyUploadResponse(BaseModel):
    property_id: str
    status: str
    message: str


class PropertyGenerationResponse(BaseModel):
    property: AIGeneratedProperty
    processing_time: float
    recommendations: List[str]


# Mock data for AI generation
MOCK_PROPERTY_TEMPLATES = [
    {
        "title": "Luxurious Modern Villa with Garden",
        "price_range": (850000, 1200000),
        "location": {
            "city": "Munich",
            "neighborhood": "Bogenhausen",
            "state": "Bavaria",
        },
        "details": {"bedrooms": 4, "bathrooms": 3, "sqft": 2800, "type": "Villa"},
        "features": [
            "Garden",
            "Garage",
            "Modern Kitchen",
            "Fireplace",
            "Terrace",
            "High Ceilings",
        ],
    },
    {
        "title": "Contemporary Apartment with City Views",
        "price_range": (650000, 900000),
        "location": {
            "city": "Munich",
            "neighborhood": "Maxvorstadt",
            "state": "Bavaria",
        },
        "details": {"bedrooms": 3, "bathrooms": 2, "sqft": 1800, "type": "Apartment"},
        "features": ["Balcony", "Elevator", "Modern Kitchen", "City Views", "Parking"],
    },
    {
        "title": "Charming Traditional House",
        "price_range": (750000, 1100000),
        "location": {"city": "Munich", "neighborhood": "Pasing", "state": "Bavaria"},
        "details": {"bedrooms": 5, "bathrooms": 3, "sqft": 3200, "type": "House"},
        "features": [
            "Garden",
            "Garage",
            "Traditional Architecture",
            "Updated Kitchen",
            "Basement",
        ],
    },
]

# In-memory storage for demo (in production, use a database)
property_uploads = {}


@app.get("/")
def read_root():
    """Root endpoint returns API information."""
    return {
        "message": "Welcome to Real Estate AI API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/api/property/upload",
            "generate": "/api/property/generate/{property_id}",
            "status": "/api/property/status/{property_id}",
        },
    }


@app.post(
    "/api/property/upload", response_model=PropertyUploadResponse, status_code=201
)
def upload_property_images(upload_request: PropertyImageUpload):
    """Upload property images and description for AI processing."""

    if not upload_request.images or len(upload_request.images) == 0:
        raise HTTPException(status_code=400, detail="At least one image is required")

    if not upload_request.description or len(upload_request.description.strip()) < 10:
        raise HTTPException(
            status_code=400, detail="Description must be at least 10 characters long"
        )

    # Generate unique property ID
    property_id = str(uuid.uuid4())

    # Store upload data (in production, save to database and cloud storage)
    property_uploads[property_id] = {
        "id": property_id,
        "images": upload_request.images,
        "description": upload_request.description,
        "user_prompt": upload_request.user_prompt,
        "uploaded_at": datetime.now().isoformat(),
        "status": "uploaded",
        "processed": False,
    }

    return PropertyUploadResponse(
        property_id=property_id,
        status="uploaded",
        message="Images and description uploaded successfully. You can now generate the property listing.",
    )


@app.post(
    "/api/property/generate/{property_id}", response_model=PropertyGenerationResponse
)
def generate_property_listing(
    property_id: str, generation_request: Optional[PropertyGenerationRequest] = None
):
    """Generate AI-powered property listing from uploaded images and description."""

    if property_id not in property_uploads:
        raise HTTPException(status_code=404, detail="Property upload not found")

    upload_data = property_uploads[property_id]

    if upload_data["processed"]:
        raise HTTPException(
            status_code=400, detail="Property listing already generated"
        )

    # Mock AI processing time
    import time

    start_time = time.time()

    # Simulate AI analysis of images and description
    # In production, this would call actual AI models for:
    # - Image recognition and analysis
    # - Price estimation based on features and location
    # - Feature extraction
    # - Description enhancement

    # Select mock template based on description keywords
    description_lower = upload_data["description"].lower()
    selected_template = MOCK_PROPERTY_TEMPLATES[0]  # Default

    if "apartment" in description_lower or "flat" in description_lower:
        selected_template = MOCK_PROPERTY_TEMPLATES[1]
    elif "traditional" in description_lower or "classic" in description_lower:
        selected_template = MOCK_PROPERTY_TEMPLATES[2]
    elif "villa" in description_lower or "luxury" in description_lower:
        selected_template = MOCK_PROPERTY_TEMPLATES[0]

    # Generate realistic pricing analysis
    def generate_pricing_analysis(
        proposed_price: int, property_details: dict, location: dict
    ) -> PricingAnalysis:
        # Mock market data based on property type and location
        base_price = selected_template["price_range"][0]
        high_price = selected_template["price_range"][1]
        avg_price = (base_price + high_price) // 2

        # Calculate market position
        price_diff_percentage = ((proposed_price - avg_price) / avg_price) * 100

        if price_diff_percentage < -10:
            market_position = "below_market"
        elif price_diff_percentage > 15:
            market_position = "above_market"
        else:
            market_position = "competitive"

        # Generate comparable properties data
        comparable_properties = {
            "avg_price": avg_price,
            "min_price": base_price - random.randint(50000, 100000),
            "max_price": high_price + random.randint(50000, 150000),
            "sample_size": random.randint(8, 18),
        }

        # Generate specific recommendations based on market position
        recommendations = []
        market_insights = []

        if market_position == "above_market":
            recommendations = [
                "Consider reducing price by 5-10% for faster sale",
                "Highlight premium features to justify higher price",
                "Professional staging could help justify the premium",
            ]
            market_insights = [
                f"Your price is {abs(price_diff_percentage):.1f}% above market average",
                f"Similar {property_details['type'].lower()}s in {location['neighborhood']} sell for €{base_price:,}-€{high_price:,}",
                "Higher-priced properties typically take 60-90 days to sell",
                "Consider emphasizing unique features that add value",
            ]
        elif market_position == "below_market":
            recommendations = [
                "Your price is competitive and likely to attract buyers quickly",
                "Consider slight price increase to maximize value",
                "Market data suggests room for 5-10% price increase",
            ]
            market_insights = [
                f"Your price is {abs(price_diff_percentage):.1f}% below market average",
                f"Similar properties in {location['neighborhood']} sell for €{avg_price:,} on average",
                "Below-market pricing typically results in quick sales (15-30 days)",
                "Multiple offers are likely at this price point",
            ]
        else:  # competitive
            recommendations = [
                "Your asking price is competitive for this area",
                "Market data shows strong demand for similar properties",
                "Consider highlighting unique features in marketing",
            ]
            market_insights = [
                f"Your price is within {abs(price_diff_percentage):.1f}% of market average",
                f"Similar {property_details['type'].lower()}s in {location['neighborhood']} sell for €{base_price:,}-€{high_price:,}",
                "Competitively priced properties typically sell within 30-45 days",
                "Strong market conditions favor this price range",
            ]

        return PricingAnalysis(
            market_position=market_position,
            confidence=random.uniform(0.80, 0.95),
            price_difference_percentage=round(price_diff_percentage, 1),
            comparable_properties=comparable_properties,
            recommendations=recommendations,
            market_insights=market_insights,
        )

    # Generate pricing analysis
    pricing_analysis = generate_pricing_analysis(
        selected_template["price_range"][1],
        selected_template["details"],
        selected_template["location"],
    )

    # Generate AI property listing
    ai_property = AIGeneratedProperty(
        id=property_id,
        title=selected_template["title"],
        price=selected_template["price_range"][1],  # Use higher end of range
        pricePerSqft=round(
            selected_template["price_range"][1] / selected_template["details"]["sqft"]
        ),
        location=PropertyLocation(
            address=f"Musterstraße {property_id[:2]}, {selected_template['location']['city']}",
            city=selected_template["location"]["city"],
            state=selected_template["location"]["state"],
            zipCode="80331",
            neighborhood=selected_template["location"]["neighborhood"],
            coordinates={"lat": 48.1351, "lng": 11.5820},
        ),
        details=PropertyDetails(**selected_template["details"]),
        images=upload_data["images"][:6],  # Use uploaded images
        features=selected_template["features"],
        description=f"{upload_data['description']}\n\nThis property features excellent craftsmanship and modern amenities. Located in a prime area with great connectivity and local amenities. Perfect for families looking for comfort and style.",
        listing=PropertyListing(
            datePosted=datetime.now().isoformat(),
            daysOnMarket=0,
            status="active",
            agent={
                "name": "AI Generated Agent",
                "company": "Real Estate AI",
                "phone": "+49 89 123456789",
                "email": "agent@realestate-ai.com",
            },
        ),
        confidence_score=0.92,
        ai_suggestions=[
            "Consider highlighting the modern kitchen features",
            "Add information about nearby schools and transport",
            "Professional photography recommended for better presentation",
            "Market analysis suggests competitive pricing",
        ],
        pricing_analysis=pricing_analysis,
    )

    # Mark as processed
    property_uploads[property_id]["processed"] = True
    property_uploads[property_id]["generated_property"] = ai_property.dict()

    processing_time = time.time() - start_time

    return PropertyGenerationResponse(
        property=ai_property,
        processing_time=processing_time,
        recommendations=[
            "Your property has been successfully analyzed",
            "Price estimation based on similar properties in the area",
            "Consider adding more exterior photos for better appeal",
            "Ready to publish with current information",
        ],
    )


@app.get("/api/property/status/{property_id}")
def get_property_status(property_id: str):
    """Get the status of a property upload and generation."""

    if property_id not in property_uploads:
        raise HTTPException(status_code=404, detail="Property upload not found")

    upload_data = property_uploads[property_id]

    return {
        "property_id": property_id,
        "status": "processed" if upload_data["processed"] else "uploaded",
        "uploaded_at": upload_data["uploaded_at"],
        "images_count": len(upload_data["images"]),
        "description_length": len(upload_data["description"]),
        "processed": upload_data["processed"],
    }


@app.get("/api/property/list")
def list_all_properties():
    """List all uploaded properties (for development/testing)."""
    return {
        "properties": [
            {
                "property_id": pid,
                "status": "processed" if data["processed"] else "uploaded",
                "uploaded_at": data["uploaded_at"],
            }
            for pid, data in property_uploads.items()
        ],
        "total": len(property_uploads),
    }


# Legacy endpoint for backward compatibility
@app.post("/prompt/", status_code=201)
async def create_item_legacy(input: Input):
    await generate_knowledge(input)
    await do_groupchat()

    # Datei lesen
    data = {}
    with open("group_chat_result.txt", "r", encoding="utf-8") as f:
        content = f.read()

    return content


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
