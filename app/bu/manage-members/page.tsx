"use client";

import React, { useEffect, useState } from "react";

//component
import TitlePage from "@/app/components/Title/TitlePage";
import ButtonBG from "@/app/components/Form/ButtonBG";
import FormFilter from "@/app/components/Filter/FormFilter";
import ItemUser from "@/app/components/MembersPage/ItemUser";
import MemberModel from "@/app/components/Model/MemberModel";

//const
import { FILTER, STATUS } from "@/constants/enum";

//mock
import { useUserStore } from "@/stores/userStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useMemberStore } from "@/stores/memberStore";
import SkeletonMemberPage from "@/app/components/Skeleton/SkeletonMemberPage";

function Page() {
  const { companyData } = useCompanyStore();
  const { membersData } = useMemberStore();
  const { userData } = useUserStore();
  const [isLoadingskeleton, setisLoadIngskeleton] = useState(true); // ✅ loading state
  const [rowsPerPage, setRowsPerPage] = useState(4);

  useEffect(() => {
    // Simulate fetching data (fake delay)
    const timer = setTimeout(() => setisLoadIngskeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  //member data
  const [members, setMembers] = useState(membersData);

  //filter
  const [searchStatus, setSearchStatus] = useState<string>(""); // Filter by status
  const [searchCompany, setSearchCompany] = useState<string>(""); // Filter by company
  const [search, setSearch] = useState<string>(""); // Search input

  const filtered = members.filter((item) => {
    const company =
      companyData.find((com) => com.id === item.member_company_id)?.name || "";
    const matchesStatus =
      searchStatus && searchStatus !== FILTER.ALL_STATUS
        ? item.member_status === searchStatus
        : true;
    const matchesCompany =
      searchCompany && searchCompany !== FILTER.ALL_COMPANIES
        ? company?.toLowerCase().includes(searchCompany.toLowerCase())
        : true;
    const matchesSearch = search
      ? item.member_name.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesStatus && matchesCompany && matchesSearch;
  });

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

  const handleNewMember = ({
    name,
    phone,
  }: {
    name: string;
    phone: string;
  }) => {
    console.log("New Member: ", name, phone);
    const newMember = {
      id: String(Date.now()),
      member_name: name,
      member_phone: phone,
      member_status: STATUS.ACTIVE, // หรือจะกำหนดให้เลือกก็ได้
      member_company_id: userData.company_id, // ตั้งค่า default หรือให้เลือกในฟอร์มภายหลัง
      member_tripsTotal: 0,
      member_lastTransaction: "-",
    };
    setMembers((prev) => [...prev, newMember]);
    handleCloseMemberModel();
  };

  //get Company
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
          {isLoadingskeleton ? <SkeletonMemberPage rows={5} /> :
          <div className="custom-frame-content">
            {filtered?.map((item, index) => {
              const company = getCompanyName({ id: item.member_company_id });
              return (
                <React.Fragment key={index}>
                  <ItemUser
                    name={item.member_name}
                    tel={item.member_phone}
                    status={item.member_status}
                    company={company}
                    tripsTotal={item.member_tripsTotal}
                    lastTransaction={item.member_lastTransaction}
                    index={index}
                  />
                  {index < filtered.length - 1 && (
                    <hr className="border-t border-[#E5E7EB]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          }

          <MemberModel
            open={memberModelOpen}
            onClose={handleCloseMemberModel}
            onHandle={handleNewMember}
          />
        </div>
      
    </>
  );
}

export default Page;
