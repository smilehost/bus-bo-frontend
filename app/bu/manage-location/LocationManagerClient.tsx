"use client";

import React, { useEffect, useState, useCallback } from "react";
// import LocationTable from "@/app/components/Table/LocationTable";
import LocationModal from "@/app/components/Model/LocationModal";
// import SearchFilter from "@/app/components/SearchFilter/LocationSearchFilter";
import SkeletonLocationTable from "@/app/components/Skeleton/SkeletonLocationTable";
import { Confirm } from "@/app/components/Dialog/Confirm";
import { Alert } from "@/app/components/Dialog/Alert";
import { debounce } from "@/utils/debounce";
import { useLocationStore } from "@/stores/locationStore";
import { withSkeletonDelay } from "@/app/components/Skeleton/withSkeletonDelay";
import TitlePage from "@/app/components/Title/TitlePage";
import TableActionButton from "@/app/components/Table/TableActionButton/TableActionButton";
import { MapPin, SquarePen, Trash2 } from "lucide-react";
import TableTemplate, { ColumnConfig } from "@/app/components/Table/TableTemplate";
import { getTextLocation, useLanguageContext } from "@/app/i18n/translations";
import FormFilter from "@/app/components/Filter/FormFilter";

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
  // const [isLoading, setIsLoading] = useState(false);
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(false);
  const { isTH } = useLanguageContext();
  const text = getTextLocation({ isTH });

  const fetchLocations = async () => {
    // setIsLoading(true);
    const cancelSkeleton = withSkeletonDelay(setIsLoadingskeleton);
    try {
      await getLocations(currentPage, rowsPerPage);
    } catch (error) {
      console.error("Failed to load data", error);
    }
    cancelSkeleton();
    // setIsLoading(false);
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
      title: editingLocation ? text.confirmUpdateTitle : text.confirmCreateTitle,
      text: editingLocation ? text.confirmUpdateText : text.confirmCreateText,
      confirmText: editingLocation ? text.updateBtn : text.createBtn,
      cancelText: text.cancelBtn,
      type: "question",
    });

    if (!isConfirmed) return;

    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, location);
        await Alert({
          title: text.alertUpdatedTitle,
          text: text.alertUpdatedText,
          type: "success",
        });
      } else {
        await createLocation(location);
        await Alert({
          title: text.alertCreatedTitle,
          text: text.alertCreatedText,
          type: "success",
        });
      }
      setShowModal(false);
      fetchLocations();
    } catch {
      await Alert({
        title: text.errorTitle,
        text: text.errorText,
        type: "error",
      });
    }
  };

  const handleDeleteLocation = async (id: number) => {
    const isConfirmed = await Confirm({
      title: text.confirmDeleteTitle,
      text: text.confirmDeleteText,
      confirmText: text.deleteBtn,
      cancelText: text.cancelBtn,
      type: "warning",
    });

    if (!isConfirmed) return;

    try {
      await deleteLocation(id);
      await Alert({
        title: text.alertDeletedTitle,
        text: text.alertDeletedText,
        type: "success",
      });
      fetchLocations();
    } catch  {
      await Alert({
        title: text.alertDeletedText,
        text: text.deleteErrorText,
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
      key: 'no', label: text.number, width: '20%', align: 'left'
    },
    {
      key: 'name', label: text.name, width: '20%', align: 'left'
    },
    { key: 'lat', label: text.lat, width: '20%', align: 'center' },
    { key: 'long', label: text.long, width: '20%', align: 'center' },
    {
      key: 'id', label: text.action, width: '25%', align: 'right',
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
            title={isTH ? "เปิดใน Google Maps" : "Open in Google Maps"}
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
            title={isTH ? "แก้ไข" : "Edit"}
          />
          <TableActionButton
            onClick={() => handleDeleteLocation(row.id)}
            icon={
              <Trash2 className={`custom-size-tableAction-btn text-red-600`} />
            }
            bgColor="bg-red-50 text-red-600"
            hoverColor="hover:bg-red-100"
            title={isTH ? "ลบ" : "Delete"}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-0">
        <TitlePage title={text.title} description={text.description} btnText={text.btnText} handleOpenModel={handleAddLocation} />
        <div className="bg-white rounded-md shadow p-5 mt-5">
          {/* <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          /> */}
          <FormFilter
            setSearch={(value: string) =>
              handleSearchChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            placeholderSearch={text.search}
            search={searchTerm}
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
