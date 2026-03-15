import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { api } from "@/lib/api"
import type { ClothingItem } from "@/types/clothing"
import type { SavedOutfit } from "@/types/outfit"

type OutfitImageProps = {
  item: SavedOutfit
  deleteItem: (id: string) => void
  onClick?: (item: SavedOutfit) => void
}

export function OutfitCardImage({ item, onClick }: OutfitImageProps) {
  const pieces = [
    ...item.outer_tops,
    ...item.inner_tops,
    ...item.bottoms,
    ...item.shoes,
  ]

  const thumbnailId = pieces[0]

  const { data: thumbnailItem } = useQuery({
    queryKey: ["clothes", thumbnailId],
    queryFn: async () => {
      const { data } = await api.get<ClothingItem>(`/clothes/${thumbnailId}`)
      return data
    },
    enabled: Boolean(thumbnailId),
  })

  return (
    <Card
      className="relative mx-auto w-full max-w-sm cursor-pointer pt-0 transition-transform hover:-translate-y-1"
      onClick={() => onClick?.(item)}
    >
      <div className="black/35 absolute inset-0 z-30 aspect-video" />
      <img
        src={thumbnailItem?.image_url || "https://avatar.vercel.sh/shadcn1"}
        alt={thumbnailItem?.name || item.title}
        className="relative z-20 aspect-video w-full object-cover"
      />
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.reasoning || pieces.join(", ")}</CardDescription>
      </CardHeader>
    </Card>
  )
}
