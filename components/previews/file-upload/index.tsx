import type { PreviewExample } from "@/components/previews/types"
import { FileUploadAvatarExample } from "./file-upload-avatar"
import { FileUploadImageGridExample } from "./file-upload-image-grid"
import { FileUploadMultipleExample } from "./file-upload-multiple"
import { FileUploadProgressExample } from "./file-upload-progress"
import { FileUploadSingleExample } from "./file-upload-single"
import { FileUploadTriggerExample } from "./file-upload-trigger"

export const fileUploadExamples: PreviewExample[] = [
  {
    name: "single",
    title: "Dropzone",
    component: FileUploadSingleExample,
    file: "components/previews/file-upload/file-upload-single.tsx",
  },
  {
    name: "multiple",
    title: "Multiple files",
    component: FileUploadMultipleExample,
    file: "components/previews/file-upload/file-upload-multiple.tsx",
  },
  {
    name: "trigger",
    title: "Button trigger",
    component: FileUploadTriggerExample,
    file: "components/previews/file-upload/file-upload-trigger.tsx",
  },
  {
    name: "image-grid",
    title: "Image grid",
    component: FileUploadImageGridExample,
    file: "components/previews/file-upload/file-upload-image-grid.tsx",
  },
  {
    name: "avatar",
    title: "Avatar picker",
    component: FileUploadAvatarExample,
    file: "components/previews/file-upload/file-upload-avatar.tsx",
  },
  {
    name: "progress",
    title: "Upload progress",
    component: FileUploadProgressExample,
    file: "components/previews/file-upload/file-upload-progress.tsx",
  },
]
