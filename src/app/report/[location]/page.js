import { notFound } from 'next/navigation';
import ReportClientPage from './ReportClientPage';

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function getReportData(location) {
  // Determine API URL based on environment
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/reports/${location}`, {
      next: { revalidate: 60 } // Also Next.js fetch cache revalidation
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch report');
    }
    
    const data = await res.json();
    return data.report;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}

export default async function ReportPage({ params }) {
  const resolvedParams = await params;
  const { location } = resolvedParams;
  
  const reportData = await getReportData(location);
  
  if (!reportData) {
    notFound();
  }

  return <ReportClientPage initialReport={reportData} />;
}
