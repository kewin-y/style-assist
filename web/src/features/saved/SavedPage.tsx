import * as React from "react"
import { useQueries } from "@tanstack/react-query"

import { Navbar } from "@/components/navbar"
import { OutfitDialog } from "@/components/outfit-dialog"
import { OutfitCardImage } from "@/components/outfit_card"
import { useOutfits } from "@/hooks/useOutfits"
import { api } from "@/lib/api"
import type { ClothingItem } from "@/types/clothing"
import type { SavedOutfit } from "@/types/outfit"

export default function SavedPage() {
  const { data: items = [], isLoading, error } = useOutfits()
  const [selectedOutfit, setSelectedOutfit] =
    React.useState<SavedOutfit | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const deleteItem = (id: string) => {
    console.log("Delete outfit:", id)
  }

  const selectedClothingIds = React.useMemo(() => {
    if (!selectedOutfit) {
      return []
    }

    return Array.from(
      new Set([
        ...selectedOutfit.outer_tops,
        ...selectedOutfit.inner_tops,
        ...selectedOutfit.bottoms,
        ...selectedOutfit.shoes,
      ])
    )
  }, [selectedOutfit])

  const clothingQueries = useQueries({
    queries: selectedClothingIds.map((clothingId) => ({
      queryKey: ["clothes", clothingId],
      queryFn: async () => {
        const { data } = await api.get<ClothingItem>(`/clothes/${clothingId}`)
        return data
      },
      enabled: isDialogOpen,
    })),
  })

  const selectedItems = React.useMemo(
    () =>
      clothingQueries
        .map((query) => query.data)
        .filter((item): item is ClothingItem => item !== undefined),
    [clothingQueries]
  )

  const handleCardClick = (outfit: SavedOutfit) => {
    setSelectedOutfit(outfit)
    setIsDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)

    if (!open) {
      setSelectedOutfit(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">
          Error loading saved outfits: {JSON.stringify(error)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 p-4">
        <Navbar />

        <h1 className="mt-15 mb-6 ml-5 text-6xl font-bold">
          Here are your saved outfits!
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {items.map((outfit) => (
          <OutfitCardImage
            key={outfit.id}
            item={outfit}
            deleteItem={deleteItem}
            onClick={handleCardClick}
          />
        ))}
      </div>

      <OutfitDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        outfit={selectedOutfit}
        items={selectedItems}
      />
    </div>
  )
}
