export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <div className="mt-4">
          <p className="text-xl">Creating your story...</p>
          <p className="text-sm opacity-60 mt-2">This may take a moment</p>
        </div>
      </div>
    </div>
  );
} 