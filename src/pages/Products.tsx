import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { VitrineService, CartService } from "../services/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imagesJson: string; // JSON com URLs das imagens
  category: string;
  isActive: boolean;
  createdAt: string;
  stock: number; // opcional
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<string>("Todos");
  const [sort, setSort] = useState<string>("padrao");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);

  useEffect(() => {
    VitrineService.getProducts()
      .then((res) => {
        const activeProducts = res.data.filter((p: Product) => p.isActive);
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtro e ordenação
  useEffect(() => {
    let filtered = [...products];

    // Filtrar por categoria
    if (category !== "Todos") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filtrar por faixa de preço
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Ordenar por preço
    if (sort === "menor") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "maior") filtered.sort((a, b) => b.price - a.price);

    setFilteredProducts(filtered);
  }, [category, sort, priceRange, products]);

  const handleAddToCart = async (productId: string) => {
    try {
      await CartService.editItems({ productId, quantity: 1 });
      alert("Produto adicionado ao carrinho!");
    } catch (err) {
      alert("Erro ao adicionar ao carrinho");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>

      {/* FILTROS */}
      <section className="bg-gray-100 py-4 px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        {/* Categoria */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Categoria:</label>
          <select
            className="border border-gray-300 rounded-lg p-2 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Todos">Todas</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Acessórios">Acessórios</option>
            <option value="Computadores">Computadores</option>
          </select>
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Ordenar por:</label>
          <select
            className="border border-gray-300 rounded-lg p-2 bg-white"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="padrao">Padrão</option>
            <option value="menor">Preço: menor → maior</option>
            <option value="maior">Preço: maior → menor</option>
          </select>
        </div>

        {/* Faixa de preço */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Faixa de preço:</label>
          <input
            type="range"
            min={0}
            max={15000}
            step={500}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([0, parseInt(e.target.value, 10)])
            }
            className="w-48"
          />
          <span className="text-sm text-gray-600">
            Até R$ {priceRange[1].toLocaleString("pt-BR")}
          </span>
        </div>
      </section>

      {/* LISTA DE PRODUTOS */}
      <main className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const images = JSON.parse(product.imagesJson || "[]");
          const mainImage = images[0] || "/placeholder.png";

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description.slice(0, 60) + "..."}
              price={product.price}
              stock={product.stock}
              image={mainImage}
              onAddToCart={handleAddToCart}
            />
          );
        })}
      </main>
    </div>
  );
};

export default Products;
