export default function ErrorScreen({ message, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm w-full rounded-2xl border border-line bg-paper-raised p-7 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-danger-soft text-danger text-xl font-display">
          !
        </div>
        <h1 className="font-display text-lg font-semibold mb-2">Data unavailable</h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-5">{message}</p>
        <button
          onClick={onRetry}
          className="w-full rounded-xl bg-brand text-white text-sm font-medium py-2.5 hover:bg-brand-dark transition-colors"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
