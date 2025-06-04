"use client";

import React, { useEffect, useState, useCallback } from "react";
import LocationTable from "@/app/components/Table/LocationTable";
import LocationModal from "@/app/components/Model/LocationModal";
import SearchFilter from "@/app/components/SearchFilter/LocationSearchFilter";
import SkeletonLocationTable from "@/app/components/Skeleton/SkeletonLocationTable";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import { debounce } from "@/utils/debounce";
import { useLocationStore } from "@/stores/locationStore";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";
import TitlePage from "@/app/components/Title/TitlePage";
import TableActionButton from "@/app/components/Table/TableActionButton/TableActionButton";
import { MapPin, SquarePen, Trash2 } from "lucide-react";
import TableTemplate, {
  ColumnConfig,
} from "@/app/components/Table/TableTemplate";

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

interface LocationTableProps {
  no: number;
  name: string;
  lat: string;
  long: string;
  id: number;
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

  const paginatedWithNo = paginatedLocations.map((lo, index) => ({
    ...lo,
    no: (currentPage - 1) * rowsPerPage + index + 1,
  }));

  //columns
  const columns: ColumnConfig<LocationTableProps>[] = [
    {
      key: "no",
      label: "No.",
      width: "20%",
      align: "left",
    },
    {
      key: "name",
      label: "Location Name",
      width: "20%",
      align: "left",
    },
    { key: "lat", label: "Latitude", width: "20%", align: "center" },
    { key: "long", label: "Longtitude", width: "20%", align: "center" },
    {
      key: "id",
      label: "Action",
      width: "25%",
      align: "right",
      render: (_, row) => (
        <div className="flex justify-end gap-2 min-w-max">
          <TableActionButton
            href={`https://www.google.com/maps?q=${row.lat},${row.long}`}
            newTab
            icon={
              <MapPin
                className={`custom-size-tableAction-btn text-purple-600`}
              />
            }
            bgColor="bg-purple-100"
            hoverColor="hover:bg-purple-200"
            title="Open in Google Maps"
          />
          <TableActionButton
            onClick={() => handleEditLocation(row.id)}
            icon={
              <SquarePen
                className={`custom-size-tableAction-btn text-blue-500`}
              />
            }
            bgColor="bg-blue-50 text-blue-600"
            hoverColor="hover:bg-blue-100"
            title="Edit"
          />
          <TableActionButton
            onClick={() => handleDeleteLocation(row.id)}
            icon={
              <Trash2 className={`custom-size-tableAction-btn text-red-600`} />
            }
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
            title="Delete"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-0">
        <TitlePage
          title="Manage Location"
          description="View and manage location information"
          btnText="Add New Location"
          handleOpenModel={handleAddLocation}
        />

        <div className="custom-frame-content p-5 mt-5">
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
            <div className="w-full overflow-x-auto">
              <TableTemplate
                columns={columns}
                data={paginatedWithNo}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={Math.ceil(totalResults / rowsPerPage)}
                totalResults={totalResults}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowKey={(row) => row.id}
              />
            </div>
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
