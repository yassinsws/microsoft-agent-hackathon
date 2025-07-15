from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv()
# FastAPI-Instanz erstellen
app = FastAPI(
    title="Simple API", description="Eine einfache FastAPI-Anwendung", version="1.0.0"
)


# Datenmodell mit Pydantic definieren
class Input(BaseModel):
    prompt: str
    images: List[str]


class Response(BaseModel):
    price: int
    description: str


@app.get("/")
def read_root():
    """Root-Endpunkt gibt eine einfache Willkommensnachricht zurück."""
    return {"message": "Willkommen bei der Simple API"}


@app.post("/prompt/", response_model=Response, status_code=201)
def create_item(input: Input):

    return Response(price=10, description="Descript")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
