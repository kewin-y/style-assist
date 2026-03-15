import { useQuery } from "@tanstack/react-query"
import { useMemo, useRef, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { ClothingItem, ClothingFilters } from "@/types/clothing"

const DEBOUNCE_MS = 300

export function useClothes(filters: ClothingFilters) {
  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedFilters(filters)
    }, DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [filters])

  const params = useMemo(() => {
    const searchParams = new URLSearchParams()
    debouncedFilters.categories.forEach((c) =>
      searchParams.append("categories", c)
    )
    debouncedFilters.colors.forEach((c) => searchParams.append("colors", c))
    debouncedFilters.formalities.forEach((f) =>
      searchParams.append("formalities", f)
    )
    return searchParams.toString()
  }, [debouncedFilters])

  return useQuery({
    queryKey: ["clothes", debouncedFilters],
    queryFn: async () => {
      const url = params ? `/clothes?${params}` : "/clothes"
      const { data } = await api.get<ClothingItem[]>(url)
      return data
    },
  })
}