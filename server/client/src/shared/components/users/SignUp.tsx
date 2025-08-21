import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signupValidationSchemas } from "../../../utils/validations/AuthValidations";
import { ValidationError } from "yup";
import { registerUser } from "../../../store/actions/authActions";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { apiRequest } from "../../../store/apiClient";
import type { RegisterPayload, SignupFormValues } from "../../interfaces/authInterface";
import { ArrowLeft, ArrowRight, CloudUpload, Eye, EyeOff, Loader } from "lucide-react";
import PhoneNumberField from "./PhoneNumberField";
import locationData from "../../enums/country.json";
import {
  getStatesByCountry,
  getCitiesByState,
} from "../../../utils/common/helpers";
import FileUpload from "./FileUpload";
import type { UploadItem } from "./FileUpload";
import type { AxiosProgressEvent } from "axios";
import FormikAutocomplete from "./FormikAutocomplete";
import { Logos } from "../../../utils/assets";

type Role = "client" | "inspector";
type FieldName =
  | "certificateDocuments"
  | "referenceDocuments"
  | "profileImage"
  | "uploadedIdOrLicenseDocument";

const SINGLE_FILE_FIELDS: FieldName[] = [
  "profileImage",
  "uploadedIdOrLicenseDocument",
];

const stepsInspector = [
  "Personal Details",
  "Professional Details",
  "Service Area",
  "Additional Details",
  // "Subscription",
];


const initialValues: SignupFormValues = {
  name: "",
  phoneNumber: "",
  email: "",
  mailingAddress: "",
  password: "",
  confirmPassword: "",
  certificateTypeId: "",
  certificateAgencyIds: [],
  certificateDocuments: [], // URLs[]
  certificateExpiryDate: new Date().toISOString().split("T")[0] || "",
  state: "",
  country: "",
  city: "",
  zip: "",
  // subscriptionType: "monthly",
  profileImage: [], // make single-file fields arrays of URLs for consistency
  uploadedIdOrLicenseDocument: [], // "
  referenceDocuments: [], // URLs[]
  termsAccepted: false,
  eSigned: false,
  countryCode: "",
  workHistoryDescription: "",
  // subscriptionId: "monthly",
};

