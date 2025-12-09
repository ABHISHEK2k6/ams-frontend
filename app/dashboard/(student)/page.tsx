"use client"

import { User, Wrench } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActionableStats from "@/components/dashboard/ActionableStats"
import AttendanceCharts from "@/components/dashboard/AttendanceCharts"
import PersonalizedStudentView from "@/components/dashboard/PersonalizedStudentView"
import LowAttendanceSubjects from "@/components/dashboard/LowAttendanceSubjects"
import { Session } from "@/lib/auth-client"

export default function StudentDashboardPage({ session } : { session: Session }) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Tabs defaultValue="management" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="management">
                        <Wrench className="mr-2 h-4 w-4" />
                        Management View
                    </TabsTrigger>
                    <TabsTrigger value="student">
                        <User className="mr-2 h-4 w-4" />
                        Personalized View
                    </TabsTrigger>
                </TabsList>
                
                {/* Management View */}
                <TabsContent value="management" className="space-y-4">
                    <ActionableStats />
                    <AttendanceCharts />
                    <LowAttendanceSubjects />
                </TabsContent>

                {/* Personalized Student View */}
                <TabsContent value="student" className="space-y-4">
                    <PersonalizedStudentView session={session} />
                </TabsContent>
            </Tabs>
        </div>
    );
}