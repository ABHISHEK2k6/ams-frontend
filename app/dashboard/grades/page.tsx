"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, GraduationCap } from "lucide-react";
import { ParentProfile } from "@/lib/types/UserTypes";
import { TeacherGradeGrid } from "./teacher-grade-grid";
import { StudentGradeView } from "./student-grade-view";

export default function GradesPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  if (user.role === "student") {
    return (
      <div className="p-4 md:p-6 pb-20 md:pb-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grades</h1>
          <p className="text-sm text-muted-foreground">Your marks and assignments this semester.</p>
        </div>
        <StudentGradeView />
      </div>
    );
  }

  if (user.role === "parent") {
    const child = (user.profile as ParentProfile)?.child;
    if (!child?._id) {
      return (
        <div className="p-4 md:p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No child is linked to your account yet. Contact the school admin to get this set up.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className="p-4 md:p-6 pb-20 md:pb-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grades</h1>
          <p className="text-sm text-muted-foreground">
            {child.first_name ? `${child.first_name}'s` : "Your child's"} marks and assignments this semester.
          </p>
        </div>
        <StudentGradeView />
      </div>
    );
  }

  if (user.role === "teacher" || user.role === "hod") {
    return (
      <div className="p-4 md:p-6 pb-20 md:pb-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Grades</h1>
            <p className="text-sm text-muted-foreground">Enter and manage marks for the classes you teach.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/grades/report")}>
            <GraduationCap className="mr-2 h-4 w-4" /> Semester Report
          </Button>
        </div>
        <TeacherGradeGrid />
      </div>
    );
  }

  // admin / principal — no personal grade entry; route to the institution-wide report
  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <Card>
        <CardHeader>
          <CardTitle>Grades</CardTitle>
          <CardDescription>
            View the semester grade report — per-student, per-subject internal marks across batches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/dashboard/grades/report")}>
            <GraduationCap className="mr-2 h-4 w-4" /> Open Semester Grade Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
