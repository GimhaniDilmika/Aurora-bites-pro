import { LockKeyhole, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function ManagerLogin({ onLogin }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const allowed = import.meta.env.VITE_MANAGER_PASSCODE || "chef2026";

    if (passcode === allowed) {
      setError("");
      onLogin();
      return;
    }

    setError("Invalid passcode. Default demo passcode is chef2026.");
  }

  return (
    <section className="loginPage">
      <motion.div className="loginCard" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
        <div className="loginIcon"><ShieldCheck size={32} /></div>
        <span className="eyebrow">Secure manager area</span>
        <h1>Manager Dashboard Login</h1>
        <p>Access live orders, payment status, reservations, analytics, and menu controls.</p>

        <form onSubmit={handleSubmit}>
          <label>
            <LockKeyhole size={18} />
            <input type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} placeholder="Enter manager passcode" required />
          </label>
          {error && <div className="errorText">{error}</div>}
          <button className="primaryBtn fullWidth">Enter Dashboard</button>
        </form>
      </motion.div>
    </section>
  );
}
