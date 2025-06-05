"use client";

import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import SkeletonDashboard from "@/app/components/Skeleton/SkeletonDashboard";
import { useTransactionStore } from "@/stores/transaction";
import DashboardHeader from "@/app/components/dash/DashboardHeader";
import DashboardFilters from "@/app/components/dash/DashboardFilters";
import DashboardStats from "@/app/components/dash/DashboardStats";
import DashboardCharts from "@/app/components/dash/DashboardCharts";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";

interface RouteData {
  lat: number;
  lng: number;
  name: number;
  amount: number;
  payment: number;
  Date: string;
}

export default function DashboardPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const getTransactionMap = useTransactionStore((state) => state.getTransactionMap);
  const [routeData, setRouteData] = useState<RouteData[]>([]);
  const [selectDate, setSelectDate] = useState("all");
  const [customDate, setCustomDate] = useState(""); // <-- เพิ่มแยก
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerClusterRef = useRef<MarkerClusterer | null>(null);

  const totalAmount = routeData.reduce((sum, route) => sum + route.amount, 0);
  const totalPassengers = routeData.length;

  const center = routeData.length
    ? {
        lat: routeData.reduce((sum, { lat }) => sum + lat, 0) / routeData.length,
        lng: routeData.reduce((sum, { lng }) => sum + lng, 0) / routeData.length,
      }
    : { lat: 16.44, lng: 102.83 };

  const containerStyle = {
    width: "100%",
    height: "600px",
  };

  // ฟังก์ชันวาง Marker ใหม่ทุกครั้งที่ข้อมูลเปลี่ยน
  const loadMarkers = (map: google.maps.Map, data: RouteData[]) => {
    // ล้าง marker เดิม
    if (markerClusterRef.current) {
      markerClusterRef.current.clearMarkers();
    }

    const markers = data.map((route) => {
      return new google.maps.Marker({
        position: { lat: route.lat, lng: route.lng },
      });
    });

    const clusterer = new MarkerClusterer({ markers, map });
    markerClusterRef.current = clusterer;
  };

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (routeData.length > 0) {
      loadMarkers(map, routeData);
    }
  };

  // เมื่อข้อมูลเปลี่ยน ให้ update marker บนแผนที่
  useEffect(() => {
    if (mapRef.current && isLoaded && routeData.length > 0) {
      loadMarkers(mapRef.current, routeData);
    }
  }, [routeData, isLoaded]);

  // โหลดข้อมูลเมื่อเลือกวันที่
  useEffect(() => {
    const fetchData = async () => {
      const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
      const data = await getTransactionMap();
      if (!data) return;

      const now = new Date();

      const filtered = data.filter((tx) => {
        const txDate = new Date(tx.transaction_date_time);

        if (selectDate === "day") {
          return (
            txDate.getFullYear() === now.getFullYear() &&
            txDate.getMonth() === now.getMonth() &&
            txDate.getDate() === now.getDate()
          );
        } else if (selectDate === "month") {
          return (
            txDate.getFullYear() === now.getFullYear() &&
            txDate.getMonth() === now.getMonth()
          );
        } else if (selectDate === "year") {
          return txDate.getFullYear() === now.getFullYear();
        } else if (/\d{4}-\d{2}-\d{2}/.test(selectDate)) {
          const customDate = new Date(selectDate);
          return (
            txDate.getFullYear() === customDate.getFullYear() &&
            txDate.getMonth() === customDate.getMonth() &&
            txDate.getDate() === customDate.getDate()
          );
        }

        return true;
      });

      const mapped = filtered.map((tx) => ({
        lat: parseFloat(tx.transaction_lat),
        lng: parseFloat(tx.transaction_long),
        name: tx.transaction_route_id,
        amount: parseFloat(tx.transaction_amount),
        payment: tx.transaction_payment_method_id,
        Date: tx.transaction_date_time,
      }));

      setRouteData(mapped);
      cancelSkeleton();
    };

    fetchData();
  }, [selectDate, getTransactionMap]);

  return (
    <>
      {isLoadingskeleton ? (
        <SkeletonDashboard />
      ) : (
        <div>
          <DashboardHeader />
          <DashboardFilters
            selectDate={selectDate}
            setDate={setSelectDate}
            customDate={customDate}
            setCustomDate={setCustomDate}
          />
          <DashboardStats
            totalPassengers={totalPassengers}
            totalAmount={totalAmount}
            totalRoutes={routeData.length}
          />
          <DashboardCharts routeData={routeData} />
          <div className="flex gap-4 h-[600px]">
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
