import { Navbar } from "@/components/navbar"
import { OutfitCardImage } from "@/components/outfit_card"
import { useOutfits } from "@/hooks/useOutfits"

export default function SavedPage() {
  const { data: items = [], isLoading, error } = useOutfits()

  const deleteItem = (id: number) => {
    console.log("Delete outfit:", id)
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
          />
        ))}
      </div>
    </div>
  )
}
