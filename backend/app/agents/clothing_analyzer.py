from pydantic_ai import Agent
from app.schemas.clothing import ClothingItem
from app.models.gemini import gemini_2_0_flash_exp_free

agent = Agent(
    model=gemini_2_0_flash_exp_free,
    output_type=ClothingItem,
    system_prompt="""
    You are a fashion analyst. Look at the clothing item in the image and extract:
    - name: a short name for the item (e.g. "White Cotton T-Shirt")
    - description: a brief description of the item (1-2 sentences)
    - category: one of INNER_TOP (e.g. tank top, dress shirt, undershirt, dresses, romberts, anything layered below a larger jacket or sweater),
      OUTER_TOP (e.g. Jackets or the outermost layer of the upper body portion of the outfit), BOTTOM (pants, shirts, etc), SHOES
      If the clothing category does not fall under any of the 4 categories listed above, please warn the user with an error: "WARNING! This type of clothing cannot be uploaded. You can only upload tops, bottoms, and shoes."
      and do not extract any information.
    - formality: one of CASUAL, BUISNESS_CASUAL, FORMAL, ATHLETIC
    - color: 'RED','ORANGE','YELLOW','GREEN','BLUE','PURPLE','BLACK','WHITE','BROWN','MULTI', 'GREY', 'PINK'
    Always return structured data only.
    """,
)
