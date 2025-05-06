'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaMoneyBillWave, FaQrcode } from 'react-icons/fa';

export default function PaymentForm() {
  const router = useRouter();
  const [paymentType, setPaymentType] = useState<'cash' | 'qr'>('cash');

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">ซื้อตั๋ว</h1>
          <p className="text-sm text-gray-500">ค้นหาเส้นทางขาขึ้นล่วงหน้า</p>
        </div>

        {/* กล่อง: ข้อมูลเส้นทาง */}
        <div className="space-y-2 border rounded-md p-4 bg-gray-50">
          <p className="text-sm text-gray-500">เส้นทาง</p>
          <div className="text-sm text-gray-700">
            <div>ต้นทาง: กรุงเทพ - ขอนแก่น</div>
            <div>จาก: กรุงเทพ</div>
            <div>ถึง: มหาสารคาม</div>
            <div className="font-semibold text-orange-600 mt-1">ราคาต่อใบ : 1,200 บาท</div>
          </div>
        </div>

        {/* กล่อง: ข้อมูลผู้โดยสาร */}
        <div className="space-y-4 border rounded-md p-4 bg-gray-50">
          <p className="text-sm text-gray-500">ข้อมูลผู้โดยสาร</p>
          <div>
            <label className="block text-sm mb-1">จำนวนผู้โดยสาร</label>
            <input
              type="number"
              defaultValue={1}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">เบอร์โทร</label>
            <input type="text" placeholder="เบอร์โทร" className="w-full border p-2 rounded text-sm" />
          </div>
        </div>

        {/* กล่อง: การชำระเงิน */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500">การชำระเงิน</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentType('cash')}
              className={`flex-1 flex items-center justify-center gap-2 border p-2 rounded text-sm ${
                paymentType === 'cash' ? 'bg-orange-500 text-white font-semibold' : 'text-gray-700'
              }`}
            >
              <FaMoneyBillWave /> ชำระเงินสด
            </button>
            <button
              onClick={() => setPaymentType('qr')}
              className={`flex-1 flex items-center justify-center gap-2 border p-2 rounded text-sm ${
                paymentType === 'qr' ? 'bg-orange-500 text-white font-semibold' : 'text-gray-700'
              }`}
            >
              <FaQrcode /> การชำระเงินด้วย QR
            </button>
          </div>

          {paymentType === 'qr' && (
            <div className="flex justify-center">
              <img
                src="/qr-placeholder.png"
                alt="qr"
                className="w-40 h-40 object-contain border rounded"
              />
            </div>
          )}
        </div>

        <button
          className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
          onClick={() => router.push('/bu/sell-ticket/bill')}
        >
          ยืนยันการจอง
        </button>
      </div>
    </div>
  );
}
