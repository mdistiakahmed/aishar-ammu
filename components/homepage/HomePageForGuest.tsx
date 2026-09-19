import Link from "next/link";
import { brand, tagline } from "@/lib/constants";

export function HomePageForGuest() {
  return (
    <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Welcome</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">
        {brand}
      </h1>
      <p className="mt-3 text-base leading-7 text-rose-900/80">{tagline}</p>
      <p className="mt-3 text-sm leading-6 text-rose-900/75">
        Read baby names and short Islamic duas without an account. Guidance here is general wellbeing
        only — it is not a diagnosis or a substitute for a doctor.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/baby-names"
          className="inline-flex h-12 items-center justify-center rounded-full bg-rose-700 px-5 text-sm font-semibold text-white hover:bg-rose-800"
        >
          Baby names
        </Link>
        <Link
          href="/duas"
          className="inline-flex h-12 items-center justify-center rounded-full border border-rose-200 bg-petal px-5 text-sm font-semibold text-rose-800 hover:bg-rose-50"
        >
          Islamic duas
        </Link>
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-full border border-rose-200 bg-white px-5 text-sm font-semibold text-rose-800 hover:bg-rose-50"
        >
          Sign in
        </Link>
      </div>
    </section>
  );
}
