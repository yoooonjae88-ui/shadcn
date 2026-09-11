import { act, render, renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadErrors,
  formatBytes,
  useFileUpload,
} from "@/registry/file-upload/file-upload"

function makeFile(name: string, size = 100, type = "text/plain") {
  const file = new File(["x".repeat(Math.min(size, 8))], name, { type })
  Object.defineProperty(file, "size", { value: size })
  return file
}

describe("formatBytes", () => {
  it("formats byte counts for humans", () => {
    expect(formatBytes(1024)).toBe("1 KB")
    expect(formatBytes(1536000)).toBe("1.5 MB")
    expect(formatBytes(0)).toBe("0 B")
  })
})

describe("useFileUpload", () => {
  it("accepts files and reports them via onFilesChange and onFilesAdded", () => {
    const onFilesChange = vi.fn()
    const onFilesAdded = vi.fn()
    const { result } = renderHook(() =>
      useFileUpload({ multiple: true, onFilesChange, onFilesAdded })
    )

    act(() => result.current[1].addFiles([makeFile("a.txt"), makeFile("b.txt")]))
    expect(result.current[0].files.map((f) => f.file.name)).toEqual([
      "a.txt",
      "b.txt",
    ])
    expect(onFilesAdded).toHaveBeenCalledTimes(1)
    expect(onFilesChange).toHaveBeenCalledTimes(1)
  })

  it("replaces the current file in single mode", () => {
    const { result } = renderHook(() => useFileUpload())

    act(() => result.current[1].addFiles([makeFile("first.txt")]))
    act(() => result.current[1].addFiles([makeFile("second.txt")]))
    expect(result.current[0].files.map((f) => f.file.name)).toEqual([
      "second.txt",
    ])
  })

  it("rejects files over maxSize with a readable error", () => {
    const onFileReject = vi.fn()
    const { result } = renderHook(() =>
      useFileUpload({ maxSize: 1024, onFileReject })
    )

    act(() => result.current[1].addFiles([makeFile("big.txt", 2048)]))
    expect(result.current[0].files).toHaveLength(0)
    expect(result.current[0].errors[0]).toContain("1 KB size limit")
    expect(onFileReject).toHaveBeenCalledTimes(1)
  })

  it("rejects files that do not match accept", () => {
    const { result } = renderHook(() => useFileUpload({ accept: "image/*" }))

    act(() => result.current[1].addFiles([makeFile("doc.txt")]))
    expect(result.current[0].files).toHaveLength(0)
    expect(result.current[0].errors[0]).toContain("not an accepted file type")
  })

  it("rejects duplicates and enforces maxFiles", () => {
    const { result } = renderHook(() =>
      useFileUpload({ multiple: true, maxFiles: 2 })
    )

    act(() => result.current[1].addFiles([makeFile("a.txt")]))
    act(() => result.current[1].addFiles([makeFile("a.txt")]))
    expect(result.current[0].errors[0]).toContain("already in the list")

    act(() => result.current[1].addFiles([makeFile("b.txt"), makeFile("c.txt")]))
    expect(result.current[0].files).toHaveLength(2)
    expect(result.current[0].errors[0]).toContain("at most 2 files")
  })

  it("runs custom validation", () => {
    const { result } = renderHook(() =>
      useFileUpload({
        validate: (file) => (file.name.includes(" ") ? "No spaces" : null),
      })
    )

    act(() => result.current[1].addFiles([makeFile("bad name.txt")]))
    expect(result.current[0].errors).toEqual(["No spaces"])
  })

  it("removes and clears files", () => {
    const { result } = renderHook(() => useFileUpload({ multiple: true }))

    act(() => result.current[1].addFiles([makeFile("a.txt"), makeFile("b.txt")]))
    const firstId = result.current[0].files[0].id

    act(() => result.current[1].removeFile(firstId))
    expect(result.current[0].files.map((f) => f.file.name)).toEqual(["b.txt"])

    act(() => result.current[1].clearFiles())
    expect(result.current[0].files).toHaveLength(0)
  })

  it("seeds from initialFiles as already-uploaded entries", () => {
    const { result } = renderHook(() =>
      useFileUpload({
        initialFiles: [
          { id: "1", name: "logo.png", size: 500, type: "image/png", url: "/logo.png" },
        ],
      })
    )
    expect(result.current[0].files[0]).toMatchObject({
      status: "success",
      progress: 100,
    })
  })

  it("drives the upload lifecycle through onUpload handlers", async () => {
    const onUpload = vi.fn(
      (
        _file: File,
        handlers: { onProgress: (p: number) => void; onSuccess: () => void }
      ) => {
        handlers.onProgress(50)
        handlers.onSuccess()
      }
    )
    const { result } = renderHook(() => useFileUpload({ onUpload }))

    await act(async () => result.current[1].addFiles([makeFile("a.txt")]))
    expect(onUpload).toHaveBeenCalledTimes(1)
    expect(result.current[0].files[0]).toMatchObject({
      status: "success",
      progress: 100,
    })
  })

  it("marks a file errored when the uploader rejects", async () => {
    const onUpload = vi.fn().mockRejectedValue(new Error("Network down"))
    const { result } = renderHook(() => useFileUpload({ onUpload }))

    await act(async () => result.current[1].addFiles([makeFile("a.txt")]))
    expect(result.current[0].files[0]).toMatchObject({
      status: "error",
      error: "Network down",
    })
  })
})

describe("FileUpload", () => {
  it("renders a dropzone that opens the picker and surfaces errors", async () => {
    const user = userEvent.setup()
    render(
      <FileUpload maxSize={10}>
        <FileUploadDropzone label="Drop files here" />
        <FileUploadErrors />
      </FileUpload>
    )

    expect(screen.getByText("Drop files here")).toBeInTheDocument()
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement

    await user.upload(input, makeFile("big.txt", 100))
    expect(screen.getByRole("alert")).toHaveTextContent("size limit")
  })
})
