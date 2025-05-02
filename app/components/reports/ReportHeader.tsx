import { PrinterIcon, DownloadIcon, RefreshCcwIcon } from 'lucide-react'

const ReportHeader = () => (
  <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      <p className="text-gray-600">Generate and view detailed reports</p>
    </div>

    {/* ปุ่มต่าง ๆ */}
    <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <PrinterIcon size={16} />
        Print
      </button>
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <DownloadIcon size={16} />
        Export CSV
      </button>
      <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
        <RefreshCcwIcon size={16} />
        Refresh Data
      </button>
    </div>
  </div>
)

export default ReportHeader
