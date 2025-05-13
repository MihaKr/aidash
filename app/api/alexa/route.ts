import { NextRequest, NextResponse } from "next/server";

// Mock database - in a real app, this would be a database connection
const mockDatabase = {
    userData: {
        heatingOn: true,
        temperature: 24, // degrees C
        electricityUsage: 12.5, // kWh
        averageElectricity: 10, // kWh
        waterUsage: 150, // liters
        averageWater: 120, // liters
        lightsOnUnoccupied: true,
        lastUpdated: new Date().toISOString()
    },

    getUserData: (userId: string) => mockDatabase.userData,

    updateTemperature: (temp: number) => {
        mockDatabase.userData.temperature = temp;
        return mockDatabase.userData;
    }
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

// Add PATCH endpoint for temperature updates from dashboard
export async function PATCH(req: NextRequest) {
    try {
        const data = await req.json();
        if (data.temperature !== undefined) {
            mockDatabase.updateTemperature(data.temperature);
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ success: false, error: "No temperature provided" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Invalid request" });
    }
}

// Add GET endpoint to fetch current temperature
export async function GET() {
    return NextResponse.json({
        temperature: mockDatabase.userData.temperature
    });
}

function handleLaunchRequest() {
    return createResponse(
        "Welcome to Eco Nudge. You can say 'I'm home' to get your usage update, ask about your environmental impact, or change the temperature."
    );
}

async function handleIntentRequest(intent: AlexaIntent, userId: string) {
    const intentName = intent?.name;

    if (intentName === "AnyUpdatesIntent") {
        return handleAnyUpdatesIntent(userId);
    } else if (intentName === "ChangeTemperatureIntent") {
        return handleChangeTemperature(intent);
    } else if (intentName === "ImHomeIntent") {
        return handleImHomeIntent(userId);
    } else if (intentName === "GetEnvironmentalImpactIntent") {
        return handleEnvironmentalImpactIntent(userId);
    } else if (intentName === "GetTemperatureIntent") {
        return handleGetTemperature();
    } else if (intentName === "AMAZON.HelpIntent") {
        return createResponse(
            "You can say 'I'm home' to get your usage update, ask 'what's my environmental impact', say 'set temperature to 21 degrees', or ask 'are there any updates' for current conditions."
        );
    } else if (intentName === "AMAZON.StopIntent" || intentName === "AMAZON.CancelIntent") {
        return createResponse("Goodbye!", true);
    } else {
        return createResponse("I'm not sure how to help with that. You can say 'I'm home' to get your usage update.");
    }
}

function handleAnyUpdatesIntent(userId: string) {
    const userData = mockDatabase.getUserData(userId);
    const currentCondition = mockDatabase.getEnvironmentalUpdate();

    let responseText = `There are currently ${currentCondition.description}. ${currentCondition.impact}. `;

    // Add specific details based on the condition type
    switch (currentCondition.type) {
        case "CLOUDY_DAY":
            const productionDrop = ((userData.expectedSolarProduction - userData.solarProduction) / userData.expectedSolarProduction * 100).toFixed(0);
            responseText += `Your solar production is down ${productionDrop}% from expected. ${currentCondition.recommendation}. `;
            break;

        case "PEAK_HOURS":
            const potentialSavings = (userData.electricityUsage * 0.15).toFixed(2); // Assume 15% potential savings
            responseText += `You could save approximately €${potentialSavings} by ${currentCondition.recommendation}. `;
            break;

        case "HIGH_DEMAND":
            const currentUsage = userData.electricityUsage.toFixed(1);
            responseText += `Your current consumption is ${currentUsage} kWh. ${currentCondition.recommendation}. `;
            break;
    }

    // Add temperature-related advice if relevant
    if (userData.temperature > 21) {
        responseText += `Also, your heating is set to ${userData.temperature}°C, which is above the recommended temperature. Lowering it by ${userData.temperature - 21} degrees could reduce your energy consumption. `;
    }

    // Add a general eco-tip
    const ecoTips = [
        "Remember to turn off lights in unoccupied rooms to save energy.",
        "Consider using natural light during daytime hours when possible.",
        "Running your washing machine at full load can save both water and electricity."
    ];
    responseText += ecoTips[Math.floor(Math.random() * ecoTips.length)];

    return createResponse(responseText);
}

function handleChangeTemperature(intent: AlexaIntent) {
    const temperatureSlot = intent.slots?.temperature;
    if (!temperatureSlot?.value) {
        return createResponse("I didn't catch what temperature you want. Please try again with a specific temperature.");
    }

    const newTemp = parseInt(temperatureSlot.value);
    if (isNaN(newTemp) || newTemp < 16 || newTemp > 28) {
        return createResponse("Please choose a temperature between 16 and 28 degrees.");
    }

    // Update the temperature in our database
    mockDatabase.updateTemperature(newTemp);

    let response = `I've set the temperature to ${newTemp} degrees.`;

    // Add energy-saving advice if temperature is high
    if (newTemp > 21) {
        const extraCost = (newTemp - 21) * 10;
        response += ` Note that setting the temperature ${newTemp - 21} degrees above the recommended 21 degrees could cost an extra €${extraCost} per month.`;
    }

    return createResponse(response);
}

function handleGetTemperature() {
    const currentTemp = mockDatabase.userData.temperature;
    let response = `The current temperature is set to ${currentTemp} degrees.`;

    if (currentTemp > 21) {
        response += ` This is ${currentTemp - 21} degrees above the recommended temperature of 21 degrees.`;
    }

    return createResponse(response);
}

function handleImHomeIntent(userId: string) {
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

    // Add current temperature information
    responseText += ` The temperature is currently set to ${userData.temperature} degrees.`;
    if (userData.temperature > 21) {
        responseText += ` You could save money by lowering it to the recommended 21 degrees.`;
    }

    return createResponse(responseText);
}

function handleEnvironmentalImpactIntent(userId: string) {
    const userData = mockDatabase.getUserData(userId);

    // Calculate CO2 emissions (simplified example)
    const co2Emissions = userData.electricityUsage * 0.4; // kg of CO2

    const responseText = `Based on your energy usage today, your estimated carbon footprint is ${co2Emissions.toFixed(1)} kilograms of CO2. ${co2Emissions > 4 ? "That's higher than average. Check your dashboard for tips to reduce your impact." : "That's lower than average. Great job!"}`;

    return createResponse(responseText);
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