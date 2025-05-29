"use client";

import React, { useEffect, useState, useCallback } from "react";
// import CompanyTable from "@/app/components/Table/CompanyTable";
import CompanyModal from "@/app/components/Model/CompanyModal";
// import SearchFilter from "@/app/components/SearchFilter/CompanySearchFilter";
import SkeletonCompanyTable from "@/app/components/Skeleton/SkeletonCompanyTable";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import { debounce } from "@/utils/debounce";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";
import { useCompanyStore } from "@/stores/companyStore";
import TitlePage from "@/app/components/Title/TitlePage";
import TableActionButton from "@/app/components/Table/TableActionButton/TableActionButton";
import StatusText from "@/app/components/StatusText";
import TableTemplate, { ColumnConfig } from "@/app/components/Table/TableTemplate";
import { usePathname } from "next/navigation";
import FormFilter from "@/app/components/Filter/FormFilter";
import CompanyTable from "@/app/components/Table/CompanyTable";
import axios from "axios";
import { store } from "@/stores/store";
import { jwtDecode } from "jwt-decode";
import EnterPassModal from "@/app/components/Model/EnterPassModal";

export interface CompanyTableData {
  no: number;
  id: string;
  name: string;
  prefix: string;
  status: number;
}
type DecodedToken = {
  account_id: number;
  account_role: string;
  com_id: number;
  login_at: number;
  iat: number;
  exp: number;
};

