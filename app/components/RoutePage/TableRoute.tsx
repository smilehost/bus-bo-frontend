import React from 'react'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

//mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

//const
import { STATUS } from '@/constants/enum';

//component
import StatusText from '../StatusText';

type RouteData = {
  id: string
  route: string;
  company: string;
  schedule: string;
  time: string;
  ticket_amount: string,
  status: STATUS;
  routeColor: string;
};

type TableRouteProps = {
  rows: RouteData[];
  handleDeleteRoute: ({ route, id }: { route: string, id: number }) => void;
};

function TableRoute({ rows, handleDeleteRoute }: TableRouteProps) {

  const pathname = usePathname();

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
   
  }));

  // Set column widths
  const columnWidths = {
    route: '25%',
    company: '20%',
    schedule: '20%',
    time: '20%',
    tickets: '15%',
    status: '15%',
    action: '25%',
  };

  return (
    <TableContainer component={Paper} className='min-h-[700px]'>
      <Table sx={{ Width: 700 }} aria-label="customized table">
        <TableHead className=''>
          <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
            <StyledTableCell sx={{ width: columnWidths.route }}>Route</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.company }}>Company</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.schedule }}>Schedule</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.time }} className='whitespace-nowrap'>Departure Times</StyledTableCell>
            <StyledTableCell align="center" sx={{ width: columnWidths.tickets }}>Tickets</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.status }}>Status</StyledTableCell>
            <StyledTableCell align="left" sx={{ width: columnWidths.action }}>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index} className={` transition-all duration-300 ease-out hover:bg-blue-50/70 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
            } animate-fade-in`}
            style={{
              animationDelay: `${index * 50}ms`,
              animationDuration: "600ms",
              animationFillMode: "both",
            }}>
              <StyledTableCell align="left">
                <div className='flex gap-3 items-center'>
                  <div className={`w-[8px] h-[32px] rounded-lg flex-shrink-0 `}
                    style={{ backgroundColor: row?.routeColor }}
                  />
                  <p className='whitespace-nowrap custom-ellipsis-style'>{row?.route}</p>
                </div>
              </StyledTableCell>
              <StyledTableCell align="left">{row?.company}</StyledTableCell>
              <StyledTableCell align="left">{row?.schedule}</StyledTableCell>
              <StyledTableCell align="left">{row?.time}</StyledTableCell>
              <StyledTableCell align="center">{row?.ticket_amount}</StyledTableCell>
              <StyledTableCell align="left">
                <StatusText type={row?.status} />
              </StyledTableCell>
              <StyledTableCell align="left">
                <div className='flex gap-2 min-w-max'>
                  <Link href={`${pathname}/routeTicket/${row?.id}`} className='cursor-pointer'>
                    <Image
                      src={"/icons/money.svg"}
                      width={1000}
                      height={1000}
                      alt='icon'
                      priority
                      className='w-[16px] h-[16px]'
                    />
                  </Link>
                  <Link href={`${pathname}/edit/${row?.id}`} className='cursor-pointer'>
                    <Image
                      src={"/icons/edit.svg"}
                      width={1000}
                      height={1000}
                      alt='icon'
                      priority
                      className='w-[16px] h-[16px]'
                    />
                  </Link>
                  <div onClick={() => handleDeleteRoute({ route: row?.route, id: Number(row?.id) })} className='cursor-pointer'>
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
