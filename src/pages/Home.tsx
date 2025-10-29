import React from 'react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-black">Bem-vindo ao TeraBum</h1>
        <p className="text-black text-lg mb-8">Tecnologia que acelera o seu mundo.</p>

        {/* Seções do Figma podem ser adicionadas aqui */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">Seção 1</div>
          <div className="bg-white p-6 rounded shadow">Seção 2</div>
          <div className="bg-white p-6 rounded shadow">Seção 3</div>
        </section>
      </main>
    </div>
  );
};

export default Home;
