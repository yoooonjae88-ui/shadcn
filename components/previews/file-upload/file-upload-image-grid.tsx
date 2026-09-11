"use client"

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadErrors,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemPreview,
  FileUploadList,
  useFileUploadContext,
} from "@/registry/file-upload/file-upload"

// Image-only uploads rendered as a wrapping thumbnail grid with a hover
// delete button on each tile.
function ImageGrid() {
  const { state } = useFileUploadContext()
  return (
    <FileUploadList orientation="horizontal">
      {state.files.map((file) => (
        <FileUploadItem
          key={file.id}
          file={file}
          className="group size-20 w-auto shrink-0 p-0"
        >
          <FileUploadItemPreview className="size-20 rounded-lg" />
          <FileUploadItemDelete className="absolute top-1 right-1 size-6 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100" />
        </FileUploadItem>
      ))}
    </FileUploadList>
  )
}

export function FileUploadImageGridExample() {
  return (
    <FileUpload
      className="w-full max-w-sm"
      multiple
      accept="image/*"
      maxFiles={6}
      maxSize={4 * 1024 * 1024}
    >
      <FileUploadDropzone description="PNG, JPG, GIF… up to 6 images, 4 MB each" />
      <FileUploadErrors />
      <ImageGrid />
    </FileUpload>
  )
}
