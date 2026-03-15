import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AlertDialogDestructive } from "@/components/deleteConfirm"
import type { SavedOutfit } from "@/types/outfit"

type OutfitImageProps = {
  item: SavedOutfit
  deleteItem: (id: number) => void
}

export function OutfitCardImage({ item, deleteItem }: OutfitImageProps) {
  const pieces = [
    ...item.outer_tops,
    ...item.inner_tops,
    ...item.bottoms,
    ...item.shoes,
  ]

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1" // get image {item.image_url} (from outfit table)
        alt="Cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.reasoning || pieces.join(", ")}</CardDescription>
      </CardHeader>
      {/* Delete button */}
      <div className="absolute right-2 bottom-2 z-50">
        <AlertDialogDestructive onConfirm={() => deleteItem(item.id)} />
      </div>
    </Card>
  )
}
