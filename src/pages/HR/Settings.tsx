import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure system settings and preferences.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <p>Settings configuration features coming soon...</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
