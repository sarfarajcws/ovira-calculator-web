export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 h-10 w-10 rounded-full border-2 border-line-strong border-t-brand animate-spin" />
        <p className="font-mono text-sm tracking-wide text-ink-soft">
          Loading calculator data…
        </p>
      </div>
    </div>
  );
}
