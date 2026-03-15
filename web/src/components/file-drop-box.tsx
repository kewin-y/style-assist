import { Upload, X } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { cn } from "@/lib/utils"

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

type FileUploadBoxProps = {
  value: File[]
  onValueChange: (files: File[]) => void
  disabled?: boolean
  className?: string
}

export function FileUploadBox({
  value,
  onValueChange,
  disabled = false,
  className,
}: FileUploadBoxProps) {
  const onFileValidate = React.useCallback((file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed"
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return `File size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    }

    return null
  }, [])

  const onFileReject = React.useCallback((_file: File, message: string) => {
    toast.error(message)
  }, [])

  return (
    <FileUpload
      value={value}
      onValueChange={onValueChange}
      onFileValidate={onFileValidate}
      onFileReject={onFileReject}
      accept="image/*"
      maxFiles={1}
      className={cn("w-full max-w-md", className)}
      disabled={disabled}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <HugeiconsIcon
              icon={Upload}
              className="size-6 text-muted-foreground"
            />
          </div>
          <p className="text-sm font-medium">Drop one image here</p>
          <p className="text-xs text-muted-foreground">
            Or click to browse (max 1 image, 2MB)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {value.map((file) => (
          <FileUploadItem
            key={`${file.name}-${file.lastModified}`}
            value={file}
          >
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <HugeiconsIcon icon={X} />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  )
}
