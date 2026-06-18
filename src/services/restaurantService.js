import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase";
import { menuSeed } from "../data/menuSeed";

const MENU_KEY = "aurora_pro_menu";
const ORDERS_KEY = "aurora_pro_orders";
const RESERVATIONS_KEY = "aurora_pro_reservations";

function readLocal(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("aurora-pro-local-change"));
}

function createLocalId() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}

export function isFirebaseReady() {
  return Boolean(hasFirebaseConfig && db);
}

export function subscribeMenu(callback) {
  if (isFirebaseReady()) {
    const q = query(collection(db, "menu"), orderBy("name", "asc"));
    return onSnapshot(q, (snapshot) => {
      const menu = snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
      callback(menu.length ? menu : menuSeed);
    });
  }

  const emit = () => callback(readLocal(MENU_KEY, menuSeed));
  emit();
  window.addEventListener("aurora-pro-local-change", emit);
  return () => window.removeEventListener("aurora-pro-local-change", emit);
}

export function subscribeOrders(callback) {
  if (isFirebaseReady()) {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });
  }

  const emit = () => callback(readLocal(ORDERS_KEY, []));
  emit();
  window.addEventListener("aurora-pro-local-change", emit);
  return () => window.removeEventListener("aurora-pro-local-change", emit);
}

export function subscribeReservations(callback) {
  if (isFirebaseReady()) {
    const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });
  }

  const emit = () => callback(readLocal(RESERVATIONS_KEY, []));
  emit();
  window.addEventListener("aurora-pro-local-change", emit);
  return () => window.removeEventListener("aurora-pro-local-change", emit);
}

export async function seedDemoMenu() {
  if (isFirebaseReady()) {
    await Promise.all(menuSeed.map((item) => setDoc(doc(db, "menu", item.id), item)));
    return;
  }

  writeLocal(MENU_KEY, menuSeed);
}

export async function placeOrder(order) {
  const payload = {
    ...order,
    status: "new",
    paymentStatus: order.paymentMethod === "cash" ? "pending" : "paid",
    createdAt: isFirebaseReady() ? serverTimestamp() : new Date().toISOString()
  };

  if (isFirebaseReady()) {
    const ref = await addDoc(collection(db, "orders"), payload);
    return ref.id;
  }

  const orders = readLocal(ORDERS_KEY, []);
  const id = createLocalId();
  writeLocal(ORDERS_KEY, [{ id, ...payload }, ...orders]);
  return id;
}

export async function updateOrderStatus(orderId, status) {
  if (isFirebaseReady()) {
    await updateDoc(doc(db, "orders", orderId), { status });
    return;
  }

  const orders = readLocal(ORDERS_KEY, []);
  writeLocal(ORDERS_KEY, orders.map((order) => (order.id === orderId ? { ...order, status } : order)));
}

export async function updatePaymentStatus(orderId, paymentStatus) {
  if (isFirebaseReady()) {
    await updateDoc(doc(db, "orders", orderId), { paymentStatus });
    return;
  }

  const orders = readLocal(ORDERS_KEY, []);
  writeLocal(ORDERS_KEY, orders.map((order) => (order.id === orderId ? { ...order, paymentStatus } : order)));
}

export async function saveMenuItem(item) {
  const payload = {
    ...item,
    price: Number(item.price),
    rating: Number(item.rating || 4.5),
    prepMinutes: Number(item.prepMinutes || 15),
    calories: Number(item.calories || 450),
    available: Boolean(item.available),
    popular: Boolean(item.popular),
    veg: Boolean(item.veg)
  };

  const id = payload.id || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  if (isFirebaseReady()) {
    await setDoc(doc(db, "menu", id), { ...payload, id });
    return;
  }

  const menu = readLocal(MENU_KEY, menuSeed);
  const exists = menu.some((item) => item.id === id);
  const nextMenu = exists
    ? menu.map((item) => (item.id === id ? { ...payload, id } : item))
    : [{ ...payload, id }, ...menu];

  writeLocal(MENU_KEY, nextMenu);
}

export async function deleteMenuItem(itemId) {
  if (isFirebaseReady()) {
    await deleteDoc(doc(db, "menu", itemId));
    return;
  }

  const menu = readLocal(MENU_KEY, menuSeed);
  writeLocal(MENU_KEY, menu.filter((item) => item.id !== itemId));
}

export async function createReservation(reservation) {
  const payload = {
    ...reservation,
    status: "pending",
    createdAt: isFirebaseReady() ? serverTimestamp() : new Date().toISOString()
  };

  if (isFirebaseReady()) {
    const ref = await addDoc(collection(db, "reservations"), payload);
    return ref.id;
  }

  const reservations = readLocal(RESERVATIONS_KEY, []);
  const id = createLocalId();
  writeLocal(RESERVATIONS_KEY, [{ id, ...payload }, ...reservations]);
  return id;
}

export async function updateReservationStatus(reservationId, status) {
  if (isFirebaseReady()) {
    await updateDoc(doc(db, "reservations", reservationId), { status });
    return;
  }

  const reservations = readLocal(RESERVATIONS_KEY, []);
  writeLocal(
    RESERVATIONS_KEY,
    reservations.map((item) => (item.id === reservationId ? { ...item, status } : item))
  );
}
