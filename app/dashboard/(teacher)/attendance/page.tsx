"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, Users, BookOpen, Pencil, Trash2, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { listAttendanceSessions, deleteAttendanceSessionById, getRecentUniqueSessions, type AttendanceSession, type UniqueSession } from "@/lib/api/attendance-session";
import CreateClassDialog from "./create-class-dialog";

export default function AttendancePage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [uniqueClasses, setUniqueClasses] = useState<UniqueSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogSession, setDeleteDialogSession] = useState<AttendanceSession | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsData, uniqueData] = await Promise.all([
        listAttendanceSessions({ limit: 50 }),
        getRecentUniqueSessions(),
      ]);
      setSessions(sessionsData.sessions);
      setUniqueClasses(uniqueData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const data = await listAttendanceSessions({ limit: 50 });
      setSessions(data.sessions);
      
      // Refresh unique classes too
      const uniqueData = await getRecentUniqueSessions();
      setUniqueClasses(uniqueData);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const getFilteredSessions = () => {
    if (selectedClass === "all") {
      return sessions;
    }
    
    const [batchId, subjectId] = selectedClass.split("-");
    return sessions.filter(
      (session) => session.batch._id === batchId && session.subject._id === subjectId
    );
  };

  const filteredSessions = getFilteredSessions();

  const handleDelete = async (sessionId: string) => {
    try {
      await deleteAttendanceSessionById(sessionId);
      await loadSessions();
      setDeleteDialogSession(null);
    } catch (error) {
      console.error("Failed to delete session:", error);
      alert(error instanceof Error ? error.message : "Failed to delete session");
    }
  };

  const getSessionTypeBadge = (type: string) => {
    const variants = {
      regular: "default",
      extra: "secondary",
      practical: "outline",
    } as const;
    return variants[type as keyof typeof variants] || "default";
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage attendance sessions and records
          </p>
        </div>
        <CreateClassDialog onClassCreated={loadSessions} />
      </div>

      {/* Filter by Class */}
      {!loading && uniqueClasses.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by Class:</span>
          </div>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-75">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {uniqueClasses.map((classItem) => {
                const key = `${classItem.batch._id}-${classItem.subject._id}`;
                return (
                  <SelectItem key={key} value={key}>
                    {classItem.subject.name} - {classItem.batch.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {selectedClass !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedClass("all")}
            >
              Clear Filter
            </Button>
          )}
        </div>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription className="mt-1">
                {selectedClass === "all" 
                  ? "All attendance sessions" 
                  : "Filtered by selected class"}
              </CardDescription>
            </div>
            {!loading && (
              <Badge variant="outline" className="text-base px-3 py-1">
                {filteredSessions.length} {filteredSessions.length === 1 ? "session" : "sessions"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {selectedClass === "all" ? "No sessions found" : "No sessions for this class"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedClass === "all" 
                  ? "Create a new class to start taking attendance"
                  : "No attendance sessions have been created for this class yet"}
              </p>
              {selectedClass === "all" && <CreateClassDialog onClassCreated={loadSessions} />}
            </div>
          ) : (
            <>
              <div className="hidden md:block rounded-md border">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden lg:table-cell">Time</TableHead>
                    <TableHead className="hidden lg:table-cell">Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow 
                      key={session._id} 
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/attendance/session/${session._id}`)}
                    >
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <BookOpen className="h-4 w-4 text-primary mt-1 shrink-0" />
                          <div>
                            <p className="font-medium">{session.subject.name}</p>
                            <p className="text-xs text-muted-foreground">{session.subject.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground hidden sm:block" />
                          <span className="font-medium">{session.batch? session.batch.name : "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={getSessionTypeBadge(session.session_type)}>
                          {session.session_type.charAt(0).toUpperCase() + session.session_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(new Date(session.start_time), "hh:mm a")} -{" "}
                            {format(new Date(session.end_time), "hh:mm a")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {session.hours_taken} {session.hours_taken === 1 ? "hour" : "hours"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Edit functionality coming soon!");
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialogSession(session);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session._id}
                  className="flex flex-col gap-3 p-4 rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/attendance/session/${session._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-medium text-base">{session.subject.name}</p>
                        <p className="text-sm text-muted-foreground">{session.subject.code}</p>
                      </div>
                    </div>
                    <Badge variant={getSessionTypeBadge(session.session_type)}>
                      {session.session_type.charAt(0).toUpperCase() + session.session_type.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0" />
                      <span className="font-medium text-foreground">{session.batch ? session.batch.name : "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>
                        {format(new Date(session.start_time), "hh:mm a")} -{" "}
                        {format(new Date(session.end_time), "hh:mm a")} ({session.hours_taken} {session.hours_taken === 1 ? "hr" : "hrs"})
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 mt-1 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Edit functionality coming soon!");
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialogSession(session);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteDialogSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Delete Session</CardTitle>
              <CardDescription>
                Are you sure you want to delete this attendance session? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium">{deleteDialogSession.subject.name}</p>
                <p className="text-sm text-muted-foreground">
                  {deleteDialogSession.batch?.name ?? "N/A"} • {format(new Date(deleteDialogSession.start_time), "MMM dd, yyyy hh:mm a")}
                </p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setDeleteDialogSession(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(deleteDialogSession._id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Create a class session to start taking attendance</p>
          <p>• Each session is linked to a specific batch and subject</p>
          <p>• You can mark attendance for all students in the session</p>
          <p>• Sessions are automatically timestamped</p>
        </CardContent>
      </Card>
    </div>
  );
}
