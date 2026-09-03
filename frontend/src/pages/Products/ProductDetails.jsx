import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error?.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="ml-[4%] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-pink-400 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#2a2a2e] border-t-pink-500" />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error?.message}
          </Message>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-10">
              {/* ── Product image ─────────────────── */}
              <div className="lg:w-1/2 relative">
                <div className="rounded-2xl overflow-hidden bg-[#18181b] border border-[#2a2a2e]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full object-cover"
                    style={{ maxHeight: "480px" }}
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <HeartIcon product={product} />
                </div>
              </div>

              {/* ── Product info ──────────────────── */}
              <div className="lg:w-1/2 flex flex-col">
                {/* Name & price */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-1">
                    {product.brand}
                  </p>
                  <h1 className="text-2xl font-bold text-white leading-snug">
                    {product.name}
                  </h1>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  {product.description}
                </p>

                <p className="text-4xl font-extrabold text-white mb-6">
                  ${product.price}
                </p>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: <FaStore size={12} />, label: "Brand", value: product.brand },
                    {
                      icon: <FaClock size={12} />,
                      label: "Added",
                      value: moment(product.createdAt).fromNow(),
                    },
                    {
                      icon: <FaStar size={12} />,
                      label: "Reviews",
                      value: product.numReviews,
                    },
                    {
                      icon: <FaStar size={12} />,
                      label: "Rating",
                      value: `${Math.round(product.rating)} / 5`,
                    },
                    {
                      icon: <FaShoppingCart size={12} />,
                      label: "In Stock",
                      value: product.countInStock > 0 ? product.countInStock : "Out of Stock",
                    },
                    {
                      icon: <FaBox size={12} />,
                      label: "Quantity",
                      value: product.quantity,
                    },
                  ].map(({ icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 bg-[#18181b] border border-[#2a2a2e] rounded-xl px-3 py-2.5"
                    >
                      <span className="text-pink-400 shrink-0">{icon}</span>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          {label}
                        </p>
                        <p className="text-sm text-white font-medium">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ratings row */}
                <div className="mb-5">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </div>

                {/* Qty + Add to Cart */}
                <div className="flex items-center gap-3 mt-auto">
                  {product.countInStock > 0 && (
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="bg-[#18181b] border border-[#2a2a2e] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-pink-500 cursor-pointer"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                  >
                    <FaShoppingCart size={16} />
                    {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Product tabs (reviews etc.) ───────── */}
            <div className="mt-12">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
