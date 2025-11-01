import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function Incentives() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Incentives & Bonuses</h1>
          <p className="text-gray-600">Manage employee incentives and bonus programs.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <p>Incentives and bonus management features coming soon...</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
