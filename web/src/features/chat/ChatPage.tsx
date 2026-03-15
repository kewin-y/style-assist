import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { OutfitDialog } from "@/components/outfit-dialog"
import { FileUploadBox } from "@/components/file-drop-box"
import { Navbar } from "@/components/navbar"
import { api } from "@/lib/api"
import { uploadInspoImage } from "@/lib/supabase-storage"
import { useAuth } from "@/contexts/AuthContext"
import type { ClothingItem } from "@/types/clothing"
import type {
  GeneratedOutfit,
  OutfitGenerationErrorResponse,
} from "@/types/outfit"

type GenerateOutfitPayload = {
  prompt?: string
  image_url?: string
}

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

export default function ChatPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = React.useState("")
  const [files, setFiles] = React.useState<File[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [result, setResult] = React.useState<GeneratedOutfit | null>(null)
  const [resolvedItems, setResolvedItems] = React.useState<ClothingItem[]>([])

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

      const clothingIds = Array.from(
        new Set([
          ...normalizedData.outer_tops,
          ...normalizedData.inner_tops,
          ...normalizedData.bottoms,
          ...normalizedData.shoes,
        ])
      )

      const clothingItems = await Promise.all(
        clothingIds.map(async (clothingId) => {
          try {
            const { data } = await api.get<ClothingItem>(
              `/clothes/${clothingId}`
            )
            return data
          } catch {
            return null
          }
        })
      )

      return {
        outfit: normalizedData,
        clothingItems: clothingItems.filter(
          (item): item is ClothingItem => item !== null
        ),
      }
    },
    onSuccess: ({ outfit, clothingItems }) => {
      setResult(outfit)
      setResolvedItems(clothingItems)
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

      <OutfitDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        outfit={result}
        items={resolvedItems}
      />
    </>
  )
}
