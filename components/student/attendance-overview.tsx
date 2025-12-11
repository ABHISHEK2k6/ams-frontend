"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarCheck } from "lucide-react";

type SubjectAttendance = {
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
};

type AttendanceOverviewProps = {
  attendance: SubjectAttendance[];
};

export default function AttendanceOverview({ attendance }: AttendanceOverviewProps) {
  const totalAttended = attendance.reduce((sum, item) => sum + item.attendedClasses, 0);
  const totalClasses = attendance.reduce((sum, item) => sum + item.totalClasses, 0);
  const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5" />
          Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Attendance */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Attendance</span>
            <span className={`text-2xl font-bold ${getAttendanceColor(overallPercentage)}`}>
              {overallPercentage}%
            </span>
          </div>
          <Progress value={overallPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {totalAttended} / {totalClasses} classes attended
          </p>
        </div>

        {/* Subject-wise Attendance */}
        <div className="space-y-3">
          {attendance.map((subject, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{subject.subjectName}</span>
                <span className={`text-sm font-semibold ${getAttendanceColor(subject.percentage)}`}>
                  {subject.percentage}%
                </span>
              </div>
              <Progress value={subject.percentage} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {subject.attendedClasses} / {subject.totalClasses} classes
              </p>
            </div>
          ))}
        </div>

        {overallPercentage < 75 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ Your attendance is below 75%. Please attend classes regularly.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
