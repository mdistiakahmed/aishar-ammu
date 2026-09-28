import { findUserById } from "@/lib/db";

export type { ParsedProfile, ProfileError } from "@/lib/profile-parse";
export { parseProfilePayload, parseWeightLogPayload } from "@/lib/profile-parse";

export async function loadMe(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new Error("User missing after save");
  return { user, logs: [] };
}
