import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, IconButton, LinearProgress, Chip, Tooltip } from "@mui/material";
import { FileText, Image as ImageIcon, Trash } from "lucide-react";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export type UploadItem = {
  id: string;
  file?: File; // optional once uploaded
  name: string;
  size: number;
  type: string;
  progress: number; // 0..100
  status: UploadStatus;
  url?: string;
  error?: string;
};

interface FileUploadProps {
  items: UploadItem[];
  onDelete: (index: number) => void;
  title?: string;
 
  mode?: "profile" | "list";
   
  uploadControl?: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({
  items,
  onDelete,
  title = "Uploaded Files",
  mode = "list",
  uploadControl,
}) => {
  // Move all hooks to the top level
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);
  
  // Only create previewUrl if we're in profile mode and have items
  const previewUrl = useMemo(() => {
    if (mode === "profile" && items?.[0]) {
      return items[0].url || objectUrl;
    }
    return undefined;
  }, [mode, items, objectUrl]);

  useEffect(() => {
    if (mode === "profile" && items?.[0]) {
      const item = items[0];
      if (!item.url && item.file) {
        const u = URL.createObjectURL(item.file);
        setObjectUrl(u);
        return () => URL.revokeObjectURL(u);
      }
      // If there's a server URL, make sure any old object URL gets cleaned.
      return () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, items, objectUrl]);

  if (!items?.length) {
    // In profile mode, even if there is no item yet, we still show the title and the upload control.
    if (mode === "profile") {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            {title}
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: 200,
              borderRadius: 2,
              border: "2px dashed #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No profile image uploaded
            </Typography>
          </Box>

          {uploadControl && <Box sx={{ mt: 1 }}>{uploadControl}</Box>}
        </Box>
      );
    }
    return null;
  }

  // ----- PROFILE MODE -----
  if (mode === "profile") {
    const item = items[0];

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>

        <Box sx={{ position: "relative", mb: 1.5 }}>
          {/* Image / Placeholder */}
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                borderRadius: 12,
                border: "2px solid #e5e7eb",
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 220,
                borderRadius: 2,
                border: "2px dashed #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#fafafa",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Preparing preview…
              </Typography>
            </Box>
          )}

          {/* Delete */}
          <IconButton
            onClick={() => onDelete(0)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
            }}
            size="small"
            aria-label="delete profile image"
          >
            <Trash size={16} />
          </IconButton>

          {/* Progress / Status overlay (bottom-left) */}
          {item?.status === "uploading" && (
            <Box
              sx={{
                position: "absolute",
                left: 12,
                bottom: 12,
                right: 12,
                bgcolor: "rgba(255,255,255,0.9)",
                borderRadius: 1,
                p: 1,
                boxShadow: 1,
              }}
            >
              <LinearProgress variant="determinate" value={item.progress} />
              <Typography variant="caption" color="text.secondary">
                Uploading… {item.progress}%
              </Typography>
            </Box>
          )}
          {item?.status === "success" && (
            <Box
              sx={{
                position: "absolute",
                left: 12,
                bottom: 12,  
                p: 0.5,
                 
              }}
            >
              <Chip size="small" sx={{ backgroundColor: "success.main", color: "#fff" }} label="Uploaded" />
            </Box>
          )}
          {item?.status === "error" && (
            <Box
              sx={{
                position: "absolute",
                left: 12,
                bottom: 12,
                bgcolor: "rgba(255,255,255,0.95)",
                borderRadius: 1,
                p: 0.75,
                boxShadow: 1,
              }}
            >
              <Typography variant="caption" color="error">
                {item.error || "Upload failed."}
              </Typography>
            </Box>
          )}
        </Box>

       
      </Box>
    );
  }

  // ----- LIST MODE (default) -----
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>

      {items.map((it, index) => (
        <Box
          key={it.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            p: 2,
            mb: 1.5,
            border: "1px solid #e5e7eb",
            borderRadius: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
            {it.type?.startsWith("image/") ? <ImageIcon size={20} /> : <FileText size={20} />}

         

            <Box sx={{ minWidth: 0 }}>
              <Tooltip title={it.name}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}
                >
                  {it.name}
                </Typography>
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                {(it.size / 1024).toFixed(1)} KB
              </Typography>

              {it.status === "uploading" && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress variant="determinate" value={it.progress} />
                  <Typography variant="caption" color="text.secondary">
                    Uploading… {it.progress}%
                  </Typography>
                </Box>
              )}

              {it.status === "success" && (
                <Box sx={{ mt: 0.5, display: "flex", gap: 1, alignItems: "center" }}>
                  <Chip size="small" label="Uploaded" sx={{ backgroundColor: "success.main", color: "#fff" }} />
                  {it.url && (
                    <a href={it.url} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>
                      View
                    </a>
                  )}
                </Box>
              )}

              {it.status === "error" && (
                <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                  {it.error || "Upload failed."}
                </Typography>
              )}
            </Box>
          </Box>

          <IconButton
            aria-label="delete"
            onClick={() => onDelete(index)}
            size="small"
            sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fef2f2" } }}
          >
            <Trash size={16} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default FileUpload;
