import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";

import { useEffect, useRef, useState } from "react";
import { resendOtp, verifyOtp } from "../../../store/actions/authActions";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { useLocation, useNavigate } from "react-router-dom";
import pageNotFound from "../../../assets/svg/page-not-found.svg";
import { otpValidationSchema } from "../../../utils/validations/AuthValidations";
import { ArrowRight } from "lucide-react";
import { Logos } from "../../../utils/assets";


export default function Otp() {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber, countryCode, fromSignup } = location.state || {};  



  const [showInfo, setShowInfo] = useState(false);

  const formik = useFormik({
    initialValues: {
      otp: ["", "", "", "", "", ""],
    },
    validationSchema: otpValidationSchema,
    onSubmit: async (values) => {
      const otpValue = values.otp.join("");
      try {
        const result = await dispatch(
          verifyOtp({
            phoneNumber: phoneNumber,
            countryCode: countryCode,
            phoneOtp: otpValue,
          })
        ).unwrap();
        console.log("result", result);
        navigate("/signin");
      } catch (error) {
        console.error("Error verifying OTP:", error);
      }
    },
  });



  const showOtpError =
    formik.submitCount > 0 &&
    typeof formik.errors.otp === "string" &&
    !formik.values.otp.every(digit => digit !== "");

  const showFieldError = (idx: number) => {
    if (!showOtpError) return false;

    // Show error for empty fields when OTP is incomplete
    const isOtpComplete = formik.values.otp.every(digit => digit !== "");
    if (isOtpComplete) return false;

    // Only show error for empty fields, not when focused
    return !formik.values.otp[idx];
  };

  // Auto-focus first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => { 
    if (!fromSignup) {
      setShowInfo(true);
    }
  }, [fromSignup]);
  if (showInfo) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Container
          maxWidth="sm"
          sx={{
            textAlign: "center",
            m: 10,
          }}
        >
          <img
            src={pageNotFound}
            alt="Access Denied"
            style={{ width: "100%", maxWidth: 240, margin: "0 auto" }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mt: 2,

            }}
          >
            Oops! You can’t access this page directly.
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 14 }}>
            Please sign up first to receive an OTP.
          </Typography>
          <Button
            sx={{ height: 56, width: "auto", mt: 3 }}
            variant="contained"
            onClick={() => navigate("/signup-role")}
            endIcon={<ArrowRight size={20} />}
          >
            Sign Up Now
          </Button>
        </Container>
      </Box>
    );
  }
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasteData)) return;

    const otpArray = pasteData.split("").slice(0, 6);
    const newOtp = [...formik.values.otp];

    otpArray.forEach((digit, i) => {
      if (index + i < 6) {
        newOtp[index + i] = digit;
      }
    });

    formik.setFieldValue("otp", newOtp);

    const lastFilledIndex = Math.min(index + otpArray.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...formik.values.otp];
      newOtp[index] = value;
      formik.setFieldValue("otp", newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !formik.values.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleResendOtp = async () => {
    try {
      await dispatch(
        resendOtp({ phoneNumber: phoneNumber, countryCode: countryCode })
      ).unwrap();
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };
  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={{
          p: 2,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Avatar
            src={Logos.small}
            alt="Ecme logo"
            sx={{ width: 60, height: 60, cursor: "pointer" }}
          />
        </Box>

        <Typography
          variant="h5"
          mb={0}
          gutterBottom
          textAlign="left"
          sx={{ fontWeight: 600 }}
        >
          OTP Verification
        </Typography>

        <Typography
          variant="body1"
          sx={{ fontWeight: 500, fontSize: 14 }}
          textAlign="left"
          mb={5}
        >
          We have sent you a One Time Password to your phone number
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, }}>


          <form onSubmit={formik.handleSubmit}>
            <Stack direction="row" spacing={1} justifyContent="center" >
              {formik.values.otp.map((value, index) => (
                <TextField
                  key={index}
                  name={`otp[${index}]`}
                  value={value}
                  inputRef={(el) => (inputRefs.current[index] = el)}

                  onBlur={(e) => {

                    formik.handleBlur(e);
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e, index)}
                  error={showFieldError(index)}
                  variant="outlined"
                  inputProps={{
                    maxLength: 1,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    style: {
                      textAlign: "center",
                      fontSize: 24,
                      fontWeight: 600,
                      padding: 10,
                      width: 56,
                      height: 40,
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                />
              ))}
            </Stack>

            {showOtpError && (
              <Typography color="error" align="left" sx={{ mb: 1, fontSize: 12, ml: 1,mt:0.5 }}>
                {formik.errors.otp}
              </Typography>
            )}


            <Button
              type="submit"
              fullWidth
              variant="contained"
              endIcon={<ArrowRight size={20} />}
              sx={{
                height: 56,
                textTransform: "none",
                letterSpacing: 0.5,
                marginTop: 3,
              }}
            >
              Verify OTP
            </Button>
          </form>
        </Box>
        <Typography
          sx={{
            mt: 1,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Didn't receive the OTP?{" "}
          <Button
            className="font-medium underline text-right text-[14px]"
            onClick={handleResendOtp}
          >
            Resend OTP
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
