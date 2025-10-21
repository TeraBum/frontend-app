# 🏗️ Estrutura recomendada do repositório

    frontend-app/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── OrderCard.tsx
    │   │   └── Loader.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Orders.tsx
    │   │   └── OrderDetails.tsx
    │   ├── services/
    │   │   └── api.ts          <- onde ficam os endpoints
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── public/
    │   └── favicon.ico
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    └── vite.config.ts

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
