import React from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  onAddToCart: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  stock,
  image,
  onAddToCart,
}) => {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col">
      {/* Imagem do produto */}
      <div className="h-40 w-full mb-4">
        <img
          src={image || "/placeholder.png"}
          alt={name}
          className="h-full w-full object-cover rounded-lg"
        />
      </div>

      {/* Nome e descrição */}
      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      {description && (
        <p className="text-gray-500 text-sm mb-2">{description}</p>
      )}

      {/* Preço */}
      <p className="font-bold text-gray-900 mb-2">R$ {price.toLocaleString("pt-BR")}</p>

      {/* Estoque e botão */}
      <button
        disabled={stock === 0}
        onClick={() => onAddToCart(id)}
        className={`mt-auto px-4 py-2 rounded-lg font-semibold transition-all ${
          stock > 0
            ? "bg-[#24dbc5] hover:bg-[#1fc2ae] text-black"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        {stock > 0 ? "Adicionar ao Carrinho" : "Esgotado"}
      </button>
    </div>
  );
};

export default ProductCard;
