"use client";

import React, { useEffect, useState, useCallback } from "react";
import TitlePage from "@/app/components/Title/TitlePage";
import ButtonBG from "@/app/components/Form/ButtonBG";
import FormFilter from "@/app/components/Filter/FormFilter";
import MemberTable from "@/app/components/Table/MemberTable";
import MemberModel from "@/app/components/Model/MemberModal";
import { useUserStore } from "@/stores/userStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useMemberStore } from "@/stores/memberStore";
import SkeletonMemberPage from "@/app/components/Skeleton/SkeletonMemberPage";
import EditPasswordModel from "@/app/components/Model/EditMemberPassModal";
import EditStatusModel from "@/app/components/Model/EditMemberStatusModal";
import { STATUS, FILTER } from "@/constants/enum";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import { debounce } from "@/utils/debounce"; 
import SearchFilter from "@/app/components/SearchFilter/MemberSearchFilter";

function Page() {
  const { companyData } = useCompanyStore();
  const { membersData } = useMemberStore();
  const { userData } = useUserStore();

  const [isLoadingskeleton, setIsLoadingSkeleton] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [members, setMembers] = useState(membersData);

  const [searchStatus, setSearchStatus] = useState<string>("");
  const [searchCompany, setSearchCompany] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState(search); // ✅ state เพิ่มเติม

  const [memberModelOpen, setMemberModelOpen] = useState(false);
  const [isEditStatusOpen, setEditStatusOpen] = useState(false);
  const [isEditPasswordOpen, setEditPasswordOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ debounce function
  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingSkeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = members.filter((item) => {
    const companyName =
      companyData.find((com) => com.id === item.member_company_id)?.name || "";
    const matchStatus =
      searchStatus && searchStatus !== FILTER.ALL_STATUS
        ? item.member_status === searchStatus
        : true;
    const matchCompany =
      searchCompany && searchCompany !== FILTER.ALL_COMPANIES
        ? companyName.toLowerCase().includes(searchCompany.toLowerCase())
        : true;
    const matchSearch = debouncedSearch
      ? item.member_name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        item.member_phone.toLowerCase().includes(debouncedSearch.toLowerCase())
      : true;
    return matchStatus && matchCompany && matchSearch;
  });

  const totalResults = filtered.length;
  const totalPages = Math.ceil(totalResults / rowsPerPage);
  const paginatedMembers = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const listCompany = companyData.map((item) => item.name);
  const listStatus = [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.CANCELLED];

  const filterSearch = [
    {
      defaulteValue: FILTER.ALL_STATUS,
      listValue: listStatus,
      setSearchValue: setSearchStatus,
      size: "w-[130px]",
    },
    {
      defaulteValue: FILTER.ALL_COMPANIES,
      listValue: listCompany,
      setSearchValue: setSearchCompany,
      size: "w-[170px]",
    },
  ];

  const handleNewMember = async ({
    name,
    phone,
  }: {
    name: string;
    phone: string;
  }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMemberModelOpen(false);
    try {
      const isConfirmed = await Confirm({
        title: "Confirm Create",
        text: "Do you want to create this member?",
        confirmText: "Create",
        cancelText: "Cancel",
        type: "question",
      });
      if (!isConfirmed) return;
      const newMember = {
        id: String(Date.now()),
        member_name: name,
        member_phone: phone,
        member_status: STATUS.ACTIVE,
        member_company_id: userData.company_id,
        member_tripsTotal: 0,
        member_lastTransaction: "-",
      };
      setMembers((prev) => [...prev, newMember]);
      await Alert({
        title: "Created!",
        text: "Member created successfully",
        type: "success",
      });
    } catch (err) {
      await Alert({
        title: "Error!",
        text: "Failed to create member.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMember = async ({
    id,
    name,
    phone,
  }: {
    id: number;
    name: string;
    phone: string;
  }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMemberModelOpen(false);
    try {
      const isConfirmed = await Confirm({
        title: "Confirm Update",
        text: "Do you want to update this member?",
        confirmText: "Update",
        cancelText: "Cancel",
        type: "question",
      });
      if (!isConfirmed) return;
      setMembers((prev) =>
        prev.map((m) =>
          m.id === String(id)
            ? { ...m, member_name: name, member_phone: phone }
            : m
        )
      );
      await Alert({
        title: "Updated!",
        text: "Member updated successfully",
        type: "success",
      });
    } catch (err) {
      await Alert({
        title: "Error!",
        text: "Failed to update member.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStatus = async (newStatus: string) => {
    if (selectedMemberId === null || isSubmitting) return;
    setIsSubmitting(true);
    setEditStatusOpen(false);
    try {
      const isConfirmed = await Confirm({
        title: "Confirm Status Change",
        text: `Do you want to change status to ${newStatus}?`,
        confirmText: "Update",
        cancelText: "Cancel",
        type: "question",
      });
      if (!isConfirmed) return;
      setMembers((prev) =>
        prev.map((m) =>
          m.id === String(selectedMemberId)
            ? { ...m, member_status: newStatus as STATUS }
            : m
        )
      );
      await Alert({
        title: "Updated!",
        text: "Member status updated successfully",
        type: "success",
      });
    } catch (err) {
      await Alert({
        title: "Error!",
        text: "Failed to update status.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPassword = async (newPassword: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setEditPasswordOpen(false);
    try {
      const isConfirmed = await Confirm({
        title: "Confirm Password Change",
        text: "Do you want to update the password?",
        confirmText: "Update",
        cancelText: "Cancel",
        type: "question",
      });
      if (!isConfirmed) return;
      console.log("Updated password:", newPassword);
      await Alert({
        title: "Updated!",
        text: "Password updated successfully",
        type: "success",
      });
    } catch (err) {
      await Alert({
        title: "Error!",
        text: "Failed to update password.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getCompanyName = ({ id }: { id: string }) => {
    return companyData.find((com) => com.id === id)?.name || "";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <TitlePage
            title="Manage Members"
            description="View and manage customer information"
          />
          <ButtonBG
            text="Add New Member"
            icon="/icons/plus.svg"
            onClick={() => {
              setEditingMember(null);
              setMemberModelOpen(true);
            }}
            size="h-[38px]"
            disbled={isSubmitting}
          />
        </div>

        <div className="bg-white rounded-md shadow p-5">
          <SearchFilter
            searchTerm={search}
            setSearchTerm={(e) => {
              const value = typeof e === "string" ? e : e.target.value;
              setSearch(value);
              debouncedFetch(value);
            }}
            statusFilter={searchStatus}
            setStatusFilter={setSearchStatus}
            companyFilter={searchCompany} // ✅ ส่งค่า companyFilter
            setCompanyFilter={setSearchCompany} // ✅ ส่งฟังก์ชัน setCompanyFilter
          />

          {isLoadingskeleton ? (
            <SkeletonMemberPage rows={5} />
          ) : (
            <MemberTable
              members={paginatedMembers.map((m) => ({
                id: Number(m.id),
                name: m.member_name,
                tel: m.member_phone,
                status: m.member_status,
                company: getCompanyName({ id: m.member_company_id }),
                tripsTotal: m.member_tripsTotal,
                lastTransaction: m.member_lastTransaction,
              }))}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              totalResults={totalResults}
              onEditStatus={(id, status) => {
                if (!isSubmitting) {
                  setSelectedMemberId(id);
                  setCurrentStatus(status);
                  setEditStatusOpen(true);
                }
              }}
              onEditPassword={(id) => {
                if (!isSubmitting) {
                  setSelectedMemberId(id);
                  setEditPasswordOpen(true);
                }
              }}
              onEditMember={(id) => {
                if (!isSubmitting) {
                  const memberToEdit = members.find((m) => m.id === String(id));
                  if (memberToEdit) {
                    setEditingMember({
                      id: Number(memberToEdit.id),
                      name: memberToEdit.member_name,
                      phone: memberToEdit.member_phone,
                    });
                    setMemberModelOpen(true);
                  }
                }
              }}
            />
          )}
        </div>

        <MemberModel
          open={memberModelOpen}
          onClose={() => !isSubmitting && setMemberModelOpen(false)}
          onHandle={async (member) => {
            if (member.id) {
              await handleEditMember({ ...member, id: member.id as number });
            } else {
              await handleNewMember(member);
            }
          }}
          editingMember={editingMember}
        />

        <EditStatusModel
          open={isEditStatusOpen}
          onClose={() => !isSubmitting && setEditStatusOpen(false)}
          currentStatus={(currentStatus as STATUS) || STATUS.ACTIVE}
          onSave={handleEditStatus}
        />

        <EditPasswordModel
          open={isEditPasswordOpen}
          onClose={() => !isSubmitting && setEditPasswordOpen(false)}
          onSave={handleEditPassword}
        />
      </div>
    </div>
  );
}

export default Page;
