import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRef } from "react";
import { resendOtp, verifyOtp } from "../../store/actions/authActions";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { useLocation, useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

export default function Otp() {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { phoneNumber, countryCode } = useLocation().state;
  console.log("phoneNumber", phoneNumber);
  console.log("countryCode", countryCode);
  const formik = useFormik({
    initialValues: {
      otp: ["", "", "", "", "", ""],
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .of(Yup.string().length(1, "One digit required").required("Required"))
        .min(6, "Complete all 6 digits"),
    }),
    onSubmit: async (values) => {
      const otpValue = values.otp.join("");
      console.log("OTP Submitted:", otpValue);
      try {
        const result = await dispatch(
          verifyOtp({ phoneNumber: phoneNumber, countryCode:countryCode, phoneOtp: otpValue })
        ).unwrap();
        console.log("result", result); 
        navigate("/login");
      } catch (error) {
        console.error("Error verifying OTP:", error);
      }
    },
  });

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
    const result = await dispatch(resendOtp({ phoneNumber:phoneNumber, countryCode:countryCode })).unwrap();
    console.log("result", result);
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
            src="https://ecme-react.themenate.net/img/logo/logo-light-streamline.png"
            alt="Ecme logo"
            sx={{ width: 60, height: 60 }}
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
          mb={4}
        >
          We have sent you a One Time Password to your email
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
            {formik.values.otp.map((value, index) => (
              <TextField
                key={index}
                name={`otp[${index}]`}
                value={value}
                inputRef={(el) => (inputRefs.current[index] = el)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e, index)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(e, index)
                }
                error={
                  formik.touched.otp &&
                  !!formik.errors.otp &&
                  !!formik.errors.otp[index]
                }
                helperText={
                  formik.touched.otp &&
                  formik.errors.otp &&
                  formik.errors.otp[index]
                }
                variant="outlined"
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: 600,
                    padding: 10,
                    width: 56,
                    height: 40,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />
            ))}
          </Stack>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              height: 56,
              textTransform: "none",
              letterSpacing: 0.5,
              marginTop: 2,
            }}
          >
            Verify OTP
          </Button>
        </form>
        <Typography
          sx={{
            mt: 3,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Didn't receive the OTP?{" "}
          <Button className="font-medium underline text-right text-[14px]" onClick={handleResendOtp}>
            Resend OTP
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
