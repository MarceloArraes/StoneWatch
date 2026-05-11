import { LoginForm } from "@/components/login-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <h1
            className="text-4xl tracking-[0.2em] mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            STONEWATCH
          </h1>
          <p className="text-sm text-[#8B9DB5] leading-relaxed">
            Production error tracking
            <br />
            for precision stonemasonry
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
