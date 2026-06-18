import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { formatCurrency, getFees } from "../utils/analytics";

export default function CartDrawer({
  open,
  cart,
  closeCart,
  increaseItem,
  decreaseItem,
  removeItem,
  clearCart,
  openCheckout,
  deliveryMethod,
  setDeliveryMethod,
  promoCode,
  setPromoCode
}) {
  const fees = getFees(cart, deliveryMethod, promoCode);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button className="overlay" aria-label="Close cart" onClick={closeCart} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className="cartDrawer" initial={{ x: 460 }} animate={{ x: 0 }} exit={{ x: 460 }} transition={{ type: "spring", stiffness: 260, damping: 28 }}>
            <div className="drawerHeader">
              <div>
                <span className="eyebrow">Your order</span>
                <h2>Smart Cart</h2>
              </div>
              <button className="iconBtn" onClick={closeCart}><X size={20} /></button>
            </div>

            {!cart.length ? (
              <div className="cartEmpty">
                <ShoppingBag size={42} />
                <strong>Your cart is empty</strong>
                <span>Add something delicious from the menu.</span>
              </div>
            ) : (
              <>
                <div className="cartList">
                  {cart.map((item) => (
                    <div className="cartItem" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{formatCurrency(item.price)}</span>
                        <div className="quantityControl">
                          <button onClick={() => decreaseItem(item.id)}><Minus size={14} /></button>
                          <b>{item.quantity}</b>
                          <button onClick={() => increaseItem(item.id)}><Plus size={14} /></button>
                          <button className="dangerMini" onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="deliverySwitch">
                  <button className={deliveryMethod === "delivery" ? "selected" : ""} onClick={() => setDeliveryMethod("delivery")}>Delivery</button>
                  <button className={deliveryMethod === "pickup" ? "selected" : ""} onClick={() => setDeliveryMethod("pickup")}>Pickup</button>
                </div>

                <label className="promoBox">
                  <span>Promo code</span>
                  <input value={promoCode} onChange={(event) => setPromoCode(event.target.value.toUpperCase())} placeholder="AURORA10 / STUDENT15 / FREESHIP" />
                </label>

                <div className="cartSummary full">
                  <div><span>Subtotal</span><strong>{formatCurrency(fees.subtotal)}</strong></div>
                  <div><span>Service Fee</span><strong>{formatCurrency(fees.serviceFee)}</strong></div>
                  <div><span>Delivery</span><strong>{formatCurrency(fees.deliveryFee)}</strong></div>
                  <div><span>Discount</span><strong>- {formatCurrency(fees.discount)}</strong></div>
                  <div className="totalLine"><span>Total</span><strong>{formatCurrency(fees.total)}</strong></div>
                </div>

                {fees.promoLabel && <div className="successMini">Applied: {fees.promoLabel}</div>}

                <div className="drawerActions">
                  <button className="ghostBtn" onClick={clearCart}>Clear</button>
                  <button className="primaryBtn" onClick={openCheckout}>Checkout</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
