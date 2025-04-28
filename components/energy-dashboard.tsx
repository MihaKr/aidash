"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowUp, Calendar, Home, HomeIcon, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Toast } from "@/components/ui/toast"

export function EnergyDashboard() {
    const canvasRef = useRef(null)
    const [timeRange, setTimeRange] = useState("day")
    const [totalConsumption, setTotalConsumption] = useState(0)
    const [peakConsumption, setPeakConsumption] = useState(0)
    const [comparedToLastPeriod, setComparedToLastPeriod] = useState(0)
    const [timeSeriesData, setTimeSeriesData] = useState({
        day: [],    // Last 24 data points (hourly)
        week: [],   // Last 7 data points (daily)
        month: []   // Last 30 data points (daily)
    })
    const [currentValue, setCurrentValue] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    // New state variables for home status and notifications
    const [isHome, setIsHome] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")
    const [highUsageThreshold, setHighUsageThreshold] = useState(50) // Set a threshold for high usage (in kWh)

    // Initial setup and polling interval for the API
    useEffect(() => {
        // Initialize with some fallback data
        const initializeData = () => {
            setTimeSeriesData({
                day: generateFallbackData(24),
                week: generateFallbackData(7),
                month: generateFallbackData(30)
            })
        }

        // Fetch current value from API
        const fetchCurrentValue = async () => {
            try {
                const response = await fetch('http://localhost:1880/api/temp')
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()

                // Update current value
                const value = data.value !== undefined ? data.value : (typeof data === 'number' ? data : 0)
                setCurrentValue(value)
                setLastUpdated(new Date())
                setError(null)

                // Add to time series data
                updateTimeSeriesData(value)

                // Check for high usage
                checkHighUsage(value)

                // Also fetch home status whenever we get energy data
                fetchHomeStatus()

                if (loading) setLoading(false)
            } catch (err) {
                console.error("Error fetching data:", err)
                setError(err.message)
                // Only initialize with fallback if we haven't loaded any data yet
                if (timeSeriesData.day.length === 0) {
                    initializeData()
                }
                if (loading) setLoading(false)
            }
        }

        // Fetch home status from API
        const fetchHomeStatus = async () => {
            try {
                const response = await fetch('http://localhost:1880/api/isHome')
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()

                // Update home status (convert to boolean)
                const homeStatus = data === 1 || data.value === 1
                setIsHome(homeStatus)
            } catch (err) {
                console.error("Error fetching home status:", err)
                // Keep previous status in case of error
            }
        }

        // Check if usage is high and show notification if needed
        const checkHighUsage = (value) => {
            if (isHome && value > highUsageThreshold) {
                setNotificationMessage(`High energy usage detected: ${value} kWh. Consider turning off unnecessary appliances.`)
                setShowNotification(true)

                // Auto-hide notification after 10 seconds
                setTimeout(() => {
                    setShowNotification(false)
                }, 10000)
            }
        }

        // Initial fetch - fetchCurrentValue will also call fetchHomeStatus
        fetchCurrentValue()

        // Set up polling interval (every 5 seconds)
        const intervalId = setInterval(fetchCurrentValue, 5000)

        // Clean up on unmount
        return () => {
            clearInterval(intervalId)
        }
    }, [isHome, highUsageThreshold]) // Update dependency array to include isHome and threshold

    // Update time series data with new values
    const updateTimeSeriesData = (newValue) => {
        setTimeSeriesData(prevData => {
            // Add new value to day data (keep last 24 points)
            const updatedDayData = [...prevData.day, newValue].slice(-24)

            // Update week data every 24 points (average of day)
            let updatedWeekData = [...prevData.week]
            if (prevData.day.length >= 23) { // Almost a full day of data
                const dayAverage = prevData.day.reduce((sum, val) => sum + val, 0) / prevData.day.length
                updatedWeekData = [...updatedWeekData, dayAverage].slice(-7)
            }

            // Update month data once a week (average of week)
            let updatedMonthData = [...prevData.month]
            if (prevData.week.length >= 6) { // Almost a full week of data
                const weekAverage = prevData.week.reduce((sum, val) => sum + val, 0) / prevData.week.length
                updatedMonthData = [...updatedMonthData, weekAverage].slice(-30)
            }

            return {
                day: updatedDayData,
                week: updatedWeekData,
                month: updatedMonthData
            }
        })
    }

    // Process data whenever timeSeriesData or timeRange changes
    useEffect(() => {
        // Get the appropriate data array based on time range
        const values = timeSeriesData[timeRange] || []

        if (values.length === 0) return

        // Calculate stats
        const total = values.reduce((sum, val) => sum + val, 0)
        const peak = Math.max(...values)

        // Calculate comparison with previous period
        // For a real app, we'd store historical data and compare properly
        const halfLength = Math.floor(values.length / 2)
        const currentPeriodAvg = values.slice(halfLength).reduce((sum, val) => sum + val, 0) / halfLength || 0
        const prevPeriodAvg = values.slice(0, halfLength).reduce((sum, val) => sum + val, 0) / halfLength || 0
        const comparison = prevPeriodAvg ? ((currentPeriodAvg - prevPeriodAvg) / prevPeriodAvg) * 100 : 0

        setTotalConsumption(Math.round(total))
        setPeakConsumption(Math.round(peak))
        setComparedToLastPeriod(comparison)

        drawCircularChart(values)
    }, [timeSeriesData, timeRange])

    // Fallback data generation if API fails
    const generateFallbackData = (points) => {
        const data = []
        for (let i = 0; i < points; i++) {
            const baseValue = 30 + 20 * Math.sin((i / points) * Math.PI * 2)
            const noise = Math.random() * 15
            data.push(baseValue + noise)
        }
        return data
    }

    const drawCircularChart = (data) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        const size = Math.min(window.innerWidth - 40, 500)
        canvas.width = size
        canvas.height = size

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const outerRadius = Math.min(centerX, centerY) - 10
        const innerRadius = outerRadius * 0.6

        // Draw inner circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
        ctx.fillStyle = "#1e293b"
        ctx.fill()

        // Draw outer circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2)
        ctx.strokeStyle = "#475569"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw hour ticks and labels
        const hoursInDay = 24
        for (let hour = 0; hour < hoursInDay; hour++) {
            // Position at the correct hour (start at the top and go clockwise)
            // -Math.PI/2 starts at top (12 o'clock position)
            const angle = ((hour / hoursInDay) * Math.PI * 2) - Math.PI/2

            // Draw hour tick
            const tickStartX = centerX + (innerRadius - 5) * Math.cos(angle)
            const tickStartY = centerY + (innerRadius - 5) * Math.sin(angle)
            const tickEndX = centerX + innerRadius * Math.cos(angle)
            const tickEndY = centerY + innerRadius * Math.sin(angle)

            ctx.beginPath()
            ctx.moveTo(tickStartX, tickStartY)
            ctx.lineTo(tickEndX, tickEndY)
            ctx.strokeStyle = "#64748b"
            ctx.lineWidth = 1
            ctx.stroke()

            // Add hour label for major hours (3, 6, 9, 12)
            if (hour % 3 === 0) {
                const labelRadius = innerRadius - 15
                const labelX = centerX + labelRadius * Math.cos(angle)
                const labelY = centerY + labelRadius * Math.sin(angle)

                ctx.fillStyle = "#94a3b8"
                ctx.font = "10px sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText(hour === 0 ? "24" : hour.toString(), labelX, labelY)
            }
        }

        // Get current hour to determine where new data should be positioned
        const now = new Date()
        const currentHour = now.getHours()

        // Draw data points
        const maxValue = Math.max(...data, 1) * 1.2 // Add 20% for visual spacing, ensure always > 0

        // Start position for sequential data rendering
        // We'll start at the current hour (top of the circle) and go clockwise
        const dataPoints = data.length

        // Display data sequentially next to each other rather than evenly spaced
        // We'll place them together based on their arrival time, starting from 12 o'clock
        // and covering only the portion of the circle that has data
        data.forEach((value, index) => {
            // If we have fewer points than the full circle capacity,
            // cluster them together on one side starting from 12 o'clock
            const totalAngleSpan = Math.min(dataPoints / 24, 1) * (Math.PI * 2)
            const segmentAngle = totalAngleSpan / dataPoints
            const startAngle = -Math.PI/2 // Start at 12 o'clock position
            const angle = startAngle + (index * segmentAngle)

            // Calculate peak height (value relative to max)
            const peakHeight = (value / maxValue) * (outerRadius - innerRadius)

            // Calculate start and end points
            const startX = centerX + innerRadius * Math.cos(angle)
            const startY = centerY + innerRadius * Math.sin(angle)

            const endX = centerX + (innerRadius + peakHeight) * Math.cos(angle)
            const endY = centerY + (innerRadius + peakHeight) * Math.sin(angle)

            // Draw peak line
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)

            // Color based on intensity
            const intensity = value / maxValue
            const hue = 120 - intensity * 120 // Green to red
            ctx.strokeStyle = `hsl(${hue}, 80%, 50%)`
            ctx.lineWidth = 3
            ctx.stroke()

            // Add a dot at the peak
            ctx.beginPath()
            ctx.arc(endX, endY, 3, 0, Math.PI * 2)
            ctx.fillStyle = `hsl(${hue}, 80%, 50%)`
            ctx.fill()
        })

        // Draw center text with current value if available
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 24px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        if (currentValue !== null) {
            ctx.fillText(`${currentValue} kWh`, centerX, centerY - 15)
            ctx.font = "16px sans-serif"
            ctx.fillText("Current Value", centerX, centerY + 15)
        } else {
            ctx.fillText(`${totalConsumption} kWh`, centerX, centerY - 15)
            ctx.font = "16px sans-serif"
            ctx.fillText("Total Consumption", centerX, centerY + 15)
        }

        // If we have last updated time, show it
        if (lastUpdated) {
            ctx.font = "12px sans-serif"
            const timeStr = lastUpdated.toLocaleTimeString()
            ctx.fillText(`Last updated: ${timeStr}`, centerX, centerY + 40)
        }
    }

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const values = timeSeriesData[timeRange] || []
            if (values.length > 0) {
                drawCircularChart(values)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [timeSeriesData, timeRange, currentValue, lastUpdated])

    return (
        <div className="w-full max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Energy Consumption</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Custom Range
                    </Button>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Display high usage notification */}
            {showNotification && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>High Energy Usage Alert</AlertTitle>
                    <AlertDescription>
                        {notificationMessage}
                    </AlertDescription>
                </Alert>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
                    Error loading data: {error}. Showing generated fallback data.
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {currentValue !== null ? `${currentValue} kWh` : 'N/A'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Waiting for data...'}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Peak Consumption</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{peakConsumption} kWh</div>
                                <div className="text-xs text-muted-foreground">
                                    Highest value in {timeRange === "day" ? "24 hours" : timeRange === "week" ? "7 days" : "30 days"}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Average</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round((totalConsumption / (timeSeriesData[timeRange].length || 1)) * 10) / 10} kWh
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Per {timeRange === "day" ? "hour" : "day"}
                                </div>
                            </CardContent>
                        </Card>

                        {/* New card for home status */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <HomeIcon className={`h-6 w-6 mr-2 ${isHome ? 'text-green-500' : 'text-gray-400'}`} />
                                    <div className="text-xl font-bold">
                                        {isHome ? "Home" : "Away"}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {isHome
                                        ? "You are currently at home"
                                        : "You are currently away"}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <div className="relative">
                            <canvas ref={canvasRef} className="max-w-full" style={{ maxHeight: "500px" }} />
                            {timeSeriesData[timeRange].length === 0 && !loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                                    No data available for the selected time range
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-500">
                        {timeSeriesData[timeRange].length > 0 ? (
                            <p>
                                Displaying {timeSeriesData[timeRange].length} data points for {timeRange === "day" ? "the last 24 hours" : timeRange === "week" ? "the last 7 days" : "the last 30 days"}
                            </p>
                        ) : (
                            <p>Collecting data for {timeRange} view...</p>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}