import { api } from "@/services/axios.service";
import {
  FetchMemberQuery,
  CreateMemberPayload,
  UpdateMemberPayload,
} from "@/payloads/member.payload";

export const MemberService = {
  async fetchMembers(query: FetchMemberQuery) {
    return await api.get({
      path: "/accounts",
      query: query as unknown as Record<string, string | number>,
    });
  },

  async fetchMemberByComId(query: FetchMemberQuery) {
    return await api.get({
      path: "/accounts/all",
      query: query as unknown as Record<string, string | number>,
    });
  },

  async fetchMemberById(id: string) {
    return await api.get({
      path: "/accounts",
      params: id,
    });
  },

  async createMember(payload: CreateMemberPayload) {
    return await api.post({
      path: "/auth/register",
      body: payload,
    });
  },

  async updateMember(id: string, payload: UpdateMemberPayload) {
    return await api.put({
      path: `/accounts`,
      params: id,
      body: payload,
    });
  },

  async deleteMember(id: string) {
    return await api.delete({
      path: "/accounts",
      params: id,
    });
  },

  async changePassword(userId: number, newPassword: string) {
    return await api.post({
      path: "/auth/changepassword",
      body: {
        userId: Number(userId),
        newPassword: newPassword,
      },
    });
  },

  async changeStatus(userId: string, newStatus: number) {
    return await api.post({
      path: "/auth/changestatus",
      body: {
        userId: Number(userId),
        newStatus,
      },
    });
  },
};
