import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { OrderService } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  customerName: string;
  status: string;
  date: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await OrderService.getPayment('all'); // ou sua API de listar pedidos
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <main className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
        {orders.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <p className="font-semibold text-black">{order.customerName}</p>
                <p className="text-gray-500">Pedido: #{order.id}</p>
                <p className="text-gray-500">Data: {order.date}</p>
                <p className={`mt-2 font-bold ${order.status === 'Entregue' ? 'text-primary' : 'text-yellow-500'}`}>
                  {order.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
