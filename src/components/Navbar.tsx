import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-black p-4 flex justify-between items-center">
      <div>
        <div className="text-2xl font-bold">TeraBum</div>
        <div className="text-sm font-medium">Tecnologia que acelera o seu mundo</div>
      </div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-white">Home</Link>
        <Link to="/orders" className="hover:text-white">Pedidos</Link>
      </div>
    </nav>
  );
};

export default Navbar;
