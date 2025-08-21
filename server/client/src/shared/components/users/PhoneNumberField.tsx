import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import type { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

interface PhoneNumberFieldProps {
  name: string;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (phoneNumber: string, countryCode: string) => void;
  onBlur: () => void;
  label?: string;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  name,
  value,
  error,
  touched,
  onChange,
  onBlur,
  label = "Phone Number",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [dialCode, setDialCode] = useState("+91");

  React.useEffect(() => {}, [value]);

  const showError = touched && Boolean(error);
  const hasValue = value.length > 0;
  const shouldShowLabel = isFocused || hasValue;

  const handleChange = (val: string, data: CountryData) => {
    const code = `+${data.dialCode}`;
    setDialCode(code);

    const national = val
      .replace(new RegExp(`^\\+?${data.dialCode}`), "")
      .replace(/\D/g, "")
      .trim();

    onChange(national, code);
  };

  const fullValue = value ? `${dialCode}${value}` : dialCode;

  return (
    <div className="mt-2 mb-2 relative">
      {/* Floating Label */}
      <div
        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 bg-white font-medium
          ${
            shouldShowLabel
              ? "-top-2 text-xs px-1"
              : "top-[18px] text-base font-normal px-0"
          }
          ${showError ? "text-red-600" : "text-[#0009]"} ${
          showError && isFocused ? "focusRed" : ""
        }`}
      >
        {label}
      </div>

      <PhoneInput
        country="in"
        value={fullValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        inputProps={{
          name,
        }}
        specialLabel=""
        containerClass={showError && isFocused ? "focusRed" : ""}
        inputStyle={{
          width: "100%",
          height: "56px",
          border: `${showError ? "1px solid red" : "1px solid #0009"}`,
        }}
        placeholder=""
      />

      {showError && <p className="text-red-600 text-xs mt-1 ml-3">{error}</p>}
    </div>
  );
};

export default PhoneNumberField;
