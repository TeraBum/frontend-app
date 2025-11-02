# 🏗️ Estrutura recomendada do repositório

```
frontend-app/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        <- barra de navegação principal
│   │   ├── OrderCard.tsx     <- cartão de pedidos usado em Orders
│   │   └── Loader.tsx        <- loader animado com border-t-primary
│   ├── pages/
│   │   ├── Home.tsx          <- página inicial
│   │   ├── Orders.tsx        <- lista de pedidos do usuário
│   │   └── OrderDetails.tsx  <- detalhes de um pedido específico
│   │   ├── Login.tsx         <- página de login
│   │   ├── Register.tsx      <- página de cadastro
│   │   ├── Products.tsx      <- listagem de produtos
│   │   └── Cart.tsx          <- carrinho do usuário
│   ├── services/
│   │   └── api.ts             <- onde ficam os endpoints e serviços (UserService, OrderService, etc.)
│   ├── App.tsx               <- configuração de rotas e layout geral
│   ├── main.tsx              <- ponto de entrada React
│   └── index.css             <- importações Tailwind e CSS global
├── public/
│   └── favicon.ico
├── .vscode/
│   └── settings.json         <- configuração VSCode para Tailwind e TSX
├── Dockerfile
├── package.json
├── package-lock.json         <- gerado automaticamente pelo npm
├── tailwind.config.js        <- configuração de cores, fonte e tema TeraBum
├── postcss.config.js         <- configuração do PostCSS para Tailwind
├── tsconfig.json
└── vite.config.ts
```

##  Passo a passo pra criar do zero

###  1. Criar o projeto base

    npm create vite@latest frontend-app -- --template react-ts
    cd frontend-app
    npm install

###  2. Instalar Tailwind CSS

    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p

#### Editar o arquivo `tailwind.config.js`:

    export default {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {},
      },
      plugins: [],
    };

#### Criar/editar `src/index.css`:

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

## Comandos úteis

- Rodar em desenvolvimento:

    npm run dev

- Build para produção:

    npm run build

- Servir build localmente:

    npm run preview

---

 **Pronto!**  
Esse bloco pode ser colado **diretamente no README.md** sem quebrar a formatação do GitHub.  
Tudo está dentro de **um único bloco contínuo**, incluindo diretórios e instruções.
