import { FilterDropdown } from "@/components/filter"
import * as React from "react"
import { useClothes } from "@/hooks/useClothes"
import { apiForm } from "@/lib/api"
import type { ClothingFilters } from "@/types/clothing"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

const EMPTY_FILTERS: ClothingFilters = {
  categories: [],
  colors: [],
  formalities: [],
}

export default function ClosetPage() {
  const [filters, setFilters] = React.useState<ClothingFilters>(EMPTY_FILTERS)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const { data: items = [], isLoading, error, refetch } = useClothes(filters)

  const deleteItem = (id: string) => {
    console.log("Delete item:", id)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setUploadSuccess(null)
      setUploadError("Please choose an image file.")
      event.target.value = ""
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      await apiForm.post("/clothes/upload", formData)
      await refetch()
      setUploadSuccess("Upload complete. Your closet is updating.")
    } catch (uploadErr) {
      console.error(uploadErr)
      setUploadError("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
      event.target.value = ""
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
          Error loading closet items: {JSON.stringify(error)}{" "}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 p-4">
        <Navbar />
        <h1 className="mt-15 mb-6 ml-5 text-6xl font-bold">
          Welcome to your digital closet!
        </h1>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button onClick={handleUploadClick} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload clothing item"}
        </Button>
        {uploadError ? (
          <p className="text-sm text-red-500">{uploadError}</p>
        ) : null}
        {uploadSuccess ? (
          <p className="text-sm text-green-600">{uploadSuccess}</p>
        ) : null}
        <div style={{ height: "20px" }} />
      </div>

      <div>
        <FilterDropdown
          filters={filters}
          onFiltersChange={setFilters}
          items={items}
          deleteItem={deleteItem}
        />
      </div>
    </div>
  )
}
