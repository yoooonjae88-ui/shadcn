import { promises as fs } from "fs"
import path from "path"
import { timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"

// Registry items are built into .registry (outside public/) so they are
// never served without passing this token check.
const REGISTRY_DIR = path.join(process.cwd(), ".registry")

function isAuthorized(request: NextRequest): boolean {
  const token = process.env.REGISTRY_TOKEN
  if (!token) return false

  const header = request.headers.get("authorization") ?? ""
  const provided = header.startsWith("Bearer ") ? header.slice(7) : ""

  const a = Buffer.from(provided)
  const b = Buffer.from(token)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await params
  const fileName = name.endsWith(".json") ? name : `${name}.json`

  if (!/^[\w-]+\.json$/.test(fileName)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const content = await fs.readFile(path.join(REGISTRY_DIR, fileName), "utf8")
    return new NextResponse(content, {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
