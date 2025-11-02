import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { CartService, VitrineService } from '../services/api';
import Loader from '../components/Loader';

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}


const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await CartService.get();
      console.log(res.data.items)
      const products = []
      for (const item of res.data.items) {
      const productRes = await VitrineService.getProductById(item.productId)
      products.push({...item, name: productRes.data.name})
  }
      
     // VitrineService.getProductById
      setCart(products);
      setLoading(false);
    } catch (err) {
      setCart([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      await CartService.checkout({ items: cart });
      alert('Compra realizada com sucesso!');
      setCart([]);
      //redirect para o servico de pagamento
    } catch (err) {
      alert('Erro ao realizar checkout');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Seu Carrinho</h1>
        {cart.length === 0 ? (
          <p>O carrinho está vazio.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {cart.map(item => (
                <li key={item.productId} className="flex justify-between bg-white p-4 rounded shadow">
                  <span>{item.name} x {item.quantity}</span>
                  <span>R${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-primary text-white px-4 py-2 rounded"
            >
              Finalizar Compra
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
