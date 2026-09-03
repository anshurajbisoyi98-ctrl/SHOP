import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="relative bg-[#18181b] rounded-2xl overflow-hidden border border-[#2a2a2e] hover:border-pink-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-0.5 group w-72">
      <section className="relative overflow-hidden">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={p.image}
            alt={p.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
          {/* Brand badge */}
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-pink-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-pink-500/30">
            {p?.brand}
          </span>
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-sm font-semibold text-white leading-snug line-clamp-1 flex-1 mr-2">
            {p?.name}
          </h5>
          <p className="text-pink-400 font-bold text-sm whitespace-nowrap">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {p?.description?.substring(0, 80)}...
        </p>

        <section className="flex justify-between items-center gap-2">
          <Link
            to={`/product/${p._id}`}
            className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-colors duration-200"
          >
            View Details
          </Link>

          <button
            className="p-2 rounded-lg bg-[#27272a] hover:bg-pink-500/20 hover:text-pink-400 text-gray-300 transition-all duration-200 border border-[#3a3a3e] hover:border-pink-500/40"
            onClick={() => addToCartHandler(p, 1)}
            title="Add to Cart"
          >
            <AiOutlineShoppingCart size={20} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
