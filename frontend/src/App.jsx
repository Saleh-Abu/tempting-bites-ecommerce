import { useState } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Occasions from "./components/Occasions";
import TodaysOffers from "./components/TodaysOffers";
import BestSellers from "./components/BestSellers";
import CartDrawer from "./components/CartDrawer";
import SearchModal from "./components/SearchModal";
import MobileBottomNav from "./components/MobileBottomNav";
import NewArrivals from "./components/NewArrivals";
import CustomCakeCTA from "./components/CustomCakeCTA";
import BakingCareer from "./components/BakingCareer";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";

import CakesPage from "./pages/CakesPage";
import CheckoutPage from "./pages/CheckoutPage";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminCakesPage from "./pages/AdminCakesPage";
import AuthPage from "./pages/AuthPage";
import MyOrdersPage from "./pages/MyOrdersPage";


/* =========================================
   HOME PAGE
========================================= */

function HomePage() {
  return (
    <>
      <Hero />

      <Occasions />

      <TodaysOffers />

      <BestSellers />

      <NewArrivals />

      <CustomCakeCTA />

      <BakingCareer />

      <Reviews />

      <Footer />
    </>
  );
}


/* =========================================
   CUSTOMER LAYOUT
========================================= */

function CustomerLayout({
  children,
}) {
  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);


  const openSearch = () => {
    setSearchOpen(true);
  };


  const closeSearch = () => {
    setSearchOpen(false);
  };


  return (
    <>

      {/* TOP NAVBAR */}

      <Navbar
        onSearchOpen={
          openSearch
        }
      />


      {/* PAGE CONTENT */}

      <main className="pb-20 md:pb-0">
        {children}
      </main>


      {/* CART DRAWER */}

      <CartDrawer />


      {/* MOBILE BOTTOM NAVIGATION */}

      <MobileBottomNav
        onSearchOpen={
          openSearch
        }
      />


      {/* SEARCH MODAL */}

      <SearchModal
        isOpen={
          searchOpen
        }
        onClose={
          closeSearch
        }
      />

    </>
  );
}


/* =========================================
   APP
========================================= */

function App() {
  return (
    <Routes>

      {/* =====================================
          HOME
      ===================================== */}

      <Route
        path="/"
        element={
          <CustomerLayout>
            <HomePage />
          </CustomerLayout>
        }
      />


      {/* =====================================
          CAKES
      ===================================== */}

      <Route
        path="/cakes"
        element={
          <CustomerLayout>
            <CakesPage />
          </CustomerLayout>
        }
      />


      {/* =====================================
          CHECKOUT

          Standalone route.
          No Navbar.
          No CartDrawer.
          No MobileBottomNav.
      ===================================== */}

      <Route
        path="/checkout"
        element={
          <CheckoutPage />
        }
      />


      {/* =====================================
          ADMIN LOGIN
      ===================================== */}

      <Route
        path="/admin/login"
        element={
          <AdminLoginPage />
        }
      />


      {/* =====================================
          ADMIN DASHBOARD
      ===================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminDashboard />
        }
      />


      {/* =====================================
          ADMIN ORDERS
      ===================================== */}

      <Route
        path="/admin/orders"
        element={
          <AdminOrdersPage />
        }
      />


      {/* =====================================
          ADMIN CAKES
      ===================================== */}

      <Route
        path="/admin/cakes"
        element={
          <AdminCakesPage />
        }
      />

      {/* =====================================
          AUTH PAGE
      ===================================== */}

      <Route
        path="/auth"
        element={
          <AuthPage />
        }
      />  

      {/* =====================================
          MY ORDERS
      ===================================== */}

      <Route
        path="/my-orders"
        element={
          <CustomerLayout>
            <MyOrdersPage />
          </CustomerLayout>
        }
      />

    </Routes>
  );
}


export default App;