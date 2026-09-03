import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader />
        </div>
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError?.error}
        </Message>
      ) : (
        <>
          {/* Section header */}
          <div className="flex justify-between items-center px-8 mt-12 ml-[5rem]">
            <div>
              <p className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-1">
                Featured Collection
              </p>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Special Products
              </h1>
            </div>

            <Link
              to="/shop"
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 transition-colors duration-200 text-white font-semibold rounded-full py-2.5 px-7 text-sm"
            >
              Shop All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 14 10">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
          </div>

          {/* Products grid */}
          <div className="ml-[5rem] px-8 mt-8 pb-12">
            <div className="flex justify-center flex-wrap gap-6">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
