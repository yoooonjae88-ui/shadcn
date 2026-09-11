import type { PreviewExample } from "@/components/previews/types"
import { AlertDialogAsyncExample } from "./alert-dialog-async"
import { AlertDialogBulkExample } from "./alert-dialog-bulk"
import { AlertDialogCheckboxGatedExample } from "./alert-dialog-checkbox-gated"
import { AlertDialogDefaultExample } from "./alert-dialog-default"
import { AlertDialogDestructiveExample } from "./alert-dialog-destructive"
import { AlertDialogSizesExample } from "./alert-dialog-sizes"
import { AlertDialogStatusExample } from "./alert-dialog-status"
import { AlertDialogTypeToConfirmExample } from "./alert-dialog-type-to-confirm"

export const alertDialogExamples: PreviewExample[] = [
  {
    name: "default",
    title: "Default confirmation",
    component: AlertDialogDefaultExample,
    file: "components/previews/alert-dialog/alert-dialog-default.tsx",
  },
  {
    name: "destructive",
    title: "Destructive delete",
    component: AlertDialogDestructiveExample,
    file: "components/previews/alert-dialog/alert-dialog-destructive.tsx",
  },
  {
    name: "status",
    title: "Status icons & close",
    component: AlertDialogStatusExample,
    file: "components/previews/alert-dialog/alert-dialog-status.tsx",
  },
  {
    name: "checkbox-gated",
    title: "Checkbox-gated",
    component: AlertDialogCheckboxGatedExample,
    file: "components/previews/alert-dialog/alert-dialog-checkbox-gated.tsx",
  },
  {
    name: "type-to-confirm",
    title: "Type-to-confirm",
    component: AlertDialogTypeToConfirmExample,
    file: "components/previews/alert-dialog/alert-dialog-type-to-confirm.tsx",
  },
  {
    name: "bulk",
    title: "Bulk action",
    component: AlertDialogBulkExample,
    file: "components/previews/alert-dialog/alert-dialog-bulk.tsx",
  },
  {
    name: "async",
    title: "Async confirmation",
    component: AlertDialogAsyncExample,
    file: "components/previews/alert-dialog/alert-dialog-async.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: AlertDialogSizesExample,
    file: "components/previews/alert-dialog/alert-dialog-sizes.tsx",
  },
]
