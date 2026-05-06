import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardActions, Button, Typography, Stack, Box } from "@mui/material";

export default function CartPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API = "http://localhost:3000/api/orders";

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) return;

    setUser(savedUser);
    fetchOrders(savedUser);
  }, []);

  const fetchOrders = async (savedUser) => {
    try {
      const res = await axios.get(`${API}?user=${savedUser._id || savedUser.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (order) => {
    navigate(`/paymentForm/${order._id}`); 
    console.error("wadak na kata krla");
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return; 

    try {
      await axios.delete(`${API}/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Failed to delete order");
    }
  };

  if (!user) return <p>No user logged in</p>;
  if (loading) return <p>Loading cart...</p>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>🛒 My Cart</Typography>

      {orders.length === 0 ? (
        <Typography>No items in cart</Typography>
      ) : (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ overflowX: { xs: "hidden", sm: "auto" }, paddingY: 2 }}
        >
          {orders.map((order) => {
            const total =
              (order.parts?.reduce((acc, p) => acc + p.price * p.quantity, 0) || 0) +
              (order.vehicles?.reduce((acc, v) => acc + v.price, 0) || 0);

            return (
              <Card
                key={order._id}
                sx={{
                  minWidth: 300,
                  maxWidth: 350,
                  flexShrink: 0,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order ID: {order._id}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Status: {order.status}
                  </Typography>
                  <Typography variant="h6" gutterBottom>Total: ${total}</Typography>

                  {order.parts.length > 0 && (
                    <>
                      <Typography variant="subtitle2">Parts</Typography>
                      {order.parts.map((p, idx) => (
                        <Typography key={idx} variant="body2">
                          {p.name} (x{p.quantity}) - ${p.price}
                        </Typography>
                      ))}
                    </>
                  )}

                  {order.vehicles.length > 0 && (
                    <>
                      <Typography variant="subtitle2">Vehicles</Typography>
                      {order.vehicles.map((v, idx) => (
                        <Typography key={idx} variant="body2">
                          {v.name} - ${v.price}
                        </Typography>
                      ))}
                    </>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handlePayment(order)}
                  >
                    Payment
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