export default function SignUp() {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { role } = (useLocation().state || {}) as { role?: Role };

  useEffect(() => {
    if (!role) navigate("/signup-role");
  }, [role, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Centralized upload state for all fields
  const [uploads, setUploads] = useState<Record<FieldName, UploadItem[]>>({
    certificateDocuments: [],
    referenceDocuments: [],
    profileImage: [],
    uploadedIdOrLicenseDocument: [],
  });

  const stepsForRole = useMemo(
    () => (role === "client" ? ["Account"] : stepsInspector),
    [role]
  );
  const anyUploadInProgress = useMemo(
    () =>
      Object.values(uploads).some((arr) =>
        arr.some((x) => x.status === "uploading")
      ),
    [uploads]
  );

  const anyUploadError = useMemo(
    () =>
      Object.values(uploads).some((arr) =>
        arr.some((x) => x.status === "error")
      ),
    [uploads]
  );

  const formik = useFormik<SignupFormValues>({
    initialValues,
    validationSchema: signupValidationSchemas[activeStep],
    validate: (values) => {
      const errors: Record<string, string> = {};

      // Custom validation for termsAccepted and eSigned based on role and step
      if (role === "client" && activeStep === 0) {
        // Clients must accept terms and e-sign in step 0
        if (!values.termsAccepted) {
          errors.termsAccepted = "You must agree to the Terms and Conditions";
        }
        if (!values.eSigned) {
          errors.eSigned = "You must confirm all information is truthful";
        }
      } else if (role === "inspector" && activeStep === 3) {
        // Inspectors must accept terms and e-sign in step 3
        if (!values.termsAccepted) {
          errors.termsAccepted = "You must agree to the Terms and Conditions";
        }
        if (!values.eSigned) {
          errors.eSigned = "You must confirm all information is truthful";
        }
      } else {
        // For other combinations, these fields are not required
        // Clear any validation errors that might come from Yup
        delete errors.termsAccepted;
        delete errors.eSigned;
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      // Final full-validate
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        formik.setErrors(errors);
        formik.setTouched(
          Object.keys(errors).reduce(
            (acc, k) => ({ ...acc, [k]: true }),
            {} as Record<string, boolean>
          )
        );
        return;
      }

      const basePayload = {
        role: role === "client" ? 1 : 2,
        location: {
          type: "Point",
          locationName: values.city || "City",
          coordinates: [-73.9857, 40.7484],
        },
        countryCode: values.countryCode,
        email: values.email,
        mailingAddress: values.mailingAddress,
        name: values.name,
        password: values.password,
        phoneNumber: values.phoneNumber,
        agreedToTerms: values.termsAccepted,
        isTruthfully: values.eSigned,
      };

      const payload =
        role === "client"
          ? basePayload
          : {
            ...basePayload,
            uploadedIdOrLicenseDocument: values.uploadedIdOrLicenseDocument?.[0] || null,
            profileImage: values.profileImage?.[0] || null,
            certificateDocuments: values.certificateDocuments || [],
            certificateAgencyIds: values.certificateAgencyIds || [],
            certificateExpiryDate: values.certificateExpiryDate || null,
            certificateTypeId: values.certificateTypeId || null,
            city: values.city,
            country: values.country,
            state: values.state,

            ...(values.zip ? { zip: values.zip } : {}),
            ...(values.workHistoryDescription?.trim()
              ? { workHistoryDescription: values.workHistoryDescription.trim() }
              : {}),
            ...(Array.isArray(values.referenceDocuments) && values.referenceDocuments.length
              ? { referenceDocuments: values.referenceDocuments }
              : {}),
            // ...(values.subscriptionId ? { subscriptionType: values.subscriptionId } : {}),
          };


      try {
        await dispatch(
          registerUser(payload as RegisterPayload)
        ).unwrap();
        navigate("/otp-verification", {
          state: {
            phoneNumber: values.phoneNumber,
            countryCode: values.countryCode,
            fromSignup: true,
          },
        });
      } catch (error: unknown) {
         
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
  });

  const handleClickShowPassword = () => setShowPassword((s) => !s);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((s) => !s);

  // ---- Upload helpers ----
  const setItems = (
    field: FieldName,
    updater: (prev: UploadItem[]) => UploadItem[]
  ) => setUploads((prev) => ({ ...prev, [field]: updater(prev[field]) }));

  const uploadSingleFile = async (fieldName: FieldName, item: UploadItem) => {
    const formData = new FormData();
    formData.append("file", item.file as File);

    try {
      const response = await apiRequest(
        `${import.meta.env.VITE_API_URL}/uploads`,
        {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // DO NOT set Content-Type; let the client handle boundaries.
          onUploadProgress: (evt: AxiosProgressEvent) => {
            if (!evt.total) return;
            const percent = Math.round((evt.loaded * 100) / evt.total);
            setItems(fieldName, (prev) =>
              prev.map((x) =>
                x.id === item.id ? { ...x, progress: percent } : x
              )
            );
          },
        }
      );

      const body = response.body as { fileUrl: string } | { fileUrl: string }[];
      const urls = Array.isArray(body)
        ? body.map((x) => x.fileUrl)
        : [body.fileUrl];
      const url = urls[0];

      // Mark success + attach URL
      setItems(fieldName, (prev) =>
        prev.map((x) =>
          x.id === item.id
            ? { ...x, progress: 100, status: "success", url, file: undefined }
            : x
        )
      );

      // Append URL to Formik array
      const existing = (formik.values as SignupFormValues)[fieldName] || [];
      formik.setFieldValue(fieldName, [...existing, url]);
    } catch {
      setItems(fieldName, (prev) =>
        prev.map((x) =>
          x.id === item.id
            ? {
              ...x,
              status: "error",
              error: "Upload failed. Please try again.",
            }
            : x
        )
      );
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: FieldName
  ) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    // Build new items
    let newItems: UploadItem[] = selected.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
      progress: 0,
      status: "uploading",
    }));

    if (SINGLE_FILE_FIELDS.includes(fieldName)) {

      setItems(fieldName, () => []);
      formik.setFieldValue(fieldName, []);
      newItems = [newItems[0]!];

    } else {
      // For multi-file fields: append
      setItems(fieldName, (prev) => [...prev, ...newItems]);
    }

    if (SINGLE_FILE_FIELDS.includes(fieldName)) {
      // set single item after clearing
      setItems(fieldName, () => [...newItems]);
    }

    // Upload each file separately
    for (const item of newItems) {
      // eslint-disable-next-line no-await-in-loop
      await uploadSingleFile(fieldName, item);
    }

    // allow re-selecting the same file(s)
    e.target.value = "";


  };

  const handleDeleteFile = (fieldName: FieldName, index: number) => {
    setItems(fieldName, (prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);

      // Remove URL from Formik if present
      const urls = (formik.values as SignupFormValues)[fieldName] || [];
      if (removed?.url) {
        const urlIdx = urls.indexOf(removed.url);
        if (urlIdx >= 0) {
          const n = [...urls];
          n.splice(urlIdx, 1);
          formik.setFieldValue(fieldName, n);
        }
      }
      return copy;
    });
  };

  // ---- Steps rendering ----
  const renderStepContent = (step: number) => {
    // Client has only the first section (account/personal details)
    if (role === "client") {
      step = 0;
    }

    switch (step) {
      // Personal Details
      case 0:
        return (
          <>
            <TextField
              label="Full Name"
              name="name"
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="off"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onBlur={formik.handleBlur}
              sx={{ mb: 2 }}
            />

            <PhoneNumberField
              name="phoneNumber"
              value={formik.values.phoneNumber}
              error={formik.errors.phoneNumber}
              touched={formik.touched.phoneNumber}
              onChange={(phoneNumber, countryCode) => {
                formik.setFieldValue("phoneNumber", phoneNumber);
                formik.setFieldValue("countryCode", countryCode);
              }}
              onBlur={() => formik.validateField("phoneNumber")}
            />

            <TextField
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="off"
              inputProps={{ maxLength: 254 }}
            // sx={{ mb: 2 }}
            />

            <TextField
              label="Mailing Address"
              name="mailingAddress"
              value={formik.values.mailingAddress}
              onChange={formik.handleChange}
              error={
                formik.touched.mailingAddress &&
                Boolean(formik.errors.mailingAddress)
              }
              helperText={
                formik.touched.mailingAddress && formik.errors.mailingAddress
              }
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="off"
              onBlur={formik.handleBlur}
            // sx={{ mb: 2 }}
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 64 }}
            // sx={{ mb: 2 }}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="off"
            // sx={{ mb: 2 }}
            />

            {role === "client" && (
              <>
                <Box display="flex" alignItems="center"  mt={2} mb={2}>
                  <input
                    type="checkbox"
                    id="terms"
                    name="termsAccepted"
                    checked={formik.values.termsAccepted || false}
                    onChange={(e) =>
                      formik.setFieldValue("termsAccepted", e.target.checked)
                    }
                    onBlur={formik.handleBlur}
                    style={{
                      marginRight: 8,
                      cursor: "pointer",
                      accentColor: "#1A2C47",
                      width: 16,
                      height: 16,
                    }}
                  />
                  <Box
                    component="label"
                    htmlFor="terms"
                    sx={{
                      fontSize: 14,
                      cursor: "pointer",
                      color:
                        formik.touched.termsAccepted &&
                          formik.errors.termsAccepted
                          ? "#d32f2f"
                          : "inherit",

                    }}
                  >
                    I agree to the Terms and Conditions.
                  </Box>
                </Box>


                <Box display="flex" alignItems="center" mb={2}>
                  <input
                    type="checkbox"
                    id="esign"
                    name="eSigned"
                    checked={formik.values.eSigned || false}
                    onChange={(e) =>
                      formik.setFieldValue("eSigned", e.target.checked)
                    }
                    onBlur={formik.handleBlur}
                    style={{
                      marginRight: 8,
                      cursor: "pointer",
                      accentColor: "#1A2C47",
                      width: 16,
                      height: 16,
                    }}
                  />
                  <Box
                    component="label"
                    htmlFor="esign"
                    sx={{
                      fontSize: 14,
                      cursor: "pointer",
                      color:
                        formik.touched.eSigned && formik.errors.eSigned
                          ? "#d32f2f"
                          : "inherit",
                    }}
                  >
                    I confirm all information is truthful.
                  </Box>
                </Box>

              </>
            )}
          </>
        );

      // Professional Details
      case 1:
        return (
          <>
            <FormikAutocomplete
              formik={formik}
              name="certificateTypeId"
              label="Certification Type"
              options={[
                { id: "689c50cdd32c1600d1134a00", name: "Electrical Inspector" },
                { id: "689c50cdd32c1600d1134a01", name: "Building Inspector (ICC)" },
                { id: "689c50cdd32c1600d1134a02", name: "Fire Safety Inspector" },
                { id: "689c50cdd32c1600d1134a03", name: "Welding Inspector (AWS CWI)" },
              ]}
              optionIdKey="id"
              optionLabelKey="name"
            />
            <FormikAutocomplete
              formik={formik}
              name="certificateAgencyIds"
              label="Certifying Agency"
              multiple
              options={[
                { id: "66bb10000100000000000106", name: "Bureau Veritas" },
                { id: "66bb10000100000000000107", name: "Royal (RICS)" },
                { id: "66bb10000100000000000108", name: "Australian (ABCB)" },
              ]}
              optionIdKey="id"
              optionLabelKey="name"
            />

            <TextField
              type="date"
              label="Expiration Date"
              name="certificateExpiryDate"
              value={formik.values.certificateExpiryDate}
              onChange={formik.handleChange}
              error={
                formik.touched.certificateExpiryDate &&
                Boolean(formik.errors.certificateExpiryDate)
              }
              helperText={
                formik.touched.certificateExpiryDate &&
                formik.errors.certificateExpiryDate
              }
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split("T")[0] }}
              fullWidth
              margin="normal"
              autoComplete="off"
            // sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2, mt: 2, }}  >

              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  borderRadius: 1,
                  borderColor: "#27272a",
                  color: "#27272a",
                  height: 56,
                  textTransform: "none",
                  mb: 1,
                }}
                startIcon={<CloudUpload size={20} />}
              >
                Upload Certification Documents
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => handleFileUpload(e, "certificateDocuments")}
                />
              </Button>
              {
                formik.touched.certificateDocuments && formik.errors.certificateDocuments && (
                  <Typography sx={{ color: "#d32f2f", fontSize: 14, mt: 3, }}>
                    {formik.errors.certificateDocuments}
                  </Typography>
                )
              }
              <FileUpload
                items={uploads.certificateDocuments}
                onDelete={(idx) => handleDeleteFile("certificateDocuments", idx)}
                title={`Uploaded Certification Documents (${uploads.certificateDocuments.length})`}
              // hasError={uploads.certificateDocuments.some((x) => x.status === "error")}
              />

              {Array.isArray(formik.values.certificateDocuments) &&
                formik.values.certificateDocuments.length > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: "success.main", display: "block", mt: 1 }}
                  >
                    Total files in system:{" "}
                    {formik.values.certificateDocuments.length}
                  </Typography>
                )}
            </Box>
          </>
        );

      // Service Area
      case 2:
        return (
          <>
            <FormikAutocomplete
              formik={formik}
              name="country"
              label="Country"
              options={locationData.map((c) => ({ id: c.country, name: c.country }))} // normalize to objects
              optionIdKey="id"
              optionLabelKey="name"
            />

            <FormikAutocomplete
              formik={formik}
              name="state"
              label="State"
              options={getStatesByCountry(formik.values.country).map((s) => ({ id: s, name: s }))}
              optionIdKey="id"
              optionLabelKey="name"
            />

            <FormikAutocomplete
              formik={formik}
              name="city"
              label="City"
              options={getCitiesByState(formik.values.country, formik.values.state).map((c) => ({ id: c, name: c }))}
              optionIdKey="id"
              optionLabelKey="name"
            />
            <TextField
              label="Zip Code (optional)"
              name="zip"
              value={formik.values.zip}
              onChange={formik.handleChange}
              error={formik.touched.zip && Boolean(formik.errors.zip)}
              helperText={formik.touched.zip && formik.errors.zip}
              fullWidth
              margin="normal"
              autoComplete="off"
              onBlur={formik.handleBlur}
              inputProps={{ maxLength: 10 }}
            />
          </>
        );

      // Additional Details
      case 3:
        return (
          <>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}
            >
              <FileUpload
                items={uploads.profileImage}
                onDelete={(index) => handleDeleteFile("profileImage", index)}
                title="Profile Image"
                mode="profile"
                uploadControl={
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ borderRadius: 1, height: 52, textTransform: "none" }}
                    startIcon={<CloudUpload size={20} />}
                  >
                    {uploads.profileImage.length
                      ? "Replace Profile Image"
                      : "Upload Profile Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "profileImage")}
                    />
                  </Button>
                }
              />
            </Box>

            {/* ID / License (single) */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ borderRadius: 1, height: 52, textTransform: "none", mb: 2 }}
              startIcon={<CloudUpload size={20} />}

            >
              Upload ID / License
              <input
                type="file"
                hidden
                accept="image/*,application/pdf"
                onChange={(e) =>
                  handleFileUpload(e, "uploadedIdOrLicenseDocument")
                }
                

              />
            </Button>
            <FileUpload
              items={uploads.uploadedIdOrLicenseDocument}
              onDelete={(index) =>
                handleDeleteFile("uploadedIdOrLicenseDocument", index)
              }
              title="Uploaded ID / License"
            />

            {/* Reference Letters (multiple) */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ borderRadius: 1, height: 52, textTransform: "none", mb: 2 }}
              startIcon={<CloudUpload size={20} />}

            >
              Upload Reference Letters
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => handleFileUpload(e, "referenceDocuments")}
              />
            </Button>

            <FileUpload
              items={uploads.referenceDocuments}
              onDelete={(index) =>
                handleDeleteFile("referenceDocuments", index)
              }
              title={`Uploaded Reference Letters (${uploads.referenceDocuments.length})`}
            />
            {formik.values.referenceDocuments?.length > 0 && (
              <Typography
                variant="caption"
                sx={{ color: "success.main", display: "block", mt: 1 }}
              >
                Total files in system: {formik.values.referenceDocuments.length}
              </Typography>
            )}

            <TextField
              label="Work History Description"
              name="workHistoryDescription"
              value={formik.values.workHistoryDescription}
              onChange={formik.handleChange}
              error={
                formik.touched.workHistoryDescription &&
                Boolean(formik.errors.workHistoryDescription)
              }
              fullWidth
              margin="normal"
              autoComplete="off"
              multiline
              rows={4}
              onBlur={formik.handleBlur}
              inputProps={{ maxLength: 1000 }}
            />

            {/* Terms & E-Sign */}
            <Box display="flex" alignItems="center" mb={2} mt={2}>
              <input
                type="checkbox"
                id="terms"
                checked={formik.values.termsAccepted || false}
                onChange={(e) =>
                  formik.setFieldValue("termsAccepted", e.target.checked)
                }
                onBlur={formik.handleBlur}
                style={{ marginRight: 8, cursor: "pointer", accentColor: "#1A2C47", width: 16, height: 16, }}
              />
              <Box
                component="label"
                htmlFor="terms"
                sx={{
                  fontSize: 14,
                  cursor: "pointer",
                  color:
                    formik.touched.termsAccepted && formik.errors.termsAccepted
                      ? "#d32f2f"
                      : "inherit",
                }}
              >
                I agree to the Terms and Conditions.
              </Box>
            </Box>



            <Box display="flex" alignItems="center">
              <input
                type="checkbox"
                id="esign"
                checked={formik.values.eSigned || false}
                onChange={(e) =>
                  formik.setFieldValue("eSigned", e.target.checked)
                }
                onBlur={formik.handleBlur}
                style={{ marginRight: 8, cursor: "pointer", accentColor: "#1A2C47", width: 16, height: 16, }}

              />
              <Box
                component="label"
                htmlFor="esign"
                sx={{
                  fontSize: 14,
                  cursor: "pointer",
                  color:
                    formik.touched.eSigned && formik.errors.eSigned
                      ? "#d32f2f"
                      : "inherit",
                }}
              >
                I confirm all information is truthful.
              </Box>
            </Box>


          </>
        );

      // Subscription
      case 4:
        return (
          <>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                backgroundColor: "#f4f4f4",
                borderRadius: "20px",
                width: "fit-content",
                mx: "auto",
                p: "2px",
                mb: 2,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-2px",
                  left: "-2px",
                  right: "-2px",
                  bottom: "-2px",
                  background: "linear-gradient(45deg, #4caf50, #2196f3)",
                  borderRadius: "22px",
                  zIndex: -1,
                  opacity: 0.3,
                }
              }}
            >

            </Box>

          </>
        );

      default:
        return null;
    }
  };

  const handleNext = async () => {


    try {
      const schema = signupValidationSchemas[activeStep];
      await schema?.validate(formik.values, { abortEarly: false });
      setActiveStep((prev) => Math.min(prev + 1, stepsForRole.length - 1));
    } catch (err) {
      if (err instanceof ValidationError && err.inner) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((ve) => {
          if (ve.path) formErrors[ve.path] = ve.message;
        });
        formik.setErrors(formErrors);
        formik.setTouched(
          Object.keys(formErrors).reduce(
            (acc, k) => ({ ...acc, [k]: true }),
            {} as Record<string, boolean>
          )
        );
      }
    }
  };
  const nextDisabled = anyUploadInProgress || anyUploadError;
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  return (
    <>
      {formik.isSubmitting && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
          }}>
          <Loader size={48} style={{ animation: "spin 1s linear infinite" }} />
        </Box>
      )}
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>

        <Box sx={{ width: "100%", p: 2, bgcolor: "background.paper" }}>
          <Box
            sx={{ mb: 3, width: "400px", margin: "0 auto", textAlign: "left" }}
          >
            <Avatar
              src={Logos.small}
              alt="Logo"
              sx={{ width: 60, height: 60, mb: 3, cursor: "pointer" }}
              onClick={() => navigate("/")}
            />

            <Typography
              variant="h5"
              mb={0}
              gutterBottom
              textAlign="left"
              sx={{ fontWeight: 600 }}
            >
              Sign Up
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: "#2a2728", fontSize: 14 }}
              textAlign="left"
              mb={3}
            >
              Please fill in the details below to sign up
            </Typography>
          </Box>

          {role !== "client" && (
            <Box sx={{ mb: 3 }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  margin: "0 auto",
                  width: "80%",
                  textAlign: "center",
                  "& .MuiStepLabel-label": { color: "#a0a0a0" },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: "#27272a !important",
                    fontWeight: 600,
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: "#27272a !important",
                    fontWeight: 600,
                  },
                  "& .MuiStepIcon-root": { color: "#e0e0e0" },
                  "& .MuiStepIcon-root.Mui-active": { color: "#27272a" },
                  "& .MuiStepIcon-root.Mui-completed": { color: "#27272a" },
                }}
              >
                {stepsForRole.map((label) => (
                  <Step key={label}>
                    <StepLabel sx={{ fontSize: 14 }}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          <Box component="div" sx={{ width: "400px", margin: "0 auto" }}>
            <Box
              component="form"
              sx={{
                flexDirection: "column",
                gap: 1,
                width: "400px",
                margin: "0 auto",
                // minHeight: "500px",
                mb: 2,
              }}
              onSubmit={formik.handleSubmit}
            >
              <Box>{renderStepContent(activeStep)}</Box>

              {formik.errors.submit && (
                <Box
                  sx={{
                    color: "#d32f2f",
                    fontSize: 14,
                    mt: 2,
                    textAlign: "center",
                  }}
                >
                  {formik.errors.submit}
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              width: "80%",
              margin: "0 auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {role === "client" ? (
              <Button
                onClick={() => formik.handleSubmit()}
                variant="contained"
                sx={{
                  height: 56,
                  textTransform: "none",
                  width: "400px",
                  margin: "0 auto",
                }}
                endIcon={<ArrowRight size={20} />}
              >
                Sign Up
              </Button>
            ) : (
              <>
                <Box
                  sx={{
                    width: "400px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    sx={{
                      borderRadius: 1,
                      borderColor: "#27272a",
                      color: "#27272a",
                      height: 56,
                      textTransform: "none",
                      flex: 1, 
                    }}
                    startIcon={<ArrowLeft size={20} />}
                  >
                    Previous
                  </Button>

                  {activeStep < stepsForRole.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      disabled={nextDisabled}
                      sx={{
                        height: 56,
                        textTransform: "none",
                        flex: 1,  
                      }}
                      endIcon={<ArrowRight size={20} />}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={() => formik.handleSubmit()}
                      variant="contained"
                      sx={{
                        height: 56,
                        textTransform: "none",
                        flex: 1,
                      }}
                      endIcon={<ArrowRight size={20} />}
                    >
                      Sign Up
                    </Button>
                  )}
                </Box>

              </>
            )}
          </Box>
          <Typography
            sx={{
              mt: 2,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Already have an account?{" "}
            <Link
              className="font-medium underline text-right text-[14px]"
              to="/signin"
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
