"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { listGradeFields } from "@/lib/api/grade-field";
import { listGradeEntries } from "@/lib/api/grade-entry";
import { GradeField, PopulatedGradeEntry } from "@/lib/types/GradeTypes";

type SubjectGroup = {
  subjectId: string;
  name: string;
  subject_code: string;
  total_marks: number;
  fields: GradeField[];
};

function computeCappedTotal(fields: GradeField[], entryMap: Map<string, PopulatedGradeEntry>, capAt: number) {
  const rawTotal = fields.reduce((sum, field) => {
    if (field.type === "moderation") {
      // Applies its raw value directly — no entry, no weightage.
      const moderationValue = Number(field.value);
      return Number.isNaN(moderationValue) ? sum : sum + moderationValue;
    }
    const entry = entryMap.get(field._id);
    if (!entry || entry.is_absent) return sum;
    return sum + (entry.mark / field.total_mark!) * field.weightage;
  }, 0);
  return Math.round(Math.min(rawTotal, capAt) * 100) / 100;
}

export function StudentGradeView() {
  const [fields, setFields] = useState<GradeField[]>([]);
  const [entries, setEntries] = useState<PopulatedGradeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [fieldsData, entriesData] = await Promise.all([
          listGradeFields({ limit: 200 }),
          listGradeEntries({ limit: 200 }),
        ]);
        setFields(fieldsData);
        setEntries(entriesData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load grades");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const entryMap = useMemo(() => {
    const map = new Map<string, PopulatedGradeEntry>();
    for (const entry of entries) {
      map.set(entry.grade_field._id, entry);
    }
    return map;
  }, [entries]);

  const subjectGroups = useMemo(() => {
    const groups: Record<string, SubjectGroup> = {};
    for (const field of fields) {
      const subj = field.subject;
      if (!subj) continue;
      if (!groups[subj._id]) {
        groups[subj._id] = {
          subjectId: subj._id,
          name: subj.name ?? subj.subject_code,
          subject_code: subj.subject_code,
          total_marks: subj.total_marks ?? 0,
          fields: [],
        };
      }
      groups[subj._id].fields.push(field);
    }
    return Object.values(groups);
  }, [fields]);

  const assignments = useMemo(() => fields.filter((f) => f.type === "assignment"), [fields]);

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (subjectGroups.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No grades have been published yet.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Semester Grade Card — one row per subject, capped internal total */}
      <Card>
        <CardHeader>
          <CardTitle>Semester Grade Card</CardTitle>
          <CardDescription>Internal marks per subject.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Internal Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectGroups.map((group) => (
                <TableRow key={group.subjectId}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.subject_code}</TableCell>
                  <TableCell className="text-right">
                    {computeCappedTotal(group.fields, entryMap, group.total_marks)} / {group.total_marks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Per-subject breakdown */}
      {subjectGroups.map((group) => (
        <Card key={group.subjectId}>
          <CardHeader>
            <CardTitle>{group.name}</CardTitle>
            <CardDescription>{group.subject_code}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Your Mark</TableHead>
                  <TableHead>Max Mark</TableHead>
                  <TableHead>Weightage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.fields.map((field) => {
                  if (field.type === "moderation") {
                    return (
                      <TableRow key={field._id}>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>{field.value}</TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Applied
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  const entry = entryMap.get(field._id);
                  return (
                    <TableRow key={field._id}>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>{entry ? (entry.is_absent ? "AB" : entry.mark) : "—"}</TableCell>
                      <TableCell>{field.total_mark}</TableCell>
                      <TableCell>{field.weightage}%</TableCell>
                      <TableCell>
                        {entry ? (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Marked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" /> Pending
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Assignments — filtered slice of the same grade-field data */}
      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>Assignments across all your subjects.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((field) => {
                  const entry = entryMap.get(field._id);
                  return (
                    <TableRow key={field._id}>
                      <TableCell>{field.subject?.name ?? field.subject?.subject_code}</TableCell>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>
                        {field.due_date ? new Date(field.due_date).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        {entry ? (entry.is_absent ? "AB" : `${entry.mark}/${field.total_mark}`) : `—/${field.total_mark}`}
                      </TableCell>
                      <TableCell>
                        {entry ? (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Marked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" /> Pending
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
