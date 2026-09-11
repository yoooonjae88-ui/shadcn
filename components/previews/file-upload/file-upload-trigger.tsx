"use client"

import {
  FileUpload,
  FileUploadErrors,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadItemRetry,
  FileUploadList,
  FileUploadTrigger,
  useFileUploadContext,
} from "@/registry/file-upload/file-upload"

function FileRows() {
  const { state } = useFileUploadContext()
  return (
    <FileUploadList>
      {state.files.map((file) => (
        <FileUploadItem key={file.id} file={file}>
          <FileUploadItemPreview />
          <FileUploadItemMetadata />
          <FileUploadItemProgress />
          <FileUploadItemRetry />
          <FileUploadItemDelete />
        </FileUploadItem>
      ))}
    </FileUploadList>
  )
}

// No dropzone — just a picker button.
export function FileUploadTriggerExample() {
  return (
    <FileUpload multiple maxFiles={3} className="w-full max-w-sm">
      <FileUploadTrigger />
      <FileUploadErrors />
      <FileRows />
    </FileUpload>
  )
}
