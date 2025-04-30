"use client";
type Ticket = {
  id: string;
  route: string;
  journey: string;
  passengers: number;
  datetime: string;
  status: "Active" | "Canceled";
  amount: number;
  price: string;
};

const tickets: Ticket[] = [
  {
    id: "T12345",
    route: "Northern Express",
    journey: "Central Station → North Terminal",
    passengers: 1,
    datetime: "5/15/2023 08:00",
    status: "Active",
    amount: 4,
    price: "$30.00",
  },
  {
    id: "T12346",
    route: "Southern Route",
    journey: "Central Station → South Terminal",
    passengers: 2,
    datetime: "5/15/2023 09:30",
    status: "Active",
    amount: 5,
    price: "matrix price",
  },
  {
    id: "T12347",
    route: "Eastern Circuit",
    journey: "East Terminal → Riverside",
    passengers: 1,
    datetime: "5/16/2023 10:00",
    status: "Canceled",
    amount: 15,
    price: "matrix price",
  },
  {
    id: "T12348",
    route: "Western Line",
    journey: "Central Station → Mountain View",
    passengers: 3,
    datetime: "5/16/2023 14:00",
    status: "Active",
    amount: 5,
    price: "$75.00",
  },
];
const routeColors: Record<string, string> = {
    "Northern Express": "bg-blue-500",
    "Southern Route": "bg-green-500",
    "Eastern Circuit": "bg-orange-400",
    "Western Line": "bg-purple-500",
  };
  

export default function TicketTable() {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-gray-600 font-medium">
          <tr>
            <th className="px-4 py-3" >Ticket ID</th>
            <th className="px-4 py-3">Route</th>
            <th className="px-4 py-3">Journey</th>
            <th className="px-4 py-3">Date & Time</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="px-4 py-3 font-medium">{ticket.id}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-6 rounded-full ${routeColors[ticket.route]}`} />
                    <span>{ticket.route}</span>
                </div>
                </td>
              <td className="px-4 py-3 text-gray-500">
                <div>{ticket.journey}</div>
                <div className="text-xs">{ticket.passengers} passenger(s)</div>
              </td>
              <td className="px-4 py-3">{ticket.datetime}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-3">{ticket.amount}</td>
              <td className="px-4 py-3">
                {ticket.price === "matrix price" ? (
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded cursor-pointer">
                    matrix price
                  </span>
                ) : (
                  ticket.price
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
