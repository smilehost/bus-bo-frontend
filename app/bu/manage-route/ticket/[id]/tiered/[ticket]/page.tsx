"use client"

// import React, { useState } from 'react';

//components
import TitleHeader from '@/app/components/Title/TitleHeader';
import TierdPriceTable from '@/app/components/Table/TierdPriceTable';

export type TieredPriceType = {
  from: string,
  to: string,
  price: number
}

export default function Home() {

  // const [tieredPriceList, setTieredPriceList] = useState<TieredPriceType[]>([])

  return (
    <div className="overflow-x-auto">
      <TitleHeader text='Set Tiered Price' />

      {/* Input controls */}
      <div className='bg-white rounded-lg shadow-xs mt-5 py-7 px-10'>
        <TierdPriceTable />
      </div>
    </div>
  );
}