interface LoadingOverlayProps {
  status: 'writing' | 'drawing';
  currentPage?: number;
  totalPages?: number;
}

export default function LoadingOverlay({ status, currentPage, totalPages }: LoadingOverlayProps) {
  const getMessage = () => {
    switch (status) {
      case 'writing':
        return {
          title: 'Writing your story...',
          subtitle: 'Creating a magical adventure just for you'
        };
      case 'drawing':
        return {
          title: `Drawing page ${currentPage} of ${totalPages}...`,
          subtitle: 'Bringing your story to life with beautiful illustrations'
        };
      default:
        return {
          title: 'Creating your story...',
          subtitle: 'This may take a moment'
        };
    }
  };

  const message = getMessage();

  return (
    <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center gap-2">
          {status === 'writing' ? (
            <div className="loading loading-dots loading-lg text-primary"></div>
          ) : (
            <div className="loading loading-spinner loading-lg text-primary"></div>
          )}
          <p className="text-2xl font-bold">{message.title}</p>
        </div>
        <p className="text-sm opacity-60">{message.subtitle}</p>
      </div>
    </div>
  );
} 