"use client";

import ButtonBG from "@/app/components/Form/ButtonBG";
import TicketTable from "@/app/components/Table/TicketTable";
import TicketTableSkeleton from "@/app/components/Table/TicketTableSkeleton";
import TitlePage from "@/app/components/Title/TitlePage";
import { useEffect, useState } from "react";

export default function ManageTicketPage() {
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(true);
  useEffect(() => {
    // Simulate fetching data (fake delay)
    const timer = setTimeout(() => setIsLoadingskeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <main className="">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <TitlePage
              title="Manage Tickets"
              description="View and manage ticket information"
            />
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 cursor-pointer">
          🧾 Export Tickets
          </button>
        </div>
      {isLoadingskeleton ? <TicketTableSkeleton rows={5} /> : <TicketTable />}
    </main>
  );
}