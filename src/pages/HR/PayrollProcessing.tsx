import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function PayrollProcessing() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payroll Processing</h1>
          <p className="text-gray-600">Process and manage employee payroll.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <p>Payroll processing features coming soon...</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

