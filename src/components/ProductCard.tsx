import React from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  stock: number;
  onAddToCart: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, stock, onAddToCart }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white">
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-gray-500">Preço: R${price.toFixed(2)}</p>
      <p className="text-gray-500">Estoque: {stock}</p>
      <button
        disabled={stock === 0}
        onClick={() => onAddToCart(id)}
        className="mt-2 bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default ProductCard;
