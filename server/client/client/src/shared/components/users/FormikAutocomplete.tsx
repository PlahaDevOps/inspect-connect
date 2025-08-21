// FormikAutocomplete.tsx
import * as React from "react";
import { TextField, Autocomplete } from "@mui/material";
import type { FieldInputProps, FormikProps } from "formik";

type Option = Record<string, any>;

type Props<FormValues> = {
  formik: FormikProps<FormValues>;
  name: keyof FormValues & string;
  label: string;
  options: Option[];
  optionIdKey: string;    // e.g. "id"
  optionLabelKey: string; // e.g. "name"
  multiple?: boolean;
  disabled?: boolean;
  onAfterChange?: (value: any) => void;
};

export default function FormikAutocomplete<FormValues>({
  formik,
  name,
  label,
  options,
  optionIdKey,
  optionLabelKey,
  multiple,
  disabled,
  onAfterChange,
}: Props<FormValues>) {
  const { values, setFieldValue, touched, errors, handleBlur } = formik as any;

  // Map Formik stored value(s) (IDs) -> option object(s) for the Autocomplete `value` prop
  const mapIdToOption = React.useCallback(
    (id: any) => options.find((o) => String(o?.[optionIdKey]) === String(id)) ?? null,
    [options, optionIdKey]
  );

  const formValue = values[name];

  const acValue = React.useMemo(() => {
    if (multiple) {
      const ids: any[] = Array.isArray(formValue) ? formValue : [];
      return ids.map(mapIdToOption).filter(Boolean);
    }
    if (!formValue) return null; // handles "" or undefined
    return mapIdToOption(formValue);
  }, [formValue, multiple, mapIdToOption]);

  const getOptionLabel = (opt: any) => {
    if (!opt) return "";
    // If someone passes a raw string by mistake, avoid crashing:
    if (typeof opt === "string") return opt;
    return String(opt?.[optionLabelKey] ?? "");
  };

  return (
    <Autocomplete
      disablePortal
      multiple={!!multiple}
      options={options}
      value={acValue}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(opt, val) =>
        String(opt?.[optionIdKey]) === String((val as any)?.[optionIdKey])
      }
      onChange={(_, val) => {
        if (multiple) {
          const ids = (val as Option[]).map((o) => o?.[optionIdKey]).filter(Boolean);
          setFieldValue(name, ids);
          onAfterChange?.(ids);
        } else {
          const id = (val as Option | null)?.[optionIdKey] ?? "";
          setFieldValue(name, id);
          onAfterChange?.(id);
        }
      }}
      onBlur={handleBlur as FieldInputProps<any>["onBlur"]}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          margin="normal"
          fullWidth
          autoComplete="off"
          error={Boolean(touched[name] && errors[name])}
          helperText={touched[name] && errors[name]}
        />
      )}
      disabled={disabled}
    />
  );
}
