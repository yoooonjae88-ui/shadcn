"use client"

import * as React from "react"
import {
  CircleAlert,
  CloudUpload,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileVideo,
  ImageIcon,
  RotateCcw,
  Upload,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Describes an already-uploaded file (e.g. loaded from your database) so it
 * can be listed alongside freshly picked `File` objects via `initialFiles`. */
interface FileUploadMetadata {
  id: string
  name: string
  size: number
  type: string
  /** URL used as the preview for image metadata. */
  url?: string
}

type FileUploadStatus = "idle" | "uploading" | "success" | "error"

/** One entry in the upload list: a picked `File` (or restored metadata) plus
 * its preview URL and upload lifecycle state. */
interface FileUploadFile {
  id: string
  file: File | FileUploadMetadata
  /** Object URL for picked images / `url` for image metadata; undefined otherwise. */
  preview?: string
  status: FileUploadStatus
  /** Upload progress 0–100, driven by the `onUpload` helpers. */
  progress: number
  /** Per-file upload error, set via the `onUpload` `onError` helper. */
  error?: string
}

/** Helpers handed to `onUpload` so the consumer's transport (fetch/XHR/SDK)
 * can report per-file progress and settle the item's status. */
interface FileUploadHandlers {
  onProgress: (percent: number) => void
  onSuccess: () => void
  onError: (message: string) => void
}

interface FileUploadOptions {
  /** Allow picking several files. When false a new pick replaces the current file. */
  multiple?: boolean
  /** Same syntax as the native `accept` attribute: `"image/*"`, `".pdf,.docx"`, `"video/mp4"`… */
  accept?: string
  /** Maximum number of files kept in the list (only meaningful with `multiple`). */
  maxFiles?: number
  /** Maximum size per file, in bytes. */
  maxSize?: number
  /** Extra per-file validation; return an error message to reject the file. */
  validate?: (file: File) => string | null | undefined
  /** Files already uploaded elsewhere, shown in the list from the start. */
  initialFiles?: FileUploadMetadata[]
  /** Fires with the full list whenever it changes. */
  onFilesChange?: (files: FileUploadFile[]) => void
  /** Fires with only the newly accepted files after a pick/drop. */
  onFilesAdded?: (files: FileUploadFile[]) => void
  /** Rejection callback: every file that fails validation, with the reason. */
  onFileReject?: (file: File, message: string) => void
  /** When set, each accepted file is handed to your uploader right away and
   * the item tracks uploading/success/error state with a progress bar. */
  onUpload?: (file: File, handlers: FileUploadHandlers) => void | Promise<void>
}

interface FileUploadState {
  files: FileUploadFile[]
  /** True while a drag with files hovers the dropzone. */
  isDragging: boolean
  /** Validation messages from the most recent pick/drop. */
  errors: string[]
}

interface FileUploadActions {
  addFiles: (files: FileList | File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  clearErrors: () => void
  /** Re-runs `onUpload` for a file whose upload errored. */
  retryUpload: (id: string) => void
  openFileDialog: () => void
  /** Spread onto a hidden `<input type="file">`; wired to the hook. */
  getInputProps: (
    props?: React.ComponentProps<"input">
  ) => React.ComponentProps<"input"> & { ref: React.Ref<HTMLInputElement> }
  handleDragEnter: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Formats a byte count for humans: 1024 → "1 KB", 1536000 → "1.5 MB". */
function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B"
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / Math.pow(1024, i)
  return `${parseFloat(value.toFixed(decimals))} ${units[i]}`
}

let fileUploadIdCounter = 0
function nextFileId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  fileUploadIdCounter += 1
  return `file-${Date.now()}-${fileUploadIdCounter}`
}

/** Mirrors how the native `accept` attribute matches: extension (`.pdf`),
 * wildcard mime (`image/*`) or exact mime (`application/zip`). */
function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true
  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
  if (rules.length === 0) return true
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule)
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1))
    return type === rule
  })
}

