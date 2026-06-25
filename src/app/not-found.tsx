import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="label-mono mb-5">Error 404</div>
      <h1 className="font-display text-display text-white">Lost at sea.</h1>
      <p className="mt-5 max-w-md text-zinc-400">
        This page drifted off course. Let&apos;s get you back to {SITE.name}.
      </p>
      <Link href="/" className="btn-iris group mt-8">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back home
      </Link>
    </main>
  );
}
