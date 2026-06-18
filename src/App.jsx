import { useEffect, useMemo, useRef, useState } from "react";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ManagerDashboard from "./components/ManagerDashboard";
import ManagerLogin from "./components/ManagerLogin";
import MenuSection from "./components/MenuSection";
import MobileNav from "./components/MobileNav";
import OffersSection from "./components/OffersSection";
import OrderTracker from "./components/OrderTracker";
import ReservationModal from "./components/ReservationModal";
import {
  createReservation,
  deleteMenuItem,
  placeOrder,
  saveMenuItem,
  seedDemoMenu,
  subscribeMenu,
  subscribeOrders,
  subscribeReservations,
  updateOrderStatus,
  updatePaymentStatus,
  updateReservationStatus
} from "./services/restaurantService";
import { calculateCartTotal } from "./utils/analytics";

export default function App() {
  const [view, setView] = useState("customer");
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("aurora_favorites") || "[]"));
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [promoCode, setPromoCode] = useState("");
  const [managerAuthed, setManagerAuthed] = useState(sessionStorage.getItem("aurora_manager") === "true");

  const menuRef = useRef(null);

  useEffect(() => subscribeMenu(setMenu), []);
  useEffect(() => subscribeOrders(setOrders), []);
  useEffect(() => subscribeReservations(setReservations), []);

  useEffect(() => {
    localStorage.setItem("aurora_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const cartTotal = useMemo(() => calculateCartTotal(cart), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  function addToCart(food) {
    setCart((current) => {
      const exists = current.find((item) => item.id === food.id);
      if (exists) return current.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...food, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function increaseItem(id) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  }

  function decreaseItem(id) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0));
  }

  function removeItem(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function openCheckout() {
    if (!cart.length) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  function loginManager() {
    sessionStorage.setItem("aurora_manager", "true");
    setManagerAuthed(true);
  }

  function logoutManager() {
    sessionStorage.removeItem("aurora_manager");
    setManagerAuthed(false);
  }

  function scrollToMenu() {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleFavorite(id) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <>
      <Header
        view={view}
        setView={setView}
        cartCount={cartCount}
        cartTotal={cartTotal}
        openCart={() => setCartOpen(true)}
        openReservation={() => setReservationOpen(true)}
      />

      {view === "customer" && (
        <main>
          <Hero scrollToMenu={scrollToMenu} openReservation={() => setReservationOpen(true)} />
          <OffersSection />
          <div ref={menuRef}>
            <MenuSection menu={menu} addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
          <OrderTracker orders={orders} />
        </main>
      )}

      {view === "manager" && (
        managerAuthed ? (
          <ManagerDashboard
            orders={orders}
            reservations={reservations}
            menu={menu}
            updateStatus={updateOrderStatus}
            updatePaymentStatus={updatePaymentStatus}
            saveMenuItem={saveMenuItem}
            deleteMenuItem={deleteMenuItem}
            seedMenu={seedDemoMenu}
            updateReservationStatus={updateReservationStatus}
            logout={logoutManager}
          />
        ) : (
          <ManagerLogin onLogin={loginManager} />
        )
      )}

      <CartDrawer
        open={cartOpen}
        cart={cart}
        closeCart={() => setCartOpen(false)}
        increaseItem={increaseItem}
        decreaseItem={decreaseItem}
        removeItem={removeItem}
        clearCart={clearCart}
        openCheckout={openCheckout}
        deliveryMethod={deliveryMethod}
        setDeliveryMethod={setDeliveryMethod}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
      />

      <CheckoutModal
        open={checkoutOpen}
        cart={cart}
        close={() => setCheckoutOpen(false)}
        submitOrder={placeOrder}
        clearCart={clearCart}
        deliveryMethod={deliveryMethod}
        promoCode={promoCode}
      />

      <ReservationModal
        open={reservationOpen}
        close={() => setReservationOpen(false)}
        createReservation={createReservation}
      />

      <MobileNav
        setView={setView}
        openCart={() => setCartOpen(true)}
        openReservation={() => setReservationOpen(true)}
        cartCount={cartCount}
      />
    </>
  );
}
