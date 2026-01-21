import { DatePicker } from "../ui/date-picker";
import { FormBase, FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

export function FormDatePicker(props: FormControlProps) {
    const field = useFieldContext<Date>();
    // const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <FormBase {...props}>
            <DatePicker
                label="วันเกิด"
                value={field.state.value ? new Date(field.state.value) : undefined}
                onChange={(e) => field.handleChange(e)}
            />
        </FormBase>
    );
}
