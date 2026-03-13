import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 })
  }

  const row = await prisma.marketingSiteConfig.findUnique({ where: { key } })
  return NextResponse.json({ data: row?.data ?? null })
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const data = body?.data
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const row = await prisma.marketingSiteConfig.upsert({
      where: { key },
      update: { data },
      create: { key, data },
    })

    return NextResponse.json({ data: row.data })
  } catch {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
