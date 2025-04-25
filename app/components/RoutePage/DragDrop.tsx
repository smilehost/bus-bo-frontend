import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { StationProps } from '@/types/stations';
import { Dispatch, SetStateAction } from 'react';


type DragDropProps = {
  listA: StationProps[],
  listB: StationProps[],
  setListA: Dispatch<SetStateAction<StationProps[]>>,
  setListB: Dispatch<SetStateAction<StationProps[]>>,
}

function DragDrop({ listA, listB, setListA, setListB }: DragDropProps) {

  return (
    <div className="flex justify-between flex-wrap">
      {/* List A */}
      <div className="p-4 rounded-md w-[200px] lg:w-[350px] xl:w-[434px]">
        <p className="text-center text-[12px] font-medium">Station List</p>
        <div className=' mt-5'>
          <ReactSortable
            list={listA}
            setList={setListA}
            group={{ name: 'shared', pull: true, put: true }} // 👈 ใส่แบบนี้เหมือนกัน
            animation={200}
            className="min-h-36"
          >
            {listA.map((item, index) => (
              <div
                key={index}
                className={`${listA.length - 1 === index && "rounded-b-md "} ${0 === index && "rounded-t-md border-t"} border-b border-r border-l w-full px-4 py-1  border-[#D1D5DB] bg-white text-[12px] cursor-pointer`}
              >
                {item.name}
              </div>
            ))}
          </ReactSortable>
        </div>
      </div>

      {/* List B */}
      <div className=" p-4 rounded-md w-[200px] lg:w-[350px] xl:w-[434px]">
        <p className="text-center text-[12px] font-medium">Stations this Route</p>
        <div className=' overflow-hidden mt-5'>
          <ReactSortable
            list={listB}
            setList={setListB}
            group={{ name: 'shared', pull: true, put: true }} // 👈 ใส่แบบนี้เหมือนกัน
            animation={200}
            className="min-h-36"
          >
            {listB.map((item, index) => (
              <div key={index} className='flex gap-2'>
                <div className={`${listB.length - 1 === index && "rounded-b-md"} ${0 === index && "rounded-t-md border-t"} w-[30px] h-[30px] flex justify-center items-center border-b border-r border-l bg-white border-[#D1D5DB] text-[12px] cursor-pointer`}>
                  {index + 1}
                </div>
                <div
                  className={`${listB.length - 1 === index && "rounded-b-md "} ${0 === index && "rounded-t-md border-t"} border-b border-r border-l w-full px-4 py-1  border-[#D1D5DB] bg-white text-[12px] cursor-pointer`}
                >
                  {item.name}
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
      </div>


    </div>
  )
}

export default DragDrop
