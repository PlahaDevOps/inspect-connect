import * as Yup from "yup";

const signupValidationSchemas = [
  Yup.object().shape({
    name: Yup.string().required("Full Name is required"),
    phoneNumber: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mailingAddress: Yup.string().required("Address is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be less than 20 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
      
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required")
      .max(20, "Confirm Password must be less than 20 characters"),
    // termsAccepted: Yup.boolean().oneOf([true], ""),
    // eSigned: Yup.boolean().oneOf([true], ""),
  }),
  Yup.object().shape({
    certificateTypeId: Yup.string().required("Certification Type is required"),
    certificateAgencyIds: Yup.array()
      .of(Yup.string())
      .required("Certifying Agency is required")
      .min(1, "At least one certifying agency is required"),
    certificateExpiryDate: Yup.string().required("Expiration Date is required"),
    certificateDocuments: Yup.mixed().required(
      "Certification File is required"
    ).test("file-required", "Certification File is required", (value) => {
      if (!value) return false;
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return true;
    }),
  }),
  Yup.object().shape({
    state: Yup.string().required("State is required"),
    country: Yup.string().required("County is required"),
    city: Yup.string().required("City is required"), 
  }),
  Yup.object().shape({
    profileImage: Yup.mixed().required("Profile Image is required"),
    uploadedIdOrLicenseDocument: Yup.mixed().required(
      "ID Document is required"
    ),
    // referenceDocuments: Yup.mixed().required("Reference Letters are required"),
    // workHistoryDescription: Yup.string().required("Work History Description is required"),
    termsAccepted: Yup.boolean().oneOf([true], ""),
    eSigned: Yup.boolean().oneOf([true], ""),
  }),
  Yup.object().shape({
    subscriptionType: Yup.string().required("Subscription Type is required"),
  }),
];
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be less than 20 characters")
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});
const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be less than 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required")
    .max(20, "Confirm Password must be less than 20 characters"),
});
const otpValidationSchema = Yup.object({
  otp: Yup.array()
  .length(6)
 
  .test("all-filled", "Please enter the 6-digit code", (arr) =>
    Array.isArray(arr) && arr.every(ch => /^\d$/.test(ch || ""))
  ),
});

export {
  signupValidationSchemas,
  LoginSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
  otpValidationSchema,
};
 