"use client"

import * as React from "react"
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

const CLOTHING_TYPES = [
  'INNER_TOP', 
  'OUTER_TOP', 
  'BOTTOM', 
  'SHOES'
]

const CLOTHING_FORMALITY = [
  'CASUAL', 
  'BUSINESS_CASUAL', 
  'FORMAL', 
  'ATHLETIC'
]

const CLOTHING_COLOUR = [
  'RED',
  'ORANGE',
  'YELLOW',
  'GREEN',
  'BLUE',
  'PURPLE',
  'BLACK',
  'WHITE',
  'BROWN',
  'GREY',
  'PINK',
  'MULTI'
]

type FilterDropdownProps = {
  items: { id: number; name: string; type: string; colour: string; formality: string }[]
  deleteItem: (id: number) => void
}

export function FilterDropdown({ items, deleteItem }: FilterDropdownProps) {
  // Dynamic state for all types of clothing
  const [selectedTypes, setSelectedTypes] = React.useState(
    CLOTHING_TYPES.reduce((acc, type) => {
      acc[type] = false
      return acc
    }, {} as Record<string, boolean>)
  )

  // Dynamic state for all colours
  const [selectedColours, setSelectedColours] = React.useState(
    CLOTHING_COLOUR.reduce((acc, colour) => {
      acc[colour] = false
      return acc
    }, {} as Record<string, boolean>)
  )

  // Dynamic state for all formalities
  const [selectedFormalities, setSelectedFormalities] = React.useState(
    CLOTHING_FORMALITY.reduce((acc, formality) => {
      acc[formality] = false
      return acc
    }, {} as Record<string, boolean>)
  )

  // Filter items based on selection
  const filteredItems = items.filter((item) => {

    /* Filter by clothing type */
    const activeTypes = Object.keys(selectedTypes).filter((key) => selectedTypes[key])
    const typeMatch = activeTypes.length === 0 || activeTypes.includes(item.type)

    /* Filter by colour */
    const activeColours = Object.keys(selectedColours).filter((key) => selectedColours[key])
    const colourMatch = activeColours.length === 0 || activeColours.includes(item.colour)

    /* Filter by formality */
    const activeFormalities = Object.keys(selectedFormalities).filter((key) => selectedFormalities[key])
    const formalitiesMatch = activeFormalities.length === 0 || activeFormalities.includes(item.formality)

    return typeMatch && formalitiesMatch && colourMatch
  })

  return (
    <div>
      <div className="flex justify-end mr-9.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Filter</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48">
          {/* Clothing Type Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Clothing Type</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {CLOTHING_TYPES.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes[type]}
                  onCheckedChange={(value) =>
                    setSelectedTypes({ ...selectedTypes, [type]: value })
                  }
                  onSelect={(e) => e.preventDefault()} // keep dropdown open
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Colour Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Colour</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {CLOTHING_COLOUR.map((colour) => (
                <DropdownMenuCheckboxItem
                  key={colour}
                  checked={selectedColours[colour]}
                  onCheckedChange={(value) =>
                    setSelectedColours({ ...selectedColours, [colour]: value })
                  }
                  onSelect={(e) => e.preventDefault()} // keep dropdown open
                >
                  {colour}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Formality Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Formality</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {CLOTHING_FORMALITY.map((formality) => (
                <DropdownMenuCheckboxItem
                  key={formality}
                  checked={selectedFormalities[formality]}
                  onCheckedChange={(value) =>
                    setSelectedFormalities({ ...selectedFormalities, [formality]: value })
                  }
                  onSelect={(e) => e.preventDefault()} // keep dropdown open
                >
                  {formality}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

        </DropdownMenuContent>
      </DropdownMenu>
      </div>

      {/* Display filtered items */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {filteredItems.map((item) => (
          <CardImage 
            key={item.id} 
            item={item}
            deleteItem={deleteItem}
          />
        ))}
      </div>
    </div>
  )
}
    