"""from fastapi import APIRouter, Uploadfile
from app.services.supabase import supabase

router = APIRouter()

@router.post("/upload")
async def upload_clothing(file: Uploadfile):
    pass"""

from fastapi import APIRouter
from pydantic import BaseModel
from pydantic_ai import ImageUrl

from app.agents.clothing_analyzer import agent as clothing_analyzer_agent
from app.dependencies.auth import CurrentUser

from app.services.supabase import supabase


router = APIRouter(prefix="/clothes", tags=["clothes"])


class ImageUrlRequest(BaseModel):
    url: str


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

    response = supabase.table("clothes").insert(
        {
            "user_id": user["id"],
            "name": clothing_item.name,
            "description": clothing_item.description,
            "category": clothing_item.category,
            "formality": clothing_item.formality,
            "color": clothing_item.color,
            "search_text": search_text,
            "image_url": request.url

        }
    ).execute()

    return response
# return response


