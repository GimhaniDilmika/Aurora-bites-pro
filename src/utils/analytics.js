import { promoCodes } from "../data/menuSeed";

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function createOrderCode() {
  return `AB-${Date.now().toString().slice(-6)}`;
}

export function calculateCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculatePrepTime(cart) {
  if (!cart.length) return 0;
  const maxPrep = Math.max(...cart.map((item) => item.prepMinutes || 12));
  return maxPrep + Math.max(5, cart.length * 2);
}

export function getFees(cart, deliveryMethod = "delivery", promoCode = "") {
  const subtotal = calculateCartTotal(cart);
  const serviceFee = subtotal > 0 ? 180 : 0;
  const deliveryFee = deliveryMethod === "delivery" && subtotal > 0 ? 350 : 0;
  const promo = promoCodes[String(promoCode || "").trim().toUpperCase()];

  let discount = 0;
  let promoLabel = "";

  if (promo) {
    promoLabel = promo.label;
    if (promo.type === "percent") discount = Math.round(subtotal * (promo.value / 100));
    if (promo.type === "delivery") discount = Math.min(deliveryFee, promo.value);
  }

  const total = Math.max(0, subtotal + serviceFee + deliveryFee - discount);
  return { subtotal, serviceFee, deliveryFee, discount, total, promo, promoLabel };
}

export function getDashboardStats(orders, reservations = []) {
  const totalOrders = orders.length;
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const activeOrders = orders.filter((order) =>
    ["new", "preparing", "ready"].includes(order.status)
  ).length;

  const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;
  const completedOrders = orders.filter((order) => order.status === "completed").length;
  const avgOrder = totalOrders ? revenue / totalOrders : 0;
  const pendingReservations = reservations.filter((item) => item.status === "pending").length;

  return { totalOrders, revenue, activeOrders, paidOrders, completedOrders, avgOrder, pendingReservations };
}

export function getCategorySales(orders) {
  const map = {};

  orders
    .filter((order) => order.status !== "cancelled")
    .forEach((order) => {
      (order.items || []).forEach((item) => {
        map[item.category] = (map[item.category] || 0) + item.price * item.quantity;
      });
    });

  return Object.entries(map).map(([category, revenue]) => ({ category, revenue }));
}

export function getRevenueTrend(orders) {
  const map = {};

  orders
    .filter((order) => order.status !== "cancelled")
    .forEach((order) => {
      const rawDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt || Date.now());
      const label = rawDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map[label] = (map[label] || 0) + Number(order.total || 0);
    });

  return Object.entries(map).map(([date, revenue]) => ({ date, revenue })).slice(-7);
}

export function getTopItems(orders) {
  const map = {};
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      map[item.name] = (map[item.name] || 0) + item.quantity;
    });
  });

  return Object.entries(map)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}
