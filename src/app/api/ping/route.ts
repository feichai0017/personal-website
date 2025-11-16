import { NextResponse } from "next/server"

export async function GET() {
    return NextResponse.json({
        time: Date.now()
    })
}
