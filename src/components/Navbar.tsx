import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Heart, Search } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#ffffff] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer select-none"
        >
          <img
            src="/terabum logo.png"
            alt="TeraBum"
            className="h-10 w-auto hover:opacity-90 transition-opacity"
          />
        </div>

        {/* CAMPO DE BUSCA */}
        <div className="hidden md:flex items-center bg-[#f5f7fa] rounded-lg px-3 py-2 w-1/3">
          <Search className="text-gray-400 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="bg-transparent outline-none text-sm text-gray-700 w-full"
          />
        </div>

        {/* LINKS DO MENU */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            to="/"
            className="text-gray-700 hover:text-[#24dbc5] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-gray-700 hover:text-[#24dbc5] transition-colors"
          >
            Produtos
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-[#24dbc5] transition-colors"
          >
            Entrar em Contato
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-[#24dbc5] transition-colors"
          >
            Sobre nós
          </Link>
        </nav>

        {/* ÍCONES À DIREITA */}
        <div className="flex items-center space-x-6 text-gray-700">
          {/* Favoritos */}
          <button
            title="Favoritos"
            className="hover:text-[#24dbc5] transition-colors"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Carrinho */}
          <button
            title="Carrinho"
            onClick={() => navigate("/cart")}
            className="hover:text-[#24dbc5] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          {/* Login / Registro */}
          <button
            title="Entrar ou Cadastrar"
            onClick={() => navigate("/login")}
            className="hover:text-[#24dbc5] transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
