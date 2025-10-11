import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./PaymentView.css"; 

export default function PaymentView() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/payment/${paymentId}`)
      .then((res) => setPayment(res.data))
      .catch((err) => {
        console.error(err);
        alert("Payment not found");
        navigate("/cart");
      })
      .finally(() => setLoading(false));
  }, [paymentId, navigate]);

  if (loading) return <p>Loading payment details...</p>;
  if (!payment) return <p>Payment not found</p>;

  const totalAmount =
    (payment.order.parts?.reduce((acc, p) => acc + p.price * p.quantity, 0) || 0) +
    (payment.order.vehicles?.reduce((acc, v) => acc + v.price, 0) || 0);

  const downloadPDF = () => {
    const element = document.getElementById("payment-details");
    html2canvas(element, { scale: 2, useCORS: true, allowTaint: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`payment_${paymentId}.pdf`);
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);
        alert("Failed to generate PDF. Make sure images are accessible.");
      });
  };

return (
  <div className="payment-container">
    <div id="payment-details" className="payment-details">
      <h2>💳 Payment Details</h2>
      <p><strong>Order ID:</strong> {payment.order._id}</p>
      <p><strong>Amount Paid:</strong> ${payment.amount}</p>
      <p><strong>Status:</strong> {payment.status}</p>
      <p><strong>Notes:</strong> {payment.notes || "-"}</p>
      <p><strong>Total Order Value:</strong> ${totalAmount}</p>

      <h4>Order Details</h4>
      {payment.order.parts.map((p, idx) => (
        <p key={idx}>{p.name} (x{p.quantity}) - ${p.price}</p>
      ))}
      {payment.order.vehicles.map((v, idx) => (
        <p key={idx}>{v.name} - ${v.price}</p>
      ))}

      {payment.slipImage && (
        <div>
          <h4>Slip Image:</h4>
          <img
            src={`http://localhost:3000/uploads/payments/${payment.slipImage}`}
            alt="Slip"
          />
        </div>
      )}
    </div>

    <button className="download-btn" onClick={downloadPDF}>
      📄 Download PDF
    </button>
  </div>
);

}
