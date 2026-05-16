export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 relative">
      {/* Subtle radial gradient */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.18_270_/_3%)_0%,transparent_70%)]" />

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Logo / Brand */}
      <div className="mb-8 flex flex-col items-center gap-2.5 relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
          N
        </div>
        <span className="text-[13px] font-medium text-muted-foreground/70 tracking-wide">
          AI Notes Workspace
        </span>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
