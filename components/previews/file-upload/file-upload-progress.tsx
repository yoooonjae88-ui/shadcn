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
  type FileUploadHandlers,
} from "@/registry/file-upload/file-upload"

// Stand-in for a real transport: ticks progress every 200ms and fails one
// upload in three so the error + retry path is visible in the demo.
function simulateUpload(_file: File, handlers: FileUploadHandlers) {
  let progress = 0
  const timer = setInterval(() => {
    progress += 8 + Math.random() * 12
    if (progress >= 100) {
      clearInterval(timer)
      if (Math.random() < 1 / 3) {
        handlers.onError("Network error — tap retry.")
      } else {
        handlers.onSuccess()
      }
    } else {
      handlers.onProgress(progress)
    }
  }, 200)
}

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

// Files start uploading the moment they are added; each row shows live
// progress, then a success note or an error with a retry button.
export function FileUploadProgressExample() {
  return (
    <FileUpload
      className="w-full max-w-sm"
      multiple
      maxFiles={5}
      onUpload={simulateUpload}
    >
      <FileUploadDropzone
        label={
          <>
            <span className="text-primary">Click to upload</span> — uploads
            start automatically
          </>
        }
        description="Simulated transport; roughly one in three uploads fails so you can retry it"
      />
      <FileUploadErrors />
      <FileRows />
      <FileUploadClear />
    </FileUpload>
  )
}
