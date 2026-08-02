"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CalendarDayResponse, StaffCalendarSession, StudentCalendarSession } from "@/lib/api/calendar";

const STATUS_VARIANT: Record<StudentCalendarSession["status"], "default" | "secondary" | "destructive" | "outline"> = {
  present: "default",
  late: "secondary",
  excused: "outline",
  absent: "destructive",
};

interface DayDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  loading: boolean;
  detail: CalendarDayResponse | null;
}

export default function DayDetailDialog({ open, onOpenChange, date, loading, detail }: DayDetailDialogProps) {
  const isStudent = detail?.role === "student";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{date ? format(date, "EEEE, MMMM d, yyyy") : "Day detail"}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !detail || detail.sessions.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            No classes recorded for this day.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Batch</TableHead>
                {!isStudent && "teacher" in detail.sessions[0] && <TableHead>Teacher</TableHead>}
                <TableHead>Time</TableHead>
                <TableHead className="text-right">{isStudent ? "Status" : "Attendance"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.sessions.map((session) => {
                const time = `${format(new Date(session.start_time), "h:mm a")} – ${format(
                  new Date(session.end_time),
                  "h:mm a"
                )}`;

                if (isStudent) {
                  const s = session as StudentCalendarSession;
                  return (
                    <TableRow key={s.sessionId}>
                      <TableCell>{s.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{s.batch}</TableCell>
                      <TableCell className="text-muted-foreground">{time}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={STATUS_VARIANT[s.status]}>{s.status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                }

                const s = session as StaffCalendarSession;
                return (
                  <TableRow key={s.sessionId}>
                    <TableCell>{s.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{s.batch}</TableCell>
                    {"teacher" in s && <TableCell className="text-muted-foreground">{s.teacher}</TableCell>}
                    <TableCell className="text-muted-foreground">{time}</TableCell>
                    <TableCell className="text-right">
                      {s.studentsPresent}/{s.totalStudents}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
