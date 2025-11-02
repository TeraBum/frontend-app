import React, { useEffect, useState } from "react";
import { VitrineService } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  categoria?: string;
}

const Home: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    "/Banner para Ecommerce de Black Friday Neon Roxo.png",
    "/Banner para ecommerce loja virtual minimalista preto e verde.png",
    "/Banner para loja virtual ecommerce .png",
  ];

  const categorias = [
  { name: "Cabos", img: "/cabos.jpg" },
  { name: "Hardware", img: "/hardware.webp" },
  { name: "Periféricos", img: "/perifericos.webp" },
  { name: "Monitores", img: "/monitores.jpg" },
  { name: "Armazenamento", img: "/armazenamento.jpg" },
  { name: "Notebooks", img: "/notebooks.jpg" },
  { name: "Celulares", img: "/celulares.webp" },
  { name: "Redes", img: "/redes.webp" },
];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await VitrineService.getProducts();
        setProdutos(response.data.slice(0, 8));
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  const handleCategoriaClick = (categoria: string) => {
    navigate(`/produtos?categoria=${encodeURIComponent(categoria)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#e8eef5] font-['Prompt'] text-black">

      {/* ====== CARROSSEL ====== */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {slides.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={img} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </section>

      {/* ====== CATEGORIAS ====== */}
      <section className="bg-white py-12 px-6 md:px-12 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-[#24dbc5] text-3xl">☰</span>
            CATEGORIAS
          </h2>

          <div className="flex overflow-x-auto space-x-6 scrollbar-hide">
            {categorias.map((cat, i) => (
              <div
                key={i}
                onClick={() => handleCategoriaClick(cat.name)}
                className="flex-shrink-0 w-40 text-center group cursor-pointer"
              >
                <div className="h-28 w-40 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="mt-3 text-sm font-bold uppercase text-[#000000] group-hover:text-[#24dbc5]">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRODUTOS ====== */}
      <section className="bg-white py-16 px-8 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            MAIS PROCURADOS 🔥
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#f5f7fa] rounded-2xl p-4 shadow animate-pulse">
                  <div className="h-40 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 w-3/4 mb-2 rounded"></div>
                  <div className="h-4 bg-gray-300 w-1/2 mb-4 rounded"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="bg-[#f9fafb] rounded-2xl p-4 shadow hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={produto.imagemUrl}
                      alt={produto.nome}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{produto.nome}</h3>
                  <p className="text-gray-500 mb-4 text-sm line-clamp-2">{produto.descricao}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#24dbc5]">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                    <button className="bg-[#24dbc5] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#1fb8a8] transition-all flex items-center gap-2">
                      <ShoppingCart size={18} /> Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
