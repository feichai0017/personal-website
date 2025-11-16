import { NextResponse } from "next/server"

const PAYLOAD_SIZE = 512 * 1024 // 512 KB

export async function GET() {
    const buffer = Buffer.alloc(PAYLOAD_SIZE, "0")

    return new NextResponse(buffer, {
        headers: {
            "Content-Type": "application/octet-stream",
            "Cache-Control": "no-store, max-age=0",
            "Content-Length": buffer.length.toString(),
        },
    })
}
