"use client"

import {
  FileUpload,
  FileUploadClear,
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

// Starts with an already-uploaded file restored from metadata. Rejections
// (type, size, count, duplicates) show below the zone.
export function FileUploadMultipleExample() {
  return (
    <FileUpload
      className="w-full max-w-sm"
      multiple
      maxFiles={5}
      maxSize={2 * 1024 * 1024}
      initialFiles={[
        {
          id: "initial-report",
          name: "quarterly-report.pdf",
          size: 1_284_003,
          type: "application/pdf",
        },
      ]}
    >
      <FileUploadDropzone description="Up to 5 files, 2 MB each" />
      <FileUploadErrors />
      <FileRows />
      <FileUploadClear />
    </FileUpload>
  )
}
