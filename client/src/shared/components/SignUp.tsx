import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import SubscriptionPlanCard from "./PlanCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signupValidationSchemas } from "../../utils/validations/AuthValidations";
import { ValidationError } from "yup";
import { registerUser } from "../../store/actions/authActions";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { apiRequest } from "../../store/apiClient";
import type { SignupFormValues } from "../interfaces/authInterface";
import { Eye, EyeOff } from "lucide-react";
import PhoneNumberField from "./PhoneNumberField";
 

const initialValues = {
  name: "",
  phoneNumber: "",
  email: "",
  mailingAddress: "",
  password: "",
  confirmPassword: "",
  certificateTypeId: "",
  certificateAgencyIds: [],
  certificateDocuments: [],
  certificateExpiryDate: "",
  state: "",
  country: "",
  city: "",
  zip: "",
  subscriptionType: "monthly",
  profileImage: "",
  uploadedIdOrLicenseDocument: "",
  referenceDocuments: [],
  termsAccepted: false,
  eSigned: false,
  countryCode: "",
  workHistoryDescription: "test",
};
 

const steps = [
  "Personal Details",
  "Professional Details",
  "Service Area",
  "Additional Details",
  "Subscription",
];

const SignupStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { role } = useLocation().state || { role: "client" };
  console.log("role", role);
  const [certificateDocumentsFile, setCertificateDocumentsFile] = useState<
    File[]
  >([]);
  const [profileImageFile, setProfileImageFile] = useState<File[]>([]);
  const [uploadedIdOrLicenseDocumentFile, setUploadedIdOrLicenseDocumentFile] =
    useState<File[]>([]);
  const [referenceDocumentsFile, setReferenceDocumentsFile] = useState<File[]>(
    []
  );
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const formik = useFormik<SignupFormValues>({
    initialValues: initialValues,
    validationSchema: signupValidationSchemas[activeStep],
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log("values", values);
     
      console.log("role====1", role);
      const data = values;

      const basePayload = {
        role: role === "client" ? 1 : 2,
        location: {
          type: "Point",
          locationName: "mohali",
          coordinates: [-73.9857, 40.7484],
        },
        countryCode: data.countryCode,
        email: data.email,
        mailingAddress: data.mailingAddress,
        name: data.name,
        password: data.password,
        phoneNumber: data.phoneNumber,
        agreedToTerms: data.termsAccepted,
        isTruthfully: data.eSigned,
      };
      
      let payload;
      
      if (role === "client") {
        payload = basePayload;
      } else if (role === "inspector") {
        payload = {
          ...basePayload,
          uploadedIdOrLicenseDocument: data.uploadedIdOrLicenseDocument?.[0] || null,
          profileImage: data.profileImage?.[0] || null,
          certificateDocuments: data.certificateDocuments || [],
          referenceDocuments: data.referenceDocuments || [],
          certificateAgencyIds: data.certificateAgencyIds || [],
          certificateExpiryDate: data.certificateExpiryDate || null,
          certificateTypeId: data.certificateTypeId || null,
          city: data.city,
          country: data.country,
          state: data.state,
          zip: data.zip,
          workHistoryDescription: data.workHistoryDescription,
        };
      }
      
      console.log("Final Submission:", payload);
      if (!payload) {
        setErrors({ submit: "Invalid role selected" });
        return;
      }
      try {
        const result = await dispatch(registerUser(payload)).unwrap();
        console.log("Register successful:", result);
        navigate("/otp", {
          state: {
            phoneNumber: values.phoneNumber,
            countryCode: values.countryCode,
          },
        });
      } catch (error: unknown) {
        console.error("Register failed:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Register failed. Please try again.";
        setErrors({ submit: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleNext = async () => {
    const currentStepSchema = signupValidationSchemas[activeStep];
    try {
      await currentStepSchema.validate(formik.values, { abortEarly: false });
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      if (err instanceof ValidationError && err.inner) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((validationError) => {
          if (validationError.path) {
            formErrors[validationError.path] = validationError.message;
          }
        });

        formik.setErrors(formErrors);
        formik.setTouched(
          Object.keys(formErrors).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {} as Record<string, boolean>
          )
        );
      }
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const files = Array.from(e.target.files || []);
    if (fieldName === "profileImage") {
      setProfileImageFile(files);
    } else if (fieldName === "uploadedIdOrLicenseDocument") {
      setUploadedIdOrLicenseDocumentFile(files);
    } else if (fieldName === "referenceDocuments") {
      setReferenceDocumentsFile(files);
    } else if (fieldName === "certificateDocuments") {
      setCertificateDocumentsFile(files);
    }
    if (!files || files.length === 0) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file);
    }

    try {
      const response = await apiRequest(
        `${import.meta.env.VITE_API_URL}/fileUpload`,
        {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        console.log("response=====>", response);
        const responseData = response.body as
          | { fileUrl: string }[]
          | { fileUrl: string };
        if (Array.isArray(responseData)) {
          const urls = responseData.map((item) => item.fileUrl);
          console.log("urls=====>", urls);
          formik.setFieldValue(fieldName, urls);
        } else {
          formik.setFieldValue(
            fieldName,
            responseData?.fileUrl ? [responseData.fileUrl] : []
          );
        }
      }
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStepContent = (step: number) => {
    if (role === "client") {
      step = 0;
    }
    switch (step) {
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

            {/* <TextField
              label="Phone Number"
              name="phoneNumber"
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="off"
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            /> */}
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
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
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
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
            />
            {role === "client" && (
              <>
                {/* Terms and Conditions */}
                <Box display="flex" alignItems="center" mb={2}>
                  <input
                    type="checkbox"
                    id="terms" 
                    onChange={(e) =>
                      formik.setFieldValue("termsAccepted", e.target.checked)
                    }
                    style={{ marginRight: 8 }}
                  />
                  <label htmlFor="terms" style={{ fontSize: 14 }}>
                    I agree to the Terms and Conditions.
                  </label>
                </Box>

                {/* E-Sign */}
                <Box display="flex" alignItems="center" mb={2}>
                  <input
                    type="checkbox"
                    id="esign"
                    onChange={(e) =>
                      formik.setFieldValue("eSigned", e.target.checked)
                    }
                    style={{ marginRight: 8 }}
                  />
                  <label htmlFor="esign" style={{ fontSize: 14 }}>
                    I confirm all information is truthful .
                  </label>
                </Box>
              </>
            )}
          </>
        );
      case 1:
        return (
          <>
            <TextField
              select
              label="Certification Type"
              name="certificateTypeId"
              value={formik.values.certificateTypeId}
              onChange={formik.handleChange}
              error={
                formik.touched.certificateTypeId &&
                Boolean(formik.errors.certificateTypeId)
              }
              helperText={
                formik.touched.certificateTypeId &&
                formik.errors.certificateTypeId
              }
              margin="normal"
              autoComplete="off"
              fullWidth
            >
              <MenuItem value="689499f5053d851b47626247">
                Certification A
              </MenuItem>
              <MenuItem value="689499f5053d851b47626247">
                Certification B
              </MenuItem>
            </TextField>
            <TextField
              select
              label="Certifying Agency"
              name="certificateAgencyIds"
              value={formik.values.certificateAgencyIds}
              onChange={(e) =>
                formik.setFieldValue(
                  "certificateAgencyIds",
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value
                )
              }
              error={
                formik.touched.certificateAgencyIds &&
                Boolean(formik.errors.certificateAgencyIds)
              }
              helperText={
                formik.touched.certificateAgencyIds &&
                formik.errors.certificateAgencyIds
              }
              fullWidth
              margin="normal"
              autoComplete="off"
              SelectProps={{
                multiple: true,
              }}
            >
              <MenuItem value="68949994053d851b47626244">Agency A</MenuItem>
              <MenuItem value="68949994053d851b47626245">Agency B</MenuItem>
              <MenuItem value="68949994053d851b47626246">Agency C</MenuItem>
            </TextField>

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
              fullWidth
              margin="normal"
              autoComplete="off"
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                borderRadius: 1,
                borderColor: "#27272a",
                color: "#27272a",
                height: 52,
                textTransform: "none",
                mb: 3,
              }}
            >
              Upload Certification Document
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => handleFileUpload(e, "certificateDocuments")}
              />
            </Button>
            {certificateDocumentsFile && (
              <Typography fontSize={14}>
                {certificateDocumentsFile.map((file, index) => (
                  <span key={index}>
                    {file?.name}
                    {index < certificateDocumentsFile.length - 1 ? ", " : ""}
                  </span>
                ))}
              </Typography>
            )}
          </>
        );
      case 2:
        return (
          <>
            <TextField
              select
              label="State"
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
              fullWidth
              variant="outlined"
              margin="normal"
              autoComplete="off"
            >
              <MenuItem value="California">California</MenuItem>
              <MenuItem value="Texas">Texas</MenuItem>
            </TextField>
            <TextField
              select
              label="country"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              error={formik.touched.country && Boolean(formik.errors.country)}
              helperText={formik.touched.country && formik.errors.country}
              fullWidth
              margin="normal"
              autoComplete="off"
            >
              <MenuItem value="country A">country A</MenuItem>
              <MenuItem value="country B">country B</MenuItem>
            </TextField>
            <TextField
              select
              label="City"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              fullWidth
              margin="normal"
              autoComplete="off"
            >
              <MenuItem value="City X">City X</MenuItem>
              <MenuItem value="City Y">City Y</MenuItem>
            </TextField>
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
            />
          </>
        );
      case 3:
        return (
          <>
            {profileImageFile && profileImageFile[0] ? (
              <Box mb={2}>
                <img
                  src={URL.createObjectURL(profileImageFile[0])}
                  alt="Uploaded Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              </Box>
            ) : (
              <Box mb={2}>
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt="Dummy Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                borderRadius: 1,
                height: 52,
                textTransform: "none",
                mb: 1.5,
              }}
            >
              Upload Certification Document
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "profileImage")}
              />
            </Button>

            {profileImageFile && profileImageFile.length > 0 && (
              <Typography fontSize={14} sx={{ mt: 0.5 }}>
                {profileImageFile.map((file, index) => (
                  <div key={index}>{file?.name}</div>
                ))}
              </Typography>
            )}

            {/* ID Upload */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                borderRadius: 1,
                height: 52,
                textTransform: "none",
                mb: 3,
              }}
            >
              Upload ID Document
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload(e, "uploadedIdOrLicenseDocument")
                }
              />
            </Button>
            {uploadedIdOrLicenseDocumentFile && (
              <Typography fontSize={14}>
                {uploadedIdOrLicenseDocumentFile.map((file, index) => (
                  <span key={index}>{file?.name}</span>
                ))}
              </Typography>
            )}

            {/* Reference Letters (Multiple) */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                borderRadius: 1,
                height: 52,
                textTransform: "none",
                mb: 3,
              }}
            >
              Upload Reference Letters
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => handleFileUpload(e, "referenceDocuments")}
              />
            </Button>
            {referenceDocumentsFile && (
              <Typography fontSize={14}>
                {referenceDocumentsFile.map((file, index) => (
                  <span key={index}>{file?.name}</span>
                ))}
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
            />
            {/* Terms and Conditions */}
            <Box display="flex" alignItems="center" mb={2}>
              <input
                type="checkbox"
                id="terms"
                // checked={formik.values.termsAccepted}
                onChange={(e) =>
                  formik.setFieldValue("termsAccepted", e.target.checked)
                }
                style={{ marginRight: 8 }}
              />
              <label htmlFor="terms" style={{ fontSize: 14 }}>
                I agree to the Terms and Conditions.
              </label>
            </Box>

            {/* E-Sign */}
            <Box display="flex" alignItems="center">
              <input
                type="checkbox"
                id="esign"
                onChange={(e) =>
                  formik.setFieldValue("eSigned", e.target.checked)
                }
                style={{ marginRight: 8 }}
              />
              <label htmlFor="esign" style={{ fontSize: 14 }}>
                I confirm all information is truthful (E-Sign).
              </label>
            </Box>
          </>
        );
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
              }}
            >
              {["monthly", "yearly"].map((type) => (
                <Button
                  key={type}
                  disableRipple
                  onClick={() => formik.setFieldValue("subscriptionType", type)}
                  sx={{
                    textTransform: "none",

                    borderRadius: "20px",
                    minWidth: "100px",
                    fontWeight: 500,
                    transition: "all 0.1s ease", // <== animation transition
                    backgroundColor:
                      formik.values.subscriptionType === type
                        ? "#ffffff"
                        : "transparent",
                    boxShadow:
                      formik.values.subscriptionType === type
                        ? "0 2px 8px rgba(0,0,0,0.1)"
                        : "none",
                    transform:
                      formik.values.subscriptionType === type
                        ? "scale(1.05)"
                        : "scale(1)",
                    "&:hover": {
                      backgroundColor:
                        formik.values.subscriptionType === type
                          ? "#ffffff"
                          : "#f4f4f4",
                    },
                  }}
                >
                  {type === "monthly" ? "Monthly" : "Annually"}
                </Button>
              ))}
            </Box>

            <SubscriptionPlanCard />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{ mb: 3, width: "400px", margin: "0 auto", textAlign: "left" }}
        >
          <Avatar
            src="https://ecme-react.themenate.net/img/logo/logo-light-streamline.png"
            alt="Logo"
            sx={{ width: 60, height: 60, mb: 2 }}
          />

          <Typography
            variant="h5"
            mb={0}
            gutterBottom
            textAlign="left"
            sx={{ fontWeight: 600 }}
          >
            Create your account
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
                "& .MuiStepLabel-label": {
                  color: "#a0a0a0", // default (inactive step) label color
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: "#27272a !important",
                  fontWeight: 600,
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  color: "#27272a !important",
                  fontWeight: 600,
                },
                "& .MuiStepIcon-root": {
                  color: "#e0e0e0", // default icon color
                },
                "& .MuiStepIcon-root.Mui-active": {
                  color: "#27272a",
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: "#27272a",
                },
              }}
            >
              {steps.map((label) => (
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
              minHeight: "520px",
            }}
          >
            <Box>{renderStepContent(activeStep)}</Box>
          </Box>
        </Box>

        {/* Fixed Navigation Buttons at Bottom Right */}
        <Box
          sx={{
            width: "80%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "flex-start", // or center if you prefer
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
            >
              Submit
            </Button>
          ) : (
            <>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  borderColor: "#27272a",
                  color: "#27272a",
                  height: 50,
                  textTransform: "none",
                }}
              >
                Back
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    height: 50,
                    textTransform: "none",
                    ml: 2,
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={() => formik.handleSubmit()}
                  variant="contained"
                  sx={{
                    height: 50,
                    textTransform: "none",
                    ml: 2,
                  }}
                >
                  Submit
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SignupStepper;
