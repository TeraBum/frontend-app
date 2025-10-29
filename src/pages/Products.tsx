import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { VitrineService, CartService } from '../services/api';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    VitrineService.getProducts().then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      await CartService.editItems({ productId, quantity: 1 });
      alert('Produto adicionado ao carrinho!');
    } catch (err) {
      alert('Erro ao adicionar ao carrinho');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            stock={product.stock}
            onAddToCart={handleAddToCart}
          />
        ))}
      </main>
    </div>
  );
};

export default Products;
