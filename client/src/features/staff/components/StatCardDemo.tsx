import React from "react";
import { Clock, FileText, CreditCard, Download, Users, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

export const StatCardDemo: React.FC = () => {
  const handleStatClick = (statName: string) => {
    console.log(`Clicked on ${statName} stat`);
    // Add your filtering logic here
  };

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">StatCard Component Examples</h2>
      
      {/* Staff Dashboard Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Staff Dashboard Stats</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={156}
            change={12.5}
            icon={<FileText className="h-8 w-8" />}
            color="green"
            onClick={() => handleStatClick('total')}
          />
          
          <StatCard
            title="Pending Review"
            value={23}
            change={-5.2}
            icon={<Clock className="h-8 w-8" />}
            color="orange"
            onClick={() => handleStatClick('pending')}
          />
          
          <StatCard
            title="Payment Verification"
            value={18}
            change={8.7}
            icon={<CreditCard className="h-8 w-8" />}
            color="purple"
            onClick={() => handleStatClick('payment')}
          />
          
          <StatCard
            title="Ready for Generation"
            value={12}
            change={15.3}
            icon={<Download className="h-8 w-8" />}
            color="blue"
            onClick={() => handleStatClick('generation')}
          />
        </div>
      </div>

      {/* Different Use Cases */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Use Cases</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Active Users"
            value={2847}
            change={23.1}
            icon={<Users className="h-8 w-8" />}
            color="green"
          />
          
          <StatCard
            title="Completed Today"
            value={45}
            change={-2.3}
            icon={<CheckCircle className="h-8 w-8" />}
            color="blue"
          />
          
          <StatCard
            title="System Load"
            value={87}
            change={-12.8}
            icon={<div className="h-8 w-8 rounded-full bg-orange-500" />}
            color="orange"
            onClick={() => handleStatClick('system')}
          />
        </div>
      </div>

      {/* Large Numbers Example */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Large Numbers</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <StatCard
            title="Total Documents Processed"
            value={1247892}
            change={5.7}
            icon={<FileText className="h-8 w-8" />}
            color="green"
          />
          
          <StatCard
            title="Revenue This Month"
            value={89750}
            change={-3.2}
            icon={<div className="h-8 w-8 text-2xl">₱</div>}
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};