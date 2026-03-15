from typing import Annotated

from fastapi import APIRouter, Query, UploadFile, File 
from pydantic import BaseModel
from pydantic_ai import ImageUrl

from app.agents.clothing_analyzer import agent as clothing_analyzer_agent
from app.dependencies.auth import CurrentUser
from app.schemas.clothing import ClothingCategory, ClothingColor, ClothingFormality
from app.services.supabase import supabase
import httpx
import uuid 

from app.services.bg_remover import remove_background



router = APIRouter(prefix="/clothes", tags=["clothes"])


class ImageUrlRequest(BaseModel):
    url: str

class ClothingResponse(BaseModel):
    id: int
    name: str
    description: str | None
    category: ClothingCategory
    formality: ClothingFormality
    color: ClothingColor
    image_url: str


"""@router.get("/")
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


@router.post("/upload")
async def upload_clothing(request: ImageUrlRequest, user: CurrentUser):
    result = await clothing_analyzer_agent.run([ImageUrl(url=request.url)])

    clothing_item = result.output

    search_text_arr = [
        clothing_item.name,
        clothing_item.category.value,
        clothing_item.color.value,
        clothing_item.formality.value,
    ]

    if clothing_item.description is not None:
        search_text_arr.append(str(clothing_item.description))

    search_text = " ".join(search_text_arr)

    response = (
        supabase.table("clothes")
        .insert(
            {
                "user_id": user["id"],
                "name": clothing_item.name,
                "description": clothing_item.description,
                "category": clothing_item.category,
                "formality": clothing_item.formality,
                "color": clothing_item.color,
                "search_text": search_text,
                "image_url": request.url,
            }
        )
        .execute()
    )

    return response

# Router to remove the background 
@router.post("/remove-background")
async def remove_background_endpoint(file: UploadFile = File(...)):
    # Process image
    output_path = await remove_background(file)
    
    # Upload to Supabase
    with open(output_path, 'rb') as f:
        supabase.storage.from_("clothes").upload(
            f,
            output_path.split('/')[-1]
        )
    
    # Get public URL
    url = supabase.storage.from_("stickers").get_public_url(
        output_path.split('/')[-1]
    )
    
    return {"url": url}"""


@router.post("/upload")
async def upload_clothing(request: ImageUrlRequest, user: CurrentUser):
    # Step 1: Download image from URL
    async with httpx.AsyncClient() as client:
        response = await client.get(request.url)
        image_bytes = response.content

    # Step 2: Remove background
    output_path = await remove_background(image_bytes)

    # Step 3: Upload transparent image to Supabase
    filename = f"{user["id"]}/{uuid.uuid4()}.png"
    with open(output_path, 'rb') as f:
        supabase.storage.from_("clothes").upload(filename, f)
    transparent_url = supabase.storage.from_("clothes").get_public_url(filename)

    # Step 4: Analyze the transparent image
    result = await clothing_analyzer_agent.run([ImageUrl(url=transparent_url)])

    # Step 5: Save to database
    clothing_item = result.output
    db_response = supabase.table("clothes").insert({
        "user_id": user["id"],
        "name": clothing_item.name,
        "description": clothing_item.description,
        "category": clothing_item.category,
        "formality": clothing_item.formality,
        "color": clothing_item.color,
        "image_url": transparent_url,
        "search_text": " ".join([
            clothing_item.name,
            clothing_item.category.value,
            clothing_item.color.value,
            clothing_item.formality.value,
            clothing_item.description or ""
        ])
    }).execute()

    return db_response.data
