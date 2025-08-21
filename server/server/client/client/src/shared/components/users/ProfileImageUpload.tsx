import React from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { X, Camera } from "lucide-react";

interface ProfileImageUploadProps {
  file: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  error?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  file,
  onFileSelect,
  onDelete,
  error,
}) => {
  const getImagePreview = () => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Image Preview */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxHeight: 200,
          borderRadius: 2,
          overflow: "hidden",
          border: error ? "2px solid #ef4444" : "2px solid #e5e7eb",
          backgroundColor: "#f9fafb",
        }}
      >
        <img
          src={getImagePreview()}
          alt="Profile Preview"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Delete Button Overlay */}
        {file && (
          <IconButton
            onClick={onDelete}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
            }}
            size="small"
          >
            <X size={16} />
          </IconButton>
        )}

        {/* Camera Icon Overlay for Empty State */}
        {!file && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#9ca3af",
            }}
          >
            <Camera size={48} />
          </Box>
        )}
      </Box>

      {/* Upload Button */}
      <Box
        component="label"
        sx={{
          display: "block",
          mt: 2,
          cursor: "pointer",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            textAlign: "center",
            border: "2px dashed #d1d5db",
            borderRadius: 2,
            backgroundColor: "#f9fafb",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f3f4f6",
            },
          }}
        >
          <Camera size={24} color="#6b7280" />
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            {file ? "Change Profile Image" : "Upload Profile Image"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              display: "block",
              mt: 0.5,
            }}
          >
            Click to select image file
          </Typography>
        </Paper>
        <input type="file" hidden accept="image/*" onChange={onFileSelect} />
      </Box>

      {/* Error Message */}
      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: "block" }}
        >
          {error}
        </Typography>
      )}

      {/* File Info */}
      {file && (
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            backgroundColor: "#f0f9ff",
            borderRadius: 1,
            border: "1px solid #bae6fd",
          }}
        >
          <Typography variant="caption" color="#0369a1">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProfileImageUpload;
