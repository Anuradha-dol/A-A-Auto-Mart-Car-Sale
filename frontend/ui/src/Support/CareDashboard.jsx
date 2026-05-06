import { Link, Outlet, useLocation } from "react-router-dom";
import "./CareDashboard.css";
import AdminTicketList from "./AdminTicketList";

export default function CareDashboard() {
  const { pathname } = useLocation();
  const onReviews = pathname.startsWith("/care-dashboard/reviews");

  return (
    <div className="care-wrap">
      <header className="care-header">
        <h2 className="care-title">Care Dashboard</h2>

        <div className="care-actions">
          {onReviews ? (
            <Link to="/care-dashboard" className="btn btn-blue">
              ← Back to Tickets
            </Link>
          ) : (
            <Link to="reviews" className="btn btn-green">
              Review Management
            </Link>
          )}
        </div>
      </header>

      {/* Page body */}
      <div className="care-body">
        {onReviews ? (
          /* When on /care-dashboard/reviews, render the child route here */
          <Outlet />
        ) : (
          /* Default page: tickets list */
          <section className="care-card">
            <div className="card-head">
              <h3 className="card-title">Support Tickets</h3>
              <p className="muted">Open a ticket to view & reply.</p>
            </div>
            <div className="card-body">
              <AdminTicketList />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
