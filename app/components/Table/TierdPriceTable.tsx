"use client"

import React, { useState } from 'react'

//component 
import ButtonBG from '@/app/components/Form/ButtonBG';
import ButtonDefault from '@/app/components/Form/ButtonDefault';

function TierdPriceTable() {

    const stations = ['A', 'B', 'C', 'D', 'E', 'F'];

    // const params = useParams();
    // console.log(params.id)
  
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
    const [resultJSON, setResultJSON] = useState<string | null>(null);
  
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
      const result: { from: string; to: string; price: number }[] = [];
  
      for (let i = 0; i < stations.length - 1; i++) {
        for (let j = 0; j < stations.length - 1; j++) {
          if (j >= i) {
            const price = matrix[i][j];
            if (isNaN(price)) {
              newErrors[i][j] = true;
              valid = false;
            } else {
              result.push({
                from: stations[i],
                to: stations[j + 1],
                price,
              });
            }
          }
        }
      }
  
      setErrorMatrix(newErrors);
      if (valid) {
        setResultJSON(JSON.stringify(result, null, 2));
      } else {
        setResultJSON(null);
        alert('❌ กรุณากรอกราคาทุกช่องก่อนกด Save');
      }
    };

    // console.log(resultJSON)
    return (
        <div>
            <p className='mb-2 font-medium'>Student</p>
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
                <ButtonBG text='Save' size='' onClick={handleSave} />
            </div>

            {/* Display selection summary */}
            <div className="mb-4 text-sm text-gray-700">
                <p>
                    Selected Rows:{' '}
                    {rowChecked.map((i) => `Station ${stations[i]}`).join(', ') || 'None'}
                </p>
                <p>
                    Selected Columns:{' '}
                    {colChecked.map((i) => `Station ${stations[i + 1]}`).join(', ') ||
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
                                        <div>Station {station}</div>
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
                                    <span>Station {from}</span>
                                </td>
                                {stations.slice(1).map((_, j) => (
                                    <td key={j} className="border border-gray-200 px-2 py-1 text-center h-14 ">
                                        {j >= i ? (
                                            <input
                                                type="number"
                                                className={`custom-border-gray rounded-md px-1 py-0.5 w-16 text-center ${errorMatrix[i][j] ? 'border-red-500 bg-red-100' : ''
                                                    }`}
                                                value={
                                                    !isNaN(matrix[i][j]) ? matrix[i][j].toString() : ''
                                                }
                                                onChange={(e) => {
                                                    const value = parseFloat(e.target.value);
                                                    const newMatrix = [...matrix];
                                                    newMatrix[i][j] = isNaN(value) ? NaN : value;
                                                    setMatrix(newMatrix);

                                                    const newErrors = [...errorMatrix];
                                                    newErrors[i][j] = false;
                                                    setErrorMatrix(newErrors);
                                                }}
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
