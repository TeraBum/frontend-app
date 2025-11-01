import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { OrderService } from '../services/api';

interface OrderDetail {
  id: string;
  customerName: string;
  status: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await OrderService.getPayment(id); // buscar pedido pelo id
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p>Pedido não encontrado.</p>;

  return (
    <div>
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Pedido #{order.id}</h1>
        <p className="mb-2">Cliente: {order.customerName}</p>
        <p className="mb-4">Status: {order.status}</p>
        <p className="mb-4">Data: {order.date}</p>

        <h2 className="text-xl font-semibold mb-2">Itens do Pedido:</h2>
        <ul className="list-disc list-inside space-y-1">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} x {item.quantity} — R${(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default OrderDetails;
