// app/api/alexa/announce/route.ts
import { NextRequest, NextResponse } from "next/server";

// This endpoint handles announcements to be sent to Alexa
export async function POST(req: NextRequest) {
    try {
        const { message, type, detail } = await req.json();

        // Log the announcement
        console.log(`Announcement received: ${message} (${type})`);

        // In a real implementation, this would call your Alexa Proactive Events API
        // For now, we'll just return a success response

        return NextResponse.json({
            success: true,
            message: "Announcement processed successfully",
            data: {
                message,
                type,
                detail,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Error processing announcement:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process announcement"
        }, { status: 500 });
    }
}