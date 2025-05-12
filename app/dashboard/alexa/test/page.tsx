// app/dashboard/alexa/test/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, AlertTriangle, ExternalLink } from 'lucide-react';

export default function AlexaTestPage() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6 flex items-center gap-2">
                <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                </Link>
                <h1 className="text-2xl font-bold ml-2">Alexa Test Guide</h1>
            </div>

            {/* Introduction */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Setting Up Your Test Scenario</h2>
                <p className="mb-4">
                    This guide explains how to use the Alexa Developer Console simulator with your dashboard
                    for your test scenario where a user sits in a room with a projected tree,
                    changing parameters like lighting and temperature with the goal of maintaining green leaves.
                </p>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                    <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mr-2" />
                        <div>
                            <h3 className="text-amber-800 font-medium">Important Note</h3>
                            <p className="text-amber-700 text-sm">
                                This approach uses the Alexa Developer Console Simulator instead of a physical Alexa device.
                                You'll need to have access to the Alexa Developer Console for your skill.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-800">Your Scenario Requirements:</h3>
                        <p className="text-gray-600 text-sm mt-1">
                            User sits in a room with a projected tree visualization and performs a task (crossword, quiz, article reading).
                            During the 5-minute test, Alexa will announce external factors that affect energy usage:
                        </p>
                        <ul className="list-disc pl-6 mt-2 text-sm text-gray-600 space-y-1">
                            <li>"The weather is cloudy, your solar panels are producing less electricity"</li>
                            <li>"It's raining outside, temperatures will drop in the next hour"</li>
                            <li>Other external factors that provoke the user to change consumption patterns</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Test Setup Steps */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Test Setup Instructions</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm mr-2">1</span>
                            Set Up the Alexa Developer Console
                        </h3>
                        <div className="ml-8 mt-2 text-gray-600">
                            <p>First, open the Alexa Developer Console:</p>
                            <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                                <li>Go to <a href="https://developer.amazon.com/alexa/console/ask" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center inline-flex">
                                    developer.amazon.com/alexa/console/ask
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                </a></li>
                                <li>Find and select your Eco Smart Home skill</li>
                                <li>Navigate to the "Test" tab in the top menu</li>
                                <li>Make sure the skill testing is enabled (toggle set to "Development")</li>
                                <li>Position this window where participants can see/hear it during the test</li>
                            </ol>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm mr-2">2</span>
                            Set Up Your Dashboard
                        </h3>
                        <div className="ml-8 mt-2 text-gray-600">
                            <p>Next, set up your dashboard:</p>
                            <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                                <li>Open your dashboard with test mode enabled: <span className="font-mono bg-gray-100 px-1">/dashboard?test=true</span></li>
                                <li>Click the "Connect Alexa" button to enable the test panel</li>
                                <li>You should see confirmation that Alexa is connected</li>
                                <li>The settings icon should appear in the bottom-left corner</li>
                            </ol>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm mr-2">3</span>
                            Projection Setup
                        </h3>
                        <div className="ml-8 mt-2 text-gray-600">
                            <p>Set up the tree projection in the test room:</p>
                            <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                                <li>Connect a computer to a projector displaying the dashboard</li>
                                <li>Ensure the tree visualization is clearly visible</li>
                                <li>Test the temperature controls to make sure they affect the tree visualization</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* During the Test */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">During the Test</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-800">Running the Test with Alexa Simulator:</h3>
                        <div className="mt-2 text-gray-600">
                            <p>Here's how to use the Alexa Simulator during your test:</p>

                            <div className="mt-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                                <h4 className="font-medium text-blue-800 mb-2">Step 1: Generate an Announcement</h4>
                                <ol className="list-decimal pl-5 space-y-2 text-sm">
                                    <li>Click the settings icon in the bottom-left corner of your dashboard</li>
                                    <li>Select one of the predefined announcements (e.g., "Cloudy Weather")</li>
                                    <li>Click "Send Selected" - this will update the dashboard tree visualization</li>
                                    <li>The announcement text will be shown on your dashboard and can be copied</li>
                                </ol>
                            </div>

                            <div className="mt-3 p-4 rounded-lg bg-green-50 border border-green-100">
                                <h4 className="font-medium text-green-800 mb-2">Step 2: Use the Alexa Simulator</h4>
                                <ol className="list-decimal pl-5 space-y-2 text-sm">
                                    <li>Copy the announcement text generated in Step 1</li>
                                    <li>In the Alexa Developer Console simulator, type or paste: "Alexa, tell Eco Smart Home" and then the announcement</li>
                                    <li>For example: "Alexa, tell Eco Smart Home the weather outside is now cloudy. Your solar panels are producing less electricity."</li>
                                    <li>Press Enter or click the mic button to send</li>
                                    <li>Alexa will speak the announcement in the room</li>
                                </ol>
                                <p className="mt-2 text-xs text-green-700">
                                    Tip: The Alexa simulator has a text-to-speech feature that will play through your computer speakers, simulating Alexa speaking to the user.
                                </p>
                            </div>

                            <div className="mt-3 p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                                <h4 className="font-medium text-yellow-800 mb-2">Alternative Method</h4>
                                <p className="text-sm mb-2">
                                    If you prefer, you can also input messages directly to the Alexa simulator without using the dashboard test panel:
                                </p>
                                <ol className="list-decimal pl-5 space-y-2 text-sm">
                                    <li>In the Alexa Developer Console, type a message like:</li>
                                    <li>"Alexa, tell Eco Smart Home the weather is cloudy and my solar panels are producing less electricity"</li>
                                    <li>Press Enter to send the message</li>
                                    <li>Alexa will respond accordingly</li>
                                </ol>
                                <p className="mt-2 text-xs text-yellow-700">
                                    Note: When using this method, the tree visualization on the dashboard won't automatically update. You'll need to manually adjust parameters as needed.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-medium text-gray-800">Recommended Announcement Timing:</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            For a 5-minute test, we recommend the following timing:
                        </p>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-2">
                                    <span className="font-medium text-gray-800">1:30 into test</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    "Alexa, tell Eco Smart Home the weather outside is now cloudy. Your solar panels are producing less electricity."
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-2">
                                    <span className="font-medium text-gray-800">3:00 into test</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    "Alexa, tell Eco Smart Home it's now 17:00. You're entering peak energy cost hours."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>

                <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-800">Alexa Simulator Not Responding</h3>
                        <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                            <li>Make sure you've enabled testing mode for your skill (toggle to "Development")</li>
                            <li>Check that you're using the correct invocation name for your skill</li>
                            <li>Try refreshing the Alexa Developer Console page</li>
                            <li>Ensure your computer audio is working correctly</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-800">Test Panel Not Appearing</h3>
                        <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                            <li>Ensure you've added the <span className="font-mono">?test=true</span> parameter to your URL</li>
                            <li>Make sure you've clicked "Connect Alexa" on the dashboard</li>
                            <li>Try refreshing the page</li>
                            <li>Check browser console for any errors</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-800">Audio Issues</h3>
                        <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                            <li>Ensure your computer's speakers or audio output are correctly connected and working</li>
                            <li>Check that the volume is turned up on both your computer and in the browser</li>
                            <li>If using external speakers, make sure they are powered on and properly connected</li>
                            <li>Try testing the simulator with a simple "hello" command to verify audio output</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}