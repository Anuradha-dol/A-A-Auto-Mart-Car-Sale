import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentManagerSideShowPayment.css";

export default function PaymentManagerSideShowPayment() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) return;

    axios
      .get(`http://localhost:3000/api/payment/${paymentId}`)
      .then((res) => setPayment(res.data))
      .catch((err) => {
        console.error("Error fetching payment:", err);
        alert("Payment not found");
        navigate("/paymentManager-dashboard"); // fallback
      })
      .finally(() => setLoading(false));
  }, [paymentId, navigate]);

  if (loading) return <p className="loading">Loading payment details...</p>;
  if (!payment) return <p className="loading">No payment details found.</p>;

  const order = payment.order;
  const totalAmount =
    (order?.parts?.reduce((acc, p) => acc + p.price * p.quantity, 0) || 0) +
    (order?.vehicles?.reduce((acc, v) => acc + v.price, 0) || 0);

  return (
    <div className="pm-container">
      <div className="pm-card">
        {/* Header */}
        <h1 className="pm-title">💳 Payment Details</h1>

        {/* Payment Info */}
        <div className="pm-section">
          <p><strong>Payment ID:</strong> {payment._id}</p>
          <p><strong>User:</strong> {payment.user?.name || "Unknown"}</p>
          <p><strong>Amount Paid:</strong> <span className="highlight">${payment.amount}</span></p>
          <p><strong>Status:</strong> 
            <span className={`status ${payment.status?.toLowerCase()}`}>
              {payment.status}
            </span>
          </p>
          <p><strong>Notes:</strong> {payment.notes || "—"}</p>
        </div>

        {/* Slip */}
        {payment.slipImage && (
          <div className="pm-section">
            <h3>🧾 Slip Image</h3>
            <img
              src={`http://localhost:3000/uploads/payments/${payment.slipImage}`}
              alt="Payment Slip"
              className="pm-image"
            />
          </div>
        )}

        {/* Order */}
        {order && (
          <div className="pm-section">
            <h2 className="pm-subtitle">📦 Order Details</h2>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total Order Amount:</strong> <span className="highlight">${totalAmount}</span></p>

            {order.parts?.length > 0 && (
              <div className="list">
                <h3>🔧 Parts</h3>
                <ul>
                  {order.parts.map((p, idx) => (
                    <li key={idx}>{p.name} (x{p.quantity}) – ${p.price}</li>
                  ))}
                </ul>
              </div>
            )}

            {order.vehicles?.length > 0 && (
              <div className="list">
                <h3>🚗 Vehicles</h3>
                <ul>
                  {order.vehicles.map((v, idx) => (
                    <li key={idx}>{v.name} – ${v.price}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/paymentManager-dashboard")}
          className="pm-btn"
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}
