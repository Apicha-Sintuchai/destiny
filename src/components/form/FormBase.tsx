import { ReactNode } from "react";
import { useFieldContext } from "./hooks";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "../ui/field";

export type FormControlProps = {
    label: string;
    description?: string;
    message?: string;
};

type FormBaseProps = FormControlProps & {
    children: ReactNode;
    horizontal?: boolean;
    controlFirst?: boolean;
};

export function FormBase({
    children,
    label,
    description,
    controlFirst,
    horizontal,
}: FormBaseProps) {
    const field = useFieldContext();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    const labelElement = (
        <>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
        </>
    );
    const errorElem = isInvalid && <FieldError errors={field.state.meta.errors} />;

    return (
        <Field className={`gap-2`} data-invalid={isInvalid} orientation={horizontal ? "horizontal" : undefined}>
            {controlFirst ? (
                <>
                    {children}
                    <FieldContent>
                        {labelElement}
                        <span className="*:text-xs">{errorElem}</span>
                    </FieldContent>
                </>
            ) : (
                <>
                    <FieldContent>{labelElement}</FieldContent>
                    {children}
                    <span className="*:text-xs">{errorElem}</span>
                </>
            )}
        </Field>
    );
}
