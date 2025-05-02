// src/app/components/Login/Login.tsx
"use client";
import React, { useState } from "react";
import InputLabel from "../Form/InputLabel";
import ButtonBG from "../Form/ButtonBG";
import axios from "axios";
import { store } from "@/stores/store";
import { jwtDecode } from "jwt-decode";
type DecodedToken = {
  account_id: number;
  account_role: string;
  com_id: number;
  login_at: number;
  iat: number;
  exp: number;
};

function Login() {
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          username,
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
        store.com_id.set(decoded.com_id);
        store.account_id.set(decoded.account_id);
        store.account_role.set(decoded.account_role);

        console.log("com_id :", store.com_id.get());
        console.log("account_id :", store.account_id.get());
        console.log("account_role :", store.account_role.get());
        console.log("token :", store.token.get() + ":");
      }
      window.location.href = "/bu"; //เปลี่ยนหน้าเมื่อ login สำเร็จ
    } catch (err) {
      console.log(err);
      setError("Login failed: Invalid credentials");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="shadow-xl rounded-lg overflow-hidden">
      <div className="flex flex-col justify-center items-center gap-4 custom-bg-main py-8 w-[448px] text-white">
        <div className="border-6 border-white rounded-full w-[64px] h-[64px] shadow-xl" />
        <div className="flex flex-col gap-2 items-center">
          <p className="font-bold text-xl">Bus Ticketing System</p>
          <p className="text-xs">Log in to access your account</p>
        </div>
      </div>
      <form onSubmit={handleLogin} className="p-6 flex flex-col gap-8">
        <InputLabel
          label="Username"
          placeholder="Enter your username"
          value={username}
          setValue={setUserName}
          type="text"
        />
        <InputLabel
          label="Password"
          placeholder="Enter your password"
          value={password}
          setValue={setPassword}
          type="password"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="mt-2">
          <ButtonBG size="w-[100%]" text="Sign In" />
        </div>
      </form>
    </div>
  );
}

export default Login;
