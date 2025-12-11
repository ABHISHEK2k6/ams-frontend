"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/charts"

const chartData = [
  { subject: "Math", attendance: 85 },
  { subject: "Science", attendance: 92 },
  { subject: "History", attendance: 78 },
  { subject: "English", attendance: 95 },
  { subject: "Art", attendance: 100 },
]

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "#2563eb",
  },
}

export function AttendanceChart() {
  return (
    <Card className="p-4">
      <ChartContainer config={chartConfig} className="min-h-50 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="subject"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
        </BarChart>
      </ChartContainer>
    </Card>
  )
}
