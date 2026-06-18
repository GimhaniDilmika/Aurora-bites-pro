import { CalendarDays, ChefHat, LayoutDashboard, Search, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { formatCurrency } from "../utils/analytics";

export default function Header({ view, setView, cartCount, cartTotal, openCart, openReservation }) {
  return (
    <motion.header
      className="header"
      initial={{ y: -26, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <button className="brand" onClick={() => setView("customer")}>
        <span className="brandIcon">
          <ChefHat size={22} />
        </span>
        <span>
          <strong>Aurora Bites Pro</strong>
          <small>Smart Restaurant Platform</small>
        </span>
      </button>

      <nav className="nav desktopOnly">
        <button className={view === "customer" ? "active" : ""} onClick={() => setView("customer")}>
          <Search size={17} /> Menu
        </button>
        <button onClick={openReservation}>
          <CalendarDays size={17} /> Reserve
        </button>
        <button className={view === "manager" ? "active" : ""} onClick={() => setView("manager")}>
          <LayoutDashboard size={17} /> Manager
        </button>
      </nav>

      <button className="cartButton" onClick={openCart}>
        <ShoppingBag size={18} />
        <span>{cartCount}</span>
        <strong>{formatCurrency(cartTotal)}</strong>
      </button>
    </motion.header>
  );
}
