"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { debounce } from "@/utils/debounce";

//companent 
import { ConfirmWithInput } from '@/app/components/Dialog/ConfirmWithInput'
import FormFilter from '@/app/components/Filter/FormFilter'
import TableTemplate, { ColumnConfig } from '@/app/components/Table/TableTemplate'
import StatusText from '@/app/components/StatusText'
import SkeletonRoute from '@/app/components/Skeleton/SkeletonRoute'
import { withSkeletonDelay } from '@/app/components/Skeleton/withSkeletonDelay'

//store
import { useDeviceStore } from '@/stores/deviceStore';

//toast
import { toast } from 'react-toastify'

//const 
import { statusOptions } from '@/constants/options'
import { STATUS, FILTER } from '@/constants/enum'
import { Confirm } from '@/app/components/Dialog/Confirm';

//icons
import TitlePage from '@/app/components/Title/TitlePage';
import TableActionButton from '@/app/components/Table/TableActionButton/TableActionButton';
import { InsertDevice } from '@/payloads/device.payload';
import { SquarePen, Trash2 } from 'lucide-react';

export interface DeviceTable {
    id: number,
    no: number,
    com_id: number,
    com_name: string,
    dv_serial: string,
    dv_status: number,
}

export interface DevicePageProps {
    comId: number
}

