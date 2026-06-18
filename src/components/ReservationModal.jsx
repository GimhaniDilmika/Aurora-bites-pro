import { CalendarCheck, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const initialForm = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  note: ""
};

export default function ReservationModal({ open, close, createReservation }) {
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    await createReservation(form);
    setSuccess(true);
    setForm(initialForm);
  }

  function handleClose() {
    setSuccess(false);
    close();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button className="overlay" onClick={handleClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="modal" initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }}>
            <button className="iconBtn modalClose" onClick={handleClose}><X size={20} /></button>

            {success ? (
              <div className="successBox">
                <CalendarCheck size={54} />
                <h2>Reservation requested!</h2>
                <p>The manager can confirm it from the dashboard.</p>
                <button className="primaryBtn" onClick={handleClose}>Done</button>
              </div>
            ) : (
              <>
                <span className="eyebrow">Table reservation</span>
                <h2>Book a table</h2>
                <form className="checkoutForm" onSubmit={submit}>
                  <input name="name" value={form.name} onChange={updateField} placeholder="Name" required />
                  <input name="phone" value={form.phone} onChange={updateField} placeholder="Phone number" required />
                  <input name="date" value={form.date} onChange={updateField} type="date" required />
                  <input name="time" value={form.time} onChange={updateField} type="time" required />
                  <input name="guests" value={form.guests} onChange={updateField} type="number" min="1" max="20" required />
                  <textarea name="note" value={form.note} onChange={updateField} placeholder="Special request" />
                  <button className="primaryBtn fullWidth">Request Reservation</button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
