import React, { useState, useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Dispatch, SetStateAction } from 'react';
import { LocationItem } from '@/types/location';
import { getTextFormRoute, useLanguageContext } from '@/app/i18n/translations';
import { Tooltip } from '@mui/material';
import { ArrowDownUp, ArrowRightLeft } from 'lucide-react';

type DragDropProps = {
  listA: LocationItem[],
  listB: LocationItem[],
  setListA?: Dispatch<SetStateAction<LocationItem[]>>,
  setListB: Dispatch<SetStateAction<LocationItem[]>>,
  disable: boolean
}

function DragDrop({ listA, listB, setListB, disable = false }: DragDropProps) {

  const [search, setSearch] = useState<string>("");
  const { isTH } = useLanguageContext();
  const text = getTextFormRoute({ isTH });

  // Filtered display only (ไม่ใช้กับ setList)
  const filteredListA = useMemo(() => {
    if (!search) return listA;
    return listA.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, listA]).filter(
    (itemA) => !listB.some((itemB) => itemB.id === itemA.id)
  );;

  return (
    <div className={`flex gap-5 justify-center lg:justify-between flex-wrap lg:flex-nowrap`}>
      {/* List A */}
      {!disable && (
        <div className="flex flex-col h-[450px] rounded-md w-[250px] sm:w-[300px] md:w-[350px] xl:w-[400px]">
          <p className="text-center text-[12px] font-medium">{text.stList}</p>

          <div className="mt-3 px-3">
            <input
              type="text"
              placeholder={text.search}
              className="px-5 py-1 rounded-md custom-border-gray text-[14px] w-full"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ✅ ทำ list scroll ได้ในพื้นที่ที่เหลือ */}
          <div
            className="mt-4 overflow-y-auto flex-1 min-h-0 scrollbar px-3"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'auto',
            }}
          >
            <ReactSortable
              list={filteredListA}
              setList={() => { }}
              group={{ name: 'shared', pull: true, put: true }}
              animation={200}
              className="min-h-36"
            >
              {filteredListA.length > 0 ? (
                filteredListA.map((item, index) => (
                  <Tooltip title={item.name} key={item.id || index}>
                    <div
                      className={`${filteredListA.length - 1 === index && "rounded-b-md"}
                ${0 === index && "rounded-t-md border-t"} custom-ellipsis-style
                border-b border-r border-l w-full px-4 py-1 border-[#D1D5DB]
                bg-white text-[12px] cursor-pointer`}
                    >
                      {item.name}
                    </div>
                  </Tooltip>
                ))
              ) : (
                <p className="italic text-center text-gray-400 py-4">{"No Data"}</p>
              )}
            </ReactSortable>
          </div>
        </div>
      )}

      {!disable && (
        <Tooltip title={text.Drag} className='self-center w-full lg:w-fit flex justify-center items-center'>
          <div >
            <ArrowRightLeft size={30} className='hidden lg:block' />
            <ArrowDownUp size={30} className='block lg:hidden' />
          </div>
        </Tooltip>

      )}
      {/* List B */}
      <div className={` rounded-md ${disable ? "w-full custom-disable-bg overflow-y-scroll " : "w-[250px] sm:w-[300px] md:w-[350px] xl:w-[400px]"}`}>
        <p className="text-center text-[12px] font-medium">{text.stThis}</p>
        <div className={`mt-5 h-[400px]`}

        >
          <ReactSortable
            list={listB}
            setList={setListB}
            group={{ name: 'shared', pull: true, put: true }} // 👈 ใส่แบบนี้เหมือนกัน
            animation={200}
            className={`${!disable && "h-full border rounded-lg border-gray-300 shadow p-3 overflow-y-scroll scrollbar"} border"`}
            disabled={disable}
            style={{
              overflowY: 'scroll',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'auto',
            }}
          >
            {listB.map((item, index) => (
              <div key={index} className='flex h-8 '>
                <div className={`${listB.length - 1 === index && "rounded-bl-md"} ${0 === index && "rounded-tl-md border-t"} px-4 w-[30px] h-full flex justify-center items-center border-b  border-l ${disable ? "" : "bg-white"} border-[#D1D5DB] text-[12px] cursor-pointer`}>
                  {index + 1}
                </div>
                <Tooltip title={item.name}>
                  <div
                    className={`${listB.length - 1 === index && "rounded-br-md "} ${0 === index && "rounded-tr-md border-t"} custom-ellipsis-style  border-b border-r border-l w-full px-4 py-1  border-[#D1D5DB] ${disable ? "" : "bg-white"} text-[12px] cursor-pointer flex items-center`}
                  >
                    <p className=' custom-ellipsis-style'> {item.name}</p>
                  </div>
                </Tooltip>
              </div>
            ))}
          </ReactSortable>
        </div>
      </div>


    </div>
  )
}

export default DragDrop
