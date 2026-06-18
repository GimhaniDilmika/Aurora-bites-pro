import { BarChart3, CheckCircle2, ClipboardList, CreditCard, DollarSign, LogOut, RadioTower } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, getCategorySales, getDashboardStats, getRevenueTrend, getTopItems } from "../utils/analytics";
import { isFirebaseReady } from "../services/restaurantService";
import MenuManager from "./MenuManager";
import OrderBoard from "./OrderBoard";
import ReservationBoard from "./ReservationBoard";
import StatCard from "./StatCard";

export default function ManagerDashboard({
  orders,
  reservations,
  menu,
  updateStatus,
  updatePaymentStatus,
  saveMenuItem,
  deleteMenuItem,
  seedMenu,
  updateReservationStatus,
  logout
}) {
  const stats = getDashboardStats(orders, reservations);
  const categorySales = getCategorySales(orders);
  const revenueTrend = getRevenueTrend(orders);
  const topItems = getTopItems(orders);

  return (
    <main className="dashboard">
      <div className="dashboardHero">
        <div>
          <span className="eyebrow"><RadioTower size={15} /> {isFirebaseReady() ? "Firebase real-time mode" : "Demo localStorage mode"}</span>
          <h1>Manager Control Center</h1>
          <p>Monitor orders, payments, reservations, revenue, food trends, and menu availability from one professional dashboard.</p>
        </div>
        <button className="ghostBtn" onClick={logout}><LogOut size={17} /> Logout</button>
      </div>

      <section className="statsGrid">
        <StatCard icon={ClipboardList} label="Total Orders" value={stats.totalOrders} helper="All received orders" />
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(stats.revenue)} helper="Cancelled excluded" />
        <StatCard icon={BarChart3} label="Active Orders" value={stats.activeOrders} helper="New / preparing / ready" />
        <StatCard icon={CreditCard} label="Paid Orders" value={stats.paidOrders} helper="Demo online payments" />
        <StatCard icon={CheckCircle2} label="Reservations" value={stats.pendingReservations} helper="Pending booking requests" />
      </section>

      <section className="chartsGrid">
        <div className="chartCard">
          <div className="panelHeader"><div><span className="eyebrow">Revenue pulse</span><h2>Recent Revenue</h2></div></div>
          <div className="chartWrap">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" stroke="currentColor" fill="currentColor" fillOpacity={0.16} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chartCard">
          <div className="panelHeader"><div><span className="eyebrow">Food intelligence</span><h2>Category Sales</h2></div></div>
          <div className="chartWrap">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categorySales}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="currentColor" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="topItemsPanel">
        <span className="eyebrow">Top selling items</span>
        <div className="topItems">
          {topItems.length ? topItems.map((item) => (
            <span key={item.name}>{item.name} <b>{item.quantity}</b></span>
          )) : <span>No item sales yet</span>}
        </div>
      </section>

      <OrderBoard orders={orders} updateStatus={updateStatus} updatePaymentStatus={updatePaymentStatus} />
      <ReservationBoard reservations={reservations} updateReservationStatus={updateReservationStatus} />
      <MenuManager menu={menu} saveMenuItem={saveMenuItem} deleteMenuItem={deleteMenuItem} seedMenu={seedMenu} />
    </main>
  );
}
