from typing import List

from pydantic import BaseModel


class Input(BaseModel):
    """Input model for property data and images."""

    prompt: str
    images: List[str] = []  # List of base64-encoded images
