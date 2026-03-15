export type ClothingCategory =
  | "INNER_TOP"
  | "OUTER_TOP"
  | "BOTTOM"
  | "SHOES"

export type ClothingColor =
  | "RED"
  | "ORANGE"
  | "YELLOW"
  | "GREEN"
  | "BLUE"
  | "PURPLE"
  | "BLACK"
  | "WHITE"
  | "BROWN"
  | "GREY"
  | "PINK"
  | "MULTI"

export type ClothingFormality =
  | "CASUAL"
  | "BUSINESS_CASUAL"
  | "FORMAL"
  | "ATHLETIC"

export interface ClothingItem {
  id: number
  name: string
  description: string | null
  category: ClothingCategory
  formality: ClothingFormality
  color: ClothingColor
  image_url: string
}

export interface ClothingFilters {
  categories: ClothingCategory[]
  colors: ClothingColor[]
  formalities: ClothingFormality[]
}

export const CLOTHING_CATEGORIES: ClothingCategory[] = [
  "INNER_TOP",
  "OUTER_TOP",
  "BOTTOM",
  "SHOES",
]

export const CLOTHING_COLORS: ClothingColor[] = [
  "RED",
  "ORANGE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "PURPLE",
  "BLACK",
  "WHITE",
  "BROWN",
  "GREY",
  "PINK",
  "MULTI",
]

export const CLOTHING_FORMALITIES: ClothingFormality[] = [
  "CASUAL",
  "BUSINESS_CASUAL",
  "FORMAL",
  "ATHLETIC",
]