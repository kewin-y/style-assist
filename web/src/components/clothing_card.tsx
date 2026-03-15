import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { ClothingItem } from "@/types/clothing"

type CardImageProps = {
  item: ClothingItem
  deleteItem: (id: string) => void
}

export function CardImage({ item }: CardImageProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={item.image_url}
        alt={item.name}
        className="relative z-20 aspect-video w-full object-cover"
      />
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>
          {item.description ?? "No description available."}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
