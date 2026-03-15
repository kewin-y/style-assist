export interface GeneratedOutfit {
  id?: string
  title?: string | null
  reasoning: string
  inner_tops: string[]
  outer_tops: string[]
  bottoms: string[]
  shoes: string[]
}

export interface SavedOutfit extends GeneratedOutfit {
  id: string
  title: string
}

export interface OutfitGenerationErrorResponse {
  status: "error"
  message: string
}
