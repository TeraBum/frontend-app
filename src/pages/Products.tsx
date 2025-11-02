import React, { useEffect, useState } from "react"; 
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { VitrineService, CartService } from "../services/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imagesJson?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  stock: number;
}

const categories = [
  "Todos",
  "Cabos",
  "Hardware",
  "Periféricos",
  "Monitores",
  "Armazenamento",
  "Notebooks",
  "Celulares",
  "Redes",
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<string>("Todos");
  const [sort, setSort] = useState<string>("padrao");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catFromUrl = params.get("categoria");
    if (catFromUrl && categories.includes(catFromUrl)) setCategory(catFromUrl);
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    VitrineService.getProducts()
      .then((res) => {
        const active = res.data.products.filter((p: Product) => p.isActive);
        setProducts(active);
        setFilteredProducts(active);
      })
      .catch(() => console.error("Erro ao carregar produtos"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (category !== "Todos") filtered = filtered.filter((p) => p.category === category);

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sort === "menor") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "maior") filtered.sort((a, b) => b.price - a.price);

    //setFilteredProducts(filtered);
  }, [category, sort, priceRange, products]);

  const handleAddToCart = async (productId: string) => {
    try {
      const r = await CartService.get()
      await CartService.editItems({ productId, quantity: 1 });
      alert("✅ Produto adicionado ao carrinho!");
    } catch (err) {
      try{
      await CartService.create({items:[
        { productId: productId, quantity: 1, unitPrice: 100 }
      ]});
      alert("Produto adicionado ao carrinho!")
    } catch(err){
      alert("Erro ao adicionar ao carrinho! ❌")
    }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* FILTROS */}
      <section className="bg-white border-b border-gray-200 py-4 px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        {/* Categoria */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Categoria:</label>
          <select
            className="border border-gray-300 rounded-lg p-2 bg-white hover:border-[#24dbc5] focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Ordenar por:</label>
          <select
            className="border border-gray-300 rounded-lg p-2 bg-white hover:border-[#24dbc5] focus:outline-none"
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
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-48 accent-[#24dbc5]"
          />
          <span className="text-sm text-gray-600">
            Até R$ {priceRange[1].toLocaleString("pt-BR")}
          </span>
        </div>
      </section>

      {/* LISTA DE PRODUTOS */}
      <main className="p-8">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600 text-lg mt-10">
            Nenhum produto encontrado para esta categoria ou faixa de preço.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const images = JSON.parse(product.imagesJson || "[]");
              const mainImage = images[0] || "/placeholder.png";

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  stock={ 100 /*product.stock */}
                  image={mainImage}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
