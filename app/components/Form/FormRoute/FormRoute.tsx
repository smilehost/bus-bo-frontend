"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SelectChangeEvent } from "@mui/material";

//component
import ColorRoute from "@/app/components/Form/ColorRoute";
import InputLabel from "@/app/components/Form/InputLabel";
import DragDrop from "@/app/components/RoutePage/DragDrop";
import ButtonBG from "@/app/components/Form/ButtonBG";
import ButtonDefault from "@/app/components/Form/ButtonDefault";
import TextError from "../../TextError";

//api
import { useTimeStore } from "@/stores/timeStore";
import { useDateStore } from "@/stores/dateStore";

//type
import { LocationItem } from "@/types/location";

//style
import styles from "./FormRoute.module.scss";
import SelectInputUnified from "../SelectInputUnified";
import { Confirm } from "../../Dialog/Confirm";
import { getTextFormRoute, useLanguageContext } from '../../../i18n/translations';

type FormRouteProps = {
  routeNameTH?: string | undefined;
  setRouteNameTH: React.Dispatch<React.SetStateAction<string>>;
  headerUrl?: string | undefined;
  setHeaderUrl: React.Dispatch<React.SetStateAction<string>>;
  footerUrl?: string | undefined;
  setFooterUrl: React.Dispatch<React.SetStateAction<string>>;
  routeName?: string | undefined;
  setRouteName: React.Dispatch<React.SetStateAction<string>>;
  routeColor: string;
  setRouteColor: React.Dispatch<React.SetStateAction<string>>;
  listA: LocationItem[];
  setListA: React.Dispatch<React.SetStateAction<LocationItem[]>>;
  listB: LocationItem[];
  setListB: React.Dispatch<React.SetStateAction<LocationItem[]>>;
  selectedTime: string;
  handleChangeTime: (event: SelectChangeEvent<string>) => void;
  schedule: string;
  handleChangeSchedule: (event: SelectChangeEvent<string>) => void;
  handleSubmit: () => void;
  disable: boolean;
};

function FormRoute({
  routeName,
  setRouteName,
  routeColor,
  setRouteColor,
  listA,
  setListA,
  listB,
  setListB,
  selectedTime,
  handleChangeTime,
  schedule,
  handleChangeSchedule,
  handleSubmit,
  setRouteNameTH,
  routeNameTH,
  headerUrl,
  setHeaderUrl,
  footerUrl,
  setFooterUrl,
  disable = false,
}: FormRouteProps) {
  const router = useRouter();

  const { dates, getDates } = useDateStore();
  const { times, getTimes } = useTimeStore();

  const [error, setError] = useState<string>("");

  useEffect(() => {
    getTimes(1, 5, "");
    getDates(1, 5, "");
  }, [getTimes, getDates]);

  const handleValidateSubmit = () => {
    const payload = {
      route_name_th: routeNameTH,
      route_name_en: routeName,
      route_color: routeColor,
      route_date_id: schedule,
      route_time_id: selectedTime,
      route_array: listB,
    };

    if (
      !payload.route_name_th ||
      !payload.route_name_en ||
      !payload.route_color ||
      !payload.route_date_id ||
      !payload.route_time_id ||
      payload.route_array.length < 2
    ) {
      setError("Please fill in completely.");
      return;
    }
    setError("");
    handleSubmit();
  };

  //redirec
  const RedirecTo = async ({ path }: { path: string }) => {
    const isConfirmed = await Confirm({
      title: `Go to "${path}"?`,
      confirmText: "Confirm",
      cancelText: "Cancel",
    });
    if (isConfirmed) {
      router.push(`/bu/${path}`);
    }
  };
  const { isTH } = useLanguageContext();
  const textFormRoute = getTextFormRoute({ isTH });

  // console.log(listA, listB)
  return (
    <div className="custom-frame-content px-5 py-7 mt-5 w-full">
      <div
        className={` mx-auto flex flex-col gap-3 ${styles.customSizeContainer}`}
      >
        <div className="flex justify-center lg:justify-between flex-wrap gap-3">
          <InputLabel
            label={textFormRoute.routeNameTH}
            placeholder={textFormRoute.placeholderTH}
            type="text"
            setValue={setRouteNameTH}
            value={routeNameTH}
            size="min-w-[300px] xl:w-[400px] max-w-[400px]"
          />
          <InputLabel
            label={textFormRoute.routeNameEN}
            placeholder={textFormRoute.placeholderEN}
            type="text"
            setValue={setRouteName}
            value={routeName}
            size="min-w-[300px] xl:w-[400px] max-w-[400px]"
          />
        </div>

        <div className="flex justify-center lg:justify-between flex-wrap gap-3">
          <SelectInputUnified
            label={textFormRoute.timeLabel}
            value={selectedTime}
            withRenderValue
            withStartAdornment
            onChange={handleChangeTime}
            data={times}
            onAddClick={() => RedirecTo({ path: "manage-times" })}
          />
          <SelectInputUnified
            label={textFormRoute.scheduleLabel}
            value={schedule}

            onChange={handleChangeSchedule}
            data={dates}
            onAddClick={() => RedirecTo({ path: "manage-dates" })}
          />
        </div>

        <div className="flex justify-center lg:justify-between flex-wrap gap-3">
          <ColorRoute
            color={routeColor}
            setRouteColor={setRouteColor}
            label={textFormRoute.routeColor}
            size_circle="w-[38px] h-[38px]"
            size_input="w-full"
            size="min-w-[300px] xl:w-[400px] max-w-[400px]"
          />
        </div>

        <hr className="custom-border-gray my-5" />

        <div className="flex justify-center lg:justify-between flex-wrap gap-3">
          <InputLabel
            label={textFormRoute.headerUrl}
            placeholder={textFormRoute.placeholderUrl}
            type="text"
            setValue={setHeaderUrl}
            value={headerUrl}
            size="min-w-[300px] xl:w-[400px] max-w-[400px]"
          />
          <InputLabel
            label={textFormRoute.footerUrl}
            placeholder={textFormRoute.placeholderUrl}
            type="text"
            setValue={setFooterUrl}
            value={footerUrl}
            size="min-w-[300px] xl:w-[400px] max-w-[400px]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-10">
        <p className="text-[16px] font-bold">{textFormRoute.title}</p>
        <p className="textFormRoute-[12px] text-[#6B7280]">
          {disable ? "Unable to change station order, may affect price" : textFormRoute.subtitle}
        </p>
      </div>

      <div
        className={`${disable ? "custom-disable-bg" : "bg-white"
          } border-[#D1D5DB] border-1 mt-3 py-8 px-8 rounded-lg`}
      >
        <div className={` ${styles.customSizeContainer} mx-auto`}>
          <DragDrop
            listA={listA}
            setListA={setListA}
            setListB={setListB}
            listB={listB}
            disable={disable}
          />
        </div>
      </div>
      <div className="flex flex-col items-end mt-5 ">
        {error && <TextError text={error} />}
        <div className="mt-3 flex items-center justify-end gap-3">
          <ButtonDefault
            size=""
            text={textFormRoute.cancel}
            onClick={() => router.back()}
          />
          <ButtonBG
            size=""
            text={disable ? textFormRoute.editRoute : textFormRoute.addRoute}
            onClick={handleValidateSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default FormRoute;
