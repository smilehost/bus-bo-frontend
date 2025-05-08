'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { HiOutlineArrowDown } from 'react-icons/hi';

export default function SellTicketPage() {
  const router = useRouter();
  const [from, setFrom] = useState('บขส กรุงเทพ');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  });

  const handleSearch = () => {
    if (!from || !to) return;
    router.push('/bu/sell-ticket/result');
  };

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-5 space-y-5">
        <div>
          <h1 className="text-xl font-bold">ซื้อตั๋ว</h1>
          <p className="text-gray-500 text-sm">ค้นหาเส้นทางขาขึ้นล่วงหน้า</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-md font-semibold text-gray-700">เส้นทาง</h2>

          <div>
            <label className="block mb-1 text-sm text-gray-700">จาก</label>
            <div className="flex items-center border rounded px-3">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-2 focus:outline-none"
              >
                <option>บขส กรุงเทพ</option>
                <option>หมอชิต 2</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <HiOutlineArrowDown className="text-gray-400 text-xl" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">ถึง</label>
            <div className="flex items-center border rounded px-3">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-2 focus:outline-none"
              >
                <option value="">เลือกจุดลง</option>
                <option>มหาสารคาม</option>
                <option>กาฬสินธุ์</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Date</label>
            <div className="flex items-center border rounded px-3">
              <span role="img" className="text-blue-500 mr-2">
                📅
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full py-2 text-white font-semibold rounded bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90"
          >
            ค้นหา
          </button>
        </div>
      </div>
    </div>
  );
}
