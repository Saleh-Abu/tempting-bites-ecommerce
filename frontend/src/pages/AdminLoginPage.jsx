import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";
import {
  LockKeyhole,
  Mail,
  Loader2,
  CakeSlice,
  ArrowRight,
} from "lucide-react";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

     await axios.post(
  `${API_URL}/api/admin/login`,
  form
);

      if (response.data.success) {
        localStorage.setItem(
          "adminToken",
          response.data.token
        );

        localStorage.setItem(
          "adminUser",
          JSON.stringify(
            response.data.admin
          )
        );

        navigate(
          "/admin/dashboard"
        );
      }
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff8f5] px-6">

      <motion.div
        animate={{
          y: [0, -25, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#542432]/10 blur-3xl"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-[0_30px_100px_rgba(80,30,45,0.12)] md:p-10"
      >

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">

          <CakeSlice size={30} />

        </div>

        <div className="mt-6 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
            Tempting Bites
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold text-[#542432]">
            Admin Kitchen
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Sign in to manage your
            cakes and orders.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400"
            />

            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Admin Email"
              className="w-full rounded-2xl border border-pink-100 bg-[#fffafa] py-4 pl-14 pr-5 outline-none transition focus:border-pink-400"
            />

          </div>

          <div className="relative">

            <LockKeyhole
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400"
            />

            <input
              type="password"
              name="password"
              required
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="Password"
              className="w-full rounded-2xl border border-pink-100 bg-[#fffafa] py-4 pl-14 pr-5 outline-none transition focus:border-pink-400"
            />

          </div>

          {error && (
            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-semibold text-red-600"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#542432] py-4 font-bold text-white shadow-lg disabled:opacity-50"
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Signing In...
              </>
            ) : (
              <>
                Enter Dashboard
                <ArrowRight
                  size={18}
                />
              </>
            )}

          </motion.button>

        </form>

        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-400">

          <LockKeyhole
            size={13}
          />

          Secure admin access

        </div>

      </motion.div>

    </main>
  );
}

export default AdminLoginPage;