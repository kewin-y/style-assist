"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

import { CardImage } from "@/components/clothing_card"
import {
  CLOTHING_CATEGORIES,
  CLOTHING_COLORS,
  CLOTHING_FORMALITIES,
  type ClothingCategory,
  type ClothingColor,
  type ClothingFormality,
  type ClothingFilters,
} from "@/types/clothing"

type FilterDropdownProps = {
  filters: ClothingFilters
  onFiltersChange: (filters: ClothingFilters) => void
  items: {
    id: string
    name: string
    category: ClothingCategory
    color: ClothingColor
    formality: ClothingFormality
    image_url: string
    description: string | null
  }[]
  deleteItem: (id: string) => void
}

export function FilterDropdown({
  filters,
  onFiltersChange,
  items,
  deleteItem,
}: FilterDropdownProps) {
  const selectedTypes = CLOTHING_CATEGORIES.reduce(
    (acc, type) => {
      acc[type] = filters.categories.includes(type)
      return acc
    },
    {} as Record<ClothingCategory, boolean>
  )

  const selectedColors = CLOTHING_COLORS.reduce(
    (acc, color) => {
      acc[color] = filters.colors.includes(color)
      return acc
    },
    {} as Record<ClothingColor, boolean>
  )

  const selectedFormalities = CLOTHING_FORMALITIES.reduce(
    (acc, formality) => {
      acc[formality] = filters.formalities.includes(formality)
      return acc
    },
    {} as Record<ClothingFormality, boolean>
  )

  const handleTypeChange = (type: ClothingCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, type]
      : filters.categories.filter((c) => c !== type)
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleColorChange = (color: ClothingColor, checked: boolean) => {
    const newColors = checked
      ? [...filters.colors, color]
      : filters.colors.filter((c) => c !== color)
    onFiltersChange({ ...filters, colors: newColors })
  }

  const handleFormalityChange = (
    formality: ClothingFormality,
    checked: boolean
  ) => {
    const newFormalities = checked
      ? [...filters.formalities, formality]
      : filters.formalities.filter((f) => f !== formality)
    onFiltersChange({ ...filters, formalities: newFormalities })
  }

  return (
    <div>
      <div className="ml-9.5 flex justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            {/* Clothing Type Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Clothing Type</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {CLOTHING_CATEGORIES.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedTypes[type]}
                    onCheckedChange={(value) => handleTypeChange(type, value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Color Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Color</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {CLOTHING_COLORS.map((color) => (
                  <DropdownMenuCheckboxItem
                    key={color}
                    checked={selectedColors[color]}
                    onCheckedChange={(value) => handleColorChange(color, value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {color}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Formality Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Formality</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {CLOTHING_FORMALITIES.map((formality) => (
                  <DropdownMenuCheckboxItem
                    key={formality}
                    checked={selectedFormalities[formality]}
                    onCheckedChange={(value) =>
                      handleFormalityChange(formality, value)
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    {formality}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Display items */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        {items.map((item) => (
          <CardImage key={item.id} item={item} deleteItem={deleteItem} />
        ))}
      </div>
    </div>
  )
}
