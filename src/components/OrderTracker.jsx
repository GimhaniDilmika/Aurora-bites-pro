import { SearchCheck } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../utils/analytics";

export default function OrderTracker({ orders }) {
  const [code, setCode] = useState("");
  const order = orders.find((item) => String(item.orderCode || "").toLowerCase() === code.trim().toLowerCase());

  return (
    <section className="trackerSection">
      <div>
        <span className="eyebrow">Track your order</span>
        <h2>Enter your order code</h2>
        <p>After placing an order, customers can check the order status using their order code.</p>
      </div>

      <div className="trackerCard">
        <label className="searchBox">
          <SearchCheck size={18} />
          <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Example: AB-123456" />
        </label>

        {code && !order && <div className="emptyState small"><strong>No order found</strong><span>Please check your order code.</span></div>}

        {order && (
          <div className="trackingResult">
            <span className={`statusBadge ${order.status}`}>{order.status}</span>
            <h3>{order.orderCode}</h3>
            <p>{order.customerName} • {formatCurrency(order.total)}</p>
            <div className="trackingSteps">
              {["new", "preparing", "ready", "completed"].map((step) => (
                <span key={step} className={step === order.status ? "active" : ""}>{step}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
