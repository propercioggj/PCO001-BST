# ==============================================================================
# STAGE 1: Compilação de C++ para WebAssembly usando Emscripten SDK
# ==============================================================================
FROM emscripten/emsdk:latest AS emscripten-stage
WORKDIR /build

# Copia o código-fonte C++ para o container
COPY cpp/bst.cpp .

# Cria o diretório de destino e compila o C++ gerando o loader JS e o binário WASM
# As flags exportam como ES6, ativam o Bindings (-lembind) e habilitam otimização máxima (-O3)
RUN mkdir -p /build/wasm && \
    emcc -lembind -O3 \
    -s MODULARIZE=1 \
    -s EXPORT_ES6=1 \
    bst.cpp -o wasm/bst.js

# ==============================================================================
# STAGE 2: Construção da aplicação React e empacotamento com Vite
# ==============================================================================
FROM node:20-alpine AS node-stage
WORKDIR /app

# Copia os arquivos de dependência e instala-os
COPY frontend/package*.json ./
RUN npm install

# Copia o restante do código-fonte do frontend
COPY frontend/ .

# Copia os arquivos WebAssembly gerados no Stage 1 para o diretório do frontend
COPY --from=emscripten-stage /build/wasm/bst.js /app/src/wasm/
COPY --from=emscripten-stage /build/wasm/bst.wasm /app/src/wasm/

# Realiza a compilação de produção com o Vite
RUN npm run build

# ==============================================================================
# STAGE 3: Servidor de Produção Nginx Alpine
# ==============================================================================
FROM nginx:alpine

# Copia os arquivos gerados no Stage 2 para a pasta pública do Nginx
COPY --from=node-stage /app/dist /usr/share/nginx/html

# Copia a configuração customizada do Nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
