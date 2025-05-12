// app/api/alexa/route.ts
import { NextRequest, NextResponse } from "next/server";

// Global state to store dashboard values
// In a real application, this would be a database or state management system
interface DashboardState {
    temperature: number;
    electricityUsage: number;
    averageElectricity: number;
    waterUsage: number;
    averageWater: number;
    heatingOn: boolean;
    lightsOnUnoccupied: boolean;
    treeHealth: number;
    lastUpdated: string;
}

// Initialize with default values
let dashboardState: DashboardState = {
    temperature: 21,
    electricityUsage: 6.8,
    averageElectricity: 7.5,
    waterUsage: 150,
    averageWater: 120,
    heatingOn: true,
    lightsOnUnoccupied: false,
    treeHealth: 10,
    lastUpdated: new Date().toISOString()
};

// Store the last announcement to use when testing with the simulator
let lastAnnouncement: {
    message: string;
    type: string;
    detail: string;
    timestamp: string;
} | null = null;

interface AlexaIntent {
    name: string;
    confirmationStatus: 'NONE' | 'CONFIRMED' | 'DENIED';
    slots?: Record<string, {
        name: string;
        value?: string;
        confirmationStatus: 'NONE' | 'CONFIRMED' | 'DENIED';
    }>;
}

export async function POST(req: NextRequest) {
    try {
        const alexaRequest = await req.json();
        const requestType = alexaRequest.request.type;
        const userId = alexaRequest.session?.user?.userId || "anonymous";

        // Handle different request types
        if (requestType === "LaunchRequest") {
            return handleLaunchRequest();
        } else if (requestType === "IntentRequest") {
            return handleIntentRequest(alexaRequest.request.intent);
        } else if (requestType === "SessionEndedRequest") {
            return handleSessionEndedRequest();
        }

        // Default response
        return createResponse("I'm not sure how to help with that.");
    } catch (error) {
        console.error("Error processing Alexa request:", error);
        return createResponse("Sorry, there was an error processing your request.");
    }
}

function handleLaunchRequest() {
    // Check if there's an announcement when opening the skill
    if (lastAnnouncement) {
        const announcement = lastAnnouncement;

        // Don't clear the announcement here so it can be accessed by AnyUpdatesIntent too

        return createResponse(
            `Welcome to Eco Nudge. I have an update for you: ${announcement.message} ${announcement.detail}`
        );
    }

    return createResponse(
        "Welcome to Eco Nudge. You can ask if there are any updates, say 'I'm home' to get your usage update, or ask about your environmental impact."
    );
}

