import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Logos } from "../../../utils/assets";

const SignUpRoleSelect: React.FC = () => {
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  const handleSubmit = () => { 
    navigate("/signup", { state: { role,  } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="div"
        sx={{
          width: 400,
          p: 2         
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Avatar
            src={Logos.small}
            alt="Ecme logo"
            sx={{ width: 60, height: 60,cursor:"pointer" }}
            onClick={() => navigate("/")}
          />
        </Box>

        <Typography
          variant="h5"
          mb={0}
          gutterBottom
          textAlign="left"
          sx={{ fontWeight: 600 }}
        >
          Join as a Client or Inspector
        </Typography>

        <Typography
          variant="body1"
          sx={{ fontWeight: 500, fontSize: 14 }}
          textAlign="left"
          mb={6}
        >
          Create your account to start booking or performing inspections with ease
        </Typography>

        <Box component="form" sx={{ display: "flex", flexDirection: "column",  }}>
          <RadioGroup
            value={role}
            onChange={handleChange}
            row
            sx={{ gap: 3, mb: 3, flexWrap: "wrap" }}
          >
            {[
              {
                value: "client",
                label: "I'm a client, hiring for an inspector",
              },
              {
                value: "inspector",
                label: "I'm an inspector, looking for work",
              },
             
            ].map((option) => (
                <Paper
                key={option.value}
                elevation={0}
                sx={{
                  border:
                    role === option.value
                      ? "2px solid #27272a"
                      : "2px solid #ccc",
                  borderRadius: 1,
                  p: 2,
                  width: "100%"                  
                }}
              >
              
                <FormControlLabel
                  value={option.value}
                  control={<Radio sx={{ }} />}
                  label={
                    <Typography
                      fontWeight={600}                     
                    >
                      {option.label}
                    </Typography>
                  }
                  sx={{  marginLeft: 0 }}
                />
              </Paper>
            ))}
          </RadioGroup>

          <Button
            type="button"
            fullWidth
            variant="contained"
            disabled={!role}
            sx={{
              height: 56,
              textTransform: "none",
             
            }}
            endIcon={<ArrowRight size={20} />}
            onClick={handleSubmit}
          >
            Create Account
          </Button>
        </Box>

        <Typography
          sx={{
            mt: 2,
            textAlign: "center",
            fontSize: 14          
          }}
        >
          Already have an account?{" "}
          <Link
            className="font-medium underline text-right text-[14px]"
            to="/signin"
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpRoleSelect;
