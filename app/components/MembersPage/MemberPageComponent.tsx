"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import SearchFilter from "@/app/components/SearchFilter/MemberSearchFilter";
// import MemberTable from "@/app/components/Table/MemberTable";
import MemberModal from "@/app/components/Model/MemberModal";
import EditPasswordModel from "@/app/components/Model/EditMemberPassModal";
import EditStatusModel from "@/app/components/Model/EditMemberStatusModal";
import SkeletonMemberPage from "@/app/components/Skeleton/SkeletonMemberPage";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import { debounce } from "@/utils/debounce";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";
import { useMemberStore } from "@/stores/memberStore";
import { useCompanyStore } from "@/stores/companyStore";
import { STATUS_LABELS, FILTER, USER_TIER } from "@/constants/enum";
import { MemberItem } from "@/types/member";
import TitlePage from "@/app/components/Title/TitlePage";
import TableActionButton from "@/app/components/Table/TableActionButton/TableActionButton";
import StatusText from "@/app/components/StatusText";
import TableTemplate, {
  ColumnConfig,
} from "@/app/components/Table/TableTemplate";
import { ToastContainer } from "react-toastify";
import { Eye, Lock } from "lucide-react";
import { getTextManageUserPage, useLanguageContext } from '@/app/i18n/translations';
import FormFilter from "../Filter/FormFilter";
import { statusOptions } from "@/constants/options";

export interface MemberTableData {
  no: number;
  name: string;
  company: string;
  role: string;
  status: number;
  username: string;
  id: string;
}

export interface MemberPageComponentProps {
  comId?: number;
}

