import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

//component 
import Pagination from '../Pagination/Pagination';

export type ColumnConfig<T> = {
    key: keyof T;
    label: string;
    align?: 'left' | 'right' | 'center';
    width?: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableTemplateProps<T> = {
    columns: ColumnConfig<T>[];
    data: T[];
    rowKey?: (row: T, index: number) => string | number;
    totalPages?: number;
    totalResults?: number;
    currentPage?: number;
    rowsPerPage?: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    loading?: boolean;
};

const StyledTableCell = styled(TableCell)(() => ({
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

function TableTemplate<T>({
    columns,
    data,
    rowKey,
    totalPages,
    totalResults,
    currentPage,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}: TableTemplateProps<T>) {
    return (
        <div className=" bg-white rounded-lg shadow-xs mt-5 flex flex-col items-center overflow-hidden">
            <TableContainer component={Paper} className='min-h-[700px]'>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col, index) => (
                                <StyledTableCell
                                    key={index}
                                    align={col.align || 'left'}
                                    sx={{ width: col.width }}
                                >
                                    {col.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, rowIndex) => (
                            <StyledTableRow
                                key={rowKey?.(row, rowIndex) || rowIndex}
                                className={`transition-all duration-300 ease-out hover:bg-blue-50/70 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                    } animate-fade-in`}
                                style={{
                                    animationDelay: `${rowIndex * 50}ms`,
                                    animationDuration: '600ms',
                                    animationFillMode: 'both',
                                }}
                            >
                                {columns.map((col, colIndex) => (
                                    <StyledTableCell key={colIndex} align={col.align || 'left'}>
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : (row[col.key] as React.ReactNode)}
                                    </StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {(onPageChange && onRowsPerPageChange) && (
                <div className='mt-5 w-full'>
                    <Pagination
                        currentPage={currentPage || 1}
                        totalPages={totalPages || 0}
                        onPageChange={onPageChange}
                        rowsPerPage={rowsPerPage || 10}
                        onRowsPerPageChange={onRowsPerPageChange}
                        totalResults={totalResults || 0}
                    />
                </div>
            )}
        </div>
    );
}

export default TableTemplate;

