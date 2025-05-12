// app/api/alexa/route.ts
import { NextRequest, NextResponse } from "next/server";

// Mock database - in a real app, this would be a database connection
const mockDatabase = {
    getUserData: (userId: string) => ({
        heatingOn: true,
        temperature: 24, // degrees C
        electricityUsage: 12.5, // kWh
        averageElectricity: 10, // kWh
        waterUsage: 150, // liters
        averageWater: 120, // liters
        lightsOnUnoccupied: true,
        lastUpdated: new Date().toISOString()
    })

};

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
            return handleIntentRequest(alexaRequest.request.intent, userId);
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
    return createResponse(
        "Welcome to Eco Nudge. You can say 'I'm home' to get your usage update, or ask about your environmental impact."
    );
}

async function handleIntentRequest(intent: AlexaIntent, userId: string) {
    const intentName = intent?.name;

    if (intentName === "ImHomeIntent") {
        // Handle "I'm home" intent
        const userData = mockDatabase.getUserData(userId);

        // Calculate environmental impact
        let lostLeaves = 0;
        if (userData.heatingOn && userData.temperature > 22) lostLeaves += 3;
        if (userData.electricityUsage > userData.averageElectricity * 1.2) lostLeaves += 2;
        if (userData.waterUsage > userData.averageWater * 1.3) lostLeaves += 2;
        if (userData.lightsOnUnoccupied) lostLeaves += 1;

        let responseText = `Welcome home! Today, your energy usage is ${Math.round(userData.electricityUsage)} kilowatt hours, which is `;

        if (userData.electricityUsage > userData.averageElectricity) {
            responseText += `${Math.round((userData.electricityUsage / userData.averageElectricity - 1) * 100)}% above your average. `;
        } else {
            responseText += `${Math.round((1 - userData.electricityUsage / userData.averageElectricity) * 100)}% below your average. Great job! `;
        }

        if (lostLeaves > 0) {
            responseText += `Your tree has lost ${lostLeaves} ${lostLeaves === 1 ? 'leaf' : 'leaves'} today. `;

            // Add specific tips
            if (userData.heatingOn && userData.temperature > 22) {
                responseText += "Try lowering your heating by 2 degrees to save 3 leaves. ";
            }

            if (userData.lightsOnUnoccupied) {
                responseText += "Lights are on in unoccupied rooms. ";
            }
        } else {
            responseText += "Your tree is looking healthy! Keep up the good habits.";
        }

        return createResponse(responseText);
    } else if (intentName === "GetEnvironmentalImpactIntent") {
        // Handle environmental impact intent
        const userData = mockDatabase.getUserData(userId);

        // Calculate CO2 emissions (simplified example)
        const co2Emissions = userData.electricityUsage * 0.4; // kg of CO2

        const responseText = `Based on your energy usage today, your estimated carbon footprint is ${co2Emissions.toFixed(1)} kilograms of CO2. ${co2Emissions > 4 ? "That's higher than average. Check your dashboard for tips to reduce your impact." : "That's lower than average. Great job!"}`;

        return createResponse(responseText);
    } else if (intentName === "AMAZON.HelpIntent") {
        return createResponse("You can say 'I'm home' to get your usage update, or ask 'what's my environmental impact' to learn about your carbon footprint.");
    } else if (intentName === "AMAZON.StopIntent" || intentName === "AMAZON.CancelIntent") {
        return createResponse("Goodbye!", true);
    } else {
        return createResponse("I'm not sure how to help with that. You can say 'I'm home' to get your usage update.");
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