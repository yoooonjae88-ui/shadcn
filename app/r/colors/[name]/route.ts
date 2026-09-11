import { promises as fs } from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

// Base-color palettes (neutral, zinc, slate, stone, gray) copied verbatim
// from the public shadcn registry. The shadcn CLI fetches
// `${REGISTRY_URL}/colors/<baseColor>.json` on every install to resolve CSS
// variables. That request is UNNAMESPACED, so the CLI never sends the
// `@private` Bearer token with it — this route is therefore intentionally
// unauthenticated. These are stock palettes, not proprietary items, so
// serving them without a token leaks nothing. The token gate on registry
// items (app/r/[name]/route.ts) is unaffected.
const COLORS_DIR = path.join(process.cwd(), "registry-colors")

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const fileName = name.endsWith(".json") ? name : `${name}.json`

  // Reject anything that isn't a plain `<name>.json` (blocks path traversal).
  if (!/^[\w-]+\.json$/.test(fileName)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const content = await fs.readFile(path.join(COLORS_DIR, fileName), "utf8")
    return new NextResponse(content, {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
