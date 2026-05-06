import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

export default function VehiclePartCard({ part }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/showPartDetails/${part._id}`);
  };

  return (
    <Card
      sx={{
        width: 320, // fixed width
        height: 460, // fixed height
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        boxShadow: 4,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 8,
        },
        overflow: "hidden",
        marginBottom: 2,
      }}
    >
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <CardMedia
          component="img"
          height="220"
          image={
            part.image
              ? `http://localhost:3000/uploads/${part.image}`
              : "https://via.placeholder.com/320x220"
          }
          alt={part.name}
          sx={{
            objectFit: "cover",
            width: "100%", // make image fill card width
            height: "220px",
            transition: "transform 0.3s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <Chip
            label={part.status}
            color={
              part.status.toLowerCase() === "available"
                ? "success"
                : part.status.toLowerCase() === "out of stock"
                ? "error"
                : "warning"
            }
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, px: 2, py: 1.5 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {part.name} {part.model ? `(${part.model})` : ""}
        </Typography>

        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            <strong>Type:</strong> {part.type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Brand:</strong> {part.brand}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Quantity:</strong> {part.quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Price:</strong> ${Number(part.price).toLocaleString()}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ mt: "auto", px: 2, pb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleViewDetails}
          sx={{
            fontWeight: 600,
            textTransform: "capitalize",
            py: 1,
            "&:hover": { backgroundColor: "#1976d2" },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
