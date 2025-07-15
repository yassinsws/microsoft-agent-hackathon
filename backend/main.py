from typing import List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# FastAPI-Instanz erstellen
app = FastAPI(
    title="Simple API", description="Eine einfache FastAPI-Anwendung", version="1.0.0"
)


# Datenmodell mit Pydantic definieren
class Item(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None


# In-Memory-Datenbank für Items
items_db = {}
item_id_counter = 0


@app.get("/")
def read_root():
    """Root-Endpunkt gibt eine einfache Willkommensnachricht zurück."""
    return {"message": "Willkommen bei der Simple API"}


@app.get("/items/", response_model=List[Item])
def get_items():
    """Gibt alle gespeicherten Items zurück."""
    return list(items_db.values())


@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int):
    """Gibt ein bestimmtes Item anhand seiner ID zurück."""
    if item_id not in items_db:
        raise HTTPException(
            status_code=404, detail=f"Item mit ID {item_id} nicht gefunden"
        )
    return items_db[item_id]


@app.post("/items/", response_model=Item, status_code=201)
def create_item(item: Item):
    """Erstellt ein neues Item und weist ihm eine ID zu."""
    global item_id_counter
    item_id_counter += 1

    new_item = item.dict()
    new_item["id"] = item_id_counter
    items_db[item_id_counter] = new_item

    return new_item


@app.put("/items/{item_id}", response_model=Item)
def update_item(item_id: int, item: Item):
    """Aktualisiert ein vorhandenes Item."""
    if item_id not in items_db:
        raise HTTPException(
            status_code=404, detail=f"Item mit ID {item_id} nicht gefunden"
        )

    update_data = item.dict(exclude_unset=True)
    update_data["id"] = item_id  # ID kann nicht geändert werden
    items_db[item_id] = update_data

    return update_data


@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    """Löscht ein Item anhand seiner ID."""
    if item_id not in items_db:
        raise HTTPException(
            status_code=404, detail=f"Item mit ID {item_id} nicht gefunden"
        )

    deleted_item = items_db.pop(item_id)
    return {"message": f"Item {deleted_item['name']} gelöscht"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
