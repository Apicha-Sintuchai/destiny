import { FormBase, FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";
import { PasswordInput } from "@/components/ui/password-input"

export function FormPasswordInput(props: FormControlProps) {
    const field = useFieldContext<string>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <FormBase {...props}>
            <PasswordInput
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
            />
        </FormBase>
    );
}