export default function ManageCompaniesPage() {
  const {
    companies,
    isLoading,
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
  } = useCompanyStore();

  //pathName
  const pathName = usePathname();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);

  const fetchCompanies = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingSkeleton);
    await getCompanies(currentPage, rowsPerPage, debouncedSearch);
    cancelSkeleton();
  };

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, rowsPerPage, debouncedSearch]);

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };
  const handleDeleteCompany = async (id: string) => {
    const isConfirmed = await Confirm({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this company?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!isConfirmed) return;

    try {
      await deleteCompany(id);
      await Alert({
        title: "Deleted!",
        text: "Company deleted.",
        type: "success",
      });
      fetchCompanies();
    } catch (error) {
      console.error("Delete error:", error);
      await Alert({
        title: "Error!",
        text: "Failed to delete.",
        type: "error",
      });
    }
  };

  const handleEditCompany = (id: string) => {
    const found = companies.find((c) => c.id === id);
    if (found) setEditingCompany(found);
    setIsModalOpen(true);
  };

  const handleSaveCompany = async (data: {
    name: string;
    prefix: string;
    status: number;
  }) => {
    const isConfirmed = await Confirm({
      title: editingCompany ? "Confirm Update" : "Confirm Create",
      text: editingCompany
        ? "Do you want to update this company?"
        : "Do you want to create this company?",
      confirmText: editingCompany ? "Update" : "Create",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;

    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, {
          id: editingCompany.id,
          name: data.name,
          prefix: data.prefix,
          status: data.status,
        });
        await Alert({
          title: "Updated!",
          text: "Company updated.",
          type: "success",
        });
      } else {
        await createCompany({
          name: data.name,
          prefix: data.prefix,
          status: data.status,
        });
        await Alert({
          title: "Created!",
          text: "Company created.",
          type: "success",
        });
      }

      setIsModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error("Save error:", error);
      await Alert({
        title: "Error!",
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  // const handleDeleteCompany = async (id: string) => {
  //   const isConfirmed = await Confirm({
  //     title: "Confirm Delete",
  //     text: "Are you sure you want to delete this company?",
  //     confirmText: "Delete",
  //     cancelText: "Cancel",
  //     type: "warning",
  //   });

  //   if (!isConfirmed) return;

  //   try {
  //     await deleteCompany(id);
  //     await Alert({
  //       title: "Deleted!",
  //       text: "Company deleted.",
  //       type: "success",
  //     });
  //     fetchCompanies();
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //     await Alert({
  //       title: "Error!",
  //       text: "Failed to delete.",
  //       type: "error",
  //     });
  //   }
  // };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedFetch(e.target.value);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
    setCurrentPage(1);
  };

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );
  const paginatedCompanies = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const paginatedCompaniesWithNo = paginatedCompanies.map((company, index) => ({
    ...company,
    no: (currentPage - 1) * rowsPerPage + index + 1,
  }));
  const [error, setError] = useState<string | null>(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );

  const onLoginAsCompany = async (com_id: number, password: string) => {
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          username: "admin57",
          // password : 'G1@ugO37ir',
          // username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const authHeader = response.headers["authorization"];
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1].trim();
        store.token.set(token);

        const decoded = jwtDecode<DecodedToken>(token);
        store.com_id.set(com_id);
        store.account_id.set(decoded.account_id);
        store.account_role.set(decoded.account_role);
        window.open("/bu/dashboard", "_blank");
        // shell.openExternal('localhost:3000/bu/dashboard');

      } else {
        setError("Login failed: No token received");
      }
    } catch (err) {
      setError("Login failed: Invalid credentials");
      console.error("Login error:", err);
    }
  };


  //table columns
  const columns: ColumnConfig<CompanyTableData>[] = [
    {
      key: 'no',
      label: 'No.',
      width: '5%',
    },
    {
      key: 'name', label: 'Company Name', width: '20%',
    },
    {
      key: 'prefix', label: 'Prefix', width: '20%',
    },

    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (_, row) => (
        <StatusText id={Number(row.status)} />
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
            onClick={() => handleEditCompany(row.id)}
            iconSrc="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
          />
          <TableActionButton
            href={`${pathName}/manage-device`}
            iconSrc="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
            bgColor="bg-orange-100 text-orange-400"
            hoverColor="hover:bg-orange-100"
          />
          <TableActionButton
            href={`${pathName}/manage-admin`}
            iconSrc="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
          />
          <TableActionButton
            iconSrc="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
            bgColor="bg-green-100 text-green-600"
            hoverColor="hover:bg-green-100"
          />
          <TableActionButton
          onClick={() => {
            setSelectedCompanyId(Number(row.id));
            setShowPassModal(true);
          }}
            iconSrc="M15.75 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-1.5 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
          />
        </div>
      ),
    },
  ];
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-0">
        <TitlePage title="Manage Companies" description="View and manage bus companies" btnText='Add New Company' handleOpenModel={handleAddCompany} />
        <div className="bg-white rounded-md shadow p-5 mt-5">
          <FormFilter
            setSearch={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            placeholderSearch='Search by company.'
            search={searchTerm}
          />
          {isLoadingSkeleton ? (
            <SkeletonCompanyTable rows={5} />
          ) : (
            // <CompanyTable
            //   companies={paginatedCompanies}
            //   onEdit={handleEditCompany}
            //   onDelete={handleDeleteCompany}
            //   currentPage={currentPage}
            //   onPageChange={setCurrentPage}
            //   rowsPerPage={rowsPerPage}
            //   onRowsPerPageChange={handleRowsPerPageChange}
            //   totalResults={filtered.length}
            //   isLoading={isLoading}
            // />
            <TableTemplate
              columns={columns}
              data={paginatedCompaniesWithNo}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalResults={filtered.length}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowKey={(row) => row.id}
            />
            
          )}
        </div>

      </div>

      {isModalOpen && (
        <CompanyModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCompany}
          editingCompany={
            editingCompany
              ? {
                name: editingCompany.name,
                prefix: editingCompany.prefix,
                status: editingCompany.status,
              }
              : undefined
          }
        />
      )}
      <EnterPassModal
              isOpen={showPassModal}
              onClose={() => setShowPassModal(false)}
              onSubmit={(password) => {
                if (selectedCompanyId !== null) {
                  onLoginAsCompany(selectedCompanyId, password);
                  setShowPassModal(false);
                }
              }}
            />
    </div>
  );
}
