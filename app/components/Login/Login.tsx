"use client";
import React, { useState, useEffect } from "react";
import InputLabel from "../Form/InputLabel";
import ButtonBG from "../Form/ButtonBG";
import axios from "axios";
import { store } from "@/stores/store";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Alert } from "@/app/components/Dialog/Alert";

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
  const router = useRouter();

  //Redirect ถ้ามี token อยู่แล้ว
  useEffect(() => {
    const token = store.token.get();
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          router.replace("/bu/dashboard");
        }
      } catch (e) {
        console.warn("Invalid token found, ignoring.");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
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
        store.account_name.set(response.data.result.account_name);
        store.account_username.set(response.data.result.account_username);
        store.Translation.set("TH");
  
        // ✅ ถ้าเป็น SuperAdmin → ดึง com_id ทั้งหมด
        if (decoded.account_role === "2") {
          try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/company/all`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });
  
            const comIds = res.data.result.map((company: any) => company.com_id);
            localStorage.setItem("comidSuper", JSON.stringify(comIds));
          } catch (err) {
            console.error("Failed to fetch companies for SuperAdmin:", err);
          }
        }
  
        await Alert({
          title: "Login Success!",
          text: "The system will take you to the website.",
          type: "success",
        });
  
        router.replace("/bu/dashboard");
      } else {
        setError("Login failed: No token received");
      }
    } catch (err) {
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
          setValue={setUserName}
          type="text"
        />
        <InputLabel
          label="Password"
          placeholder="Enter your password"
          setValue={setPassword}
          type="password"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="mt-2">
          <ButtonBG size={`w-[100%]`} text="Sign In" />
        </div>
      </form>
    </div>
  );
}

export default Login;
