import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { FormCheckbox } from "./FormCheckbox";
import { FormDatePicker } from "./FormDatePicker";
import { FormSelectMultiple } from "./SelectMutiple";
import { FormPasswordInput } from "./FormPasswordInput"

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
    fieldComponents: {
        Input: FormInput,
        Textarea: FormTextarea,
        Select: FormSelect,
        Checkbox: FormCheckbox,
        DatePicker: FormDatePicker,
        SelectMultiple: FormSelectMultiple,
        PasswordInput: FormPasswordInput
    },
    formComponents: {},
    fieldContext,
    formContext,
});

export { useAppForm, useFieldContext, useFormContext };
