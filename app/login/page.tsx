import { LogoMark, MailIcon } from "@/components/icons";
import { brand, brandBn, taglineBn } from "@/lib/copy";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-6">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-rose-100 bg-white shadow-[0_20px_50px_-28px_rgba(127,29,29,0.28)]">
        <div className="bg-[linear-gradient(135deg,#fff7f4_0%,#fde8ef_52%,#fff1e0_100%)] px-6 py-8 text-center sm:px-10">
          <LogoMark className="mx-auto h-14 w-14" />
          <p className="mt-4 font-[family-name:var(--font-hind)] text-lg font-semibold text-rose-950">
            {brand} · {brandBn}
          </p>
          <p className="mt-1 font-[family-name:var(--font-hind)] text-sm text-rose-800/80">
            {taglineBn}
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10">
          <h1 className="text-2xl font-semibold tracking-tight text-rose-950">
            Welcome back
          </h1>
          <p className="mt-2 font-[family-name:var(--font-hind)] text-sm leading-6 text-rose-900/75">
            আপনার যত্নের যাত্রা চালিয়ে যেতে ইমেইল দিয়ে প্রবেশ করুন।
          </p>

          <button
            type="button"
            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-rose-700 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800"
          >
            <MailIcon className="h-5 w-5" />
            Login with email
          </button>

          <p className="mt-6 text-center text-xs leading-5 text-rose-900/55">
            By continuing, you agree to our care guidance being educational only
            and not a substitute for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