// ---------------------------------------------------------------------------
// useFileUpload — the headless engine. All state, validation, drag handling,
// previews and upload lifecycle live here; the components below are one way
// to render it, but the hook can be used on its own for fully custom UIs.
// ---------------------------------------------------------------------------

function useFileUpload(
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] {
  const {
    multiple = false,
    accept,
    maxFiles = Infinity,
    maxSize = Infinity,
    validate,
    initialFiles,
    onFilesChange,
    onFilesAdded,
    onFileReject,
    onUpload,
  } = options

  const [files, setFiles] = React.useState<FileUploadFile[]>(
    () =>
      initialFiles?.map((meta) => ({
        id: meta.id,
        file: meta,
        preview: meta.url,
        status: "success" as const,
        progress: 100,
      })) ?? []
  )
  const [isDragging, setIsDragging] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])

  const inputRef = React.useRef<HTMLInputElement>(null)
  // dragenter/dragleave fire for every child the pointer crosses; a depth
  // counter keeps isDragging stable until the pointer truly leaves.
  const dragDepth = React.useRef(0)
  // Object URLs we created (not metadata URLs) so only those get revoked.
  const createdPreviews = React.useRef(new Set<string>())

  // Keep the latest callbacks without re-creating the actions on each render.
  const callbacks = React.useRef({
    onFilesChange,
    onFilesAdded,
    onFileReject,
    onUpload,
    validate,
  })
  React.useEffect(() => {
    callbacks.current = {
      onFilesChange,
      onFilesAdded,
      onFileReject,
      onUpload,
      validate,
    }
  })

  const filesRef = React.useRef(files)
  React.useEffect(() => {
    filesRef.current = files
  }, [files])

  const updateFiles = React.useCallback(
    (updater: (prev: FileUploadFile[]) => FileUploadFile[]) => {
      setFiles((prev) => {
        const next = updater(prev)
        if (next !== prev) callbacks.current.onFilesChange?.(next)
        return next
      })
    },
    []
  )

  const setFileState = React.useCallback(
    (id: string, patch: Partial<Omit<FileUploadFile, "id" | "file">>) => {
      updateFiles((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      )
    },
    [updateFiles]
  )

  const startUpload = React.useCallback(
    (item: FileUploadFile) => {
      const upload = callbacks.current.onUpload
      if (!upload || !(item.file instanceof File)) return
      setFileState(item.id, { status: "uploading", progress: 0, error: undefined })
      const handlers: FileUploadHandlers = {
        onProgress: (percent) =>
          setFileState(item.id, {
            progress: Math.max(0, Math.min(100, percent)),
          }),
        onSuccess: () =>
          setFileState(item.id, { status: "success", progress: 100 }),
        onError: (message) =>
          setFileState(item.id, { status: "error", error: message }),
      }
      void Promise.resolve(upload(item.file, handlers)).catch((err: unknown) => {
        handlers.onError(err instanceof Error ? err.message : "Upload failed")
      })
    },
    [setFileState]
  )

  const addFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      const picked = Array.from(incoming)
      if (picked.length === 0) return

      const nextErrors: string[] = []
      const reject = (file: File, message: string) => {
        nextErrors.push(message)
        callbacks.current.onFileReject?.(file, message)
      }

      // Single mode: only the first pick matters and it replaces the current file.
      const candidates = multiple ? picked : picked.slice(0, 1)
      const current = multiple ? filesRef.current : []
      const accepted: FileUploadFile[] = []

      for (const file of candidates) {
        if (!matchesAccept(file, accept)) {
          reject(file, `"${file.name}" is not an accepted file type.`)
          continue
        }
        if (file.size > maxSize) {
          reject(
            file,
            `"${file.name}" exceeds the ${formatBytes(maxSize)} size limit.`
          )
          continue
        }
        const custom = callbacks.current.validate?.(file)
        if (custom) {
          reject(file, custom)
          continue
        }
        const duplicate = [...current, ...accepted].some(
          (item) => item.file.name === file.name && item.file.size === file.size
        )
        if (duplicate) {
          reject(file, `"${file.name}" is already in the list.`)
          continue
        }
        if (current.length + accepted.length >= maxFiles) {
          reject(file, `You can upload at most ${maxFiles} files.`)
          continue
        }

        let preview: string | undefined
        if (file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file)
          createdPreviews.current.add(preview)
        }
        accepted.push({
          id: nextFileId(),
          file,
          preview,
          status: "idle",
          progress: 0,
        })
      }

      setErrors(nextErrors)

      if (accepted.length > 0) {
        updateFiles((prev) => {
          if (!multiple) {
            // Replace: release the previous file's preview before dropping it.
            for (const item of prev) {
              if (item.preview && createdPreviews.current.delete(item.preview)) {
                URL.revokeObjectURL(item.preview)
              }
            }
            return accepted
          }
          return [...prev, ...accepted]
        })
        callbacks.current.onFilesAdded?.(accepted)
        for (const item of accepted) startUpload(item)
      }
    },
    [accept, maxFiles, maxSize, multiple, startUpload, updateFiles]
  )

  const removeFile = React.useCallback(
    (id: string) => {
      updateFiles((prev) => {
        const target = prev.find((item) => item.id === id)
        if (target?.preview && createdPreviews.current.delete(target.preview)) {
          URL.revokeObjectURL(target.preview)
        }
        return prev.filter((item) => item.id !== id)
      })
    },
    [updateFiles]
  )

  const clearFiles = React.useCallback(() => {
    updateFiles((prev) => {
      for (const item of prev) {
        if (item.preview && createdPreviews.current.delete(item.preview)) {
          URL.revokeObjectURL(item.preview)
        }
      }
      return []
    })
    setErrors([])
  }, [updateFiles])

  const clearErrors = React.useCallback(() => setErrors([]), [])

  const retryUpload = React.useCallback(
    (id: string) => {
      const item = filesRef.current.find((f) => f.id === id)
      if (item && item.status === "error") startUpload(item)
    },
    [startUpload]
  )

  const openFileDialog = React.useCallback(() => {
    inputRef.current?.click()
  }, [])

  const getInputProps = React.useCallback(
    (
      props?: React.ComponentProps<"input">
    ): React.ComponentProps<"input"> & { ref: React.Ref<HTMLInputElement> } => ({
      type: "file",
      multiple,
      accept,
      tabIndex: -1,
      ...props,
      ref: inputRef,
      onChange: (e) => {
        if (e.target.files) addFiles(e.target.files)
        // Reset so picking the same file again still fires `change`.
        e.target.value = ""
        props?.onChange?.(e)
      },
    }),
    [accept, addFiles, multiple]
  )

  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragDepth.current += 1
    if (e.dataTransfer.types.includes("Files")) setIsDragging(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setIsDragging(false)
  }, [])

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      dragDepth.current = 0
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
    },
    [addFiles]
  )

  // Release every object URL we created when the owner unmounts.
  React.useEffect(() => {
    const previews = createdPreviews.current
    return () => {
      for (const url of previews) URL.revokeObjectURL(url)
      previews.clear()
    }
  }, [])

  const state = React.useMemo(
    () => ({ files, isDragging, errors }),
    [files, isDragging, errors]
  )
  const actions = React.useMemo(
    () => ({
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      retryUpload,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    }),
    [
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      retryUpload,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    ]
  )

  return [state, actions]
}

