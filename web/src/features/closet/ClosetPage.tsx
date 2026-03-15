import { FilterDropdown } from "@/components/filter"
import * as React from "react"
import { useClothes } from "@/hooks/useClothes"
import type { ClothingFilters } from "@/types/clothing"
import { Navbar } from "@/components/navbar";

const EMPTY_FILTERS: ClothingFilters = {
  categories: [],
  colors: [],
  formalities: [],
}

export default function ClosetPage() {
  const [filters, setFilters] = React.useState<ClothingFilters>(EMPTY_FILTERS)
  const { data: items = [], isLoading, error } = useClothes(filters)

  const deleteItem = (id: number) => {
    console.log("Delete item:", id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">Error loading closet items: {JSON.stringify(error)} </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <h1 className="text-6xl font-bold mb-6 ml-5 mt-15">Welcome to your digital closet!</h1>
      <FilterDropdown
        filters={filters}
        onFiltersChange={setFilters}
        items={items}
        deleteItem={deleteItem}
      />
      <div style={{ height: "20px" }} />
    </div>
  )
}

