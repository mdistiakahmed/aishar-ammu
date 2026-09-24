export function profileStatusMessage(saved?: string, error?: string) {
  if (saved === "1") return "Your profile was saved.";
  if (error === "dates") {
    return "Enter valid dates, or leave blank to keep saved dates. Start cannot be after due date.";
  }
  if (error === "weight") {
    return "Enter a weight between 30 kg and 180 kg, or leave blank to keep your saved value.";
  }
  if (error === "name") {
    return "Preferred name must be 40 characters or fewer, or leave blank to keep your saved name.";
  }
  if (error === "gender") return "Choose girl, boy, or not known yet.";
  if (error === "db") return "We could not save your details. Please try again.";
  return null;
}

export function ProfileStatus({ saved, error }: { saved?: string; error?: string }) {
  const message = profileStatusMessage(saved, error);
  if (!message) return null;

  return (
    <p
      role="status"
      className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
        saved === "1"
          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
          : "border-rose-200 bg-rose-50 text-rose-900"
      }`}
    >
      {message}
    </p>
  );
}
