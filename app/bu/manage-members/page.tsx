"use client";

import React, { useEffect, useState } from "react";
import TitlePage from "@/app/components/Title/TitlePage";
import ButtonBG from "@/app/components/Form/ButtonBG";
import FormFilter from "@/app/components/Filter/FormFilter";
import MemberTable from "@/app/components/Table/MemberTable";
import MemberModel from "@/app/components/Model/MemberModal";

//const
import { FILTER, STATUS } from "@/constants/enum";

//mock
import { useUserStore } from "@/stores/userStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useMemberStore } from "@/stores/memberStore";
import SkeletonMemberPage from "@/app/components/Skeleton/SkeletonMemberPage";
import EditPasswordModel from "@/app/components/Model/EditMemberPassModal";
import EditStatusModel from "@/app/components/Model/EditMemberStatusModal";

function Page() {
  const { companyData } = useCompanyStore();
  const { membersData } = useMemberStore();
  const { userData } = useUserStore();
  const [isLoadingskeleton, setisLoadIngskeleton] = useState(true); 
  const [rowsPerPage, setRowsPerPage] = useState(4);

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
    const matchSearch = search
      ? item.member_name.toLowerCase().includes(search.toLowerCase())
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

  //handle memberModel
  const [memberModelOpen, setMemberModelOpen] = useState(false);
  const handleOpenMemberModel = () => setMemberModelOpen(true);
  const handleCloseMemberModel = () => setMemberModelOpen(false);

  //handle edit status modal
  const [isEditStatusOpen, setEditStatusOpen] = useState(false);
  const [isEditPasswordOpen, setEditPasswordOpen] = useState(false); // Added state for EditPasswordModel
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const handleEditStatus = (newStatus: string) => {
    console.log("Status updated to:", newStatus);
    setEditStatusOpen(false);
  };

  const handleEditPassword = (newPassword: string) => {
    console.log("Password updated to:", newPassword);
    setEditPasswordOpen(false);
  };

  const handleNewMember = ({
    name,
    phone,
  }: {
    name: string;
    phone: string;
  }) => {
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
    setMemberModelOpen(false);
  };

  const handleEditStatus = (newStatus: string) => {
    if (selectedMemberId === null) return;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === String(selectedMemberId) ? { ...m, member_status: newStatus as STATUS } : m
      )
    );
    setEditStatusOpen(false);
  };

  const handleEditPassword = (newPassword: string) => {
    console.log("Updated password:", newPassword);
    setEditPasswordOpen(false);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getCompanyName = ({ id }: { id: string }) => {
    return companyData.find((com) => com.id === id)?.name || "";
  };

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <TitlePage
            title="Manage Members"
            description="View and manage customer information"
          />
          <ButtonBG
            size="h-[38px]"
            text="Add New Member"
            icon="/icons/plus.svg"
            onClick={handleOpenMemberModel}
          />
        </div>

        <FormFilter
          setSearch={setSearch}
          placeholderSearch="Search by phone or name..."
          filter={filterSearch}
        />
        {isLoadingskeleton ? (
          <SkeletonMemberPage rows={5} />
        ) : (
          <div className="custom-frame-content">
            {filtered?.map((item, index) => {
              const company = getCompanyName({ id: item.member_company_id });
              return (
                <React.Fragment key={index}>
                  <MemberTable
                    name={item.member_name}
                    tel={item.member_phone}
                    status={item.member_status}
                    company={company}
                    tripsTotal={item.member_tripsTotal}
                    lastTransaction={item.member_lastTransaction}
                    index={index}
                    currentPage={1}
                    totalPages={Math.ceil(filtered.length / rowsPerPage)}
                    onPageChange={(page) =>
                      console.log("Page changed to:", page)
                    }
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(rows) => setRowsPerPage(rows)}
                    totalResults={filtered.length}
                    onEditPassword={(id) =>
                      console.log("Edit password for:", id)
                    }
                    onEditStatus={(id, status) =>
                      console.log("Edit status for:", id, "to", status)
                    }
                  />
                  {index < filtered.length - 1 && (
                    <hr className="border-t border-[#E5E7EB]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <MemberModel
          open={memberModelOpen}
          onClose={handleCloseMemberModel}
          onHandle={handleNewMember}
        />
        <EditStatusModel
          open={isEditStatusOpen}
          onClose={() => setEditStatusOpen(false)}
          currentStatus={(currentStatus as STATUS) || STATUS.ACTIVE}
          onSave={handleEditStatus}
        />

        <EditPasswordModel
          open={isEditPasswordOpen}
          onClose={() => setEditPasswordOpen(false)}
          onSave={handleEditPassword}
        />
      </div>
    </>
  );
}

export default Page;