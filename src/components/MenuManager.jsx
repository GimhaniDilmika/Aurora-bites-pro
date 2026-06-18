import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../utils/analytics";

const blankItem = {
  name: "",
  category: "",
  price: "",
  rating: 4.5,
  prepMinutes: 15,
  calories: 450,
  spiceLevel: "Mild",
  available: true,
  popular: false,
  veg: false,
  image: "",
  description: "",
  tags: ""
};

export default function MenuManager({ menu, saveMenuItem, deleteMenuItem, seedMenu }) {
  const [form, setForm] = useState(blankItem);
  const [editingId, setEditingId] = useState(null);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function editItem(item) {
    setEditingId(item.id);
    setForm({ ...item, tags: (item.tags || []).join(", ") });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await saveMenuItem({
      ...form,
      id: editingId,
      tags: String(form.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean)
    });
    setEditingId(null);
    setForm(blankItem);
  }

  return (
    <section className="dashboardPanel">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">Menu control</span>
          <h2>Menu Manager</h2>
        </div>
        <button className="ghostBtn" onClick={seedMenu}>Seed 50+ Menu Items</button>
      </div>

      <form className="menuForm" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={updateField} placeholder="Food name" required />
        <input name="category" value={form.category} onChange={updateField} placeholder="Category" required />
        <input name="price" value={form.price} onChange={updateField} placeholder="Price" type="number" required />
        <input name="prepMinutes" value={form.prepMinutes} onChange={updateField} placeholder="Prep minutes" type="number" />
        <input name="calories" value={form.calories} onChange={updateField} placeholder="Calories" type="number" />
        <input name="rating" value={form.rating} onChange={updateField} placeholder="Rating" type="number" step="0.1" />
        <input name="spiceLevel" value={form.spiceLevel} onChange={updateField} placeholder="Spice level" />
        <input name="image" value={form.image} onChange={updateField} placeholder="Image URL" required />
        <input name="tags" value={form.tags} onChange={updateField} placeholder="Tags, comma separated" />
        <label className="checkLabel"><input type="checkbox" name="available" checked={form.available} onChange={updateField} /> Available</label>
        <label className="checkLabel"><input type="checkbox" name="popular" checked={form.popular} onChange={updateField} /> Popular</label>
        <label className="checkLabel"><input type="checkbox" name="veg" checked={form.veg} onChange={updateField} /> Veg</label>
        <textarea name="description" value={form.description} onChange={updateField} placeholder="Description" required />
        <button className="primaryBtn">{editingId ? <Edit3 size={17} /> : <Plus size={17} />}{editingId ? "Update Item" : "Add Item"}</button>
      </form>

      <div className="managerMenuGrid">
        {menu.map((item) => (
          <article className="miniFoodCard" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div>
              <strong>{item.name}</strong>
              <span>{item.category} • {formatCurrency(item.price)}</span>
              <small>{item.available ? "Available" : "Unavailable"} • {item.popular ? "Popular" : "Normal"}</small>
            </div>
            <button onClick={() => editItem(item)}><Edit3 size={16} /></button>
            <button className="dangerMini" onClick={() => deleteMenuItem(item.id)}><Trash2 size={16} /></button>
          </article>
        ))}
      </div>
    </section>
  );
}
