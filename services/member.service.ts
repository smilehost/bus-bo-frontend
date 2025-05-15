import { api } from "@/services/axios.service";
import {
  FetchMemberQuery,
  CreateMemberPayload,
  UpdateMemberPayload,
} from "@/payloads/member.payload";

export const MemberService = {
  async fetchMembers(query: FetchMemberQuery) {
    return await api.get({
      path: "/api/accounts/all",
      query: query as unknown as Record<string, string | number>,
    });
  },

  async fetchMemberById(id: string) {
    return await api.get({
      path: "/api/accounts",
      params: id,
    });
  },

  async createMember(payload: CreateMemberPayload) {
    return await api.post({
      path: "api/auth/register",
      body: payload,
    });
  },

  async updateMember(id: string, payload: UpdateMemberPayload) {
    return await api.put({
      path: `/api/accounts`,
      params: id,
      body: payload,
    });
  },

  async deleteMember(id: string) {
    return await api.delete({
      path: "/api/accounts",
      params: id,
    });
  },

  async changePassword(userId: string, newPassword: string) {
    return await api.post({
      path: "api/auth/changepassword",
      body: {
        userId: parseInt(userId),
        newPassword,
      },
    });
  },

  async changeStatus(userId: string, newStatus: number) {
    return await api.post({
      path: "/api/auth/changestatus",
      body: {
        userId: Number(userId),
        newStatus,
      },
    });
  },
};
