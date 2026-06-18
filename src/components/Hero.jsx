import { ArrowRight, CalendarDays, Flame, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";

export default function Hero({ scrollToMenu, openReservation }) {
  return (
    <section className="hero">
      <div className="heroGridGlow" />

      <motion.div
        className="heroContent"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <span className="eyebrow">
          <Sparkles size={16} />
          Modern restaurant ordering system
        </span>

        <h1>Order food, pay online, track orders, and reserve tables.</h1>

        <p>
          Aurora Bites Pro is a premium restaurant web app with 50+ menu items,
          smart cart, demo payment checkout, coupons, reservations, and a real-time manager dashboard.
        </p>

        <div className="heroActions">
          <button className="primaryBtn" onClick={scrollToMenu}>
            Explore 50+ Foods <ArrowRight size={18} />
          </button>
          <button className="ghostBtn" onClick={openReservation}>
            <CalendarDays size={18} /> Book Table
          </button>
        </div>

        <div className="heroStats">
          <span><strong>50+</strong> Food Items</span>
          <span><strong>24/7</strong> Online Orders</span>
          <span><strong>4.8</strong> Rating</span>
        </div>
      </motion.div>

      <motion.div
        className="heroCard"
        initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.65, delay: 0.15 }}
      >
        <div className="heroFood">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
            alt="Premium restaurant food"
          />
          <span className="floatingBadge">
            <Flame size={16} />
            Hot Deal Today
          </span>
        </div>

        <div className="aiPanel">
          <span>Smart system preview</span>
          <strong>Orders + Payments + Reservations</strong>
          <small><Star size={14} fill="currentColor" /> Built for mobile, desktop, and dashboard presentation.</small>
        </div>
      </motion.div>
    </section>
  );
}
