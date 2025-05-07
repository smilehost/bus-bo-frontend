export default function FinalBill() {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center  p-4">
        <div className="bg-white max-w-md w-full rounded-xl shadow-md p-6 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
  
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-gray-800">ขายตั๋วสำเร็จแล้ว!</h2>
            <p className="text-sm text-gray-500 mt-1">
              ตั๋วได้ถูกออกเรียบร้อยแล้ว <br /> ดำเนินการเสร็จสิ้นและพร้อมนำส่งผู้โดยสารแล้ว
            </p>
          </div>
  
          {/* Summary */}
          <div className="bg-gray-50 border rounded-lg p-4 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">เส้นทาง:</span>
              <span className="font-medium text-gray-800">กรุงเทพฯ - ขอนแก่น</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">จาก:</span>
              <span className="font-medium text-gray-800">Central Station</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ถึง:</span>
              <span className="font-medium text-gray-800">North Terminal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">จำนวนผู้โดยสาร:</span>
              <span className="font-medium text-gray-800">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">การชำระเงิน:</span>
              <span className="font-medium text-gray-800">เงินสด</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold text-lg">
              <span>ราคารวม:</span>
              <span>1,200</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  