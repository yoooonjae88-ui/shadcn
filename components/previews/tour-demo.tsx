"use client"

import * as React from "react"
import { Upload, CircleHelp, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tour, type TourStepConfig, type TourType } from "@/registry/tour/tour"

export function TourDemo() {
  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState<TourType>("default")
  const [maskOn, setMaskOn] = React.useState(true)
  const [arrowOn, setArrowOn] = React.useState(true)
  const [disabledInteraction, setDisabledInteraction] = React.useState(false)

  const steps: TourStepConfig[] = [
    {
      title: "Upload your files",
      description:
        "Drop files here or click to browse. We support images, PDFs and more.",
      target: () => document.getElementById("tour-upload"),
      placement: "bottom",
      cover: (
        <div className="flex h-24 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Upload className="size-8" aria-hidden />
        </div>
      ),
    },
    {
      title: "Save your work",
      description: "Persist changes at any time — everything is versioned.",
      target: () => document.getElementById("tour-save"),
      placement: "top",
    },
    {
      title: "Need a hand?",
      description:
        "Open help to revisit this tour or read the docs. That's it — enjoy!",
      target: () => document.getElementById("tour-help"),
      placement: "right",
    },
  ]

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={type === "default" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("default")}
        >
          Default
        </Button>
        <Button
          variant={type === "primary" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("primary")}
        >
          Primary
        </Button>
        <Button
          variant={maskOn ? "default" : "outline"}
          size="sm"
          onClick={() => setMaskOn((v) => !v)}
        >
          Mask
        </Button>
        <Button
          variant={arrowOn ? "default" : "outline"}
          size="sm"
          onClick={() => setArrowOn((v) => !v)}
        >
          Arrow
        </Button>
        <Button
          variant={disabledInteraction ? "default" : "outline"}
          size="sm"
          onClick={() => setDisabledInteraction((v) => !v)}
        >
          Lock target
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 p-6">
        <Button id="tour-upload" variant="outline" size="sm">
          <Upload aria-hidden />
          Upload
        </Button>
        <Button id="tour-save" size="sm">
          <Save aria-hidden />
          Save
        </Button>
        <Button id="tour-help" variant="ghost" size="icon" aria-label="Help">
          <CircleHelp aria-hidden />
        </Button>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setOpen(true)}>Begin tour</Button>
      </div>

      <Tour
        open={open}
        steps={steps}
        type={type}
        mask={maskOn}
        arrow={arrowOn}
        disabledInteraction={disabledInteraction}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}
