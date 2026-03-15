import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type { SavedOutfit } from "@/types/outfit"

export function useOutfits() {
  return useQuery({
    queryKey: ["outfits"],
    queryFn: async () => {
      const { data } = await api.get<SavedOutfit[]>("/outfits")
      return data
    },
  })
}
