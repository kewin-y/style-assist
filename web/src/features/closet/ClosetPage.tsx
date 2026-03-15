import { FilterDropdown } from "@/components/filter"
import * as React from "react"

// For testing
const MOCK_ITEMS = [
  { id: 1, name: "Red T-Shirt", type: "INNER_TOP", colour: "RED", formality: "CASUAL" },
  { id: 2, name: "Blue Shorts", type: "BOTTOM", colour: "BLUE", formality: "ATHLETIC" },
  { id: 3, name: "Black Dress", type: "INNER_TOP", colour: "BLACK", formality: "FORMAL" },
  { id: 4, name: "Summer Shoes", type: "SHOES", colour: "YELLOW", formality: "CASUAL" },
  { id: 5, name: "Winter Jacket", type: "OUTER_TOP", colour: "GREEN", formality: "BUSINESS_CASUAL" },
]

export default function ClosetPage() {
  const [items, setItems] = React.useState(MOCK_ITEMS)

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div>
      <h1 className="text-6xl font-bold mb-6 ml-5 mt-15">Welcome to your digital closet!</h1>
      <FilterDropdown
        items={items}
        deleteItem={deleteItem}
      />
      <div style={{ height: "20px" }} />
    </div>
  )
}

