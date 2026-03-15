from fastapi import APIRouter, HTTPException
from pydantic_ai import ImageUrl
from app.dependencies.auth import CurrentUser
from app.schemas.outfits import GenerateOutfitRequest, OutfitError
from app.agents.stylist import agent as stylist_agent
from app.services.supabase import supabase

router = APIRouter(prefix="/outfits", tags=["outfits"])


@router.get("/")
async def get_outfits(user: CurrentUser):
    try:
        response = (
            supabase.table("outfits")
            .select("*")
            .eq("user_id", user["id"])
            .order("id", desc=True)
            .execute()
        )

        return response.data
    except Exception as e:
        print(f"Fetch Outfits Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Unable to retrieve outfits.")


@router.post("/generate")
async def generate_outfit(request: GenerateOutfitRequest, user: CurrentUser):
    # 1. Build the dynamic multimodal payload
    user_input: list[str | ImageUrl] = []

    # Add text context
    if request.prompt and request.image_url:
        user_input.append(
            f"Create an outfit based on this prompt: '{request.prompt}'. Use the provided image for visual inspiration and style reference."
        )
    elif request.prompt:
        user_input.append(request.prompt)
    elif request.image_url:
        user_input.append(
            "Create an outfit that perfectly matches the vibe, style, and color palette of this reference image."
        )

    if request.image_url:
        user_input.append(ImageUrl(url=request.image_url))

    try:
        result = await stylist_agent.run(user_input, deps=user["id"])

        if isinstance(result.output, OutfitError):
            return {"status": "error", "message": result.output.refusal_reason}

        outfit = result.output

        db_response = (
            supabase.table("outfits")
            .insert(
                {
                    "user_id": user["id"],
                    "inner_tops": outfit.inner_tops,
                    "outer_tops": outfit.outer_tops,
                    "bottoms": outfit.bottoms,
                    "shoes": outfit.shoes,
                    "reasoning": outfit.reasoning,
                }
            )
            .execute()
        )

        return db_response.data

    except Exception as e:
        print(f"Generation Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="The stylist encountered an error generating your outfit.",
        )
