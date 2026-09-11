"use client"

import { Download } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardMedia,
  CardMediaOverlay,
  CardTitle,
} from "@/registry/card/card"

// A full-bleed cover that fades into the card body.
export function CardMediaExample() {
  return (
    <Card className="w-full max-w-sm">
      <CardMedia className="h-40">
        {/* Tokenised placeholder cover — no external image needed offline. */}
        <div className="h-full w-full bg-gradient-to-br from-primary via-accent to-primary" />
        <CardMediaOverlay />
        <div className="absolute bottom-3 left-6">
          <CardTitle className="text-lg">Launch recap</CardTitle>
        </div>
      </CardMedia>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The cover image fades into the card surface with a <code>from-card</code>{" "}
          gradient overlay.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" size="sm">
          <Download />
          Export
        </Button>
      </CardFooter>
    </Card>
  )
}
