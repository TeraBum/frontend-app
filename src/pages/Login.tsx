import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserService } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await UserService.login({ email, password });
      const token = response.data?.token;

      if (!token) {
        setError('Token não recebido. Tente novamente mais tarde.');
        return;
      }

      const role = login(token);

      const state = location.state as { from?: Location } | undefined;
      const redirectPath =
        state?.from?.pathname ??
        (role === 'Administrador' ? '/admin/estoque' : '/products');

      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      console.error('Erro login:', err.response);
      setError(err.response?.data || 'Erro ao logar');
    }
  };

  const handleGoToRegister = () => navigate('/register', {replace: true})

  return (
    <div className="min-h-screen">
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
          <div className='text-center block m-2' onClick={handleGoToRegister}>Não tem uma conta? <a className='cursor-pointer text-blue-600'>Registre</a></div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
