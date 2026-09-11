import { redirect } from "next/navigation"

// The home page is the components overview, so /components just goes there.
export default function ComponentsIndex() {
  redirect("/")
}
