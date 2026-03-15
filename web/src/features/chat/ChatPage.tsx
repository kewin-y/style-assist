import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { FileUploadBox } from "@/components/file-drop-box"
import { Navbar } from "@/components/navbar"
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
import { api } from "@/lib/api"
import { uploadInspoImage } from "@/lib/supabase-storage"
import { useAuth } from "@/contexts/AuthContext"
import { useClothes } from "@/hooks/useClothes"
import type { ClothingFilters, ClothingItem } from "@/types/clothing"
import type {
  GeneratedOutfit,
  OutfitGenerationErrorResponse,
} from "@/types/outfit"

type GenerateOutfitPayload = {
  prompt?: string
  image_url?: string
}

type OutfitSection = {
  key: "outer_tops" | "inner_tops" | "bottoms" | "shoes"
  title: string
  items: string[]
}

const EMPTY_FILTERS: ClothingFilters = {
  categories: [],
  colors: [],
  formalities: [],
}

const OUTFIT_SECTIONS: Array<Pick<OutfitSection, "key" | "title">> = [
  { key: "outer_tops", title: "Outer layers" },
  { key: "inner_tops", title: "Tops" },
  { key: "bottoms", title: "Bottoms" },
  { key: "shoes", title: "Shoes" },
]

function isGenerationError(
  value: GeneratedOutfit | OutfitGenerationErrorResponse
): value is OutfitGenerationErrorResponse {
  return "status" in value && value.status === "error"
}

function normalizeOutfitResponse(
  data: GeneratedOutfit[] | GeneratedOutfit | OutfitGenerationErrorResponse
) {
  if (Array.isArray(data)) {
    return data[0]
  }

  return data
}

function buildItemLookup(items: ClothingItem[]) {
  return items.reduce<Map<string, ClothingItem>>((lookup, item) => {
    lookup.set(item.name.trim().toLowerCase(), item)
    return lookup
  }, new Map())
}

function OutfitCarousel({
  title,
  itemNames,
  itemLookup,
}: {
  title: string
  itemNames: string[]
  itemLookup: Map<string, ClothingItem>
}) {
  if (itemNames.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className="text-left text-lg font-semibold">{title}</h3>
      <Carousel
        className="w-full"
        opts={{
          loop: itemNames.length > 1,
          align: "start",
        }}
      >
        <CarouselContent>
          {itemNames.map((name) => {
            const clothingItem = itemLookup.get(name.trim().toLowerCase())

            return (
              <CarouselItem
                key={`${title}-${name}`}
                className="sm:basis-1/2 lg:basis-1/3"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm">
                  {clothingItem?.image_url ? (
                    <img
                      src={clothingItem.image_url}
                      alt={name}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-muted px-6 text-center text-sm text-muted-foreground">
                      No closet image found for this piece.
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4 text-left">
                    <p className="font-medium">{name}</p>
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
        {itemNames.length > 1 ? (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        ) : null}
      </Carousel>
    </div>
  )
}

export default function ChatPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = React.useState("")
  const [files, setFiles] = React.useState<File[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [result, setResult] = React.useState<GeneratedOutfit | null>(null)
  const { data: clothes = [] } = useClothes(EMPTY_FILTERS)

  const itemLookup = React.useMemo(() => buildItemLookup(clothes), [clothes])

  const generateOutfitMutation = useMutation({
    mutationFn: async () => {
      const trimmedPrompt = prompt.trim()
      const selectedFile = files[0]

      if (!trimmedPrompt && !selectedFile) {
        throw new Error("Add a prompt or upload a reference image first.")
      }

      if (!user?.id) {
        throw new Error("Missing user context for inspiration upload.")
      }

      const payload: GenerateOutfitPayload = {}

      if (trimmedPrompt) {
        payload.prompt = trimmedPrompt
      }

      if (selectedFile) {
        payload.image_url = await uploadInspoImage(selectedFile, user.id)
      }

      const { data } = await api.post<
        GeneratedOutfit[] | GeneratedOutfit | OutfitGenerationErrorResponse
      >("/outfits/generate", payload)

      const normalizedData = normalizeOutfitResponse(data)

      if (!normalizedData) {
        throw new Error("The stylist returned an empty response.")
      }

      if (isGenerationError(normalizedData)) {
        throw new Error(normalizedData.message)
      }

      return normalizedData
    },
    onSuccess: (outfit) => {
      setResult(outfit)
      setIsDialogOpen(true)
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.detail || error.message
          : error instanceof Error
            ? error.message
            : "Could not generate an outfit right now."

      toast.error(message)
    },
  })

  const sections = React.useMemo<OutfitSection[]>(() => {
    if (!result) {
      return []
    }

    return OUTFIT_SECTIONS.map((section) => ({
      ...section,
      items: result[section.key] ?? [],
    })).filter((section) => section.items.length > 0)
  }, [result])

  const handleGenerate = async () => {
    await generateOutfitMutation.mutateAsync()
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-4">
        <Navbar />
        <h1 className="mt-15 mb-6 ml-5 text-6xl font-bold">
          What's your idea?
        </h1>
        <div className="flex w-full max-w-3xl flex-col items-center gap-6 rounded-[2rem] border bg-card/60 px-6 py-8 shadow-sm backdrop-blur-sm">
          <p className="max-w-xl text-center text-sm text-muted-foreground">
            Start with a vibe, an inspiration image, or both. We will pull from
            your closet and build an outfit that fits.
          </p>

          <FileUploadBox
            value={files}
            onValueChange={setFiles}
            disabled={generateOutfitMutation.isPending}
          />

          <p className="text-sm font-medium tracking-[0.25em] text-muted-foreground uppercase">
            or
          </p>

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe your outfit idea"
            className="min-h-36 w-full rounded-[1.5rem] border bg-background px-5 py-4 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            disabled={generateOutfitMutation.isPending}
          />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generateOutfitMutation.isPending}
            className="rounded-full border bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generateOutfitMutation.isPending
              ? "Styling..."
              : "Generate outfit"}
          </button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {result?.title?.trim() || "Your stylist picks"}
            </DialogTitle>
            <DialogDescription className="text-left leading-relaxed">
              {result?.reasoning ||
                "Here are the best matches from your closet."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-8 pt-2">
            {sections.map((section) => (
              <OutfitCarousel
                key={section.key}
                title={section.title}
                itemNames={section.items}
                itemLookup={itemLookup}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
