import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Image from "next/image";

import InputLabel from "../Form/InputLabel";
import TitleModel from "../Title/TitleModel";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";
import SelectInputUnified from "../Form/SelectInputUnified";
import { DISCOUNT_TYPE } from "@/constants/enum";
import TextError from "../TextError";

interface TicketDiscountProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: {
        name: string;
        type: number;
        value: number;
    }) => void;
    editingDiscount?: {
        name: string;
        type: number;
        value: number;
    } | null;
}
function TicketDiscountModel({
    open,
    onClose,
    onSave,
    editingDiscount,
}: TicketDiscountProps) {
    const isEditing = !!editingDiscount;

    const [valueData, setValueData] = useState({
        name: "",
        type: 0,
        value: 0,
    });

    useEffect(() => {
        if (editingDiscount) {
            setValueData({
                name: editingDiscount.name,
                type: editingDiscount.type,
                value: editingDiscount.value,
            });
        } else {
            setValueData({
                name: "",
                type: 0,
                value: 0,
            });
        }
    }, [editingDiscount, open]);

    const handleSave = () => {
        if (
            !valueData.name ||
            !valueData.value
        ) {
            setTimeout(() => alert("Please fill in all fields correctly."), 100);
            return;
        }
        onSave({
            name: valueData.name,
            type: valueData.type,
            value: valueData.value,
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <div className="w-[448px] py-2 relative">
                    <TitleModel
                        title={isEditing ? "Edit Discount" : "Add New Discount"}
                        description={
                            isEditing
                                ? "Update the Discount details below"
                                : "Fill in the Discount details below"
                        }
                    />
                    <div className="mt-7 flex flex-col gap-4">
                        <InputLabel
                            label="Discount Name"
                            placeholder="Enter ticket amount"
                            type="text"
                            value={valueData.name}
                            setValue={(e) =>
                                setValueData({ ...valueData, name: e })
                            }
                        />
                        <SelectInputUnified
                            label="Types"
                            value={valueData.type.toString()}
                            tailwind="w-full"
                            onChange={(e) => {
                                setValueData({ ...valueData, type: Number(e.target.value), value: 0 })
                            }}
                            data={[
                                {
                                    id: 0,
                                    name: DISCOUNT_TYPE.BAHT
                                },
                                {
                                    id: 1,
                                    name: DISCOUNT_TYPE.PERCENT
                                },
                            ]}
                        />
                        <InputLabel
                            label="Value"
                            placeholder="Enter ticket amount"
                            type="number"
                            value={valueData.value.toString()}
                            setValue={(e) => {
                                const newValue = Number(e);
                                if (valueData.type === 1) {
                                    if (newValue > 100 || newValue < 0) {
                                        return;
                                    }
                                }
                                setValueData({ ...valueData, value: newValue });
                            }}
                        />
                       {valueData.type === 1 && (
                         <TextError text={"รองรับสูงสุดไม่เกิน 100%"}/>
                       )}

                    </div>
                    <div className="flex gap-3 justify-end mt-7">
                        <ButtonDefault size="" text="Cancel" onClick={onClose} />
                        <ButtonBG
                            size=""
                            text={isEditing ? "Update Discount" : "Add Discount"}
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

export default TicketDiscountModel;
