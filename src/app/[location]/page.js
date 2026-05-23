import { notFound } from 'next/navigation';
import ReportClientPage from './ReportClientPage';
import dbConnect from '../../lib/mongodb';
import Report from '../../models/Report';

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function getReportData(location) {
  try {
    await dbConnect();
    
    // Direct database call instead of self-referencing fetch
    // (fetch to own API fails on Vercel during SSR/ISR)
    const report = await Report.findOne({ location: location.toLowerCase() }).lean();
    
    if (!report) return null;
    
    // Serialize MongoDB document (convert _id, dates, etc.)
    return JSON.parse(JSON.stringify(report));
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
