"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import TitlePage from "@/app/components/Title/TitlePage";
import ButtonBG from "@/app/components/Form/ButtonBG";
import SearchFilter from "@/app/components/SearchFilter/MemberSearchFilter";
import MemberTable from "@/app/components/Table/MemberTable";
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
import { STATUS_LABELS, FILTER } from "@/constants/enum";
import { MemberItem } from "@/types/member";

export default function ManageMembersPage() {
  const { members, getMembers, createMember, updateMember } = useMemberStore();
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

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  const fetchMembers = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingSkeleton);
    await getMembers(1, 9999); // โหลดทั้งหมดครั้งเดียว
    cancelSkeleton();
  };

  useEffect(() => {
    fetchMembers();
    getCompanies(1, 10);
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
      temp = temp.filter((m) => STATUS_LABELS[m.status] === searchStatus.toString());
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
      await new Promise((resolve) => setTimeout(resolve, 100));

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
    }));
  }, [filteredMembers, currentPage, rowsPerPage]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <TitlePage
            title="Manage Members"
            description="View and manage customer information"
          />
          <ButtonBG
            size="h-[38px]"
            text="Add New Member"
            icon="/icons/plus.svg"
            onClick={() => {
              setEditingMember(null);
              setIsModalOpen(true);
            }}
          />
        </div>

        <div className="bg-white rounded-md shadow p-5">
          <SearchFilter
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
          />

          {isLoadingSkeleton ? (
            <SkeletonMemberPage rows={5} />
          ) : (
            <MemberTable
              members={paginated}
              currentPage={currentPage}
              totalPages={Math.ceil(totalResults / rowsPerPage)}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              totalResults={totalResults}
              onEditStatus={(id, status) => {
                const found = members.find((m) => m.id === id);
                if (found) {
                  setSelectedMember(found);
                  setEditStatusOpen(true);
                }
              }}
              onEditPassword={(id) => {
                const found = members.find((m) => m.id === id);
                if (found) {
                  setSelectedMember(found);
                  setEditPasswordOpen(true);
                }
              }}
              onEditMember={(id) => {
                const found = members.find((m) => m.id === id);
                if (found) {
                  setEditingMember(found);
                  setIsModalOpen(true);
                }
              }}
            />
          )}
        </div>

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
