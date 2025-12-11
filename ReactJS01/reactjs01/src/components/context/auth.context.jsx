// src/components/context/auth.context.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  getAccountAPI,
  getMyFavoritesApi,
  toggleFavoriteApi,
} from "../../util/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAccountAPI()
        .then((res) => {
          if (res?.id) setUser(res);
        })
        .catch(() => {
          // token sai => logout
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  // Sau khi login thành công / có token -> load favorites
  useEffect(() => {
    let ignore = false;

    // Nếu chưa đăng nhập: clear favorites (dùng setTimeout để tránh setState sync trong effect)
    if (!user) {
      const id = setTimeout(() => {
        if (!ignore) setFavorites([]);
      }, 0);

      return () => {
        ignore = true;
        clearTimeout(id);
      };
    }

    const fetchFavorites = async () => {
      try {
        // axios.customize đang trả về data luôn
        const res = await getMyFavoritesApi(); // res = { success, data: [...] }

        if (ignore) return;

        if (res?.success) {
          setFavorites(res.data || []);
        } else {
          setFavorites([]);
        }
      } catch (e) {
        console.error("getMyFavoritesApi error:", e);
        if (!ignore) setFavorites([]);
      }
    };

    fetchFavorites();

    return () => {
      ignore = true;
    };
  }, [user]);

  const toggleFavorite = async (productId) => {
    try {
      const res = await toggleFavoriteApi(productId);

      if (res?.success) {
        const isFav = res.favorite;

        if (isFav) {
          // thêm sản phẩm mới
          setFavorites((prev) => [...prev, { id: productId }]);
        } else {
          // xoá sản phẩm khỏi danh sách
          setFavorites((prev) => prev.filter((p) => p.id !== productId));
        }

        return isFav;
      }
    } catch (e) {
      console.error("toggleFavorite error:", e);
    }
  };

  const value = {
    user,
    setUser, // login/logout vẫn dùng được
    favorites,
    toggleFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
