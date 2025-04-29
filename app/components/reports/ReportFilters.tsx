import { FilterIcon } from 'lucide-react'

const ReportFilters = ({
  dateRange,
  setDateRange,
  groupBy,
  setGroupBy,
  reportType,
  setReportType,
}: {
  dateRange: Record<'start' | 'end', string>;
  setDateRange: (dateRange: Record<'start' | 'end', string>) => void;
  groupBy: string;
  setGroupBy: (groupBy: string) => void;
  reportType: string;
  setReportType: (reportType: string) => void;
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
      {/* Filter Title */}
      <div className="flex items-center text-gray-500">
        <FilterIcon size={18} className="mr-2" />
        <span className="text-sm font-medium">Report Options:</span>
      </div>

      {/* Input / Select Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* From */}
        <div className="flex items-center gap-1">
          <label htmlFor="start-date" className="text-sm text-gray-700">From:</label>
          <input
            type="date"
            id="start-date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-orange-500"
          />
        </div>

        {/* To */}
        <div className="flex items-center gap-1">
          <label htmlFor="end-date" className="text-sm text-gray-700">To:</label>
          <input
            type="date"
            id="end-date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-orange-500"
          />
        </div>

        {/* Group By */}
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-orange-500"
        >
          <option value="day">Group by Day</option>
          <option value="week">Group by Week</option>
          <option value="month">Group by Month</option>
        </select>

        {/* Report Type */}
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-orange-500"
        >
          <option value="overview">Overview</option>
          <option value="company">By Company</option>
          <option value="route">By Route</option>
          <option value="payment">By Payment</option>
        </select>
      </div>
    </div>
  </div>
)

export default ReportFilters
