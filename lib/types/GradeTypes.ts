/**
 * Grade Fields & Grade Entries — shared types.
 * Mirrors ams-backend/src/plugins/db/models/grade.models.ts
 */

export type GradeFieldType = "exam" | "assignment" | "practical" | "attendance" | "moderation";

export interface GradeFieldSubjectRef {
  _id: string;
  name?: string;
  subject_code: string;
  sem: string;
  type?: string;
  total_marks?: number;
  pass_mark?: number;
}

export interface GradeFieldBatchRef {
  _id: string;
  name: string;
  adm_year: number;
  department: string;
}

export interface GradeField {
  _id: string;
  batch: GradeFieldBatchRef;
  subject: GradeFieldSubjectRef;
  type: GradeFieldType;
  name: string;
  /** Not present for type="moderation" — it applies its raw `value` directly, uncapped. */
  total_mark?: number;
  weightage: number;
  /** Whether students/parents can see this field yet. */
  published: boolean;
  value?: string;
  description?: string;
  due_date?: string;
}

export interface GradeEntry {
  _id: string;
  user: string;
  grade_field: string;
  mark: number;
  is_absent: boolean;
  remarks?: string;
  updated_at: string;
}

export interface GradeMatrixStudent {
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    profile?: { adm_number?: string; candidate_code?: string };
  };
  entries: Record<string, GradeEntry>; // keyed by gradeField._id
}

export interface GradeMatrix {
  gradeFields: GradeField[];
  students: GradeMatrixStudent[];
}

export interface GradeSummarySubject {
  _id: string;
  name: string;
  subject_code: string;
  sem: string;
  total_marks: number;
}

export interface GradeSummaryStudent {
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    profile?: { adm_number?: string; candidate_code?: string };
  };
  totals: Record<string, number>; // subjectId -> capped weighted total
}

export interface GradeSummary {
  subjects: GradeSummarySubject[];
  students: GradeSummaryStudent[];
}

/**
 * Shape returned by GET /academics/grade-entry (list) — user and grade_field
 * (with its nested batch/subject) come back populated, unlike the flat
 * GradeEntry rows inside a GradeMatrix.
 */
export interface PopulatedGradeEntry {
  _id: string;
  user: { _id: string; first_name: string; last_name: string; email?: string; role?: string };
  grade_field: GradeField;
  mark: number;
  is_absent: boolean;
  remarks?: string;
  updated_at: string;
}
