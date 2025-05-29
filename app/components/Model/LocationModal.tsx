import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Image from "next/image";
import TitleModel from "../Title/TitleModel";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; latitude: number; longitude: number }) => void;
  editingLocation?: {
    name: string;
    latitude: number;
    longitude: number;
  } | null;
}

function LocationModal({
  open,
  onClose,
  onSave,
  editingLocation,
}: LocationModalProps) {
  const isEditing = !!editingLocation;

  const [location, setLocation] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (editingLocation) {
      setLocation({
        name: editingLocation.name,
        latitude: editingLocation.latitude.toString(),
        longitude: editingLocation.longitude.toString(),
      });
    } else {
      setLocation({
        name: "",
        latitude: "",
        longitude: "",
      });
    }
  }, [editingLocation, open]);

  const handleSave = () => {
    if (
      !location.name ||
      isNaN(parseFloat(location.latitude)) ||
      isNaN(parseFloat(location.longitude))
    ) {
      setTimeout(
        () => toast.error("Please fill in all fields correctly."),
        100
      );
      return;
    }
    onSave({
      name: location.name,
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="w-[448px] py-2 relative">
          <TitleModel
            title={isEditing ? "Edit Location" : "Add New Location"}
            description={
              isEditing
                ? "Update the location details below"
                : "Fill in the location details below"
            }
          />
          <div className="mt-7 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Location Name
              </label>
              <input
                type="text"
                placeholder="Enter location name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                value={location.name}
                onChange={(e) =>
                  setLocation({ ...location, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Location (Latitude, Longitude)
              </label>
              <input
                type="text"
                placeholder="16.40110363857608, 102.85026064787496"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                onChange={(e) => {
                  const [lat, lng] = e.target.value
                    .split(",")
                    .map((s) => s.trim());
                  setLocation((prev) => ({
                    ...prev,
                    latitude: lat || "",
                    longitude: lng || "",
                  }));
                }}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-7">
            <ButtonDefault size="" text="Cancel" onClick={onClose} />
            <ButtonBG
              size=""
              text={isEditing ? "Update Location" : "Add Location"}
              onClick={handleSave}
            />
          </div>
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={onClose}
          >
            <Image
              src={"/icons/close.svg"}
              width={24}
              height={24}
              priority
              alt="close-icon"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LocationModal;
