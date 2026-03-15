from typing import Annotated

from fastapi import APIRouter, Query, UploadFile, File, HTTPException
from pydantic import BaseModel
from pydantic_ai import ImageUrl

from app.agents.clothing_analyzer import agent as clothing_analyzer_agent
from app.dependencies.auth import CurrentUser
from app.schemas.clothing import ClothingCategory, ClothingColor, ClothingFormality
from app.services.supabase import supabase
import uuid

from app.services.bg_remover import remove_background


router = APIRouter(prefix="/clothes", tags=["clothes"])


class ImageUrlRequest(BaseModel):
    url: str


class ClothingResponse(BaseModel):
    id: str
    name: str
    description: str | None
    category: ClothingCategory
    formality: ClothingFormality
    color: ClothingColor
    image_url: str


@router.get("/")
async def get_clothes(
    user: CurrentUser,
    categories: Annotated[list[ClothingCategory] | None, Query()] = None,
    colors: Annotated[list[ClothingColor] | None, Query()] = None,
    formalities: Annotated[list[ClothingFormality] | None, Query()] = None,
):
    query = supabase.table("clothes").select("*").eq("user_id", user["id"])

    if categories:
        query = query.in_("category", [c.value for c in categories])
    if colors:
        query = query.in_("color", [c.value for c in colors])
    if formalities:
        query = query.in_("formality", [f.value for f in formalities])

    response = query.execute()
    return response.data


@router.get("/{clothing_id}")
async def get_clothing(clothing_id: str, user: CurrentUser):
    response = (
        supabase.table("clothes")
        .select("*")
        .eq("user_id", user["id"])
        .eq("id", clothing_id)
        .limit(1)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Clothing item not found.")

    return response.data[0]


@router.post("/upload")
async def upload_clothing(
    user: CurrentUser,
    file: Annotated[UploadFile, File(...)],
):
    image_bytes = await file.read()

    # Remove background
    output_path = await remove_background(image_bytes)

    # Upload transparent image to Supabase
    filename = f"{user['id']}/{uuid.uuid4()}.png"
    with open(output_path, "rb") as f:
        _ = supabase.storage.from_("clothes").upload(filename, f)

    transparent_url = supabase.storage.from_("clothes").get_public_url(filename)

    # Analyze the transparent image
    result = await clothing_analyzer_agent.run([ImageUrl(url=transparent_url)])

    # Save to database
    clothing_item = result.output
    db_response = (
        supabase.table("clothes")
        .insert(
            {
                "user_id": user["id"],
                "name": clothing_item.name,
                "description": clothing_item.description,
                "category": clothing_item.category,
                "formality": clothing_item.formality,
                "color": clothing_item.color,
                "image_url": transparent_url,
                "search_text": " ".join(
                    [
                        clothing_item.name,
                        clothing_item.category.value,
                        clothing_item.color.value,
                        clothing_item.formality.value,
                        clothing_item.description or "",
                    ]
                ),
            }
        )
        .execute()
    )

    return db_response.data
