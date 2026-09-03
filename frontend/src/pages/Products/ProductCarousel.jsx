import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  return (
    <div className="w-full max-w-2xl">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <Slider {...settings} className="rounded-2xl overflow-hidden">
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="outline-none">
                {/* Hero image */}
                <div className="relative">
                  <img
                    src={image}
                    alt={name}
                    className="w-full object-cover rounded-2xl"
                    style={{ height: "22rem" }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl" />

                  {/* Price badge */}
                  <div className="absolute top-4 right-4 bg-pink-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    ${price}
                  </div>

                  {/* Name over image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-semibold text-pink-300 uppercase tracking-widest mb-1">
                      {brand}
                    </p>
                    <h2 className="text-xl font-bold text-white leading-snug line-clamp-1">
                      {name}
                    </h2>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {description.substring(0, 100)}...
                    </p>
                  </div>
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-3 gap-3 mt-4 px-1">
                  {[
                    { icon: <FaStore size={11} />, label: "Brand", value: brand },
                    {
                      icon: <FaClock size={11} />,
                      label: "Added",
                      value: moment(createdAt).fromNow(),
                    },
                    {
                      icon: <FaStar size={11} />,
                      label: "Rating",
                      value: `${Math.round(rating)} / 5`,
                    },
                    {
                      icon: <FaStar size={11} />,
                      label: "Reviews",
                      value: numReviews,
                    },
                    {
                      icon: <FaShoppingCart size={11} />,
                      label: "Quantity",
                      value: quantity,
                    },
                    { icon: <FaBox size={11} />, label: "In Stock", value: countInStock },
                  ].map(({ icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 bg-[#18181b] border border-[#2a2a2e] rounded-xl px-3 py-2"
                    >
                      <span className="text-pink-400">{icon}</span>
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-wide leading-none mb-0.5">
                          {label}
                        </p>
                        <p className="text-xs text-white font-medium truncate">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
