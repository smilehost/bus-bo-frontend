"use client";

import React, { useEffect, useState, useCallback } from "react";
import LocationTable from "@/app/components/Table/LocationTable";
import LocationModal from "@/app/components/Model/LocationModal";
import SearchFilter from "@/app/components/SearchFilter/LocationSearchFilter";
import SkeletonLocationTable from "@/app/components/Skeleton/SkeletonLocationTable";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import TitlePage from "@/app/components/Title/TitlePage";
import ButtonBG from "@/app/components/Form/ButtonBG";
import { debounce } from "@/utils/debounce";
import { useLocationStore } from "@/stores/locationStore";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";

// Define interfaces for location data
interface Location {
  id: number;
  name: string;
  lat: string;
  long: string;
}

interface LocationFormData {
  name: string;
  latitude: number;
  longitude: number;
}

function Page() {
  const {
    locations,
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  } = useLocationStore();

  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);

  const fetchLocations = async () => {
    setIsLoading(true);
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    try {
      await getLocations(currentPage, rowsPerPage);
    } catch (error) {
      console.error("Failed to load data", error);
    }
    cancelSkeleton();
    setIsLoading(false);
  };

  const filterLocations = useCallback(() => {
    let tempLocations = [...locations];
    if (debouncedSearch) {
      tempLocations = tempLocations.filter((location) =>
        location.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    setFilteredLocations(tempLocations);
    setTotalResults(tempLocations.length);
  }, [locations, debouncedSearch]);

  const debouncedFetch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 350),
    []
  );

  useEffect(() => {
    fetchLocations();
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    filterLocations();
  }, [debouncedSearch, locations, filterLocations]);

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

  const handleSaveLocation = async (data: LocationFormData) => {
    const location = {
      id: editingLocation?.id || 0,
      name: data.name,
      lat: data.latitude.toString(),
      long: data.longitude.toString(),
    };
    setShowModal(false);
    await new Promise((resolve) => setTimeout(resolve, 300));

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
      await deleteLocation(id);
      await Alert({
        title: "Deleted!",
        text: "Location deleted.",
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
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
    setCurrentPage(1);
  };

  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <TitlePage
            title="Manage Location"
            description="View and manage location information"
          />
          <ButtonBG
            size="h-[38px]"
            text="Add New Location"
            icon="/icons/plus.svg"
            onClick={handleAddLocation}
          />
        </div>

        <div className="bg-white rounded-md shadow p-5">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
          {isLoadingskeleton ? (
            <SkeletonLocationTable rows={5} />
          ) : (
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
              totalResults={totalResults}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {showModal && (
        <LocationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveLocation}
          editingLocation={
            editingLocation
              ? {
                  name: editingLocation.name,
                  latitude: parseFloat(editingLocation.lat),
                  longitude: parseFloat(editingLocation.long),
                }
              : null
          }
        />
      )}
    </div>
  );
}

export default Page;
