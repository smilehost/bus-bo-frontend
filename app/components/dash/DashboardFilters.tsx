import { getTextDashboard, useLanguageContext } from "@/app/i18n/translations";
import { FilterIcon } from "lucide-react";

export default function DashboardFilters({
  selectDate,
  setSelectDate,
  customDate,
  setCustomDate,
  rangeFrom,
  setRangeFrom,
  rangeTo,
  setRangeTo,
}: {
  selectDate: string;
  setSelectDate: (val: string) => void;
  customDate: string;
  setCustomDate: (val: string) => void;
  rangeFrom: string;
  setRangeFrom: (val: string) => void;
  rangeTo: string;
  setRangeTo: (val: string) => void;
}) {
  const isTH = useLanguageContext();
  const text = getTextDashboard(isTH);

  const presetOptions = [
    { value: "day", label: text.today },
    { value: "month", label: text.thisMonth },
    { value: "2m", label: isTH ? "2 เดือน" : "2 months" },
    { value: "3m", label: isTH ? "3 เดือน" : "3 months" },
    { value: "6m", label: isTH ? "6 เดือน" : "6 months" },
    { value: "year", label: text.thisYear },
    { value: "custom", label: isTH ? "เลือกวันเดียว" : "Custom Day" },
    { value: "range", label: isTH ? "ช่วงวันที่" : "Date Range" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
        <div className="flex items-center text-gray-500">
          <FilterIcon size={18} className="mr-2" />
          <span className="text-sm font-medium">{text.filters}</span>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={selectDate}
            onChange={(e) => {
              const val = e.target.value;
              setSelectDate(val);
              setCustomDate("");
              setRangeFrom("");
              setRangeTo("");
            }}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {presetOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {selectDate === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            />
          )}

          {selectDate === "range" && (
            <>
              <input
                type="date"
                value={rangeFrom}
                max={rangeTo || undefined}
                onChange={(e) => setRangeFrom(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              />
              <span className="text-sm">-</span>
              <input
                type="date"
                value={rangeTo}
                min={rangeFrom || undefined}
                onChange={(e) => setRangeTo(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}