"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ManageLocationController } from "@/controllers/manageLocation.controller";
import { LocationItem } from "@/types/location.type";
import LocationTable from "@/app/components/Table/LocationTable";
import LocationModal from "@/app/components/Modal/LocationModal";
import PageHeader from "@/app/components/PageHeader/LocationPageHeader";
import SearchFilter from "@/app/components/SearchFilter/LocationSearchFilter";
import { debounce } from "@/utils/debounce";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";

function Page() {
  // State variables
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

  // Fetch locations from the backend
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

  // Debounced search handler
  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  // Effect to fetch locations when page or rows per page changes
  useEffect(() => {
    fetchLocations();
  }, [currentPage, rowsPerPage]);

  // Handlers
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

    const isConfirmed = await Confirm({
      title: editingLocation ? "Confirm Update" : "Confirm Create",
      text: editingLocation
        ? "Do you want to update this location?"
        : "Do you want to create this location?",
      confirmText: editingLocation ? "Update" : "Create",
      cancelText: "Cancel",
      type: "question",
    });

    if (!isConfirmed) return;

    try {
      if (editingLocation) {
        await ManageLocationController.updateLocation(
          editingLocation.id,
          location
        );
        await Alert({
          title: "Updated!",
          text: "Location updated successfully",
          type: "success",
        });
      } else {
        await ManageLocationController.createLocation(location);
        await Alert({
          title: "Created!",
          text: "Location created successfully",
          type: "success",
        });
      }
      setShowModal(false);
      fetchLocations();
    } catch (error) {
      console.error("Save Location error:", error);
      await Alert({
        title: "Error!",
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  const handleDeleteLocation = async (id: number) => {
    const isConfirmed = await Confirm({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this location?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!isConfirmed) return;

    try {
      await ManageLocationController.deleteLocation(id);
      await Alert({
        title: "Deleted!",
        text: "Location deleted successfully",
        type: "success",
      });
      fetchLocations();
    } catch (error) {
      console.error("Delete Location error:", error);
      await Alert({
        title: "Error!",
        text: "Failed to delete.",
        type: "error",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedFetch(e.target.value);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); 
  };

  // Filter locations based on search term
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Paginate filtered locations
  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-7">
        {/* Page Header */}
        <PageHeader onAddLocation={handleAddLocation} />

        {/* Main Content */}
        <div className="bg-white rounded-md shadow p-5">
          {/* Search Filter */}
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />

          {/* Location Table */}
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
            onRowsPerPageChange={handleRowsPerPageChange}
            totalResults={filteredLocations.length}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Location Modal */}
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
