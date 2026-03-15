import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AlertDialogDestructive } from "@/components/deleteConfirm"

type Item = {
  id: number
  name: string
  type: string
  colour: string
  formality: string
}

type CardImageProps = {
  item: Item               // single item, not an array
  deleteItem: (id: number) => void
}

export function CardImage({ item, deleteItem }: CardImageProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>
          This is the description -- to be continued.
        </CardDescription>
      </CardHeader>
      {/* Delete button */}
        <div className="absolute bottom-2 right-2 z-50">
          <AlertDialogDestructive onConfirm={() => deleteItem(item.id)} />
        </div>
    </Card>
  )
}
