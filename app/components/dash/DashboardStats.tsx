import { getTextDashboard, useLanguageContext } from "@/app/i18n/translations";
import { JSX } from "@emotion/react/jsx-runtime";
import { UsersIcon, CreditCardIcon, TruckIcon } from "lucide-react";

export default function DashboardStats({
  totalPassengers,
  totalAmount,
  totalRoutes,
}: {
  totalPassengers: number;
  totalAmount: number;
  totalRoutes: number;
}) {
  const isTH = useLanguageContext();
  const text = getTextDashboard(isTH);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <StatsCard
        title={text.totalPassenger}
        value={totalPassengers }
        icon={<UsersIcon size={24} className="text-green-600" />}
        // change="+8.1% from yesterday"
        iconBg="bg-green-100"
      />
      <StatsCard
        title={text.totalRevenue}
        value={`${totalAmount.toLocaleString()} THB`}
        icon={<CreditCardIcon size={24} className="text-blue-600" />}
        // change="+12.3% from yesterday"
        iconBg="bg-blue-100"
      />
      <StatsCard
        title={text.activeRoute}
        value={totalRoutes}
        icon={<TruckIcon size={24} className="text-purple-600" />}
        // change="Today"
        iconBg="bg-purple-100"
      />
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  // change,
  iconBg,
}: {
  title: string;
  value: string | number;
  icon: JSX.Element;
  // change: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`flex items-center justify-center h-12 w-12 rounded-md ${iconBg}`}>
          {icon}
        </div>
        <div className="ml-5">
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {/* <p className="ml-2 text-sm text-green-600">{change}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
