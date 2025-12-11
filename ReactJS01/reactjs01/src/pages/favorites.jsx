import { useAuth } from "../components/context/auth.context";

const Favorites = () => {
  const { favorites } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h2>Sản phẩm yêu thích</h2>

      {favorites.length === 0 && <p>Chưa có sản phẩm yêu thích nào.</p>}

      <ul>
        {favorites.map((item) => (
          <li key={item.id}>{item.name || `Product #${item.id}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
