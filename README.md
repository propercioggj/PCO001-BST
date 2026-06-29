<div align="center">

# PCO001<br>Algoritmos e Estruturas de Dados<br>Universidade Federal de Itajubá

</div>

## 🔹 Atividade Extra: Simulador de Árvore Binária de Busca (BST) - C++ & WebAssembly (React)

Este projeto é um simulador interativo de uma Árvore Binária de Busca (BST - _Binary Search Tree_). A lógica central da árvore é implementada em C++ e compilada para WebAssembly (WASM), permitindo que a árvore seja manipulada diretamente no navegador usando uma interface moderna construída com React e Mermaid.js.

**Link para execução do projeto: [https://tree.propercio.dpdns.org/](https://tree.propercio.dpdns.org/)**

Repositório do projeto no Github: [https://github.com/propercioggj/PCO001-BST](https://github.com/propercioggj/PCO001-BST)

---

## 🚀 Sobre o Simulador

Este projeto funciona como uma ponte: ele conecta a programação acadêmica mais clássica com o que há de mais atual no mundo da internet. O grande destaque é que o simulador foi todo construído utilizando tecnologias open source (de código aberto), garantindo que seja acessível e colaborativo!

Abaixo, você confere:

- As ferramentas escolhidas: Quais tecnologias dão vida a esse projeto.
- O papel de cada uma: Como elas se encaixam e fazem o simulador funcionar.
- Referências oficiais: Links para você explorar, caso queira se aprofundar nelas.

### 1. C++

- **Papel no Projeto**: Implementa o núcleo computacional e a estrutura de dados em bst.cpp
- **Referência**:
  - Anotações de aula do Professor Sandro Carvalho Izidoro - PCO001 Algoritmos e Estruturas de Dados
  - [C++: como programar - Deitel & Deitel](https://plataforma.bvirtual.com.br/Acervo/Publicacao/338)

### 2. WebAssembly (WASM)

- **Papel no Projeto**: Compila o código C++ para WebAssembly, permitindo que ele seja executado diretamente no navegador
- **Referência**:
  - [WebAssembly](https://webassembly.org/)
  - [Emscripten](https://emscripten.org/)

### 3. React

- **Papel no Projeto**: Interface de usuário interativa
- **Referência**:
  - [React](https://pt-br.reactjs.org/)
  - [Vite](https://vitejs.dev/)

### 4. Nginx

- **Papel no Projeto**: Servidor web leve para servir a aplicação
- **Referência**:
  - [Nginx](https://www.nginx.com/)

### 5. Docker

- **Papel no Projeto**: Containerização da aplicação
- **Referência**:
  - [Docker](https://www.docker.com/)

### 6. Mermaid.js

- **Papel no Projeto**: Renderização de diagramas de árvores
- **Referência**:
  - [Mermaid.js](https://mermaid.ai/open-source/)

### 7. Google Fonts

- **Papel no Projeto**: Fontes utilizadas na aplicação
- **Referência**:
  - [Lexend](https://fonts.google.com/specimen/Lexend)
  - [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3)

## 📁 Estrutura de Arquivos do Projeto

Abaixo está a descrição detalhada de todos os diretórios e arquivos que compõem este projeto:

### 1. Diretório Raiz

- **docker-compose.yml**: Configuração do Docker Compose. Orquestra a construção do container da aplicação e expõe o serviço na porta local `8085`.

### 2. Código-Fonte C++ (`/cpp`)

- **cpp/bst.cpp**: Código C++ que implementa as estruturas do nó e da BST. Ele foi baseado nas anotações de aula do Professor Sandro Carvalho Izidoro, contudo foi adaptado para o contexto do projeto.
  - **Funções**: inserção, busca, remoção (com tratamento de nós com 0, 1 ou 2 filhos), travessias (Pré-Ordem, Em Ordem e Pós-Ordem), soma dos nós e contagem de folhas.
  - **Mermaid Integration**: Contém uma rotina que converte recursivamente a estrutura de nós da árvore para código de diagrama do Mermaid.js.
  - **Emscripten Bindings**: Utiliza `EMSCRIPTEN_BINDINGS` para expor a classe C++ `ArvoreBinariaBusca` e suas funções membros para o ambiente JavaScript/React.

### 3. Frontend Web (`/frontend`)

- **frontend/Dockerfile**: Arquivo de build multi estagio para Docker
  - **1º Estagio (Emscripten)**: Compila o arquivo `cpp/bst.cpp` para WebAssembly gerando os arquivos de saída em JS/WASM.
  - **2º Estagio (Node.js)**: Instala as dependências do npm e faz a build de produção dos arquivos estáticos usando o Vite.
  - **3º Estagio (Nginx)**: Implanta os arquivos compilados de produção em um servidor leve Nginx Alpine e serve o simulador.
- **frontend/nginx.conf**: Configurações do servidor web Nginx, incluindo os tipos MIME apropriados para o carregamento do arquivo `.wasm` e controle de cache para assets estáticos.
- **frontend/vite.config.js**: Configuração do Vite, contendo a inclusão de arquivos `.wasm` como assets estáticos para a build.
- **frontend/package.json**: Metadados do projeto, dependências externas (React, Mermaid.js) e scripts de build/dev.
- **frontend/package-lock.json**: Gerado automaticamente pelo npm para garantir a integridade e versionamento das dependências do projeto. Registra as versões exatas de cada pacote e suas dependências transitivas instaladas, garantindo que qualquer pessoa que execute `npm install` obtenha o mesmo conjunto de dependências.
- **frontend/index.html**: Arquivo HTML principal do frontend. Importa os estilos das fontes Google (_Lexend_ e _Source Sans 3_) e evita flashes indesejados ao carregar a página aplicando o novo tema.
- **Diretório `/frontend/src`**:
  - **frontend/src/main.jsx**: Ponto de entrada que monta o componente React raiz.
  - **frontend/src/App.jsx**: Componente principal da aplicação. Gerencia o estado da BST em WebAssembly, captura comandos e dados do usuário (inserção, busca, remoção), exibe estatísticas em tempo real, mostra os valores nos percursos ordenados, renderiza o canvas da árvore usando Mermaid.js e exibe alertas de feedback (toast notifications).
  - **frontend/src/App.css**: Folha de estilos CSS contendo as especificações do sistema de design.

---

## 🛠️ Como Executar o Simulador

Para construir o módulo C++ WebAssembly, empacotar o frontend React e servir a aplicação com Nginx de forma simplificada, execute na raiz do projeto:

```bash
# Constrói e inicializa a aplicação em segundo plano
docker compose up -d --build
```

Após a inicialização do container, abra o navegador em:
👉 http://localhost:8085
