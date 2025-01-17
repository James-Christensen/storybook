export default function KeyboardHints() {
  return (
    <footer className="mt-4 card bg-base-100 shadow-lg">
      <div className="card-body p-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-sm">←</kbd>
            <span>Previous page</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-sm">→</kbd>
            <span>or</span>
            <kbd className="kbd kbd-sm">Space</kbd>
            <span>Next page</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-sm">Home</kbd>
            <span>First page</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-sm">End</kbd>
            <span>Last page</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 