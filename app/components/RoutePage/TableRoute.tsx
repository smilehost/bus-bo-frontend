import React from 'react'
import Image from 'next/image';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { STATUS } from '@/constants/enum';
type RouteData = {
  route: string;
  company: string;
  schedule: string;
  time: string;
  status: string;
  routeColor: string;
};

type TableRouteProps = {
  rows: RouteData[];
  handleDeleteRoute: ({ route, index }: { route: string, index: number }) => void;
};

function TableRoute({ rows, handleDeleteRoute }: TableRouteProps) {

  //table
  const StyledTableCell = styled(TableCell)(({ }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontSize: 11,
      backgroundColor: "#F9FAFB",
      color: "#6B7280",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      backgroundColor: "white",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  // Set column widths
  const columnWidths = {
    route: '25%',
    company: '20%',
    schedule: '20%',
    time: '20%',
    status: '15%',
    action: '25%',
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
            <StyledTableCell sx={{ width: columnWidths.route }}>Route</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.company }}>Company</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.schedule }}>Schedule</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.time }}>Departure Times</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.status }}>Status</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.action }}>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align="left">
                <div className='flex gap-3 items-center'>
                  <div className={`w-[8px] h-[32px] ${row.routeColor} rounded-lg`} />
                  {row.route}
                </div>
              </StyledTableCell>
              <StyledTableCell align="left">{row.company}</StyledTableCell>
              <StyledTableCell align="left">{row.schedule}</StyledTableCell>
              <StyledTableCell align="left">{row.time}</StyledTableCell>
              <StyledTableCell align="left">
                {row.status === STATUS.ACTIVE ? (
                  <div className='px-2 py-1 bg-[#DCFCE7] rounded-xl w-fit text-[10px]'>
                    {row.status}
                  </div>
                ) : (
                  <div className='px-2 py-1 bg-[#F3F4F6] rounded-xl w-fit text-[10px]'>
                    {row.status}
                  </div>
                )}
              </StyledTableCell>
              <StyledTableCell align="left">
                <div className='flex gap-2 min-w-max'>
                  <div className='cursor-pointer'>
                    <Image
                      src={"/icons/edit.svg"}
                      width={1000}
                      height={1000}
                      alt='icon'
                      priority
                      className='w-[16px] h-[16px]'
                    />
                  </div>
                  <div className='cursor-pointer'>
                    <Image
                      src={"/icons/edit.svg"}
                      width={1000}
                      height={1000}
                      alt='icon'
                      priority
                      className='w-[16px] h-[16px]'
                    />
                  </div>
                  <div onClick={() => handleDeleteRoute({ route: row.route, index: index })} className='cursor-pointer'>
                    <Image
                      src={"/icons/garbage.svg"}
                      width={1000}
                      height={1000}
                      alt='icon'
                      priority
                      className='w-[16px] h-[16px]'
                    />
                  </div>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableRoute
