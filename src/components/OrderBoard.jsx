import { Clock, CreditCard, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../utils/analytics";

const statuses = ["new", "preparing", "ready", "completed", "cancelled"];

function prettyStatus(status = "") {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function OrderBoard({ orders, updateStatus, updatePaymentStatus }) {
  const [filter, setFilter] = useState("all");
  const visibleOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  return (
    <section className="dashboardPanel">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">Live operations</span>
          <h2>Order Board</h2>
        </div>
        <div className="statusFilters">
          {["all", ...statuses].map((status) => (
            <button key={status} className={filter === status ? "selected" : ""} onClick={() => setFilter(status)}>
              {prettyStatus(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="orderList">
        {!visibleOrders.length && (
          <div className="emptyState"><strong>No orders here yet</strong><span>New customer orders will appear in real time.</span></div>
        )}

        {visibleOrders.map((order) => (
          <article className="orderCard" key={order.id}>
            <div className="orderCardTop">
              <div>
                <span className={`statusBadge ${order.status}`}>{prettyStatus(order.status || "new")}</span>
                <h3>{order.orderCode || order.id.slice(0, 8)}</h3>
              </div>
              <strong>{formatCurrency(order.total)}</strong>
            </div>

            <div className="orderInfoGrid">
              <span><User size={15} /> {order.customerName}</span>
              <span><Phone size={15} /> {order.phone}</span>
              <span><Clock size={15} /> {order.prepMinutes || 15} min</span>
              <span><CreditCard size={15} /> {order.paymentMethod} • {order.paymentStatus}</span>
              <span><MapPin size={15} /> {order.deliveryMethod === "pickup" ? "Pickup order" : order.address}</span>
            </div>

            <div className="orderedItems">
              {(order.items || []).map((item) => (
                <span key={`${order.id}-${item.id}`}>{item.quantity}× {item.name}</span>
              ))}
            </div>

            {order.note && <p className="noteBox">Note: {order.note}</p>}

            <div className="statusActions">
              {statuses.map((status) => (
                <button key={status} className={order.status === status ? "selected" : ""} onClick={() => updateStatus(order.id, status)}>
                  {prettyStatus(status)}
                </button>
              ))}
              <button className={order.paymentStatus === "paid" ? "selected" : ""} onClick={() => updatePaymentStatus(order.id, order.paymentStatus === "paid" ? "pending" : "paid")}>
                Mark {order.paymentStatus === "paid" ? "Pending" : "Paid"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
