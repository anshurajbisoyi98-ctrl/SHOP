import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-48 p-2">
      <div className="relative rounded-xl overflow-hidden bg-[#18181b] border border-[#2a2a2e] hover:border-pink-500/30 transition-all duration-200 hover:-translate-y-0.5 group">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <HeartIcon product={product} />

        <div className="p-3">
          <Link to={`/product/${product._id}`}>
            <h2 className="text-xs font-semibold text-white line-clamp-1 hover:text-pink-400 transition-colors">
              {product.name}
            </h2>
          </Link>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-pink-400 font-bold text-xs">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
