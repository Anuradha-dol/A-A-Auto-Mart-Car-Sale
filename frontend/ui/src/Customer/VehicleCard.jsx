import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/showVehicleDetails/${vehicle._id}`);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: 3,
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
      }}
    >
      {/* Vehicle Image */}
      <CardMedia
        component="img"
        height="200"
        image={
          vehicle.image
            ? `http://localhost:3000/uploads/${vehicle.image}`
            : "https://via.placeholder.com/300x200"
        }
        alt={vehicle.name}
        sx={{ objectFit: "cover" }}
      />

      {/* Vehicle Info */}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {vehicle.name} ({vehicle.model})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Type:</strong> {vehicle.type} | <strong>Brand:</strong> {vehicle.brand}
        </Typography>
        <Typography variant="body1" color="primary" sx={{ fontWeight: "bold", mt: 1 }}>
          ${Number(vehicle.price).toLocaleString()}
        </Typography>

        {/* Status Badge */}
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip
            label={vehicle.status}
            color={
              vehicle.status.toLowerCase() === "available"
                ? "success"
                : vehicle.status.toLowerCase() === "sold"
                ? "error"
                : "warning"
            }
            size="small"
          />
        </Stack>
      </CardContent>

      {/* Action */}
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
