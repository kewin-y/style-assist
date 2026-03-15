"""from fastapi import APIRouter, Uploadfile
from app.services.supabase import supabase 

router = APIRouter() 

@router.post("/upload")
async def upload_clothing(file: Uploadfile): 
    pass"""

from fastapi import APIRouter, UploadFile, File
from app.agents.clothing_analyzer import agent as clothing_analyzer_agent
from pydantic import BaseModel
from pydantic_ai import ImageUrl

router = APIRouter(prefix="/clothes", tags=["clothes"])

class ImageUrlRequest(BaseModel):
    url: str

@router.post("/upload")
async def upload_clothing(request: ImageUrlRequest):
    clothing_item = await clothing_analyzer_agent.run(
        [
            ImageUrl(url=request.url)
        ]
    )

    return {
        "message": "Clothing analyzed successfully!",
        "data": repr(clothing_item.output)
    }