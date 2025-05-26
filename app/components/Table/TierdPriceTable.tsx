"use client"

import React, { useState, useEffect } from 'react'

//component 
import ButtonBG from '@/app/components/Form/ButtonBG';
import ButtonDefault from '@/app/components/Form/ButtonDefault';

//type 
import { TicketRoutePrice } from '@/types/types';

//api
import { useLocationStore } from '@/stores/locationStore';
import { toast } from 'react-toastify';

interface TierdPriceTableProps {
  ticketPrice: TicketRoutePrice[];
  stations: string[];
  ticketTypePriceName: string;
  ticketTypePriceId: string;
  handleSaveTable: (value: TicketRoutePrice[]) => void;
  setSaveTable: React.Dispatch<React.SetStateAction<number>>;
  saveTable: number
}

function TierdPriceTable({ ticketPrice, stations, ticketTypePriceName, ticketTypePriceId, handleSaveTable, setSaveTable, saveTable }: TierdPriceTableProps) {
  const { locations, getLocations } = useLocationStore();
  useEffect(() => {
    getLocations(1, 1000);
  }, [getLocations]);

  //set price เริ่มต้น
  const [checkFetchData, setCheckFetchData] = useState<boolean>(false)
  useEffect(() => {
    if (checkFetchData) return;
    // แปลง ticketPrice ที่ส่งเข้ามา ให้ map เข้า matrix
    const newMatrix = Array.from({ length: stations.length - 1 }, () =>
      Array(stations.length - 1).fill(NaN)
    );

    ticketPrice.forEach((priceItem) => {
      const fromIndex = stations.indexOf(priceItem.from);
      const toIndex = stations.indexOf(priceItem.to);

      // เฉพาะเมื่อ index มีอยู่ใน stations
      if (fromIndex !== -1 && toIndex !== -1 && toIndex > fromIndex) {
        newMatrix[fromIndex][toIndex - 1] = priceItem.price;
      }
    });

    setCheckFetchData(true)
    setMatrix(newMatrix);
  }, [stations, ticketPrice]);

  const [stationName, setStationName] = useState<string[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      if (!stations || stations.length === 0) return;

      try {
        const stationNameTemp = stations.map((id) => locations.find((s) => Number(s.id) === Number(id)))

        setStationName(
          stationNameTemp
            .map((s) => s?.name)
            .filter((name): name is string => name !== undefined)
        );
      } catch (error) {
        console.error('Error loading station names:', error);
      }
    };

    fetchStations();

  }, [stations, locations]);

  const [rowChecked, setRowChecked] = useState<number[]>([]);
  const [colChecked, setColChecked] = useState<number[]>([]);
  const [rowValue, setRowValue] = useState('');
  const [colValue, setColValue] = useState('');
  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: stations.length - 1 }, () =>
      Array(stations.length - 1).fill(NaN)
    )
  );
  const [errorMatrix, setErrorMatrix] = useState<boolean[][]>(
    Array.from({ length: stations.length - 1 }, () =>
      Array(stations.length - 1).fill(false)
    )
  );

  const toggleCheck = (index: number, type: 'row' | 'col') => {
    const list = type === 'row' ? rowChecked : colChecked;
    const setList = type === 'row' ? setRowChecked : setColChecked;

    if (list.includes(index)) {
      setList(list.filter((i) => i !== index));
    } else {
      setList([...list, index]);
    }
  };

  const applyValues = () => {
    const newMatrix = matrix.map((row) => [...row]);

    const hasRowInput = rowChecked.length > 0 && !!rowValue;
    const hasColInput = colChecked.length > 0 && !!colValue;

    if (!hasRowInput && !hasColInput && !changeMatrix) {
      setShowSave(false);
      return;
    }

    setSaveTable(Number(ticketTypePriceId))
    setShowSave(true)
    rowChecked.forEach((rowIdx) => {
      for (let j = rowIdx; j < stations.length - 1; j++) {
        newMatrix[rowIdx][j] = parseFloat(rowValue);
      }
    });

    colChecked.forEach((colIdx) => {
      for (let i = 0; i <= colIdx; i++) {
        if (i < newMatrix.length && colIdx >= i) {
          newMatrix[i][colIdx] = parseFloat(colValue);
        }
      }
    });

    setMatrix(newMatrix);

    // ✅ Reset input values
    setRowValue('');
    setColValue('');
    setRowChecked([]);
    setColChecked([]);
  };

  const handleSave = () => {
    const newErrors = errorMatrix.map((row) => [...row]);
    let valid = true;

    const updatedPrices: TicketRoutePrice[] = [];

    for (let i = 0; i < stations.length - 1; i++) {
      for (let j = 0; j < stations.length - 1; j++) {
        if (j >= i) {
          const price = matrix[i][j];
          if (isNaN(price)) {
            newErrors[i][j] = true;
            valid = false;
          } else {
            const from = stations[i];
            const to = stations[j + 1];
            const ticketTypeId = ticketTypePriceId

            const existing = ticketPrice.find(
              (item) =>
                item.from === from &&
                item.to === to &&
                item.ticket_price_type_id === ticketTypeId
            );

            updatedPrices.push({
              route_ticket_price_id: existing?.route_ticket_price_id ? existing.route_ticket_price_id.toString() : '', // ตรวจสอบว่า existing?.id เป็น undefined หรือไม่
              from,
              to,
              price,
              ticket_price_type_id: ticketTypeId,
            });
          }
        }
      }
    }

    setErrorMatrix(newErrors);

    setShowSave(false)
    setChangeMatrix(false)

    if (valid) {
      handleSaveTable(updatedPrices); // ส่งขึ้น parent component
    }
  };

  //check input
  const [showSave, setShowSave] = useState<boolean>(false)
  const [changeMatrix, setChangeMatrix] = useState<boolean>(false)

  const checkMatrixChanged = () => {
    for (let i = 0; i < stations.length - 1; i++) {
      for (let j = 0; j < stations.length - 1; j++) {
        if (j >= i) {
          const from = stations[i];
          const to = stations[j + 1];
          const price = matrix[i][j];
          const original = ticketPrice.find(
            (p) =>
              p.from === from &&
              p.to === to &&
              p.ticket_price_type_id === ticketTypePriceId
          );
          if (!original && !isNaN(price)) return true; // ใหม่แต่กรอกแล้ว
          if (original && original.price !== price) return true; // เปลี่ยนจากเดิม
        }
      }
    }
    return false;
  };

  const handleChangeMatrixInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
    j: number,
  ) => {
    if (saveTable && saveTable !== Number(ticketTypePriceId)) {
      toast.error("Please save the previous table first");
      return;
    }

    const cleanedValue = e.target.value.replace(/^0+(?!$)/, '');
    const numericValue = cleanedValue === '' ? 0 : Number(cleanedValue);
    const value = Number(numericValue);

    const newMatrix = [...matrix];
    newMatrix[i][j] = isNaN(value) ? NaN : value;
    setMatrix(newMatrix);

    const changed = checkMatrixChanged();
    setSaveTable(Number(ticketTypePriceId));
    setShowSave(true);
    setChangeMatrix(changed);

    const newErrors = [...errorMatrix];
    newErrors[i][j] = false;
    setErrorMatrix(newErrors);
  };
  // console.log("ticketPrice: ", ticketPrice)
  return (
    <div >
      <p className='mb-2 text-xl font-bold'>{ticketTypePriceName}</p>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label>
          Row Value:{' '}
          <input
            type="number"
            className="custom-border-gray rounded-md p-1 w-20"
            value={rowValue}
            onChange={(e) => setRowValue(e.target.value)}
          />
        </label>
        <label>
          Column Value:{' '}
          <input
            type="number"
            className="custom-border-gray rounded-md p-1 w-20"
            value={colValue}
            onChange={(e) => setColValue(e.target.value)}
          />
        </label>
        <ButtonDefault text='Apply' size='' onClick={applyValues} />
        {showSave && (
          <ButtonBG text='Save Table' size='' onClick={handleSave} />
        )}
      </div>

      {/* Display selection summary */}
      <div className="mb-4 text-sm text-gray-700">
        <p>
          Selected Rows:{' '}
          {rowChecked.map((i) => `${stationName[i]}`).join(', ') || 'None'}
        </p>
        <p>
          Selected Columns:{' '}
          {colChecked.map((i) => `${stationName[i + 1]}`).join(', ') ||
            'None'}
        </p>
      </div>

      <div className=' overflow-auto'>
        <table className="table-auto w-full text-sm">
          <thead>
            <tr>
              <th className="border border-gray-200 px-2 py-1 text-center h-14">location</th>
              {stations.slice(1).map((station, j) => (
                <th key={j} className="border border-gray-200 px-2 py-1 text-center">
                  <label className="flex flex-col items-center space-y-1">
                    <input
                      type="checkbox"
                      checked={colChecked.includes(j)}
                      onChange={() => toggleCheck(j, 'col')}
                    />
                    <div>{stationName[j + 1]}</div>
                  </label>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stations.slice(0, -1).map((from, i) => (
              <tr key={i}>
                <td className="border border-gray-200 px-2 py-1 flex items-center gap-2 h-14">
                  <input
                    type="checkbox"
                    checked={rowChecked.includes(i)}
                    onChange={() => toggleCheck(i, 'row')}
                  />
                  <span className=' max-w-40 xl:max-w-96 custom-ellipsis-style'>{stationName[i]}</span>
                </td>
                {stations.slice(1).map((_, j) => (
                  <td key={j} className="border border-gray-200 px-2 py-1 text-center h-14 ">
                    {j >= i ? (
                      <input
                        type="number"
                        // className={`custom-border-gray rounded-md px-1 py-0.5 w-16 text-center ${errorMatrix[i][j] ? 'border-red-500 bg-red-100' : ''
                        //   }`}
                        className={`custom-border-gray rounded-md px-1 py-0.5 w-16 text-center `}
                        value={
                          !isNaN(matrix[i][j]) ? matrix[i][j].toString() : ''
                        }
                        onWheel={(e) => {
                          (e.target as HTMLInputElement).blur();
                        }} // ปิดการเลื่อน number
                        onChange={(e) => handleChangeMatrixInput(e, i, j)}

                      />
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TierdPriceTable
