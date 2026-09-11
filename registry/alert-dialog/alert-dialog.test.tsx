import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/alert-dialog/alert-dialog"

function renderDialog(onConfirm = vi.fn()) {
  render(
    <AlertDialog>
      <AlertDialogTrigger>Delete project</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
  return { onConfirm }
}

describe("AlertDialog", () => {
  it("stays closed until triggered", () => {
    renderDialog()
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
  })

  it("opens as an alertdialog with title and description", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "Delete project" }))
    const dialog = await screen.findByRole("alertdialog")
    expect(dialog).toContainElement(
      screen.getByText("Are you absolutely sure?")
    )
    expect(dialog).toContainElement(
      screen.getByText("This action cannot be undone.")
    )
  })

  it("cancel closes without firing the action", async () => {
    const user = userEvent.setup()
    const { onConfirm } = renderDialog()

    await user.click(screen.getByRole("button", { name: "Delete project" }))
    await user.click(await screen.findByRole("button", { name: "Cancel" }))

    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    )
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("the action fires its handler and closes the dialog", async () => {
    const user = userEvent.setup()
    const { onConfirm } = renderDialog()

    await user.click(screen.getByRole("button", { name: "Delete project" }))
    await user.click(await screen.findByRole("button", { name: "Delete" }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    )
  })

  it("Escape cancels the dialog", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "Delete project" }))
    await screen.findByRole("alertdialog")
    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    )
  })
})
