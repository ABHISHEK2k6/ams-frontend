"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AttendanceOverview from "@/components/student/attendance-overview";
import { getStudentStats, type SubjectAttendanceStats } from "@/lib/api/attendance-stats";
import { getUserById, type User } from "@/lib/api/user";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function StudentAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [stats, setStats] = useState<SubjectAttendanceStats[]>([]);
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const [studentData, statsData] = await Promise.all([
          getUserById(studentId),
          getStudentStats(studentId)
        ]);
        
        setStudent(studentData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Student Tracking</h1>
          <p className="text-muted-foreground text-sm">Detailed attendance overview</p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {student?.name || `${student?.first_name || ''} ${student?.last_name || ''}`.trim() || 'Unknown Student'}
                </h2>
                <p className="text-muted-foreground">
                  ID: {(student?.profile as any)?.candidate_code || (student as any)?.roll_no || student?._id}
                  {student?.email && ` • ${student.email}`}
                </p>
              </div>
            </CardContent>
          </Card>

          {stats.length > 0 ? (
            <AttendanceOverview attendance={stats} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                No attendance records found for this student.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
