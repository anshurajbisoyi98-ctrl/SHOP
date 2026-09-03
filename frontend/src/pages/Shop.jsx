import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsMutation } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  // Mutation hook — we control when it fires
  const [getFilteredProducts, { isLoading: loadingFiltered }] =
    useGetFilteredProductsMutation();

  // Track all products (unfiltered) for brand extraction
  const [allProducts, setAllProducts] = useState([]);

  // Initial load — fetch all products with no filters
  useEffect(() => {
    const fetchAll = async () => {
      const result = await getFilteredProducts({ checked: [], radio: [] }).unwrap();
      setAllProducts(result);
      dispatch(setProducts(result));
    };
    fetchAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load categories
  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  // Re-fetch filtered products when checked categories or radio change
  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const result = await getFilteredProducts({ checked, radio }).unwrap();
        // Apply price filter on top of server-filtered results
        const filtered = result.filter((product) => {
          return (
            priceFilter === "" ||
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });
        dispatch(setProducts(filtered));
      } catch (err) {
        console.error("Filter error:", err);
      }
    };
    fetchFiltered();
  }, [checked, radio]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply price filter locally when price input changes
  useEffect(() => {
    if (allProducts.length > 0) {
      const filtered = allProducts.filter((product) => {
        return (
          priceFilter === "" ||
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
        );
      });
      dispatch(setProducts(filtered));
    }
  }, [priceFilter, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBrandClick = (brand) => {
    const productsByBrand = allProducts.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        allProducts
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="ml-[4%] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-1">
            Browse Our Collection
          </p>
          <h1 className="text-3xl font-bold text-white">Shop</h1>
        </div>

        <div className="flex gap-6">
          {/* ─── Sidebar ─────────────────────────────── */}
          <aside className="w-64 shrink-0">
            <div className="bg-[#18181b] border border-[#2a2a2e] rounded-2xl overflow-hidden sticky top-6">
              {/* Categories */}
              <div className="p-5 border-b border-[#2a2a2e]">
                <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-4">
                  Categories
                </h2>
                <div className="space-y-2">
                  {categories?.map((c) => (
                    <label
                      key={c._id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        id={`cat-${c._id}`}
                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                        className="w-4 h-4 accent-pink-500 rounded"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {c.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="p-5 border-b border-[#2a2a2e]">
                <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-4">
                  Brands
                </h2>
                <div className="space-y-2">
                  {uniqueBrands?.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        id={brand}
                        name="brand"
                        onChange={() => handleBrandClick(brand)}
                        className="w-4 h-4 accent-pink-500"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="p-5 border-b border-[#2a2a2e]">
                <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-4">
                  Filter by Price
                </h2>
                <input
                  type="text"
                  placeholder="e.g. 150"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-full bg-[#0f0f10] border border-[#2a2a2e] text-white placeholder-gray-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
              </div>

              {/* Reset */}
              <div className="p-5">
                <button
                  className="w-full text-sm font-semibold text-gray-300 hover:text-white border border-[#2a2a2e] hover:border-pink-500/40 py-2.5 rounded-xl transition-all duration-200 hover:bg-pink-500/5"
                  onClick={() => window.location.reload()}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </aside>

          {/* ─── Products grid ────────────────────────── */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">{products?.length}</span>{" "}
                {products?.length === 1 ? "product" : "products"} found
              </p>
            </div>

            {loadingFiltered || products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                {loadingFiltered ? (
                  <>
                    <div className="mb-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#2a2a2e] border-t-pink-500" />
                    </div>
                    <p className="text-gray-400 text-sm">Loading products...</p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-gray-400 text-sm">No products match your filters.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 text-pink-400 hover:text-pink-300 text-sm underline"
                    >
                      Clear filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-5">
                {products?.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
