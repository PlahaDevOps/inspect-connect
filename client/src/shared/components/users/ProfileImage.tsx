import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { X, Camera } from "lucide-react";

interface ProfileImageUploadProps {
  file: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  file,
  onFileSelect,
  onDelete,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Image Preview */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 200,
          borderRadius: 2,
          overflow: "hidden",
          border: "2px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <IconButton
              onClick={onDelete}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
              }}
              size="small"
            >
              <X size={16} />
            </IconButton>
          </>
        ) : (
          <Camera size={48} color="#9ca3af" />
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
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            border: "2px dashed #d1d5db",
            borderRadius: 2,
            backgroundColor: "#f9fafb",
            cursor: "pointer",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f3f4f6",
            },
          }}
        >
          <Camera size={24} color="#6b7280" />
          <Typography variant="body2" sx={{ mt: 1, color: "#6b7280" }}>
            {file ? "Change Image" : "Upload Profile Image"}
          </Typography>
        </Box>
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={onFileSelect}
        />
      </Box>

      {/* File Info */}
      {file && (
        <Typography variant="caption" sx={{ mt: 1, display: "block", color: "#6b7280" }}>
          {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </Typography>
      )}
    </Box>
  );
};

export default ProfileImageUpload;