export default function MemberPageComponent({
  comId,
}: MemberPageComponentProps) {
  const {
    members,
    getMembers,
    createMember,
    updateMember,
    getMemberByComId,
    clearMember,
  } = useMemberStore();
  const { companies, getCompanies } = useCompanyStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState<FILTER>(FILTER.ALL_STATUS);
  const [searchCompany, setSearchCompany] = useState<FILTER>(
    FILTER.ALL_COMPANIES
  );
  const [filteredMembers, setFilteredMembers] = useState<MemberItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);

  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditStatusOpen, setEditStatusOpen] = useState(false);
  const [isEditPasswordOpen, setEditPasswordOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
  const { isTH, isSuperAdmin } = useLanguageContext();
  const text = getTextManageUserPage({ isTH, isSuperAdmin });

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  const fetchMembers = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingSkeleton);
    if (comId) {
      await getMemberByComId(comId);
    } else {
      await getMembers(1, 50, "", "");
    }
    cancelSkeleton();
  };

  useEffect(() => {
    fetchMembers();
    getCompanies(1, 10);

    return () => {
      clearMember();
    };
  }, []);

  useEffect(() => {
    let temp = [...members];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      temp = temp.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q)
      );
    }
    if (searchStatus !== FILTER.ALL_STATUS) {
      temp = temp.filter(
        (m) => STATUS_LABELS[m.status] === searchStatus.toString()
      );
    }
    if (searchCompany !== FILTER.ALL_COMPANIES) {
      temp = temp.filter(
        (m) => m.companyId?.toString() === searchCompany.toString()
      );
    }
    setFilteredMembers(temp);
    setTotalResults(temp.length);
    setCurrentPage(1);
  }, [debouncedSearch, searchStatus, searchCompany, members, companies]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedFetch(e.target.value);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getCompanyName = (id: string) =>
    companies.find((c) => c.id.toString() === id)?.name || "-";

  const handleCreateOrUpdate = async (data: {
    id?: string;
    name: string;
    username: string;
    companyId: string;
    role: string;
    password?: string;
    status: number;
  }) => {
    try {
      setIsModalOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const isConfirmed = await Confirm({
        title: data.id ? "Confirm Update" : "Confirm Create",
        text: data.id
          ? "Do you want to update this member?"
          : "Do you want to create this member?",
        confirmText: data.id ? "Update" : "Create",
        cancelText: "Cancel",
        type: "question",
      });

      if (!isConfirmed) return;

      if (data.id) {
        await updateMember(data.id, {
          ...data,
          companyId: Number(data.companyId),
        } as MemberItem);
        await Alert({
          title: "Updated!",
          text: "Member updated.",
          type: "success",
        });
      } else {
        await createMember({
          username: data.username,
          password: data.password || "",
          name: data.name,
          role: data.role,
        });
        await Alert({
          title: "Created!",
          text: "Member created.",
          type: "success",
        });
      }

      fetchMembers();
    } catch (err) {
      console.error(err);
      await Alert({
        title: "Error!",
        text: "Failed to save member.",
        type: "error",
      });
    }
  };

  const handleEditStatus = async (newStatus: number) => {
    if (!selectedMember) return;

    const isConfirmed = await Confirm({
      title: "Confirm Status Change",
      text: "Do you want to update the status?",
      confirmText: "Update",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;

    try {
      await useMemberStore
        .getState()
        .changeStatus(selectedMember.id, newStatus);
      await Alert({
        title: "Updated!",
        text: "Status changed.",
        type: "success",
      });
      fetchMembers();
    } catch (error) {
      console.error("Status update error:", error);
      await Alert({
        title: "Error!",
        text: "Failed to change status.",
        type: "error",
      });
    }

    setEditStatusOpen(false);
  };

  const handleEditPassword = async (userId: string, newPassword: string) => {
    const isConfirmed = await Confirm({
      title: "Confirm Password Change",
      text: "Do you want to change the password?",
      confirmText: "Update",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;

    try {
      await useMemberStore.getState().changePassword(userId, newPassword);
      await Alert({
        title: "Updated!",
        text: "Password changed.",
        type: "success",
      });
    } catch (error) {
      console.error("Password update error:", error);
      await Alert({
        title: "Error!",
        text: "Failed to change password.",
        type: "error",
      });
    }

    setEditPasswordOpen(false);
  };

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredMembers.slice(start, end).map((m) => ({
      id: m.id,
      name: m.name,
      username: m.username,
      role: m.role,
      status: m.status,
      company: getCompanyName(m.companyId.toString()),
      com_id: m.companyId,
    }));
  }, [filteredMembers, currentPage, rowsPerPage]);

  const handleAddMember = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  //add no index
  const paginatedCompaniesWithNo = paginated.map((member, index) => ({
    ...member,
    no: (currentPage - 1) * rowsPerPage + index + 1,
  }));

  //action functions
  const onEditStatus = (id: string | number) => {
    const found = members.find((m) => m.id === id);
    if (found) {
      setSelectedMember(found);
      setEditStatusOpen(true);
    }
  };

  const onEditPassword = (id: string | number) => {
    const found = members.find((m) => m.id === id);
    if (found) {
      setSelectedMember(found);
      setEditPasswordOpen(true);
    }
  };

  const handleEditMember = (id: string | number) => {
    const found = members.find((m) => m.id === id);
    if (found) {
      setEditingMember(found);
      setIsModalOpen(true);
    }
  };


  //table columns
  const columns: ColumnConfig<MemberTableData>[] = [
    {
      key: 'no',
      label: text.number,
      width: '5%',
    },
    {
      key: 'name', label: text.name, width: '20%',
    },
    {
      key: 'username', label: text.userName, width: '20%',
    },
    {
      key: 'company', label: text.com, width: '20%',
    },
    {
      key: 'role', label: text.role, width: '20%',
      render: (_, row) => (
        <p>
          {Number(row.role) === 1 ? USER_TIER.ADMIN : USER_TIER.SUPER_ADMIN}
        </p>
      ),
    },
    {
      key: 'status',
      label: text.status,
      width: '15%',
      render: (_, row) => (
        <div className="cursor-pointer" onClick={() => onEditStatus(row.id)}>
          <StatusText id={Number(row.status)} />
        </div>
      ),
    },
    {
      key: 'id',
      label: text.action,
      width: '25%',
      align: 'right',
      render: (_, row) => (
        <div className="flex gap-2 min-w-max justify-end">
          <TableActionButton
            onClick={() => onEditPassword(row.id)}
            icon={
              <Lock className={`custom-size-tableAction-btn text-yellow-700`} />
            }
            bgColor="bg-yellow-100 text-yellow-400"
            hoverColor="hover:bg-yellow-100"
            title={text.ChangePassword}
          />
          <TableActionButton
            onClick={() => handleEditMember(row.id)}
            icon={
              <Eye className={`custom-size-tableAction-btn text-green-700`} />
            }
            bgColor="bg-green-100 text-green-500"
            hoverColor="hover:bg-green-100"
            title={text.view}
          />
        </div>
      ),
    },
  ];

  //filter
  const filterSearch = [
    {
      defaulteValue: FILTER.ALL_STATUS,
      listValue: statusOptions,
      setSearchValue: setSearchStatus,
      size: "w-[130px]",
    },
  ];

  // console.log("paginatedCompaniesWithNo: ", paginatedCompaniesWithNo)
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="flex-1 flex flex-col p-0">
        <TitlePage title={text.title} description={text.description} btnText={text.btnText} handleOpenModel={handleAddMember} />
        <div className="bg-white rounded-md shadow p-5 mt-5">
          <FormFilter
            setSearch={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            placeholderSearch={"Search by name or phone..."}
            filter={filterSearch}
            search={searchTerm}
          />
          {/* <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            statusFilter={searchStatus}
            setStatusFilter={(value: string) =>
              setSearchStatus(value as FILTER)
            }
            companyFilter={searchCompany}
            setCompanyFilter={(value: string) =>
              setSearchCompany(value as FILTER)
            }
            companies={companies}
          /> */}

          {isLoadingSkeleton ? (
            <SkeletonMemberPage rows={5} />
          ) : (
            <div className="w-full overflow-x-auto">
              <TableTemplate
                columns={columns}
                data={paginatedCompaniesWithNo}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalResults={totalResults}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowKey={(row) => row.id}
              />
            </div>
          )}
        </div>

        {/* ✅ Responsive modal ส่วนล่างยังคงใช้ได้ */}
        <MemberModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onHandle={handleCreateOrUpdate}
          editingMember={
            editingMember
              ? {
                ...editingMember,
                id: editingMember.id.toString(),
                companyId: editingMember.companyId.toString(),
              }
              : undefined
          }
        />
        <EditStatusModel
          open={isEditStatusOpen}
          onClose={() => setEditStatusOpen(false)}
          currentStatus={selectedMember?.status || 1}
          onSave={handleEditStatus}
        />
        <EditPasswordModel
          open={isEditPasswordOpen}
          onClose={() => setEditPasswordOpen(false)}
          userId={selectedMember?.id || ""}
          onSave={handleEditPassword}
        />
      </div>
    </div>
  );
}
