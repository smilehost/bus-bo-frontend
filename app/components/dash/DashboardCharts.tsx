import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Legend,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Bar,
    Cell,
  } from "recharts";
  import { useEffect, useState } from "react";
  import { useRouteStore } from "@/stores/routeStore";
import { getTextDashboard, useLanguageContext } from "@/app/i18n/translations";
  
  interface RouteData {
    lat: number;
    lng: number;
    name: number;
    amount: number;
    payment: number;
  }
  
  export default function DashboardCharts({ routeData }: { routeData: RouteData[] }) {
    const getRouteById = useRouteStore((state) => state.getRouteById);
    const [routeNameMap, setRouteNameMap] = useState<Record<number, string>>({});
    const isTH = useLanguageContext();
    const text = getTextDashboard(isTH);
  
    // ✅ ดึงชื่อสายจาก API โดยใช้ route_id
    useEffect(() => {
      const fetchRouteNames = async () => {
        const uniqueIds = [...new Set(routeData.map((r) => r.name))]; // route_id
        const results = await Promise.all(
          uniqueIds.map(async (id) => {
            const route = await getRouteById(id);
            return { id, name: route?.route_name_th || `สาย ${id}` };
          })
        );
        const nameMap = Object.fromEntries(results.map((r) => [r.id, r.name]));
        setRouteNameMap(nameMap);
      };
  
      fetchRouteNames();
    }, [routeData]);
  
    // ✅ รวมยอดเงินตามประเภทการจ่ายเงิน
    const paymentSummary = routeData.reduce(
      (acc, curr) => {
        if (curr.payment === 1) {
          acc.cash += curr.amount;
        } else if ([2, 3].includes(curr.payment)) {
          acc.qr += curr.amount;
        }
        return acc;
      },
      { cash: 0, qr: 0 }
    );
  
    const transactionData = [
      { name: text.cash, value: paymentSummary.cash, color: "#10B981" },
      { name: text.qr, value: paymentSummary.qr, color: "#6366F1" },
    ];
  
    // ✅ รวมข้อมูลโดยแสดงชื่อสายแทน id
    const groupedRouteData = Object.values(
      routeData.reduce((acc, curr) => {
        const id = curr.name;
        const displayName = routeNameMap[id] || `สาย ${id}`;
        if (!acc[displayName]) {
          acc[displayName] = {
            name: displayName,
            amount: 0,
            passengers: 0,
          };
        }
        acc[displayName].amount += curr.amount;
        acc[displayName].passengers += 1;
        return acc;
      }, {} as Record<string, { name: string; amount: number; passengers: number }>)
    );
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {text.trans}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {transactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {text.revenueByRoute}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={groupedRouteData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" name={text.amount} fill="#F59E0B" />
                <Bar dataKey="passengers" name={text.passenger} fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
  