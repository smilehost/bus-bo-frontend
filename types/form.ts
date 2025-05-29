import { SelectChangeEvent } from "@mui/material";

export type dataProps = {
    id?: number
    name?: string
}

export type SelectProps = {
    data: dataProps[];
    value: string | undefined;
    onChange?: (event: SelectChangeEvent<string>) => void;
};
