import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="halloween">
      <body className="min-h-screen bg-base-300">
        {children}
      </body>
    </html>
  );
} 