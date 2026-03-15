# Edward Skeletrix

from pydantic_ai import Agent, RunContext
from app.schemas.outfits import OutfitResult
from app.models.gemini import gemini_2_5_flash
from app.services.supabase import supabase
from app.schemas.clothing import ClothingCategory, ClothingFormality, ClothingColor
import json

agent = Agent(
    model=gemini_2_5_flash,
    output_type=OutfitResult,
    deps_type=str,
    system_prompt="""
    You are an elite AI personal stylist. Your job is to create the perfect outfit based on the user's request.
    - You MUST use the `search_wardrobe` tool to see what clothes the user actually owns.
    - Never recommend an item that is not in their wardrobe.
    - Return a catchy title, your reasoning, and the exact integer IDs of the items you selected.
    """,
)

@agent.tool
async def search_wardrobe(
    ctx: RunContext[str],
    category: ClothingCategory | None = None,
    formality: ClothingFormality | None = None,
    color: ClothingColor | None = None
) -> str:
    """Searches the user's Supabase database for clothes matching specific criteria."""

    user_id = ctx.deps

    query = supabase.table("clothes").select("id, name, description, category, color, formality").eq("user_id", user_id)

    if category:
        query = query.eq("category", category.value)
    if color:
        query = query.eq("color", color.value)
    if formality:
        query = query.eq("formality", formality.value)

    response = query.execute()

    if not response.data:
        return "No items found matching those criteria."

    return json.dumps(response.data)
