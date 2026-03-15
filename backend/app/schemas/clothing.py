# importing basemodel which has a bunch of cool stuff  
from pydantic import BaseModel
from enum import Enum 

class ClothingCategory(str, Enum):
    INNER_TOP = "INNER_TOP"
    OUTER_TOP = "OUTER_TOP"
    BOTTOM = "BOTTOM"
    SHOES = "SHOES"

class ClothingFormality(str, Enum):
    CASUAL = "CASUAL"
    BUSINESS_CASUAL = "BUSINESS_CASUAL"
    FORMAL = "FORMAL"
    ATHLETIC = "ATHLETIC"

class ClothingItem(BaseModel):
    name: str
    description: str
    category: ClothingCategory
    formality: ClothingFormality
    primary_color: str
