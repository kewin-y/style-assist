from enum import Enum

from pydantic import BaseModel

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


class ClothingColor(str, Enum):
    RED = "RED"
    ORANGE = "ORANGE"
    YELLOW = "YELLOW"
    GREEN = "GREEN"
    BLUE = "BLUE"
    PURPLE = "PURPLE"
    BLACK = "BLACK"
    WHITE = "WHITE"
    BROWN = "BROWN"
    GREY = "GREY"
    PINK = "PINK"
    MULTI = "MULTI"

class ClothingItem(BaseModel):
    name: str
    description: str | None = None
    category: ClothingCategory
    formality: ClothingFormality
    color: ClothingColor
