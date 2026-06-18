import { CalendarDays, Home, LayoutDashboard, ShoppingBag } from "lucide-react";

export default function MobileNav({ setView, openCart, openReservation, cartCount }) {
  return (
    <nav className="mobileNav">
      <button onClick={() => setView("customer")}>
        <Home size={20} />
        <span>Home</span>
      </button>
      <button onClick={openReservation}>
        <CalendarDays size={20} />
        <span>Reserve</span>
      </button>
      <button onClick={openCart} className="mobileCartBtn">
        <ShoppingBag size={20} />
        <b>{cartCount}</b>
        <span>Cart</span>
      </button>
      <button onClick={() => setView("manager")}>
        <LayoutDashboard size={20} />
        <span>Manager</span>
      </button>
    </nav>
  );
}
