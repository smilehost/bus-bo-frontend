"use client";

import React, { useState } from "react";
// ลบการ import Navbar และ Header
import LocationTable from "../../components/Table/LocationTable";
import LocationModal from "../../components/Modal/LocationModal";
import SearchFilter from "../../components/SearchFilter/LocationSearchFilter";
import PageHeader from "../../components/PageHeader/LocationPageHeader";

function Page() {
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: "Bang Sue Grand Station",
      latitude: 13.8028,
      longitude: 100.5382,
    },
    {
      id: 2,
      name: "Chatuchak Park",
      latitude: 13.8027,
      longitude: 100.553,
    },
    {
      id: 3,
      name: "Victory Monument",
      latitude: 13.7649,
      longitude: 100.5374,
    },
    {
      id: 4,
      name: "Siam Paragon",
      latitude: 13.7461,
      longitude: 100.5342,
    },
    {
      id: 5,
      name: "Central World",
      latitude: 13.7461,
      longitude: 100.5353,
    },
    {
      id: 6,
      name: "MBK Center",
      latitude: 13.7461,
      longitude: 100.5342,
    },
    {
      id: 7,
      name: "Terminal 21",
      latitude: 13.7367,
      longitude: 100.5604,
    },
    {
      id: 8,
      name: "Asiatique The Riverfront",
      latitude: 13.7073,
      longitude: 100.5161,
    },
    {
      id: 9,
      name: "Chatuchak Weekend Market",
      latitude: 13.8006,
      longitude: 100.5583,
    },
    {
      id: 10,
      name: "Lumphini Park",
      latitude: 13.7308,
      longitude: 100.5413,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLocation, setEditingLocation] = useState<null | {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  }>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleAddLocation = () => {
    setEditingLocation(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLocation(null);
  };

  const handleSaveLocation = (newLocation: {
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    if (editingLocation) {
      setLocations(
        locations.map((loc) =>
          loc.id === editingLocation.id
            ? { ...newLocation, id: editingLocation.id }
            : loc
        )
      );
    } else {
      setLocations([
        ...locations,
        { ...newLocation, id: locations.length + 1 },
      ]);
    }
    handleCloseModal();
  };

  const handleDeleteLocation = (id: number) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const handleEditLocation = (id: number) => {
    const locationToEdit = locations.find((loc) => loc.id === id);
    if (locationToEdit) {
      setEditingLocation(locationToEdit);
      setShowModal(true);
    }
  };

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ลบ Navbar และ Header */}
      <div className="flex-1 flex flex-col">
        <div className="p-7">
          <PageHeader onAddLocation={handleAddLocation} />

          <div className="bg-white rounded-md shadow p-5">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <LocationTable
              locations={paginatedLocations}
              onDelete={handleDeleteLocation}
              onEdit={handleEditLocation}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) =>
                setRowsPerPage(Number(e.target.value))
              }
              totalResults={filteredLocations.length}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <LocationModal
          onClose={handleCloseModal}
          onSave={handleSaveLocation}
          editingLocation={editingLocation}
        />
      )}
    </div>
  );
}

export default Page;