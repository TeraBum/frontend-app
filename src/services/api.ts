import axios from 'axios';

// ------------------- Instâncias por serviço -------------------
const userAPI = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

const vitrineAPI = axios.create({
  baseURL: 'http://localhost:5010/api/v1',
});

const estoqueAPI = axios.create({
  baseURL: 'http://localhost:5020/api/v1',
});

const carrinhoAPI = axios.create({
  baseURL: 'http://localhost:5030/api/v1',
});

const orderAPI = axios.create({
  baseURL: 'http://localhost:5050/api/v1',
});

// ------------------- Interceptor comum (token) -------------------
[userAPI, vitrineAPI, estoqueAPI, carrinhoAPI, orderAPI].forEach(apiInstance => {
  apiInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

// ------------------- UserService -------------------
export const UserService = {
  register: (data: { name: string; email: string; password: string }) =>
    userAPI.post('/Users/register', data),

  login: (data: { email: string; password: string }) =>
    userAPI.post('/Users/login', data),

  getAll: () => userAPI.get('/Users'),
  getById: (id: string) => userAPI.get(`/Users/${id}`),
  update: (id: string, data: any) => userAPI.put(`/Users/${id}`, data),
  updateRole: (id: string, role: string) => userAPI.put(`/Users/${id}/role`, { role }),
  delete: (id: string) => userAPI.delete(`/Users/${id}`),
};

// ------------------- VitrineService -------------------
export const VitrineService = {
  getProducts: () => vitrineAPI.get('/vitrine/Product'),
  getProductById: (id: string) => vitrineAPI.get(`/vitrine/Product/${id}`),
  getProductStock: (id: string) => vitrineAPI.get(`/vitrine/Product/${id}/stock`),
};

// ------------------- EstoqueService -------------------
export const StockService = {
  listItems: () => estoqueAPI.get('/stock-items'),
  getItem: (warehouseId: string, productId: string) => estoqueAPI.get(`/stock-items/${warehouseId}/${productId}`),
  updateItem: (warehouseId: string, productId: string, data: any) =>
    estoqueAPI.put(`/stock-items/${warehouseId}/${productId}`, data),
  deleteItem: (warehouseId: string, productId: string) =>
    estoqueAPI.delete(`/stock-items/${warehouseId}/${productId}`),
  createItem: (data: any) => estoqueAPI.post('/stock-items', data),
  baixa: (data: any) => estoqueAPI.post('/stock-items/baixa', data),
};

// ------------------- CartService -------------------
export const CartService = {
  create: (data: any) => carrinhoAPI.post('/cart', data),
  get: () => carrinhoAPI.get('/cart'),
  editItems: (data: any) => carrinhoAPI.patch('/cart/cart-items', data),
  cancel: () => carrinhoAPI.patch('/cart/cancel'),
  checkout: (data: any) => carrinhoAPI.post('/cart/checkout', data),
};

// ------------------- OrderService -------------------
export const OrderService = {
  createPayment: (data: any) => orderAPI.post('/payments', data),
  getPayment: (orderId: string) => orderAPI.get(`/payments/${orderId}`),
  updatePayment: (paymentId: string, data: any) => orderAPI.patch(`/payments/${paymentId}`, data),
  cancelPayment: (paymentId: string) => orderAPI.delete(`/payments/${paymentId}`),
};
