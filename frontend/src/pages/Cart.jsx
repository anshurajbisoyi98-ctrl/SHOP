import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <div className="ml-[4%] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {cartItems.length === 0 ? (
          /* ── Empty state ───────────────────────── */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/shop"
              className="bg-pink-600 hover:bg-pink-500 transition-colors text-white font-semibold py-3 px-8 rounded-full text-sm"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── Cart items ─────────────────────────── */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-6">
                Shopping Cart{" "}
                <span className="text-gray-400 text-lg font-normal">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </h1>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 bg-[#18181b] border border-[#2a2a2e] rounded-2xl p-4 hover:border-pink-500/20 transition-colors"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#0f0f10]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-sm font-semibold text-white hover:text-pink-400 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>
                      <p className="text-pink-400 font-bold text-sm mt-1">
                        ${item.price}
                      </p>
                    </div>

                    {/* Qty selector */}
                    <select
                      className="bg-[#0f0f10] border border-[#2a2a2e] text-white text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-pink-500 cursor-pointer"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>

                    {/* Line total */}
                    <div className="text-right hidden sm:block w-20 shrink-0">
                      <p className="text-sm font-bold text-white">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                      onClick={() => removeFromCartHandler(item._id)}
                      title="Remove from cart"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Order summary ───────────────────────── */}
            <div className="lg:w-72 shrink-0">
              <div className="bg-[#18181b] border border-[#2a2a2e] rounded-2xl p-6 sticky top-6">
                <h2 className="text-lg font-bold text-white mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Items ({totalItems})</span>
                    <span className="text-white">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400 font-medium">Free</span>
                  </div>
                  <div className="border-t border-[#2a2a2e] pt-3 flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-bold text-xl text-white">
                      ${totalPrice}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full mt-6 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 text-sm"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/shop"
                  className="block text-center mt-3 text-xs text-gray-400 hover:text-pink-400 transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