// ---------------------------------------------------------------------------
// Context plumbing for the composed components
// ---------------------------------------------------------------------------

interface FileUploadContextValue {
  state: FileUploadState
  actions: FileUploadActions
  disabled: boolean
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(
  null
)

function useFileUploadContext(): FileUploadContextValue {
  const ctx = React.useContext(FileUploadContext)
  if (!ctx) {
    throw new Error("FileUpload.* components must be used inside <FileUpload>")
  }
  return ctx
}

const FileUploadItemContext = React.createContext<FileUploadFile | null>(null)

function useFileUploadItemContext(): FileUploadFile {
  const ctx = React.useContext(FileUploadItemContext)
  if (!ctx) {
    throw new Error(
      "FileUploadItem.* components must be used inside <FileUploadItem>"
    )
  }
  return ctx
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

interface FileUploadProps
  extends Omit<React.ComponentProps<"div">, "onDrop">,
    FileUploadOptions {
  disabled?: boolean
}

/** Root: owns the hook state, renders the hidden file input, and provides
 * context to every part below. */
function FileUpload({
  multiple,
  accept,
  maxFiles,
  maxSize,
  validate,
  initialFiles,
  onFilesChange,
  onFilesAdded,
  onFileReject,
  onUpload,
  disabled = false,
  className,
  children,
  ...props
}: FileUploadProps) {
  const [state, actions] = useFileUpload({
    multiple,
    accept,
    maxFiles,
    maxSize,
    validate,
    initialFiles,
    onFilesChange,
    onFilesAdded,
    onFileReject,
    onUpload,
  })

  const ctx = React.useMemo(
    () => ({ state, actions, disabled }),
    [state, actions, disabled]
  )

  return (
    <FileUploadContext.Provider value={ctx}>
      <div
        data-slot="file-upload"
        data-disabled={disabled || undefined}
        className={cn("flex w-full flex-col gap-3", className)}
        {...props}
      >
        <input
          {...actions.getInputProps({ disabled, "aria-hidden": true })}
          className="sr-only"
        />
        {children}
      </div>
    </FileUploadContext.Provider>
  )
}

interface FileUploadDropzoneProps extends React.ComponentProps<"div"> {
  /** Headline inside the zone. Defaults to a click/drag prompt. */
  label?: React.ReactNode
  /** Secondary hint line, e.g. accepted types and size limit. */
  description?: React.ReactNode
  /** Swap the default cloud glyph. Pass `null` to hide it. */
  icon?: React.ReactNode
}

/** Click/keyboard/drag-and-drop target. Clicking (or Enter/Space) opens the
 * file dialog; dropping files anywhere on it adds them. */
function FileUploadDropzone({
  label,
  description,
  icon,
  className,
  children,
  ...props
}: FileUploadDropzoneProps) {
  const { state, actions, disabled } = useFileUploadContext()

  return (
    <div
      data-slot="file-upload-dropzone"
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      data-dragging={state.isDragging || undefined}
      data-disabled={disabled || undefined}
      onClick={disabled ? undefined : actions.openFileDialog}
      onKeyDown={
        disabled
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                actions.openFileDialog()
              }
            }
      }
      onDragEnter={disabled ? undefined : actions.handleDragEnter}
      onDragLeave={disabled ? undefined : actions.handleDragLeave}
      onDragOver={disabled ? undefined : actions.handleDragOver}
      onDrop={disabled ? undefined : actions.handleDrop}
      className={cn(
        "flex min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl bg-file-upload-dropzone px-6 py-8 text-center transition-colors select-none",
        "hover:bg-file-upload-dropzone-hover",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "data-[dragging]:bg-file-upload-dropzone-active",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {icon === undefined ? (
            <CloudUpload
              className={cn(
                "mb-1 size-8 text-muted-foreground transition-colors",
                state.isDragging && "text-primary"
              )}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          ) : (
            icon
          )}
          <span className="text-sm font-medium">
            {label ?? (
              <>
                <span className="text-primary">Click to upload</span> or drag
                and drop
              </>
            )}
          </span>
          {description != null && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </>
      )}
    </div>
  )
}

/** Any clickable element that opens the file dialog — for button-only
 * pickers or a "browse" affordance outside the dropzone. */
function FileUploadTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { actions, disabled } = useFileUploadContext()
  return (
    <button
      type="button"
      data-slot="file-upload-trigger"
      disabled={disabled || props.disabled}
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) actions.openFileDialog()
      }}
      {...props}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors",
        "hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children ?? (
        <>
          <Upload className="size-4" aria-hidden="true" />
          Select files
        </>
      )}
    </button>
  )
}

