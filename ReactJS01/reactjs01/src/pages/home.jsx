import { useEffect, useState } from "react";
import { fetchProductSearch } from "../util/api";
import { Link } from "react-router-dom";
import "./home.css";

const HomePage = () => {
  const [bestSeller, setBestSeller] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Best Seller
      const best = await fetchProductSearch({ limit: 6, sort: "-sold" });
      if (best?.result) setBestSeller(best.result);

      // New Books
      const newest = await fetchProductSearch({ limit: 6, sort: "-createdAt" });
      if (newest?.result) setNewBooks(newest.result);

      // Most Favorited
      const fav = await fetchProductSearch({ limit: 6, sort: "-favorites" });
      if (fav?.result) setFavoriteBooks(fav.result);
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>📚 Khám phá thế giới sách</h1>
          <p>Hơn 10.000 cuốn sách, truyện dành cho mọi lứa tuổi</p>
          <Link to="/products" className="hero-btn">
            Khám phá ngay
          </Link>
        </div>
      </section>

      {/* GENRES */}
      <section className="section genres">
        <h2>Thể loại nổi bật</h2>
        <div className="genre-grid">
          <Link to="/products?genre=novel" className="genre-card novel">
            Tiểu thuyết
          </Link>
          <Link to="/products?genre=manga" className="genre-card manga">
            Manga - Comic
          </Link>
          <Link
            to="/products?genre=lightnovel"
            className="genre-card lightnovel"
          >
            Light Novel
          </Link>
          <Link to="/products?genre=biz" className="genre-card biz">
            Kinh doanh
          </Link>
        </div>
      </section>

      {/* BEST SELLER */}
      <section className="section">
        <h2>🔥 Best Seller</h2>
        <div className="book-grid">
          {bestSeller.map((b) => (
            <Link key={b.id} to={`/products?id=${b.id}`} className="book-card">
              <img src={b.image} className="book-cover" />
              <h3>{b.name}</h3>
              <p className="author">{b.author}</p>
              <p className="price">{b.price.toLocaleString()} đ</p>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW BOOKS */}
      <section className="section">
        <h2>✨ Sách mới phát hành</h2>
        <div className="book-grid">
          {newBooks.map((b) => (
            <Link key={b.id} to={`/products?id=${b.id}`} className="book-card">
              <img src={b.image} className="book-cover" />
              <h3>{b.name}</h3>
              <p className="author">{b.author}</p>
              <p className="price">{b.price.toLocaleString()} đ</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
