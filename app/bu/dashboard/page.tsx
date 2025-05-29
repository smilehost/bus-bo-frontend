"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { FilterIcon, UsersIcon, CreditCardIcon, TruckIcon } from "lucide-react";
import { JSX } from "@emotion/react/jsx-runtime";
import SkeletonDashboard from "@/app/components/Skeleton/SkeletonDashboard";
// import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useTransactionStore } from "@/stores/transaction";
import DashboardHeader from "@/app/components/dash/DashboardHeader";
import DashboardFilters from "@/app/components/dash/DashboardFilters";
import DashboardStats from "@/app/components/dash/DashboardStats";
import DashboardCharts from "@/app/components/dash/DashboardCharts";

interface RouteData {
  lat: number;
  lng: number;
  name: number;
  amount: number;
  payment: number;
}

export default function DashboardPage() {

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
  const getTransactionMap = useTransactionStore((state) => state.getTransactionMap);
  const [routeData, setRouteData] = useState<RouteData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(true);
  const totalAmount = routeData.reduce((sum, route) => sum + route.amount, 0);
  const center = routeData.length
  ? {
      lat: routeData.reduce((sum, { lat }) => sum + lat, 0) / routeData.length,
      lng: routeData.reduce((sum, { lng }) => sum + lng, 0) / routeData.length,
    }
  : { lat: 16.44, lng: 102.83 }; // fallback ขอนแก่นกลางเมือง
  const containerStyle = {
    width: "100%",
    height: "600px",
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTransactionMap();
      if (!data) return;

      // ✅ map ให้เป็นข้อมูล lat/lng ที่ต้องการ
      const mapped = data.map((tx) => ({
        lat: parseFloat(tx.transaction_lat),
        lng: parseFloat(tx.transaction_long),
        name: (tx.transaction_route_id),
        amount: parseFloat(tx.transaction_amount),
        payment: tx.transaction_payment_method_id,
      }));

      setRouteData(mapped);
    };

    fetchData();
  }, [getTransactionMap]);
  const onLoad = (map: google.maps.Map) => {
    const markers = routeData.map((route) => {
      return new google.maps.Marker({
        position: { lat: route.lat, lng: route.lng },
      });
    });

    new MarkerClusterer({ markers, map });
  };
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingskeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const totalPassengers = routeData.length;

  return (
    <>
      {isLoadingskeleton ? (
        <SkeletonDashboard />
      ) : (
        <div className="">
          {/* Header */}
          <DashboardHeader />
          {/* Filters */}
          <DashboardFilters
            selectedCompany={selectedCompany}
            selectedProvince={selectedProvince}
            setSelectedCompany={setSelectedCompany}
            setSelectedProvince={setSelectedProvince}
          />
          {/* Stats Cards */}
          <DashboardStats
            totalPassengers={totalPassengers}
            totalAmount={totalAmount}
            totalRoutes={routeData.length}
          />
          {/* Charts */}
          <DashboardCharts routeData={routeData} />
          {/* map */}
          <div className="flex gap-4 h-[600px]">
            {/* 🗺️ Google Map */}
          <div className="flex-1 rounded overflow-hidden">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={10}
                  onLoad={onLoad}
                />
              ) : (
                <div>Loading map...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
