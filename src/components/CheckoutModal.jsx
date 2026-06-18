import { CheckCircle2, CreditCard, ShieldCheck, Smartphone, Truck, Wallet, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { calculatePrepTime, createOrderCode, formatCurrency, getFees } from "../utils/analytics";

const initialForm = {
  customerName: "",
  phone: "",
  email: "",
  address: "",
  note: ""
};

export default function CheckoutModal({ open, cart, close, submitOrder, clearCart, deliveryMethod, promoCode }) {
  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const fees = getFees(cart, deliveryMethod, promoCode);
  const estimatedPrepTime = calculatePrepTime(cart);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const orderCode = createOrderCode();

    await submitOrder({
      ...form,
      orderCode,
      items: cart,
      deliveryMethod,
      promoCode: promoCode || "",
      subtotal: fees.subtotal,
      serviceFee: fees.serviceFee,
      deliveryFee: fees.deliveryFee,
      discount: fees.discount,
      total: fees.total,
      paymentMethod,
      prepMinutes: estimatedPrepTime
    });

    setLoading(false);
    setSuccess(orderCode);
    clearCart();
    setForm(initialForm);
  }

  function handleClose() {
    setSuccess(null);
    close();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button className="overlay" onClick={handleClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="modal wideModal" initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }}>
            <button className="iconBtn modalClose" onClick={handleClose}><X size={20} /></button>

            {success ? (
              <div className="successBox">
                <CheckCircle2 size={56} />
                <h2>Order placed successfully!</h2>
                <p>Your order tracking code is:</p>
                <strong className="orderCode">{success}</strong>
                <span>Estimated preparation time: {estimatedPrepTime} minutes</span>
                <span>Use this code in the Order Tracking section.</span>
                <button className="primaryBtn" onClick={handleClose}>Done</button>
              </div>
            ) : (
              <>
                <span className="eyebrow">Checkout + demo payment</span>
                <h2>Complete your order</h2>
                <p className="muted">Total amount: <strong>{formatCurrency(fees.total)}</strong></p>

                <form className="checkoutGrid" onSubmit={handleSubmit}>
                  <div className="checkoutForm">
                    <input name="customerName" value={form.customerName} onChange={updateField} placeholder="Customer name" required />
                    <input name="phone" value={form.phone} onChange={updateField} placeholder="Phone number" required />
                    <input name="email" value={form.email} onChange={updateField} placeholder="Email address" type="email" />
                    {deliveryMethod === "delivery" && (
                      <textarea name="address" value={form.address} onChange={updateField} placeholder="Delivery address" required />
                    )}
                    <textarea name="note" value={form.note} onChange={updateField} placeholder="Special note, example: less spicy" />
                  </div>

                  <div className="paymentPanel">
                    <h3>Payment Method</h3>
                    <div className="paymentOptions">
                      <button type="button" className={paymentMethod === "card" ? "selected" : ""} onClick={() => setPaymentMethod("card")}><CreditCard size={18} /> Demo Card</button>
                      <button type="button" className={paymentMethod === "wallet" ? "selected" : ""} onClick={() => setPaymentMethod("wallet")}><Smartphone size={18} /> Wallet</button>
                      <button type="button" className={paymentMethod === "cash" ? "selected" : ""} onClick={() => setPaymentMethod("cash")}><Wallet size={18} /> Cash</button>
                    </div>

                    {paymentMethod !== "cash" ? (
                      <div className="safePaymentBox">
                        <ShieldCheck size={22} />
                        <div>
                          <strong>Demo payment only</strong>
                          <span>No real card data is collected. This is safe for internship presentation.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="safePaymentBox">
                        <Truck size={22} />
                        <div>
                          <strong>Cash on delivery / pickup</strong>
                          <span>Payment status will be pending until manager marks it as paid.</span>
                        </div>
                      </div>
                    )}

                    <div className="invoiceBox">
                      <span>Subtotal <b>{formatCurrency(fees.subtotal)}</b></span>
                      <span>Service fee <b>{formatCurrency(fees.serviceFee)}</b></span>
                      <span>Delivery <b>{formatCurrency(fees.deliveryFee)}</b></span>
                      <span>Discount <b>- {formatCurrency(fees.discount)}</b></span>
                      <strong>Total <b>{formatCurrency(fees.total)}</b></strong>
                    </div>

                    <button className="primaryBtn fullWidth" disabled={loading}>
                      {loading ? "Processing..." : paymentMethod === "cash" ? "Place Order" : "Pay Demo & Place Order"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
