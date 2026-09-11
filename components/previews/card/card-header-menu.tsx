"use client"

import { MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react"

import { Button } from "@/registry/button/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from "@/registry/card/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/dropdown/dropdown"

// A header toolbar carrying a dropdown menu.
export function CardHeaderMenuExample() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardHeading>
          <CardTitle>Invite your team</CardTitle>
          <CardDescription>Collaborate by inviting your teammates.</CardDescription>
        </CardHeading>
        <CardToolbar>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <MoreHorizontal />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardToolbar>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Everyone you invite gets access to every component in this private
          registry.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Send invites</Button>
      </CardFooter>
    </Card>
  )
}
