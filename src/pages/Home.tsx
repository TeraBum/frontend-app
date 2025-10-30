import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingCart, Cpu, Monitor, Headphones } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fa]">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-[#00C9A7] to-[#0091EA] text-white py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">
            Tecnologia que acelera o seu mundo 🚀
          </h1>
          <p className="text-lg text-gray-100 mb-8">
            As melhores ofertas em hardware, periféricos e eletrônicos você encontra aqui.
          </p>
          <button className="bg-white text-[#0091EA] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all shadow-md">
            Ver Ofertas
          </button>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Categorias em destaque
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Cpu size={40} />, label: "Hardware" },
            { icon: <Monitor size={40} />, label: "Monitores" },
            { icon: <Headphones size={40} />, label: "Periféricos" },
            { icon: <ShoppingCart size={40} />, label: "Ofertas" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow hover:shadow-lg p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1"
            >
              <div className="text-[#0091EA] mb-3">{item.icon}</div>
              <p className="text-gray-700 font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="bg-white py-16 px-8 shadow-inner">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Ofertas imperdíveis 🔥
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-[#f9fafb] rounded-2xl p-4 shadow hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Imagem {n}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Produto {n}
                </h3>
                <p className="text-gray-500 mb-4">Descrição breve do produto {n}.</p>
                <button className="w-full bg-[#0091EA] text-white font-semibold py-2 rounded-lg hover:bg-[#007ACC] transition-all">
                  Comprar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default Home;

