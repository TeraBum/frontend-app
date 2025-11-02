import axios from 'axios';

// ------------------- Instâncias por serviço -------------------
const userAPI = axios.create({
  baseURL: 'http://localhost:5000/api', // ⚡ corresponde ao backend
});

const vitrineAPI = axios.create({
  baseURL: 'http://localhost:5010/api/vitrine',
});

const estoqueBaseURL = import.meta.env.VITE_ESTOQUE_API_URL ?? '/api/v1/estoque';
const estoqueAPI = axios.create({
  baseURL: estoqueBaseURL,
});

const carrinhoAPI = axios.create({
  baseURL: 'http://localhost:5030/api/cart',
});

const orderAPI = axios.create({
  baseURL: 'http://localhost:5050/api/payments',
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
    userAPI.post('/users/register', {
      nome: data.name,
      email: data.email,
      senha: data.password,
    }),

  login: async (data: { email: string; password: string }) => {
    const response = await userAPI.post('/users/login', {
      email: data.email,
      senha: data.password,
    });

    // salva token automaticamente
    const token = response.data.token;
    if (token) localStorage.setItem('token', token);

    return response;
  },

  getAll: () => userAPI.get('/users'),
  getById: (id: string) => userAPI.get(`/users/${id}`),
  update: (id: string, data: any) => userAPI.put(`/users/${id}`, data),
  updateRole: (id: string, role: string) => userAPI.put(`/users/${id}/role`, role),
  delete: (id: string) => userAPI.delete(`/users/${id}`),
};

// ------------------- VitrineService -------------------
export const VitrineService = {
  getProducts: () => vitrineAPI.get('/Product'),
  getProductById: (id: string) => vitrineAPI.get(`/Product/${id}`),
  getProductStock: (id: string) => vitrineAPI.get(`/Product/${id}/stock`),
};

// ------------------- EstoqueService -------------------
export const StockService = {
  listItems: () => estoqueAPI.get('/'),
  getItem: (warehouseId: string, productId: string) => estoqueAPI.get(`/${warehouseId}/${productId}`),
  updateItem: (warehouseId: string, productId: string, data: any) =>
    estoqueAPI.put(`/${warehouseId}/${productId}`, data),
  deleteItem: (warehouseId: string, productId: string) =>
    estoqueAPI.delete(`/${warehouseId}/${productId}`),
  createItem: (data: any) => estoqueAPI.post('/', data),
  baixa: (data: any) => estoqueAPI.post('/baixa', data),
};

// ------------------- Estoque Products Service -------------------
export const StockProductService = {
  list: () => estoqueAPI.get('/products'),
  getById: (id: string) => estoqueAPI.get(`/products/${id}`),
  create: (data: any) => estoqueAPI.post('/products', data),
  update: (id: string, data: any) => estoqueAPI.put('/products', { id, ...data }),
  delete: (id: string) => {
    let productId = id.trim();
    productId = productId.replace(/^[{\["]+|[}\]"]+$/g, "");
    productId = productId.replace(/[^0-9a-fA-F-]/g, "");
    return estoqueAPI.delete(`/products/${encodeURIComponent(productId)}`);
  },
};

// ------------------- CartService -------------------
export const CartService = {
  create: (data: any) => carrinhoAPI.post('/', data),
  get: () => carrinhoAPI.get('/'),
  editItems: (data: any) => carrinhoAPI.patch('/cart-items', data),
  cancel: () => carrinhoAPI.patch('/cancel'),
  checkout: (data: any) => carrinhoAPI.post('/checkout', data),
};

// ------------------- OrderService -------------------
export const OrderService = {
  createPayment: (data: any) => orderAPI.post('/', data),
  getPayment: (orderId: string) => orderAPI.get(`/${orderId}`),
  updatePayment: (paymentId: string, data: any) => orderAPI.patch(`/${paymentId}`, data),
  cancelPayment: (paymentId: string) => orderAPI.delete(`/${paymentId}`),
};
