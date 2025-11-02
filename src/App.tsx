import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import StockAdmin from "./pages/StockAdmin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Payment from "./pages/Payment";
import RequireAdmin from "./components/RequireAdmin";


const App: React.FC = () => {
  return (
    <Router>
      {/* Navbar aparece em todas as páginas */}
      <Navbar />

      {/* Conteúdo principal das rotas */}
      <main className="min-h-screen flex flex-col justify-between">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route
            path="/admin/estoque"
            element={
              <RequireAdmin>
                <StockAdmin />
              </RequireAdmin>
            }
          />
          <Route path="/payment" element={<Payment />} />

        </Routes>
      </main>

      {/* Footer fixo em todas as páginas */}
      <Footer />
    </Router>
  );
};

export default App;