async function handleIntentRequest(intent: AlexaIntent) {
    const intentName = intent?.name;

    if (intentName === "ImHomeIntent") {
        // Use real-time dashboard values
        const userData = dashboardState;

        // Calculate environmental impact
        let lostLeaves = 10 - userData.treeHealth;

        let responseText = `Welcome home! Today, your energy usage is ${userData.electricityUsage.toFixed(1)} kilowatt hours, which is `;

        if (userData.electricityUsage > userData.averageElectricity) {
            responseText += `${Math.round((userData.electricityUsage / userData.averageElectricity - 1) * 100)}% above your average. `;
        } else {
            responseText += `${Math.round((1 - userData.electricityUsage / userData.averageElectricity) * 100)}% below your average. Great job! `;
        }

        if (lostLeaves > 0) {
            responseText += `Your tree has lost ${lostLeaves} ${lostLeaves === 1 ? 'leaf' : 'leaves'} today. `;

            // Add specific tips based on the current dashboard state
            if (userData.heatingOn && userData.temperature > 21) {
                responseText += `Try lowering your heating from ${userData.temperature}°C to 21°C to save leaves. `;
            }

            if (userData.lightsOnUnoccupied) {
                responseText += "Lights are on in unoccupied rooms. ";
            }
        } else {
            responseText += "Your tree is looking healthy! Keep up the good habits.";
        }

        return createResponse(responseText);
    } else if (intentName === "GetEnvironmentalImpactIntent") {
        // Use real-time dashboard values
        const userData = dashboardState;

        // Calculate CO2 emissions based on current electricity usage
        const co2Emissions = userData.electricityUsage * 0.4; // kg of CO2

        // Calculate potential savings based on current temperature
        const potentialSavings = userData.temperature > 21 ? (userData.temperature - 21) * 10 : 0;

        const responseText = `Based on your current energy usage of ${userData.electricityUsage.toFixed(1)} kilowatt hours, your estimated carbon footprint is ${co2Emissions.toFixed(1)} kilograms of CO2. ${co2Emissions > 4 ? "That's higher than average. " : "That's lower than average. Great job! "}${potentialSavings > 0 ? `You could save approximately €${potentialSavings.toFixed(2)} per month by optimizing your heating temperature.` : ""}`;

        return createResponse(responseText);
    } else if (intentName === "AnyUpdatesIntent") {
        // NEW: Handle "any updates?" intent
        if (lastAnnouncement) {
            const announcement = lastAnnouncement;
            // We'll clear the announcement after delivering it
            lastAnnouncement = null;

            return createResponse(
                `Yes, I have an update for you: ${announcement.message} ${announcement.detail || ''}`
            );
        } else {
            return createResponse("There are no new updates at this time. Your eco home is running normally.");
        }
    } else if (intentName === "GetAnnouncementIntent") {
        // Backward compatibility for the previous announcement intent
        if (lastAnnouncement) {
            const announcement = lastAnnouncement;
            lastAnnouncement = null; // Clear it after using it once

            return createResponse(
                `Here's the latest update: ${announcement.message} ${announcement.detail}`
            );
        } else {
            return createResponse("There are no new announcements at this time.");
        }
    } else if (intentName === "GetCurrentTreeHealthIntent") {
        // Intent to get current tree health
        return createResponse(
            `Your eco tree currently has ${dashboardState.treeHealth} out of 10 leaves. ${
                dashboardState.treeHealth < 7
                    ? "Try lowering your heating temperature to improve your tree's health."
                    : "Your tree is looking healthy!"
            }`
        );
    } else if (intentName === "AMAZON.HelpIntent") {
        return createResponse("You can ask if there are any updates, say 'I'm home' to get your usage update, ask 'what's my environmental impact' to learn about your carbon footprint, or ask 'how's my tree doing' to check your eco tree's health.");
    } else if (intentName === "AMAZON.StopIntent" || intentName === "AMAZON.CancelIntent") {
        return createResponse("Goodbye!", true);
    } else {
        return createResponse("I'm not sure how to help with that. You can ask if there are any updates or say 'I'm home' to get your usage update.");
    }
}

function handleSessionEndedRequest() {
    return createResponse("Goodbye!", true);
}

function createResponse(speechText: string, shouldEndSession = false) {
    return NextResponse.json({
        version: "1.0",
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: `<speak>${speechText}</speak>`
            },
            shouldEndSession: shouldEndSession
        }
    });
}

// Add a route for triggering proactive announcements
export async function PUT(req: NextRequest) {
    try {
        const { message, type, detail } = await req.json();

        console.log(`Announcement received: ${message} (${type})`);

        // Store the last announcement
        lastAnnouncement = {
            message,
            type,
            detail: detail || "",
            timestamp: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            message: "Announcement queued successfully",
            details: "Your announcement is ready for Alexa testing",
            instructions: "Open the Alexa simulator and say 'Alexa, ask Eco Nudge if there are any updates' to hear your announcement"
        });
    } catch (error) {
        console.error("Error processing announcement request:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process announcement"
        }, { status: 500 });
    }
}

// Add an endpoint to update dashboard values
export async function PATCH(req: NextRequest) {
    try {
        const updates = await req.json();

        // Update only the provided values
        dashboardState = {
            ...dashboardState,
            ...updates,
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            message: "Dashboard state updated successfully",
            currentState: dashboardState
        });
    } catch (error) {
        console.error("Error updating dashboard state:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to update dashboard state"
        }, { status: 500 });
    }
}

// Add an endpoint to get dashboard values
export async function GET(req: NextRequest) {
    return NextResponse.json({
        success: true,
        data: dashboardState
    });
}