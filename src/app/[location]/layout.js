import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { location } = resolvedParams;
  
  // Format location for title (e.g., "bhopal-city" -> "Bhopal City")
  const formattedLocation = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedLocation} | Umoor Report`,
    description: `Comprehensive Umoor reporting dashboard for ${formattedLocation}.`,
  };
}

export default async function ReportLayout({ children, params }) {
  const resolvedParams = await params;
  const { location } = resolvedParams;

  // We could fetch data here if we needed it for the layout,
  // but it's better to fetch it in the page so we can pass it to the provider.
  return (
    <div className="report-layout">
      {children}
    </div>
  );
}
