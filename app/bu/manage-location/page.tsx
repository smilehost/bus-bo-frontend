"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ManageLocationController } from "@/controllers/manageLocation.controller";
import { LocationItem } from "@/types/location.type";
import LocationTable from "@/app/components/Table/LocationTable";
import LocationModal from "@/app/components/Modal/LocationModal";
import PageHeader from "@/app/components/PageHeader/LocationPageHeader";
import SearchFilter from "@/app/components/SearchFilter/LocationSearchFilter";
import { debounce } from "@/utils/debounce";
import dynamic from "next/dynamic";

function Page() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<
    LocationItem | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const res = await ManageLocationController.fetchLocations(
        currentPage,
        rowsPerPage
      );
      setLocations(res.data);
      setTotalResults(res.total);
    } catch (error) {
      console.error("Failed to load data", error);
    }
    setIsLoading(false);
  };

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchLocations();
  }, [currentPage, rowsPerPage]);

  const handleAddLocation = () => {
    setEditingLocation(undefined);
    setShowModal(true);
  };

  const handleEditLocation = (id: number) => {
    const location = locations.find((loc) => loc.id === id);
    if (location) {
      setEditingLocation(location);
      setShowModal(true);
    }
  };

  const handleSaveLocation = async (data: {
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    const location: LocationItem = {
      id: editingLocation?.id || 0,
      name: data.name,
      lat: data.latitude.toString(),
      long: data.longitude.toString(),
    };

    if (editingLocation) {
      await ManageLocationController.updateLocation(
        editingLocation.id,
        location
      );
    } else {
      await ManageLocationController.createLocation(location);
    }
    setShowModal(false);
    fetchLocations();
  };

  const handleDeleteLocation = async (id: number) => {
    await ManageLocationController.deleteLocation(id);
    fetchLocations();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedFetch(e.target.value);
  };

  // 🔥 Search เฉพาะฝั่ง client (ใน state) เท่านั้น
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-7">
        <PageHeader onAddLocation={handleAddLocation} />

        <div className="bg-white rounded-md shadow p-5">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
          <LocationTable
            locations={paginatedLocations.map((location) => ({
              id: location.id,
              name: location.name,
              latitude: parseFloat(location.lat),
              longitude: parseFloat(location.long),
            }))}
            onEdit={handleEditLocation}
            onDelete={handleDeleteLocation}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
            totalResults={filteredLocations.length}
            isLoading={isLoading}
          />
        </div>
      </div>

      {showModal && (
        <LocationModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveLocation}
          editingLocation={
            editingLocation
              ? {
                  name: editingLocation.name,
                  latitude: parseFloat(editingLocation.lat),
                  longitude: parseFloat(editingLocation.long),
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

export default Page;
