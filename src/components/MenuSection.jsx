import { Clock, Heart, Search, SlidersHorizontal, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { formatCurrency } from "../utils/analytics";

export default function MenuSection({ menu, addToCart, favorites, toggleFavorite }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [onlyVeg, setOnlyVeg] = useState(false);

  const categories = useMemo(() => {
    const list = Array.from(new Set(menu.map((item) => item.category)));
    return ["All", ...list];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    let result = menu.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const searchText = `${item.name} ${item.description} ${item.category} ${(item.tags || []).join(" ")}`.toLowerCase();
      const matchesQuery = searchText.includes(query.toLowerCase());
      const matchesPopular = !onlyPopular || item.popular;
      const matchesVeg = !onlyVeg || item.veg;
      return matchesCategory && matchesQuery && matchesPopular && matchesVeg;
    });

    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    if (sort === "fast") result = [...result].sort((a, b) => a.prepMinutes - b.prepMinutes);

    return result;
  }, [menu, query, category, sort, onlyPopular, onlyVeg]);

  return (
    <section className="menuSection" id="menu">
      <div className="sectionHeader">
        <span className="eyebrow">Large smart menu</span>
        <h2>Explore foods by category, price, rating, and diet type</h2>
        <p>More food items, stronger filtering, favorite items, and a mobile-friendly food browsing experience.</p>
      </div>

      <div className="menuToolbar">
        <label className="searchBox">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search burger, pizza, sushi, pasta, dessert..."
          />
        </label>

        <div className="filterPanel">
          <span><SlidersHorizontal size={17} /> Smart filters</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
            <option value="fast">Fastest Prep Time</option>
          </select>
          <button className={onlyPopular ? "selected" : ""} onClick={() => setOnlyPopular((v) => !v)}>Popular</button>
          <button className={onlyVeg ? "selected" : ""} onClick={() => setOnlyVeg((v) => !v)}>Veg</button>
        </div>

        <div className="categoryPills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={category === cat ? "selected" : ""}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="menuGrid">
        <AnimatePresence>
          {filteredMenu.map((item) => (
            <motion.article
              layout
              key={item.id}
              className={`foodCard ${!item.available ? "disabled" : ""}`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.94 }}
              transition={{ duration: 0.25 }}
            >
              <div className="foodImage">
                <img src={item.image} alt={item.name} />
                <button className={`favoriteBtn ${favorites.includes(item.id) ? "saved" : ""}`} onClick={() => toggleFavorite(item.id)}>
                  <Heart size={17} fill="currentColor" />
                </button>
                <span className="rating">
                  <Star size={15} fill="currentColor" /> {item.rating || 4.5}
                </span>
              </div>

              <div className="foodBody">
                <div className="foodTop">
                  <h3>{item.name}</h3>
                  <strong>{formatCurrency(item.price)}</strong>
                </div>

                <p>{item.description}</p>

                <div className="tagRow">
                  {(item.tags || []).slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
                  <span><Clock size={14} /> {item.prepMinutes || 15} min</span>
                  <span>{item.calories || 450} cal</span>
                </div>

                <button className="addBtn" disabled={!item.available} onClick={() => addToCart(item)}>
                  {item.available ? "Add to Cart" : "Unavailable"}
                </button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {!filteredMenu.length && (
        <div className="emptyState">
          <strong>No items found</strong>
          <span>Try another search word or category.</span>
        </div>
      )}
    </section>
  );
}
