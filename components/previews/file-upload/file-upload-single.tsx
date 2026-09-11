"use client"

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadErrors,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadItemRetry,
  FileUploadList,
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

// Click, press Enter/Space, or drag a file in. Picking again replaces it.
export function FileUploadSingleExample() {
  return (
    <FileUpload maxSize={5 * 1024 * 1024} className="w-full max-w-sm">
      <FileUploadDropzone description="Any file up to 5 MB" />
      <FileUploadErrors />
      <FileRows />
    </FileUpload>
  )
}
