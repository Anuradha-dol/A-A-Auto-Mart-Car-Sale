import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentForm.css"; 

export default function PaymentForm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ bank: "", phoneNumber: "", slipImage: null, notes: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const ORDERS_API = "http://localhost:3000/api/orders";
  const PAYMENTS_API = "http://localhost:3000/api/payment";

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) return setLoading(false);
    setUser(savedUser);

    axios.get(`${ORDERS_API}/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error(err);
        alert("Order not found");
        navigate("/cart");
      })
      .finally(() => setLoading(false));
  }, [orderId, navigate]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files) setForm(prev => ({ ...prev, [name]: files[0] }));
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.slipImage) return alert("Slip image is required");

    const totalAmount =
      (order.parts?.reduce((acc, p) => acc + p.price * p.quantity, 0) || 0) +
      (order.vehicles?.reduce((acc, v) => acc + v.price, 0) || 0);

    const data = new FormData();
    data.append("order", order._id);
    data.append("user", user._id || user.id);
    data.append("userID", user.userID);
    data.append("amount", totalAmount);
    data.append("slipImage", form.slipImage);
    data.append("notes", `Bank: ${form.bank}, Phone: ${form.phoneNumber}, ${form.notes}`);

    setSubmitting(true);
    try {
      const res = await axios.post(PAYMENTS_API, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Payment submitted successfully");
      const paymentId = res.data._id;
      navigate(`/paymentView/${paymentId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="pf-loading">Loading order details...</p>;
  if (!order) return <p className="pf-loading">Order not found</p>;

  return (
    <div className="pf-container">
       <button className="cd-btn secondary-btn" onClick={() => navigate("/customer-dashboard")}>back to home</button>

      <div className="pf-card">
        <h2 className="pf-title">💳 Payment for Order {order._id}</h2>
        <p className="pf-total">
          <strong>Total Amount:</strong> $
          {(order.parts?.reduce((acc, p) => acc + p.price * p.quantity, 0) || 0) +
           (order.vehicles?.reduce((acc, v) => acc + v.price, 0) || 0)}
        </p>

        <div className="pf-order-details">
          <h3>Order Details</h3>
          {order.parts.map((p, idx) => (
            <p key={idx}>{p.name} (x{p.quantity}) - ${p.price}</p>
          ))}
          {order.vehicles.map((v, idx) => (
            <p key={idx}>{v.name} - ${v.price}</p>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="pf-form">
          <label>Bank Name:</label>
          <input type="text" name="bank" value={form.bank} onChange={handleChange} required />

          <label>Phone Number:</label>
          <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />

          <label>Slip Image:</label>
          <input type="file" name="slipImage" accept="image/*" onChange={handleChange} required />

          <label>Notes (optional):</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} />

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}
