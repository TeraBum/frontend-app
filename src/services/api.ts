import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // altere para a URL do backend
});

// Interceptor para adicionar token se estiver logado
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------- UserService -------------------
export const UserService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/Users/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/Users/login', data),
  
  getAll: () => api.get('/Users'),
  
  getById: (id: string) => api.get(`/Users/${id}`),
  
  update: (id: string, data: any) => api.put(`/Users/${id}`, data),
  
  updateRole: (id: string, role: string) => api.put(`/Users/${id}/role`, { role }),
  
  delete: (id: string) => api.delete(`/Users/${id}`),
};

// ------------------- VitrineService -------------------
export const VitrineService = {
  getProducts: () => api.get('/vitrine/Product'),
  getProductById: (id: string) => api.get(`/vitrine/Product/${id}`),
  getProductStock: (id: string) => api.get(`/vitrine/Product/${id}/stock`),
};

// ------------------- EstoqueService -------------------
export const StockService = {
  listItems: () => api.get('/stock-items'),
  getItem: (warehouseId: string, productId: string) => api.get(`/stock-items/${warehouseId}/${productId}`),
  updateItem: (warehouseId: string, productId: string, data: any) =>
    api.put(`/stock-items/${warehouseId}/${productId}`, data),
  deleteItem: (warehouseId: string, productId: string) =>
    api.delete(`/stock-items/${warehouseId}/${productId}`),
  createItem: (data: any) => api.post('/stock-items', data),
  baixa: (data: any) => api.post('/stock-items/baixa', data),

  listMoves: () => api.get('/stock-moves'),
  getMove: (id: string) => api.get(`/stock-moves/${id}`),
  movesByProduct: (productId: string) => api.get(`/stock-moves/by-product/${productId}`),
  movesByWarehouse: (warehouseId: string) => api.get(`/stock-moves/by-warehouse/${warehouseId}`),
  movesByWarehouseProduct: (warehouseId: string, productId: string) =>
    api.get(`/stock-moves/by-warehouse-product/${warehouseId}/${productId}`),
};

// ------------------- ProductService -------------------
export const ProductService = {
  create: (data: any) => api.post('/product', data),
  list: () => api.get('/product'),
  getById: (id: string) => api.get(`/product/${id}`),
  update: (id: string, data: any) => api.put(`/product/${id}`, data),
  delete: (id: string) => api.delete(`/product/${id}`),
};

// ------------------- WarehouseService -------------------
export const WarehouseService = {
  create: (data: any) => api.post('/warehouse', data),
  list: () => api.get('/warehouse'),
  getById: (id: string) => api.get(`/warehouse/${id}`),
  update: (id: string, data: any) => api.put(`/warehouse/${id}`, data),
  delete: (id: string) => api.delete(`/warehouse/${id}`),
};

// ------------------- CartService -------------------
export const CartService = {
  create: (data: any) => api.post('/cart', data),
  get: () => api.get('/cart'),
  editItems: (data: any) => api.patch('/cart/cart-items', data),
  cancel: () => api.patch('/cart/cancel'),
  checkout: (data: any) => api.post('/cart/checkout', data),
};

// ------------------- OrderService -------------------
export const OrderService = {
  createPayment: (data: any) => api.post('/payments', data),
  getPayment: (orderId: string) => api.get(`/payments/${orderId}`),
  updatePayment: (paymentId: string, data: any) => api.patch(`/payments/${paymentId}`, data),
  cancelPayment: (paymentId: string) => api.delete(`/payments/${paymentId}`),
};

export default api;
