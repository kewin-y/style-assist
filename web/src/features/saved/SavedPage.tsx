import * as React from "react"
import { Navbar } from "@/components/navbar";
import { OutfitCardImage } from "@/components/outfit_card"

// Test
const MOCK_OUTFITS = [
  { id: 1, name: "Summer Fit", items: ["Red T-Shirt", "Blue Shorts"] },
  { id: 2, name: "Formal Fit", items: ["Black Dress", "Heels"] },
  { id: 3, name: "Winter Fit", items: ["Winter Jacket", "Jeans"] },
]

export default function SavedPage() {
  const [items, setItems] = React.useState(MOCK_OUTFITS)

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(outfit => outfit.id !== id))
  }

  return (
  <div>
    <div className="flex flex-col items-center gap-4 p-4">
      <Navbar />

      <h1 className="text-6xl font-bold mb-6 ml-5 mt-15">
      Here are your saved outfits!
      </h1>
    </div>    

    <div className="grid grid-cols-3 gap-6">
      {items.map(outfit => (
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


