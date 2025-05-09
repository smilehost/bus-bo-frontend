import React, { useState, useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Dispatch, SetStateAction } from 'react';
import { LocationItem } from '@/types/location.type';

type DragDropProps = {
  listA: LocationItem[],
  listB: LocationItem[],
  setListA: Dispatch<SetStateAction<LocationItem[]>>,
  setListB: Dispatch<SetStateAction<LocationItem[]>>,
  disable: boolean
}

function DragDrop({ listA, listB, setListA, setListB, disable = false }: DragDropProps) {

  const [search, setSearch] = useState<string>("");

  // ใช้ useMemo เพื่อ filter listA ตามคำ search
  const filteredListA = useMemo(() => {
    if (!search) return listA;
    return listA.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, listA]);

  return (
    <div className={`flex gap-10 justify-center flex-wrap`}>
      {/* List A */}
      {!disable && (
        <div className=" p-4  h-[350px] rounded-md w-[200px] lg:w-[350px] xl:w-[434px]">
          <p className="text-center text-[12px] font-medium">Station List</p>
          <div className='mt-3'>
            <input
              type={"text"}
              placeholder={"Search Station..."}
              className={` px-5 py-1 rounded-md custom-border-gray text-[14px] w-full`}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className=' mt-4 overflow-y-scroll h-full'>
            <ReactSortable
              list={listA}
              setList={setListA}
              group={{ name: 'shared', pull: true, put: true }} // 👈 ใส่แบบนี้เหมือนกัน
              animation={200}
              className="min-h-36"
            >
              {filteredListA.map((item, index) => (
                <div
                  key={item.id || index}
                  className={`${filteredListA.length - 1 === index && "rounded-b-md"
                    } ${0 === index && "rounded-t-md border-t"} custom-ellipsis-style border-b border-r border-l w-full px-4 py-1 border-[#D1D5DB] bg-white text-[12px] cursor-pointer`}
                >
                  {item.name}
                </div>
              ))}
            </ReactSortable>
          </div>
        </div>
      )}

      {/* List B */}
      <div className={` p-4 rounded-md ${disable ? "w-full custom-disable-bg":"w-[200px] lg:w-[350px] xl:w-[434px]"}`}>
        <p className="text-center text-[12px] font-medium">Stations this Route</p>
        <div className=' overflow-hidden mt-5 h-[350px] overflow-y-scroll'>
          <ReactSortable
            list={listB}
            setList={setListB}
            group={{ name: 'shared', pull: true, put: true }} // 👈 ใส่แบบนี้เหมือนกัน
            animation={200}
            className="min-h-36"
            disabled = {disable}
          >
            {listB.map((item, index) => (
              <div key={index} className='flex gap-2'>
                <div className={`${listB.length - 1 === index && "rounded-b-md"} ${0 === index && "rounded-t-md border-t"} w-[30px] h-[30px] flex justify-center items-center border-b border-r border-l ${disable ? "":"bg-white"} border-[#D1D5DB] text-[12px] cursor-pointer`}>
                  {index + 1}
                </div>
                <div
                  className={`${listB.length - 1 === index && "rounded-b-md "} ${0 === index && "rounded-t-md border-t"} custom-ellipsis-style  border-b border-r border-l w-full px-4 py-1  border-[#D1D5DB] ${disable ? "":"bg-white"} text-[12px] cursor-pointer`}
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
