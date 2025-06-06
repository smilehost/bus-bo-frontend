"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//component
import InputLabel from "../Form/InputLabel";
import TitleModel from "../Title/TitleModel";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";
import { EyeIcon } from "../Icons/EyeIcon";

//utils
import { createSecurePassword } from "@/utils/generatePassword";
import LabelText from "../Form/LabelText";

//store
import { useUserStore } from "@/stores/userStore";
import { useCompanyStore } from "@/stores/companyStore";
import { CopyIcon } from "../Icons/CopyIcon";
import { CompanyItem } from "@/types/company";
import { getTextManageUserPage, useLanguageContext } from "@/app/i18n/translations";
import { store } from "@/stores/store";
import { USER_TIER } from "@/constants/enum";

type CompanyOption = {
  value: string;
  label: string;
};

type MemberModalProps = {
  open: boolean;
  onClose: () => void;
  onHandle: (member: {
    id?: string;
    name: string;
    username: string;
    companyId: string;
    role: string;
    password?: string;
    status: number;
  }) => void;
  editingMember?: {
    id: string;
    name: string;
    username: string;
    role: string;
    companyId: string;
    status: number
  };
};

function MemberModal({
  open,
  onClose,
  onHandle,
  editingMember,
}: MemberModalProps) {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [company, setCompany] = useState<CompanyItem>();
  const [role, setRole] = useState<string>("2"); // Default to Salesman
  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([
    { value: "", label: "Select a company" },
  ]);

  //store
  const { userData } = useUserStore();
  const { getCompanyById, getCompanies, companies } = useCompanyStore();
  const { isTH, isSuperAdmin } = useLanguageContext();
  const text = getTextManageUserPage({ isTH, isSuperAdmin });
  const account_role = store.account_role.use();
  const com_id = store.com_id.use();

  //get company by id
  useEffect(() => {
    const fetchCompany = async () => {
      const data = await getCompanyById(userData.company_id.toString());
      setCompany(data);
    };

    if (userData?.company_id) {
      fetchCompany();
    }
  }, [userData?.company_id]);

  const isEditing = !!editingMember;

  const roleOptions = account_role === "1" ? [{ value: "2", label: USER_TIER.ADMIN }] : [{ value: "3", label: USER_TIER.SALESMAN }];

  const fetchCompanies = async () => {
    await getCompanies(1, 999, "");
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      const mapped = companies.map((com: any) => ({
        value: com.id.toString(),
        label: com.name,
      }));
      setCompanyOptions([
        { value: "", label: text.seCom },
        ...mapped,
      ]);
    };

    if (open) fetchCompanies();
  }, [open, companies]);

  useEffect(() => {
    if (open && !isEditing) {
      const timer = setTimeout(() => {
        setUsername("");
        setPassword("");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, isEditing]);

  useEffect(() => {
    if (isEditing && editingMember) {
      setName(editingMember.name);
      setUsername(editingMember.username);
      setRole(editingMember.role);
      setCompanyId(editingMember.companyId);
      setPassword("");
    } else {
      setName("");
      setUsername("");
      setPassword("");
      setRole("");
      setCompanyId("");
    }
  }, [editingMember, isEditing, open]);

  const handleSubmit = () => {
    if (!name || (!isEditing && (!username || !password) || !role)) {
      if (account_role === "1" && !companyId) {
        toast.error("Please select a company.");
        return
      }
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 8 && !isEditing) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    const payload = isEditing
      ? {
        id: editingMember?.id,
        name,
        username: `${company?.prefix}-${editingMember?.username}` || "",
        role: editingMember?.role || "3",
        companyId: Number(account_role) === 1 ? editingMember?.companyId : com_id.toString(),
        status: editingMember?.status,
      }
      : {
        name,
        username: `${company?.prefix}-${username}` || "",
        password,
        companyId: Number(account_role) === 2 && com_id.toString() || companyId,
        role: role,
        status: 1,
      };

    onHandle(payload);

    // setName("");
    // setUsername("");
    // setPassword("");
    // setRole("");
    // setCompanyId("");
  };

  const genPassword = (length: number) => {
    const newPassword = createSecurePassword(length);
    setPassword(newPassword);
  };

  //handle  password
  const [typePassword, setTypePassword] = useState<boolean>(true);
  const [isCopy, setIsCopy] = useState<boolean>(false);

  //change type input in password
  const handleOpenPassword = () => {
    setTypePassword(!typePassword);
    setIsCopy(false);
  };

  //copy
  const copyPassword = () => {
    if (!password) return;
    navigator.clipboard
      .writeText(password)
      .then(() => {
        setIsCopy(true);
      })
      .catch((err) => {
        console.error("Failed to copy password: ", err);
      });
  };

  //check isCopy
  useEffect(() => {
    setIsCopy(false);
  }, [password]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="w-[448px] py-2 relative">
          <TitleModel
            title={isEditing ? text.editMem : text.btnText}
            description={
              isEditing
                ? "Update the member details below"
                : text.fillIn
            }
          />
          <div className="mt-7 flex flex-col gap-4">
            <InputLabel
              label={text.name}
              placeholder={text.enterMem}
              type="text"
              value={name}
              setValue={setName}
            />
            <div className="flex flex-col gap-2">
              <LabelText text={text.userName} />
              <div className="flex gap-2">
                <div
                  className={`h-[38px] px-5 rounded-md custom-border-gray text-[14px] flex justify-center items-center`}
                >
                  {company?.prefix}
                </div>
                <input
                  value={username}
                  type={"text"}
                  placeholder={text.enterUser}
                  className={`h-[38px] px-5 rounded-md custom-border-gray text-[14px] w-full`}
                  onChange={(e) => {
                    const input = e.target.value;
                    const englishOnly = input.replace(/[^a-zA-Z0-9]/g, ''); // กรองให้เหลือแค่ a-z, A-Z, 0-9
                    setUsername(englishOnly);
                  }}
                />
              </div>
            </div>

            {!isEditing && (
              <div className="relative">
                <InputLabel
                  label={
                    <div className="flex justify-between">
                      <p>{text.passWord}</p>
                      <div
                        className=""
                        onClick={() => {
                          genPassword(8);
                        }}
                      >
                        <p className="" style={{ fontSize: "14px" }}>
                          {text.genPassword}
                        </p>
                      </div>
                    </div>
                  }
                  placeholder={text.enterPass}
                  type={typePassword ? "password" : "text"}
                  value={password}
                  setValue={setPassword}
                  autoComplete="new-password"
                />
                <div className="absolute bottom-2 right-4 flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={handleOpenPassword}
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <EyeIcon visible={typePassword} />
                  </button>
                  <button
                    type="button"
                    onClick={copyPassword}
                    className={`${isCopy ? "text-green-600" : "text-gray-500"
                      } hover:text-green-700 transition-colors`}
                  >
                    <CopyIcon copied={isCopy} />
                  </button>
                </div>
              </div>
            )}
            {account_role === "1" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {text.com}
                </label>
                <select
                  disabled={isEditing}
                  className={`${isEditing && "bg-gray-200"} w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500`}
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                >
                  {companyOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.value === ""}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">{text.role}</label>
              <select
                disabled={isEditing}
                className={`${isEditing && "bg-gray-200"} w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value={""}>
                  Select Role
                </option>
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-7">
            <ButtonDefault size="" text={text.cancelText} onClick={onClose} />
            <ButtonBG
              size=""
              text={isEditing ? text.editMem : text.addMem}
              onClick={handleSubmit}
            />
          </div>

          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={onClose}
          >
            <Image
              src={"/icons/close.svg"}
              width={24}
              height={24}
              priority
              alt="close-icon"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MemberModal;
