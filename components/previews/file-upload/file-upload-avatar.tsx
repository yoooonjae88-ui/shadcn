"use client"

import { CircleUserRound } from "lucide-react"

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadErrors,
  useFileUploadContext,
} from "@/registry/file-upload/file-upload"

// The dropzone itself shows the current image; a new pick replaces it.
function AvatarZone() {
  const { state } = useFileUploadContext()
  const avatar = state.files[0]
  return (
    <FileUploadDropzone
      aria-label="Upload profile picture"
      className="size-24 min-h-0 self-center overflow-hidden rounded-full p-0"
    >
      {avatar?.preview ? (
        // eslint-disable-next-line @next/next/no-img-element -- object URL preview
        <img
          src={avatar.preview}
          alt="Profile picture preview"
          className="size-full object-cover"
        />
      ) : (
        <CircleUserRound
          className="size-9 text-muted-foreground"
          strokeWidth={1.25}
          aria-hidden="true"
        />
      )}
    </FileUploadDropzone>
  )
}

export function FileUploadAvatarExample() {
  return (
    <FileUpload accept="image/*" maxSize={2 * 1024 * 1024} className="items-center">
      <AvatarZone />
      <span className="self-center text-xs text-muted-foreground">
        Click or drop an image to change the avatar
      </span>
      <FileUploadErrors className="self-center" />
    </FileUpload>
  )
}
