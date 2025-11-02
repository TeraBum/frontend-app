// src/pages/Payment.tsx
import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const Payment: React.FC = () => {
  const [cart] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Kit Upgrade AMD Ryzen 5 4500, Placa Mãe A520M, 16GB DDR4, Neologic - Nli84048',
      image:
        'https://images5.kabum.com.br/produtos/fotos/sync_mirakl/367065/xlarge/Kit-Upgrade-AMD-Ryzen-5-4500-Placa-M-e-A520M-16GB-DDR4-Neologic-Nli84048_1741269039.jpg',
      price: 1299,
      quantity: 1,
    },
  ]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cartão Mastercard **** 6302');
  const [installments, setInstallments] = useState(1);

  const [address, setAddress] = useState({
    name: 'João da Silva',
    street: 'Rua das Flores, 123',
    neighborhood: 'Jardim Alegria',
    city: 'Belo Horizonte',
    state: 'MG',
    zip: '30123-456',
  });

  // Endereço temporário para o modal
  const [tempAddress, setTempAddress] = useState({ ...address });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 150;
  const total =
    paymentMethod.includes('Cartão') && installments >= 10
      ? subtotal + shipping + (subtotal + shipping) * 0.02 * installments
      : subtotal + shipping;

  const openAddressModal = () => {
    setTempAddress({ ...address });
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false); // descarta alterações
  };

  const saveAddress = () => {
    setAddress({ ...tempAddress });
    setShowAddressModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 max-w-7xl mx-auto flex flex-col lg:flex-row p-4 lg:p-6 gap-6">
        {/* Resumo do pedido */}
        <aside className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow sticky top-6 h-fit space-y-6">
          <h2 className="text-2xl font-bold">Resumo do Pedido</h2>

          {/* Entrega */}
          <section className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-lg">Entrega</h3>
            <p>{address.name}</p>
            <p>{address.street}</p>
            <p>
              {address.neighborhood}, {address.city}, {address.state}, {address.zip}
            </p>
            <button
              className="text-[#24dbc5] mt-2 hover:underline font-semibold"
              onClick={openAddressModal}
            >
              Alterar endereço
            </button>
          </section>

          {/* Produtos */}
          <section className="border-b border-gray-200 pb-4 space-y-2">
            <h3 className="font-semibold text-lg">Itens</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">x{item.quantity}</p>
                </div>
                <span className="font-semibold">R$ {item.price.toFixed(2)}</span>
              </div>
            ))}
          </section>

          {/* Pagamento */}
          <section className="pb-4">
            <h3 className="font-semibold text-lg">Pagamento</h3>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                if (!e.target.value.includes('Cartão')) setInstallments(1);
              }}
              className="mt-2 border border-gray-300 rounded p-2 w-full"
            >
              <option>Cartão Mastercard **** 6302</option>
              <option>Cartão Visa **** 1234</option>
              <option>PIX</option>
              <option>Boleto</option>
            </select>

            {paymentMethod.includes('Cartão') && (
              <select
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                className="mt-2 border border-gray-300 rounded p-2 w-full"
              >
                {[...Array(12)].map((_, i) => {
                  const n = i + 1;
                  return (
                    <option key={n} value={n}>
                      {n}x {n >= 10 ? `(com juros)` : `(sem juros)`}
                    </option>
                  );
                })}
              </select>
            )}
          </section>

          {/* Totais */}
          <section className="space-y-1">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Frete:</span>
              <span>R$ {shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </section>

          <button className="w-full bg-[#24dbc5] text-white py-3 rounded-lg font-semibold hover:bg-[#1bb3a3] transition-colors mt-4">
            Confirmar Pedido
          </button>
        </aside>

        {/* Área principal */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Instruções e Observações</h2>
            <textarea
              placeholder="Adicionar instruções especiais para o pedido..."
              className="w-full border border-gray-300 rounded p-3 resize-none h-32"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-2xl font-bold mb-4">Informações adicionais</h2>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Precisa de ajuda?</h3>
              <p>Explore nossas páginas de Ajuda para dúvidas sobre pedidos, pagamentos e frete.</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Confirmação</h3>
              <p>Ao finalizar seu pedido, você receberá um e-mail confirmando que o pedido foi recebido.</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Política de devolução</h3>
              <p>Produtos podem ser devolvidos em até 7 dias corridos após o recebimento. Devem estar na embalagem original e sem sinais de uso.</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Segurança e termos</h3>
              <p>Pagamentos processados via SSL. Ao confirmar o pedido, você concorda com os Termos de Uso e Política de Privacidade do TeraBuum.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de endereço */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Alterar Endereço</h2>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Nome"
                className="w-full border border-gray-300 rounded p-2"
                value={tempAddress.name}
                onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Rua, Número"
                className="w-full border border-gray-300 rounded p-2"
                value={tempAddress.street}
                onChange={(e) => setTempAddress({ ...tempAddress, street: e.target.value })}
              />
              <input
                type="text"
                placeholder="Bairro"
                className="w-full border border-gray-300 rounded p-2"
                value={tempAddress.neighborhood}
                onChange={(e) => setTempAddress({ ...tempAddress, neighborhood: e.target.value })}
              />
              <input
                type="text"
                placeholder="Cidade"
                className="w-full border border-gray-300 rounded p-2"
                value={tempAddress.city}
                onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Estado"
                className="w-full border border-gray-300 rounded p-2"
                value={tempAddress.state}
                onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
              />
              <input
                type="text"
                placeholder="CEP"
                className="w-full border border-gray-300 rounded p-2"
                value={tempAddress.zip}
                onChange={(e) => setTempAddress({ ...tempAddress, zip: e.target.value })}
              />
              <button
                type="button"
                className="w-full bg-[#24dbc5] text-white py-2 rounded mt-3"
                onClick={saveAddress}
              >
                Salvar
              </button>
            </form>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeAddressModal}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
