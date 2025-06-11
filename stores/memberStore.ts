import { create } from "zustand";
import { MemberItem } from "@/types/member";
import {
  CreateMemberPayload,
  UpdateMemberPayload,
  FetchMemberQuery,
} from "@/payloads/member.payload";
import { MemberService } from "@/services/member.service";

interface MemberStore {
  members: MemberItem[];
  total: number;
  isLoading: boolean;

  getMembers: (
    page: number,
    size: number,
    search?: string,
    status?: string,
    companyId?: string
  ) => Promise<void>;

  getMemberByComId: (
    com_id?: number
  ) => Promise<void>;

  createMember: (member: CreateMemberPayload) => Promise<void>;
  updateMember: (id: string, member: Partial<MemberItem>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMemberById: (id: string) => Promise<MemberItem | undefined>;
  changePassword: (userId: number, newPassword: string) => Promise<void>;
  changeStatus: (userId: string, newStatus: number) => Promise<void>; // ✅ เพิ่มเมธอด
  clearMember: () => void;
}

export const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  total: 0,
  isLoading: false,

  getMembers: async (page, size, search, status) => {
    set({ isLoading: true });
    try {
      const query: FetchMemberQuery = {
        page,
        size,
        search: search,
        status: status,
      };
      const res = await MemberService.fetchMembers(query);
      const rawData = (res as { result: { data: any[] } })?.result?.data || [];
      const totalCount = (res as { total?: number }).total !== undefined ? (res as { total?: number }).total : rawData?.length;

      const mapped: MemberItem[] = rawData.map((item: any) => ({
        id: item.account_id.toString(),
        username: item.account_username,
        name: item.account_name,
        role: item.account_role,
        status: item.account_status,
        com_id: item.account_com_id,
        company: item.company
      }));

      set({ members: mapped, total: totalCount });
    } catch (error) {
      console.error("getMembers error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getMemberByComId: async (com_id) => {
    set({ isLoading: true });
    try {
      const query: FetchMemberQuery = {
        com_id
      };
      const res = await MemberService.fetchMemberByComId(query);
      const rawData = (res as { result: any[] })?.newResult || [];
      const totalCount = (res as { total?: number }).total !== undefined ? (res as { total?: number }).total : rawData?.length;

      const mapped: MemberItem[] = rawData.map((item: any) => ({
        id: item.account_id.toString(),
        username: item.account_username,
        name: item.account_name,
        role: item.account_role,
        status: item.account_status,
        com_id: item.account_com_id,
        company: item.company
      }));

      set({ members: mapped, total: totalCount });
    } catch (error) {
      console.error("getMembers error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createMember: async (member) => {
    await MemberService.createMember(member);
  },

  updateMember: async (id, member) => {
    const payload: UpdateMemberPayload = {
      account_id: parseInt(id, 10),
      account_name: member.name!,
      // account_username: member.username,
    };
    await MemberService.updateMember(id, payload);
  },

  deleteMember: async (id) => {
    await MemberService.deleteMember(id);
  },

  getMemberById: async (id) => {
    try {
      const res = await MemberService.fetchMemberById(id);
      const item = (res as { result: any }).result;
      return {
        id: item.account_id.toString(),
        username: item.account_username,
        name: item.account_name,
        role: item.account_role,
        status: item.account_status,
        com_id: item.account_com_id,
      };
    } catch (error) {
      console.error("getMemberById error:", error);
      return undefined;
    }
  },

  changePassword: async (userId: number, newPassword: string) => {
    try {
      await MemberService.changePassword(userId, newPassword);
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  changeStatus: async (userId: string, newStatus: number) => {
    try {
      await MemberService.changeStatus(userId, newStatus);
    } catch (error) {
      console.error("Change status error:", error);
      throw error;
    }
  },

  clearMember: () => {
    set({
      members: [],
      total: 0,
    });
  },
}));
