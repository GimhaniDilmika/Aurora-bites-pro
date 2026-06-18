import { CalendarDays, Phone, Users } from "lucide-react";

export default function ReservationBoard({ reservations, updateReservationStatus }) {
  return (
    <section className="dashboardPanel">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">Table bookings</span>
          <h2>Reservation Board</h2>
        </div>
      </div>

      <div className="reservationGrid">
        {!reservations.length && (
          <div className="emptyState"><strong>No reservations yet</strong><span>Customer reservation requests appear here.</span></div>
        )}

        {reservations.map((item) => (
          <article className="reservationCard" key={item.id}>
            <span className={`statusBadge ${item.status}`}>{item.status}</span>
            <h3>{item.name}</h3>
            <p><Phone size={15} /> {item.phone}</p>
            <p><CalendarDays size={15} /> {item.date} at {item.time}</p>
            <p><Users size={15} /> {item.guests} guests</p>
            {item.note && <small>{item.note}</small>}
            <div className="statusActions">
              {["pending", "confirmed", "cancelled"].map((status) => (
                <button key={status} className={item.status === status ? "selected" : ""} onClick={() => updateReservationStatus(item.id, status)}>{status}</button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
