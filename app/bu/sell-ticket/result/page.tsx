'use client';
import { useRouter } from 'next/navigation';
import { FaBusAlt, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function ResultList() {
  const router = useRouter();
  const results = [
    {
      id: 1,
      name: 'Smile XD.',
      price: 1200,
      route: 'กรุงเทพฯ - ขอนแก่น',
      time: '09:00',
      seats: 1,
      logo: '/smile-logo.png',
    },
    {
      id: 2,
      name: 'Bussing transit',
      price: 800,
      route: 'กรุงเทพฯ - กาฬสินธุ์',
      time: '07:00',
      seats: 10,
      logo: '',
    },
    {
      id: 3,
      name: 'Bussing transit',
      price: 800,
      route: 'กรุงเทพฯ - กาฬสินธุ์',
      time: '12:00',
      seats: 15,
      logo: '',
    },
  ];

  const dates = ['24 เม.ย.', '25 เม.ย.', '26 เม.ย.', '27 เม.ย.'];

  return (
    <div className="min-h-screen bg-gray-100 px-4 ">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">กรุงเทพฯ - สารคาม</h2>
          <p className="text-sm text-gray-500">26 เม.ย. • 1 Guests</p>
        </div>

        {/* Date Selector */}
        <div className="flex flex-wrap gap-2">
          {dates.map((d, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-lg border text-sm ${
                i === 1 ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700'
              }`}
            >
              {d}
            </button>
          ))}
          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center gap-2 text-sm">
            <FaCalendarAlt /> ปฏิทิน
          </button>
        </div>

        {/* Result Cards */}
        <div className="space-y-4">
          {results.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl shadow p-4 w-full flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {r.logo ? (
                  <Image src={r.logo} alt="logo" width={36} height={36} className="rounded-full" />
                ) : (
                  <FaBusAlt className="text-orange-500 text-2xl" />
                )}
                <div>
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-sm text-gray-500">
                    รอบ {r.time} / จำนวนตั๋วคงเหลือ {r.seats} ใบ
                  </p>
                </div>
              </div>

              <div className="mt-2 md:mt-0 text-center">
                <p className="text-sm text-gray-600">{r.route}</p>
                <p className="text-lg font-bold text-orange-600">
                  THB {r.price.toLocaleString()} <span className="text-sm font-normal">/ ตั๋ว</span>
                </p>
              </div>

              <button
                onClick={() => router.push('/bu/sell-ticket/payment')}
                className="mt-3 md:mt-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-5 py-2 rounded-md hover:opacity-90"
              >
                เลือก
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
