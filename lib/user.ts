export type BabyGender = "girl" | "boy" | "unknown";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  preferredName: string;
  picture: string;
  pregnancyStartDate: string | null;
  nextDoctorVisitDate: string | null;
  dueDate: string | null;
  weightAtStartKg: number | null;
  babyGender: BabyGender | null;
};

export type SessionUser = UserRecord;
