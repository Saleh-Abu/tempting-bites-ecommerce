import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Home,
  CakeSlice,
  Search,
  ShoppingBag,
} from "lucide-react";

import { openCart } from "../features/cartSlice";

function MobileBottomNav({
  onSearchOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items || []
  );

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const isHome =
    location.pathname === "/";

  const isCakes =
    location.pathname === "/cakes";

  return (
    <div className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 md:hidden">

      <div className="grid grid-cols-4 items-center rounded-full border border-white/50 bg-white/90 px-2 py-2 shadow-[0_15px_45px_rgba(84,36,50,0.18)] backdrop-blur-xl">

        {/* HOME */}

        <NavButton
          active={isHome}
          label="Home"
          icon={Home}
          onClick={() =>
            navigate("/")
          }
        />

        {/* CAKES */}

        <NavButton
          active={isCakes}
          label="Cakes"
          icon={CakeSlice}
          onClick={() =>
            navigate("/cakes")
          }
        />

        {/* SEARCH */}

        <NavButton
          label="Search"
          icon={Search}
          onClick={
            onSearchOpen
          }
        />

        {/* CART */}

        <NavButton
          label="Cart"
          icon={ShoppingBag}
          badge={cartCount}
          onClick={() =>
            dispatch(openCart())
          }
        />

      </div>

    </div>
  );
}

function NavButton({
  active,
  label,
  icon: Icon,
  onClick,
  badge,
}) {
  return (
    <motion.button
      type="button"
      whileTap={{
        scale: 0.9,
      }}
      onClick={onClick}
      className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-full transition ${
        active
          ? "bg-[#542432] text-white"
          : "text-[#8d6974]"
      }`}
    >

      <div className="relative">

        <Icon size={19} />

        {badge > 0 && (
          <motion.span
            key={badge}
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[8px] font-bold text-white"
          >
            {badge > 99
              ? "99+"
              : badge}
          </motion.span>
        )}

      </div>

      <span className="text-[9px] font-bold">
        {label}
      </span>

    </motion.button>
  );
}

export default MobileBottomNav;