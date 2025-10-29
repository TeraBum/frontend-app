import React from 'react';

interface OrderCardProps {
  orderId: string;
  customerName: string;
  status: string;
  date: string;
}

const OrderCard: React.FC<OrderCardProps> = ({ orderId, customerName, status, date }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer bg-white">
      <div className="font-semibold text-black">{customerName}</div>
      <div className="text-gray-500">Pedido: #{orderId}</div>
      <div className="text-gray-500">Data: {date}</div>
      <div className={`mt-2 font-bold ${status === 'Entregue' ? 'text-primary' : 'text-yellow-500'}`}>
        {status}
      </div>
    </div>
  );
};

export default OrderCard;
