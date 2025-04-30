"use client";

import React, { useEffect, useState, useCallback } from "react";
import LocationTable from "@/app/components/Table/LocationTable";
import LocationModal from "@/app/components/Model/LocationModal";
import PageHeader from "@/app/components/PageHeader/LocationPageHeader";
import SearchFilter from "@/app/components/SearchFilter/LocationSearchFilter";
import SkeletonLocationTable from "@/app/components/Skeleton/SkeletonLocationTable";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import { debounce } from "@/utils/debounce";
import { useLocationStore } from "@/stores/locationStore";

function Page() {
  const {
    locations,
    total,
    isLoading,
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  } = useLocationStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(undefined);
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);

  const fetchData = async () => {
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    await getLocations(currentPage, rowsPerPage);
    cancelSkeleton();
  };

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage]);

  const handleAddLocation = () => {
    setEditingLocation(undefined);
    setShowModal(true);
  };

  const handleEditLocation = (id: number) => {
    const loc = locations.find((l) => l.id === id);
    if (loc) {
      setEditingLocation(loc);
      setShowModal(true);
    }
  };

  const handleSaveLocation = async (data: {
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    const location = {
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
        await updateLocation(editingLocation.id, location);
        await Alert({
          title: "Updated!",
          text: "Location updated.",
          type: "success",
        });
      } else {
        await createLocation(location);
        await Alert({
          title: "Created!",
          text: "Location created.",
          type: "success",
        });
      }
      setShowModal(false);
      fetchData();
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
      await deleteLocation(id);
      await Alert({
        title: "Deleted!",
        text: "Location deleted.",
        type: "success",
      });
      fetchData();
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
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
    setCurrentPage(1);
  };

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
        {isLoadingskeleton ? (
          <SkeletonLocationTable rows={rowsPerPage} />
        ) : (
          <>
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
                onRowsPerPageChange={handleRowsPerPageChange}
                totalResults={filteredLocations.length}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
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
