import { notFound } from 'next/navigation';
import DashboardClientLayout from './DashboardClientLayout';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { location } = resolvedParams;
  
  const formattedLocation = location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `Dashboard | ${formattedLocation}`,
    description: 'Manage your Umoor Reports',
  };
}

export default async function DashboardLayout({ children, params }) {
  const resolvedParams = await params;
  const { location } = resolvedParams;

  return (
    <DashboardClientLayout location={location}>
      {children}
    </DashboardClientLayout>
  );
}
