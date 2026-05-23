import DashboardClientLayout from './DashboardClientLayout';

export const metadata = {
  title: 'Dashboard | Umoor Report',
  description: 'Manage your Umoor Reports',
};

export default function DashboardLayout({ children }) {
  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  );
}
