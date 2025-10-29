import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../services/api';
import Navbar from '../components/Navbar';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await UserService.login({ email, password });
      localStorage.setItem('token', response.data.token); // salva token
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao logar');
    }
  };

  return (
      <div className='min-h-screen'><Navbar />
    <div className="flex flex-col items-center justify-center mt-20 bg-secondary">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">Entrar</button>
      </form>
    </div>
    </div>
  );
};

export default Login;