/** Validation messages from the last pick/drop (wrong type, too big, too
 * many…). Renders nothing while there are no errors. */
function FileUploadErrors({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { state } = useFileUploadContext()
  if (state.errors.length === 0) return null
  return (
    <div
      data-slot="file-upload-errors"
      role="alert"
      className={cn(
        "flex flex-col gap-1 text-xs text-destructive",
        className
      )}
      {...props}
    >
      {state.errors.map((error, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ))}
    </div>
  )
}

/** List container for `FileUploadItem`s. Set `orientation="horizontal"` for
 * a wrapping thumbnail grid instead of stacked rows. */
function FileUploadList({
  orientation = "vertical",
  className,
  children,
  ...props
}: React.ComponentProps<"ul"> & {
  orientation?: "vertical" | "horizontal"
}) {
  const { state } = useFileUploadContext()
  if (state.files.length === 0 && React.Children.count(children) === 0) {
    return null
  }
  return (
    <ul
      data-slot="file-upload-list"
      data-orientation={orientation}
      aria-label="Selected files"
      className={cn(
        orientation === "vertical"
          ? "flex w-full flex-col gap-2"
          : "flex w-full flex-wrap gap-3",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  )
}

/** One row/tile per file. Pass the entry from `state.files`; children
 * (preview, metadata, progress, delete) read it from context. */
function FileUploadItem({
  file,
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & { file: FileUploadFile }) {
  return (
    <FileUploadItemContext.Provider value={file}>
      <li
        data-slot="file-upload-item"
        data-status={file.status}
        className={cn(
          "relative flex w-full items-center gap-3 rounded-lg bg-file-upload-item p-3",
          className
        )}
        {...props}
      >
        {children}
      </li>
    </FileUploadItemContext.Provider>
  )
}

/** File-type glyph shown when there is no image preview, chosen from the
 * mime type with an extension fallback. */
function FileUploadTypeIcon({
  type,
  name,
  ...props
}: React.ComponentProps<typeof FileIcon> & { type: string; name: string }) {
  const lower = name.toLowerCase()
  let Icon = FileIcon
  if (type.startsWith("image/")) Icon = ImageIcon
  else if (type.startsWith("video/")) Icon = FileVideo
  else if (type.startsWith("audio/")) Icon = FileAudio
  else if (
    /zip|rar|7z|tar|gzip|compressed/.test(type) ||
    /\.(zip|rar|7z|tar|gz)$/.test(lower)
  ) {
    Icon = FileArchive
  } else if (
    /excel|spreadsheet|csv/.test(type) ||
    /\.(xls|xlsx|csv|ods)$/.test(lower)
  ) {
    Icon = FileSpreadsheet
  } else if (
    /json|javascript|typescript|html|css|xml/.test(type) ||
    /\.(json|js|jsx|ts|tsx|html|css|xml|yml|yaml)$/.test(lower)
  ) {
    Icon = FileCode
  } else if (
    /pdf|msword|wordprocessing|text/.test(type) ||
    /\.(pdf|doc|docx|txt|md)$/.test(lower)
  ) {
    Icon = FileText
  }
  return <Icon {...props} />
}

/** Image thumbnail when a preview URL exists, otherwise a file-type icon. */
function FileUploadItemPreview({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const item = useFileUploadItemContext()
  return (
    <div
      data-slot="file-upload-item-preview"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-file-upload-preview",
        className
      )}
      {...props}
    >
      {children ??
        (item.preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- object URLs from the file picker can't go through next/image
          <img
            src={item.preview}
            alt={item.file.name}
            className="size-full object-cover"
          />
        ) : (
          <FileUploadTypeIcon
            type={item.file.type}
            name={item.file.name}
            className="size-5 text-muted-foreground"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        ))}
    </div>
  )
}

/** Name + human-readable size; swaps the size line for the error message
 * when the file's upload failed. */
function FileUploadItemMetadata({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const item = useFileUploadItemContext()
  return (
    <div
      data-slot="file-upload-item-metadata"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    >
      {children ?? (
        <>
          <span className="truncate text-sm font-medium">
            {item.file.name}
          </span>
          {item.status === "error" && item.error ? (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <CircleAlert className="size-3 shrink-0" aria-hidden="true" />
              {item.error}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {formatBytes(item.file.size)}
              {item.status === "uploading" && ` · ${Math.round(item.progress)}%`}
              {item.status === "success" && " · Uploaded"}
            </span>
          )}
        </>
      )}
    </div>
  )
}

/** Slim progress bar bound to the item's upload progress. Hidden until the
 * upload starts; keeps the success color once complete. */
function FileUploadItemProgress({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const item = useFileUploadItemContext()
  if (item.status === "idle") return null
  return (
    <div
      data-slot="file-upload-item-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(item.progress)}
      aria-label={`Upload progress for ${item.file.name}`}
      className={cn(
        "absolute inset-x-3 bottom-1 h-1 overflow-hidden rounded-full bg-file-upload-track",
        item.status === "error" && "bg-destructive/20",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-200",
          item.status === "error"
            ? "bg-destructive"
            : item.status === "success"
              ? "bg-file-upload-success"
              : "bg-file-upload-progress"
        )}
        style={{ width: `${item.status === "error" ? 100 : item.progress}%` }}
      />
    </div>
  )
}

/** Per-item action: retry a failed upload. Renders only on error items. */
function FileUploadItemRetry({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { actions } = useFileUploadContext()
  const item = useFileUploadItemContext()
  if (item.status !== "error") return null
  return (
    <button
      type="button"
      data-slot="file-upload-item-retry"
      aria-label={`Retry uploading ${item.file.name}`}
      onClick={() => actions.retryUpload(item.id)}
      className={cn(
        "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-file-upload-dropzone-hover hover:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {children ?? <RotateCcw className="size-4" aria-hidden="true" />}
    </button>
  )
}

/** Per-item action: remove the file from the list. */
function FileUploadItemDelete({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { actions, disabled } = useFileUploadContext()
  const item = useFileUploadItemContext()
  return (
    <button
      type="button"
      data-slot="file-upload-item-delete"
      aria-label={`Remove ${item.file.name}`}
      disabled={disabled || props.disabled}
      onClick={() => actions.removeFile(item.id)}
      {...props}
      className={cn(
        "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-file-upload-dropzone-hover hover:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children ?? <X className="size-4" aria-hidden="true" />}
    </button>
  )
}

/** Removes every file at once. Hidden while the list is empty. */
function FileUploadClear({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { state, actions, disabled } = useFileUploadContext()
  if (state.files.length === 0) return null
  return (
    <button
      type="button"
      data-slot="file-upload-clear"
      disabled={disabled || props.disabled}
      onClick={() => actions.clearFiles()}
      {...props}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 self-start rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors",
        "hover:bg-file-upload-dropzone-hover hover:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children ?? "Remove all"}
    </button>
  )
}

export {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadTypeIcon,
  FileUploadItemRetry,
  FileUploadItemDelete,
  FileUploadClear,
  FileUploadErrors,
  useFileUpload,
  useFileUploadContext,
  useFileUploadItemContext,
  formatBytes,
  type FileUploadProps,
  type FileUploadOptions,
  type FileUploadState,
  type FileUploadActions,
  type FileUploadFile,
  type FileUploadMetadata,
  type FileUploadStatus,
  type FileUploadHandlers,
}
