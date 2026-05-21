import './globals.css';

export const metadata = {
  title: {
    default: 'Umoor Report Dashboard',
    template: '%s | Umoor Report',
  },
  description: 'Comprehensive Umoor reporting dashboard with achievements, improvements, and gallery highlights across all active Umoors and cities.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-cream min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
