import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 ml-[4%]">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="mb-8">
            <span className="text-2xl font-bold text-white tracking-tight">
              Shop<span className="text-pink-500">Verse</span>
            </span>
            <h1 className="mt-6 text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-[#18181b] border border-[#2a2a2e] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-[#18181b] border border-[#2a2a2e] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-400 text-center">
            New to ShopVerse?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Image panel */}
      <div className="hidden xl:block w-[55%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt="Login visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f10]/60 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <p className="text-white text-2xl font-bold leading-snug">
            Discover premium products<br />at your fingertips.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
