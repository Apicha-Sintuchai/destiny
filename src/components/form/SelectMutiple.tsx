import { useFieldContext } from "./hooks";
import { FormBase, FormControlProps } from "./FormBase";
import { ReactNode } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import { Dropdown } from "react-day-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from "@/components/ui/multi-select"


export function FormSelectMultiple({ children, ...props }: FormControlProps & { children: ReactNode }) {
    const field = useFieldContext<string[]>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <FormBase {...props}>
            {/* <Select onValueChange={(e) => field.handleChange(e)} value={field.state.value} multiple={true}>
                <SelectTrigger aria-invalid={isInvalid} id={field.name} onBlur={field.handleBlur}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>{children}</SelectContent>
            </Select> */}


            <MultiSelect onValuesChange={(e) => field.handleChange(e)} values={field.state.value}>
                <MultiSelectTrigger className="w-full " aria-invalid={isInvalid} id={field.name} onBlur={field.handleBlur}>
                    <MultiSelectValue placeholder={props.message} overflowBehavior="wrap" />
                </MultiSelectTrigger>
                <MultiSelectContent >
                    <MultiSelectGroup>
                        {

                            children
                        }
                    </MultiSelectGroup>
                </MultiSelectContent>
            </MultiSelect>
        </FormBase>
    );
}