function DevicePage({ comId }: DevicePageProps) {

    //api
    const { devices, addDevice, getDevices, updateDeviceStatus, updateDevice, deleteDevice, clearDevices } = useDeviceStore();

    const [searchStatus, setSearchStatus] = useState<string>(''); // Filter by status
    const [search, setSearch] = useState<string>(''); // Search input
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);

    //clear
    useEffect(() => {
        return () => {
            clearDevices()
        };
    }, []);

    //fetch routes from store
    const fetchDeviceData = async () => {
        const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
        await getDevices(currentPage, rowsPerPage, debouncedSearch, searchStatus, comId);
        cancelSkeleton();
    }

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);
        setRowsPerPage(newSize);
        setCurrentPage(1);
    };


    // Function to create data for table
    const createData = (
        no: number,
        id: number,
        com_id: number,
        com_name: string,
        dv_serial: string,
        dv_status: number,
    ): DeviceTable => {
        return { no, id, com_id, com_name, dv_serial, dv_status };
    };

    // Generate rows for table
    const [rows, setRows] = useState<DeviceTable[]>([]);
    useEffect(() => {
        const isReady = devices?.data?.devices?.length;
        if (!isReady) {
            setRows([])
            return
        };
        const deviceCom = devices?.data

        const fetchWithTicketCounts = async () => {
            const newRows = await Promise.all(
                deviceCom?.devices?.map(async (item, index) => {
                    return createData(
                        index + 1, // no
                        item.device_id, //id
                        item.device_com_id, // company id (example)
                        deviceCom.com_name, // company name (example)
                        item.device_serial_number, // serial number (example)
                        item.device_status // status
                    );
                })
            );
            setRows(newRows);
        };
        fetchWithTicketCounts();

    }, [devices]);

    // Handle delete route
    const handleDeleteDevice = async ({ name, id }: { name: string, id: number }) => {
        const inputName = await ConfirmWithInput({
            title: `Delete "${name}"?`,
            text: `Please type the route name below to confirm deletion.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            placeholder: "Type route name here"
        });

        if (inputName === name) {
            const result = await deleteDevice(id);
            if (result.success) {
                fetchDeviceData();
                toast.success("delete device successfully!");
            } else {
                toast.error(`Error: ${result.message}`);
            }
        } else if (inputName !== null) {
            toast.error("ไมวะ.");
        }
    };

    // Handle Change Status
    const handleChangeStatus = async ({ idStatus, id }: { idStatus: string, id: number }) => {
        const currentStatus = Number(idStatus);
        const nextStatus = currentStatus === 1 ? 0 : 1;
        const statusText = nextStatus === 1 ? STATUS.ACTIVE : STATUS.INACTIVE;

        const isStatusConfirmed = await Confirm({
            title: "Change Status?",
            text: `Do you want to change the status to "${statusText}"`,
            confirmText: "Confirm",
            cancelText: "Cancel",
        });

        if (isStatusConfirmed) {
            const result = await updateDeviceStatus(id, nextStatus);
            if (result.success) {
                toast.success("Change status sucessfuly!")
                fetchDeviceData();
            } else {
                toast.error(`Change status error: ${result.message}`)
            }
        }
    };

    //model add or edit
    const handleDevice = async ({ id, name }: { id?: number, name?: string }) => {
        const isConfirmed = await ConfirmWithInput({
            title: `${id ? "Edit Device" : "Add New Device"}`,
            text: `Fill in the serial number below.`,
            confirmText: "Confirm",
            cancelText: "Cancel",
            placeholder: "Serial Number",
            defaultValue: name || ""  // ใส่ค่า name ถ้ามี, ไม่งั้นเป็น empty string
        });

        if (isConfirmed) {
            const inputName = isConfirmed.trim();

            if (!inputName) {
                toast.error("Name cannot be empty");
                return;
            }

            const formatPayload: InsertDevice = {
                device_serial_number: inputName,
            };

            if (id) {

                const result = await updateDevice(id, formatPayload);
                if (result.success) {
                    toast.success("Updated successfully!");
                } else {
                    toast.error(`Update failed: ${result.message}`);
                }
            } else {
                if (comId) {
                    formatPayload.device_com_id = comId;
                }

                // เพิ่มใหม่ (ไม่ส่ง id)
                const result = await addDevice(formatPayload);
                if (result.success) {
                    toast.success("Created successfully!");
                } else {
                    toast.error(`Creation failed: ${result.message}`);
                }
            }
            fetchDeviceData();
        }
    };

    //for add
    const handleDeviceOpenModel = () => {
        handleDevice({});
    };

    //filter
    const filterSearch = [
        {
            defaulteValue: FILTER.ALL_STATUS,
            listValue: statusOptions,
            setSearchValue: setSearchStatus,
            size: "w-[130px]",
        },

    ];

    //search
    useEffect(() => {
        fetchDeviceData();
    }, [debouncedSearch, searchStatus, currentPage, rowsPerPage])

    const debouncedFetch = useCallback(
        debounce((value: string) => {
            setDebouncedSearch(value);
        }, 350),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedFetch(e.target.value);
    };

    //table columns
    const columns: ColumnConfig<DeviceTable>[] = [
        {
            key: 'no',
            label: 'No',
            width: '5%',
        },
        {
            key: 'com_name', label: 'Company Name', width: '20%',
        },
        {
            key: 'dv_serial', label: 'Serial Number', width: '20%'
        },
        {
            key: 'dv_status',
            label: 'Status',
            width: '15%',
            render: (_, row) => (
                <div className='cursor-pointer'
                    onClick={() => handleChangeStatus({ idStatus: String(row.dv_status), id: Number(row.id) })}
                >
                    <StatusText id={Number(row.dv_status)} />
                </div>
            ),
        },
        {
            key: 'id',
            label: 'Action',
            width: '25%',
            align: 'right',
            render: (_, row) => (
                <div className='flex gap-2 min-w-max justify-end'>
                    <TableActionButton
                        onClick={() => handleDevice({ id: row.id, name: row.dv_serial })}
                        icon={<SquarePen className={`custom-size-tableAction-btn text-blue-500`} />}
                        bgColor="bg-blue-50 text-blue-600"
                        hoverColor="hover:bg-blue-100"
                    />
                    <TableActionButton
                        onClick={() => handleDeleteDevice({ name: row.dv_serial, id: row.id })}
                        icon={<Trash2 className={`custom-size-tableAction-btn text-red-600`} />}
                        bgColor="bg-red-50 text-red-600"
                        hoverColor="hover:bg-red-100"
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <TitlePage title='Manage Device' description='View and manage device' btnText='Add New Device' handleOpenModel={handleDeviceOpenModel} />
            <div className='custom-frame-content p-5 mt-5'>
                <FormFilter
                    setSearch={(value: string) =>
                        handleSearchChange({
                            target: { value },
                        } as React.ChangeEvent<HTMLInputElement>)
                    }
                    placeholderSearch='Search device...'
                    filter={filterSearch}
                    search={search}
                />
                {isLoadingskeleton ? <SkeletonRoute /> :
                    <TableTemplate
                        columns={columns}
                        data={rows}
                        currentPage={currentPage}
                        rowsPerPage={rowsPerPage}
                        totalPages={devices?.totalPages}
                        totalResults={devices?.total}
                        onPageChange={setCurrentPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowKey={(row) => row.id}
                    />
                }
            </div>

        </>
    )
}

export default DevicePage
