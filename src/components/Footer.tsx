import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#000000] text-[#e8eef5] py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LOGO + SLOGAN */}
        <div>
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/terabum logo.png"
              alt="TeraBum"
              className="h-10 w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </div>

          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            Tecnologia que acelera o seu mundo.
          </p>

          {/* REDES SOCIAIS */}
          <div className="flex space-x-5 mt-6">
            <a
              href="#"
              className="text-gray-400 hover:text-[#24dbc5] transition-colors"
              title="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#24dbc5] transition-colors"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#24dbc5] transition-colors"
              title="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#24dbc5] transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* COLUNA: SERVIÇOS */}
        <div>
          <h3 className="text-[#24dbc5] font-semibold mb-4">Serviços</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link
                to="/products"
                className="hover:text-[#24dbc5] transition-colors"
              >
                Produtos
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-[#24dbc5] transition-colors"
              >
                Carrinho
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-[#24dbc5] transition-colors"
              >
                Login / Cadastro
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUNA: SUPORTE */}
        <div>
          <h3 className="text-[#24dbc5] font-semibold mb-4">Suporte</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-[#24dbc5] transition-colors">
                Dúvidas frequentes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#24dbc5] transition-colors">
                Política de privacidade
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#24dbc5] transition-colors">
                Termos de uso
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-[#24dbc5]">TeraBum</span> — Todos os
        direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
