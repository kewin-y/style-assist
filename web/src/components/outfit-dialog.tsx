import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ClothingItem } from "@/types/clothing"
import type { GeneratedOutfit } from "@/types/outfit"

type OutfitSection = {
  key: "outer_tops" | "inner_tops" | "bottoms" | "shoes"
  title: string
}

const OUTFIT_SECTIONS: OutfitSection[] = [
  { key: "outer_tops", title: "Outer layers" },
  { key: "inner_tops", title: "Tops" },
  { key: "bottoms", title: "Bottoms" },
  { key: "shoes", title: "Shoes" },
]

function buildItemLookup(items: ClothingItem[]) {
  return items.reduce<Map<string, ClothingItem>>((lookup, item) => {
    lookup.set(item.id, item)
    return lookup
  }, new Map())
}

function OutfitCarousel({
  title,
  itemIds,
  itemLookup,
}: {
  title: string
  itemIds: string[]
  itemLookup: Map<string, ClothingItem>
}) {
  if (itemIds.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className="text-left text-lg font-semibold">{title}</h3>
      <Carousel
        className="w-full"
        opts={{
          loop: itemIds.length > 1,
          align: "start",
        }}
      >
        <CarouselContent>
          {itemIds.map((itemId) => {
            const clothingItem = itemLookup.get(itemId)
            const displayName = clothingItem?.name ?? `Missing item ${itemId}`

            return (
              <CarouselItem
                key={`${title}-${itemId}`}
                className="sm:basis-1/2 lg:basis-1/3"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm">
                  {clothingItem?.image_url ? (
                    <img
                      src={clothingItem.image_url}
                      alt={displayName}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-muted px-6 text-center text-sm text-muted-foreground">
                      This clothing item could not be loaded.
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4 text-left">
                    <p className="font-medium">{displayName}</p>
                    {clothingItem?.description ? (
                      <p className="text-sm text-muted-foreground">
                        {clothingItem.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        {itemIds.length > 1 ? (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        ) : null}
      </Carousel>
    </div>
  )
}

export function OutfitDialog({
  open,
  onOpenChange,
  outfit,
  items,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  outfit: GeneratedOutfit | null
  items: ClothingItem[]
}) {
  const itemLookup = React.useMemo(() => buildItemLookup(items), [items])

  const sections = React.useMemo(() => {
    if (!outfit) {
      return []
    }

    return OUTFIT_SECTIONS.map((section) => ({
      ...section,
      itemIds: outfit[section.key] ?? [],
    })).filter((section) => section.itemIds.length > 0)
  }, [outfit])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {outfit?.title?.trim() || "Your stylist picks"}
          </DialogTitle>
          <DialogDescription className="text-left leading-relaxed">
            {outfit?.reasoning || "Here are the best matches from your closet."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-8 pt-2">
          {sections.map((section) => (
            <OutfitCarousel
              key={section.key}
              title={section.title}
              itemIds={section.itemIds}
              itemLookup={itemLookup}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
