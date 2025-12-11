import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addCommentApi,
  fetchProductDetail,
  deleteCommentApi,
  updateCommentApi,
} from "../util/api";
import { useAuth } from "../components/context/auth.context";
import "./productDetail.css";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [stats, setStats] = useState(null);

  // comment states
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);

  // pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // edit comment
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const { favorites, toggleFavorite, user } = useAuth();
  const isFavorite = favorites?.some((p) => p.id == id);

  // =============================
  // ADD COMMENT
  // =============================
  const handleAddComment = async () => {
    if (!user) return alert("Bạn cần đăng nhập để bình luận!");
    if (!commentInput.trim()) return;

    const res = await addCommentApi(id, commentInput);

    if (res?.success) {
      setComments((prev) => [
        {
          ...res.comment,
          User: { name: user.name, avatar: user.avatar },
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      setStats((prev) => ({
        ...prev,
        commentsCount: prev.commentsCount + 1,
      }));

      setCommentInput("");
    }
  };

  // =============================
  // TIME AGO
  // =============================
  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = (now - past) / 1000;
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  // =============================
  // LOAD COMMENTS WITH PAGINATION
  // =============================
  const loadComments = async (nextPage = 1) => {
    const res = await fetchProductDetail(id, nextPage);

    if (nextPage === 1) {
      setComments(res.comments);
    } else {
      setComments((prev) => [...prev, ...res.comments]);
    }

    const loaded = nextPage * 5;
    setHasMore(loaded < res.totalComments);
  };

  // =============================
  // INITIAL LOAD
  // =============================
  useEffect(() => {
    const loadDetail = async () => {
      const res = await fetchProductDetail(id, 1);

      if (res.success) {
        setProduct(res.product);
        setStats(res.stats);
        setComments(res.comments);
        setHasMore(res.totalComments > 5);
      }
    };
    loadDetail();
  }, [id]);

  if (!product || !stats) return <p>Đang tải...</p>;

  const handleFavorite = () => {
    if (!user) return alert("Bạn cần đăng nhập!");
    toggleFavorite(product.id);
  };

  // =============================
  // DELETE COMMENT
  // =============================
  const deleteComment = async (commentId) => {
    if (!confirm("Xoá bình luận này?")) return;

    const res = await deleteCommentApi(commentId);
    if (res?.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));

      setStats((prev) => ({
        ...prev,
        commentsCount: prev.commentsCount - 1,
      }));
    }
  };

  // =============================
  // EDIT COMMENT
  // =============================
  const startEdit = (c) => {
    setEditingId(c.id);
    setEditText(c.content);
  };

  const saveEdit = async () => {
    const res = await updateCommentApi(editingId, editText);

    if (res?.success) {
      setComments((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, content: editText } : c))
      );
      setEditingId(null);
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-left">
          <img
            src={`/${product.image}`}
            alt={product.name}
            className="detail-image"
          />
        </div>

        <div className="detail-right">
          <h1 className="detail-title">{product.name}</h1>

          <p className="detail-price">
            {product.price.toLocaleString("vi-VN")}₫
          </p>

          <p className="detail-meta">
            📂 Danh mục: <b>{product.category}</b> <br />
            👁 Lượt xem: {product.views} <br />
            🛒 Khách đã mua: {stats.buyers} <br />
            💬 Bình luận: {stats.commentsCount}
          </p>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-actions">
            <button
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={handleFavorite}
            >
              {isFavorite ? "♥ Đã yêu thích" : "♡ Yêu thích"}
            </button>

            <button className="add-cart-btn">+ Thêm vào giỏ</button>
          </div>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="comment-section">
        <h3>Bình luận</h3>

        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            <img
              src={c.User?.avatar ? `/${c.User.avatar}` : "/user_default.jpg"}
              className="comment-avatar"
            />

            <div className="comment-body">
              <div className="comment-header">
                <b>{c.User?.name}</b>
                <span className="comment-time">{timeAgo(c.createdAt)}</span>

                {user?.id === c.userId && (
                  <div className="comment-actions">
                    <button className="more-btn">⋮</button>
                    <div className="comment-menu">
                      <div onClick={() => startEdit(c)}>Sửa</div>
                      <div onClick={() => deleteComment(c.id)}>Xoá</div>
                    </div>
                  </div>
                )}
              </div>

              {editingId === c.id ? (
                <div className="edit-box">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <button className="save-btn" onClick={saveEdit}>
                    Lưu
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setEditingId(null)}
                  >
                    Huỷ
                  </button>
                </div>
              ) : (
                <div className="comment-content">{c.content}</div>
              )}
            </div>
          </div>
        ))}

        {/* LOAD MORE */}
        {hasMore && (
          <button
            className="load-more-btn"
            onClick={() => {
              const next = page + 1;
              setPage(next);
              loadComments(next);
            }}
          >
            Xem thêm bình luận
          </button>
        )}

        {/* COMMENT FORM */}
        <div className="comment-form">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Nhập bình luận..."
            className="comment-input"
          />

          <button className="comment-btn" onClick={handleAddComment}>
            Gửi bình luận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
