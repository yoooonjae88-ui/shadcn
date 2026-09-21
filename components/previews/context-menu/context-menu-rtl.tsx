"use client"

import { DirectionProvider } from "@base-ui/react/direction-provider"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/registry/context-menu/context-menu"

// The popup is portalled to the end of the document, so a `dir` on a wrapper
// around the menu never reaches it. In a real RTL app `dir="rtl"` sits on
// <html> and the portal inherits it; to scope it to one example, Base UI's
// DirectionProvider mirrors the logical sides and `dir` on the content turns
// the popup's own subtree — which is what flips the submenu chevron.
export function ContextMenuRtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="w-full max-w-xs">
        <ContextMenu>
          <ContextMenuTrigger className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed text-sm">
            <span className="hidden pointer-fine:inline-block">
              انقر بزر الماوس الأيمن هنا
            </span>
            <span className="hidden pointer-coarse:inline-block">
              اضغط مطولاً هنا
            </span>
          </ContextMenuTrigger>
          <ContextMenuContent dir="rtl" side="inline-end" className="w-48">
            <ContextMenuGroup>
              <ContextMenuItem>رجوع</ContextMenuItem>
              <ContextMenuItem>إعادة تحميل</ContextMenuItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger>المزيد</ContextMenuSubTrigger>
                <ContextMenuSubContent dir="rtl" className="w-40">
                  <ContextMenuGroup>
                    <ContextMenuItem>حفظ الصفحة</ContextMenuItem>
                    <ContextMenuItem>أدوات المطور</ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </DirectionProvider>
  )
}
