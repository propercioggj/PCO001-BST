import React, { useState, useEffect, useRef } from 'react';
import initModule from './wasm/bst.js';
import wasmUrl from './wasm/bst.wasm';
import mermaid from 'mermaid';
import './App.css';

// Inicialização segura do Mermaid.js com estilo personalizado para o tema Verde Ardósia
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    fontFamily: 'Lexend, sans-serif',
    primaryColor: '#EBF2F1',       /* --primary-light */
    primaryTextColor: '#203335',   /* --text-main */
    primaryBorderColor: '#7A9A95', /* --accent */
    lineColor: '#4A6B6C',          /* --primary */
    secondaryColor: '#FFFFFE',     /* --surface */
    tertiaryColor: '#F4F8F8'       /* --bg-primary */
  },
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true
  }
});

// Componente para renderizar o diagrama do Mermaid
const MermaidViewer = ({ chartCode, scale, containerRef }) => {
  useEffect(() => {
    if (!chartCode || !containerRef.current) return;

    containerRef.current.innerHTML = '';
    const renderId = `mermaid-${Math.floor(Math.random() * 1000000)}`;

    try {
      mermaid.render(renderId, chartCode).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      }).catch((err) => {
        console.error("Erro na renderização do Mermaid:", err);
      });
    } catch (error) {
      console.error("Erro crítico no Mermaid:", error);
    }
  }, [chartCode]);

  return (
    <div 
      ref={containerRef} 
      className="mermaid-container"
      style={{ transform: `scale(${scale})` }}
    />
  );
};

// Ícones SVG Inline (Padrão Lucide)
const Icons = {
  Tree: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
      <path d="m12 19 7-7H5l7 7z" />
      <path d="m12 13 6-6H6l6 6z" />
      <path d="m12 7 5-5H7l5 5z" />
      <path d="M12 19v3" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Minus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  RotateCcw: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
      <polyline points="3 3 3 8 8 8"></polyline>
    </svg>
  ),
  Sliders: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14"></line>
      <line x1="4" y1="10" x2="4" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12" y2="3"></line>
      <line x1="20" y1="21" x2="20" y2="16"></line>
      <line x1="20" y1="12" x2="20" y2="3"></line>
      <line x1="1" y1="14" x2="7" y2="14"></line>
      <line x1="9" y1="8" x2="15" y2="8"></line>
      <line x1="17" y1="16" x2="23" y2="16"></line>
    </svg>
  ),
  BarChart2: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  ),
  GitBranch: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15"></line>
      <circle cx="18" cy="6" r="3"></circle>
      <circle cx="6" cy="18" r="3"></circle>
      <path d="M18 9a9 9 0 0 1-9 9"></path>
    </svg>
  ),
  PlayCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="10 8 16 12 10 16 10 8"></polygon>
    </svg>
  ),
  Github: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  )
};

function App() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingType, setAnimatingType] = useState(null);
  const [wasmModule, setWasmModule] = useState(null);
  const [bst, setBst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [chartCode, setChartCode] = useState('');
  const [stats, setStats] = useState({ soma: 0, folhas: 0 });
  const [traversals, setTraversals] = useState({ pre: '', em: '', pos: '' });
  const [scale, setScale] = useState(1);
  const [toasts, setToasts] = useState([]);
  const inputRef = useRef(null);
  const mermaidContainerRef = useRef(null);

  // Inicializa o Wasm
  useEffect(() => {
    initModule({
      locateFile: (path) => {
        if (path.endsWith('.wasm')) {
          return wasmUrl;
        }
        return path;
      }
    })
      .then((Module) => {
        setWasmModule(Module);
        const bstInstance = new Module.ArvoreBinariaBusca();
        setBst(bstInstance);
        setLoading(false);
        showToast('WebAssembly inicializado com sucesso!', 'info');
      })
      .catch((err) => {
        console.error("Falha ao inicializar o Wasm:", err);
        showToast('Erro ao carregar o módulo WebAssembly.', 'error');
        setLoading(false);
      });

    return () => {
      if (bst) {
        bst.delete();
      }
    };
  }, []);

  useEffect(() => {
    if (bst) {
      atualizarInterface();
    }
  }, [bst]);

  const atualizarInterface = () => {
    if (!bst) return;
    try {
      setChartCode(bst.gerarMermaid());
      setStats({
        soma: bst.somaNos(),
        folhas: bst.contaFolhas()
      });
      setTraversals({
        pre: bst.preOrdem(),
        em: bst.emOrdem(),
        pos: bst.posOrdem()
      });
    } catch (err) {
      console.error("Erro ao sincronizar com C++:", err);
    }
  };

  const obterMermaidId = (valor) => {
    return valor < 0 ? `n_neg_${Math.abs(valor)}` : `n_${valor}`;
  };

  const encontrarElementoNode = (valor) => {
    if (!mermaidContainerRef.current) return null;
    const idToFind = obterMermaidId(valor);
    const valorStr = String(valor);

    // 1. Busca por ID com regex
    const nodes = mermaidContainerRef.current.querySelectorAll('.node, g.node, g');
    const regex = new RegExp(`(^|[-_])${idToFind}([-_]|$)`);
    for (let node of nodes) {
      if (node.id && regex.test(node.id)) {
        return node;
      }
    }

    // 2. Busca por Classes do grupo
    for (let node of nodes) {
      if (node.classList && (node.classList.contains(idToFind) || node.classList.contains(`flowchart-${idToFind}`))) {
        return node;
      }
    }

    // 3. Busca por Conteúdo de Texto exato (Fallback definitivo)
    const nodeElements = mermaidContainerRef.current.querySelectorAll('.node');
    for (let node of nodeElements) {
      const textEls = node.querySelectorAll('text, div, span, p');
      if (textEls.length > 0) {
        for (let txtEl of textEls) {
          if (txtEl.textContent.trim() === valorStr) {
            return node;
          }
        }
      }
      if (node.textContent.trim() === valorStr) {
        return node;
      }
    }

    return null;
  };

  const aplicarEstilosElemento = (el, tipo) => {
    if (!el) return;

    const aplicarAForma = (shape) => {
      shape.classList.add('styled-by-animation');
      if (tipo === 'active') {
        shape.style.setProperty('fill', '#DFA14B', 'important');
        shape.style.setProperty('stroke', '#203335', 'important');
        shape.style.setProperty('stroke-width', '3px', 'important');
      } else if (tipo === 'visited') {
        shape.style.setProperty('fill', '#7A9A95', 'important');
        shape.style.setProperty('stroke', '#4A6B6C', 'important');
        shape.style.setProperty('stroke-width', '2px', 'important');
      } else if (tipo === 'delete') {
        shape.style.setProperty('fill', '#D9534F', 'important');
        shape.style.setProperty('stroke', '#203335', 'important');
        shape.style.setProperty('stroke-width', '3px', 'important');
      } else if (tipo === 'search') {
        shape.style.setProperty('fill', '#2A9D8F', 'important');
        shape.style.setProperty('stroke', '#203335', 'important');
        shape.style.setProperty('stroke-width', '3px', 'important');
      } else if (tipo === 'success') {
        shape.style.setProperty('fill', '#A7FFEB', 'important');
        shape.style.setProperty('stroke', '#2A9D8F', 'important');
        shape.style.setProperty('stroke-width', '3px', 'important');
      } else if (tipo === 'attention') {
        shape.style.setProperty('fill', '#FFCCBC', 'important');
        shape.style.setProperty('stroke', '#D9534F', 'important');
        shape.style.setProperty('stroke-width', '3px', 'important');
      }
    };

    const aplicarATextoSVG = (txt) => {
      txt.classList.add('styled-by-animation');
      if (tipo === 'delete' || tipo === 'search') {
        txt.style.setProperty('fill', '#ffffff', 'important');
      } else {
        txt.style.setProperty('fill', '#203335', 'important');
      }
      txt.style.setProperty('font-weight', 'bold', 'important');
    };

    const aplicarATextoHTML = (txt) => {
      txt.classList.add('styled-by-animation');
      if (tipo === 'delete' || tipo === 'search') {
        txt.style.setProperty('color', '#ffffff', 'important');
      } else {
        txt.style.setProperty('color', '#203335', 'important');
      }
      txt.style.setProperty('font-weight', 'bold', 'important');
    };

    const tag = el.tagName.toLowerCase();
    el.classList.add('styled-by-animation');
    if (['rect', 'path', 'polygon', 'circle', 'ellipse'].includes(tag)) {
      aplicarAForma(el);
    } else if (tag === 'text') {
      aplicarATextoSVG(el);
    } else if (['div', 'span', 'p'].includes(tag)) {
      aplicarATextoHTML(el);
    }

    el.querySelectorAll('rect, path, polygon, circle, ellipse').forEach(aplicarAForma);
    el.querySelectorAll('text').forEach(aplicarATextoSVG);
    el.querySelectorAll('div, span, p').forEach(aplicarATextoHTML);
  };

  const removerEstilosElemento = (el) => {
    if (!el) return;
    const limpar = (element) => {
      element.style.removeProperty('fill');
      element.style.removeProperty('stroke');
      element.style.removeProperty('stroke-width');
      element.style.removeProperty('color');
      element.style.removeProperty('font-weight');
    };
    limpar(el);
    el.querySelectorAll('*').forEach(limpar);
  };

  const limparEstilosAnimacao = () => {
    if (!mermaidContainerRef.current) return;
    
    // Remove as classes de animação principais
    const nodes = mermaidContainerRef.current.querySelectorAll('.active-node, .visited-node, .success-node, .attention-node');
    nodes.forEach(node => {
      node.classList.remove('active-node', 'visited-node', 'success-node', 'attention-node');
    });

    // Limpa apenas os elementos que foram alterados pela animação
    const styledElements = mermaidContainerRef.current.querySelectorAll('.styled-by-animation');
    styledElements.forEach(el => {
      removerEstilosElemento(el);
      el.classList.remove('styled-by-animation');
    });
  };

  const handleAnimateTraversal = async (tipo) => {
    if (!bst || isAnimating || !mermaidContainerRef.current) return;

    let pathVal;
    try {
      if (tipo === 'pre') {
        pathVal = bst.obterPreOrdem();
      } else if (tipo === 'em') {
        pathVal = bst.obterEmOrdem();
      } else if (tipo === 'pos') {
        pathVal = bst.obterPosOrdem();
      }
    } catch (err) {
      console.error("Erro ao obter percurso do Wasm:", err);
      showToast("Erro ao obter percurso do WebAssembly.", "error");
      return;
    }

    const path = [];
    for (let i = 0; i < pathVal.length; i++) {
      path.push(pathVal[i]);
    }

    if (path.length === 0) {
      showToast('Árvore vazia, nada para animar!', 'warning');
      return;
    }

    setIsAnimating(true);
    setAnimatingType(tipo);
    showToast(`Iniciando animação: ${tipo === 'pre' ? 'Pré-Ordem' : tipo === 'em' ? 'Em Ordem' : 'Pós-Ordem'}`, 'info');

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Garante que todos os estilos de animação anteriores estão limpos
    limparEstilosAnimacao();

    for (let idx = 0; idx < path.length; idx++) {
      // 1. O nó ativo anterior (se houver) passa a ser "visited"
      if (idx > 0) {
        const prevVal = path[idx - 1];
        const prevEl = encontrarElementoNode(prevVal);
        if (prevEl) {
          prevEl.classList.remove('active-node');
          prevEl.querySelectorAll('*').forEach(child => child.classList.remove('active-node'));
          
          prevEl.classList.add('visited-node');
          aplicarEstilosElemento(prevEl, 'visited');
        }
      }

      // 2. Marca o nó atual como "active"
      const activeVal = path[idx];
      const activeEl = encontrarElementoNode(activeVal);
      if (activeEl) {
        activeEl.classList.add('active-node');
        aplicarEstilosElemento(activeEl, 'active');
      }

      await delay(700);
    }

    // Mantém a visualização dos caminhos marcados por 1.5 segundos
    await delay(1500);

    limparEstilosAnimacao();
    setIsAnimating(false);
    setAnimatingType(null);
    showToast('Animação concluída!', 'success');
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const obterValorValido = () => {
    if (inputValue.trim() === '') {
      showToast('Por favor, digite um número inteiro.', 'error');
      if (inputRef.current) inputRef.current.focus();
      return null;
    }
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) {
      showToast('Valor inválido! Digite apenas números inteiros.', 'error');
      if (inputRef.current) inputRef.current.focus();
      return null;
    }
    return val;
  };

  const handleInsert = () => {
    const val = obterValorValido();
    if (val === null) return;

    if (bst.buscar(val)) {
      showToast(`O valor ${val} já existe na árvore (BST não aceita duplicados).`, 'error');
      return;
    }

    bst.inserir(val);
    showToast(`Nó ${val} inserido com sucesso!`, 'success');
    setInputValue('');
    atualizarInterface();
    if (inputRef.current) inputRef.current.focus();
  };

  const handleRemove = async () => {
    const val = obterValorValido();
    if (val === null) return;

    if (!bst.buscar(val)) {
      showToast(`O valor ${val} não existe na árvore para remoção.`, 'error');
      return;
    }

    setIsAnimating(true);
    const el = encontrarElementoNode(val);
    if (el) {
      el.classList.add('visited-node');
      aplicarEstilosElemento(el, 'delete');
      showToast(`Removendo nó ${val}...`, 'info');
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    bst.remover(val);
    showToast(`Nó ${val} removido com sucesso!`, 'success');
    setInputValue('');
    atualizarInterface();
    limparEstilosAnimacao();
    setIsAnimating(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSearch = async () => {
    const val = obterValorValido();
    if (val === null) return;

    const pathVal = bst.buscarAnimado(val);
    const path = [];
    for (let i = 0; i < pathVal.length; i++) {
      path.push(pathVal[i]);
    }

    if (path.length === 0) {
      showToast('Árvore vazia, nada para buscar!', 'warning');
      return;
    }

    setIsAnimating(true);
    setInputValue('');
    if (inputRef.current) inputRef.current.focus();

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Garante que todos os estilos de animação anteriores estão limpos
    limparEstilosAnimacao();

    for (let idx = 0; idx < path.length; idx++) {
      // 1. O nó ativo anterior (se houver) passa a ser "visited"
      if (idx > 0) {
        const prevVal = path[idx - 1];
        const prevEl = encontrarElementoNode(prevVal);
        if (prevEl) {
          prevEl.classList.remove('active-node');
          prevEl.querySelectorAll('*').forEach(child => child.classList.remove('active-node'));
          
          prevEl.classList.add('visited-node');
          aplicarEstilosElemento(prevEl, 'visited');
        }
      }

      const noAtual = path[idx];
      const activeEl = encontrarElementoNode(noAtual);

      // 2. Se for o último elemento no caminho da busca
      if (idx === path.length - 1) {
        if (noAtual === val) {
          // Sucesso!
          if (activeEl) {
            activeEl.classList.add('success-node');
            aplicarEstilosElemento(activeEl, 'success');
          }
          showToast(`O valor ${val} foi encontrado com sucesso!`, 'success');
        } else {
          // Atenção!
          if (activeEl) {
            activeEl.classList.add('attention-node');
            aplicarEstilosElemento(activeEl, 'attention');
          }
          showToast(`O valor ${val} não existe na árvore. Busca encerrou no nó ${noAtual}.`, 'error');
        }
      } else {
        // Nó ativo intermediário
        if (activeEl) {
          activeEl.classList.add('active-node');
          aplicarEstilosElemento(activeEl, 'active');
        }
        await delay(600);
      }
    }

    // Mantém a visualização final do caminho por 2 segundos antes de limpar
    await delay(2000);
    limparEstilosAnimacao();
    setIsAnimating(false);
  };

  const handleClear = () => {
    if (!bst || !wasmModule) return;
    bst.delete();
    const newBst = new wasmModule.ArvoreBinariaBusca();
    setBst(newBst);
    showToast('Simulador reinicializado. Árvore limpa!', 'info');
    setInputValue('');
    setScale(1);
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.1, 2.5));
  const zoomOut = () => setScale(s => Math.max(s - 0.1, 0.4));
  const resetZoom = () => setScale(1);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#F4F8F8',
        color: '#4A6B6C',
        fontFamily: "'Lexend', sans-serif"
      }}>
        <div style={{
          border: '4px solid rgba(74, 107, 108, 0.1)',
          borderLeft: '4px solid #4A6B6C',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <h2>Inicializando WebAssembly BST...</h2>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Cabeçalho */}
      <header className="app-header">
        <div className="header-title">
          <h1>
            <Icons.Tree />
            Simulador de Árvore Binária de Busca (BST)
          </h1>
          <p>Lógica C++ em tempo de execução via WebAssembly & Visualização Mermaid.js</p>
        </div>
        <span className="badge-mestrado">PCO001: Algoritmos - UNIFEI</span>
      </header>

      {/* Grid Layout */}
      <main className="app-content">
        
        {/* Painel Lateral */}
        <section className="app-sidebar">
          
          {/* Card de Controle */}
          <div className="glass-card">
            <h2 className="card-title">
              <Icons.Sliders />
              Ações da Árvore
            </h2>
            <div className="form-group">
              <div className="input-container">
                <input
                  ref={inputRef}
                  type="number"
                  placeholder="Digite um número inteiro"
                  className="input-field"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleInsert();
                  }}
                  autoFocus
                  disabled={isAnimating}
                />
              </div>
              <div className="btn-grid">
                <button className="btn btn-success" onClick={handleInsert} disabled={isAnimating}>
                  <Icons.Plus /> Inserir
                </button>
                <button className="btn btn-danger" onClick={handleRemove} disabled={isAnimating}>
                  <Icons.Minus /> Remover
                </button>
              </div>
              <button className="btn btn-primary" onClick={handleSearch} disabled={isAnimating}>
                <Icons.Search /> Buscar Elemento
              </button>
              <button className="btn btn-secondary" onClick={handleClear} disabled={isAnimating}>
                <Icons.RotateCcw /> Reiniciar Árvore
              </button>
            </div>
          </div>

          {/* Card de Percursos */}
          <div className="glass-card">
            <h2 className="card-title">
              <Icons.GitBranch />
              Percursos da Árvore
            </h2>
            <div className="traversal-list">
              <div className={`traversal-item ${animatingType === 'pre' ? 'active-traversal' : ''}`}>
                <div className="traversal-header-row">
                  <div className="traversal-label">Pré-Ordem</div>
                  <button 
                    className="btn-play-traversal" 
                    onClick={() => handleAnimateTraversal('pre')} 
                    disabled={isAnimating || !bst || traversals.pre === "Árvore vazia"}
                    title="Animar Pré-Ordem"
                  >
                    <Icons.PlayCircle /> Animar
                  </button>
                </div>
                <div className="traversal-value">{traversals.pre}</div>
              </div>
              
              <div className={`traversal-item ${animatingType === 'em' ? 'active-traversal' : ''}`}>
                <div className="traversal-header-row">
                  <div className="traversal-label">Em Ordem (Ordenado)</div>
                  <button 
                    className="btn-play-traversal" 
                    onClick={() => handleAnimateTraversal('em')} 
                    disabled={isAnimating || !bst || traversals.em === "Árvore vazia"}
                    title="Animar Em Ordem"
                  >
                    <Icons.PlayCircle /> Animar
                  </button>
                </div>
                <div className="traversal-value">{traversals.em}</div>
              </div>
              
              <div className={`traversal-item ${animatingType === 'pos' ? 'active-traversal' : ''}`}>
                <div className="traversal-header-row">
                  <div className="traversal-label">Pós-Ordem</div>
                  <button 
                    className="btn-play-traversal" 
                    onClick={() => handleAnimateTraversal('pos')} 
                    disabled={isAnimating || !bst || traversals.pos === "Árvore vazia"}
                    title="Animar Pós-Ordem"
                  >
                    <Icons.PlayCircle /> Animar
                  </button>
                </div>
                <div className="traversal-value">{traversals.pos}</div>
              </div>
            </div>
          </div>

          {/* Card de Estatísticas */}
          <div className="glass-card">
            <h2 className="card-title">
              <Icons.BarChart2 />
              Estatísticas
            </h2>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label">Soma dos Nós</div>
                <div className="stat-value">{stats.soma}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Qtd. Folhas</div>
                <div className="stat-value">{stats.folhas}</div>
              </div>
            </div>
          </div>

        </section>

        {/* Visualizador Principal */}
        <section className="glass-card mermaid-card">
          <div className="mermaid-card-header">
            <h2 className="card-title">
              <Icons.Tree />
              Estrutura Gráfica da Árvore
            </h2>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>
              Renderizado via Mermaid.js
            </div>
          </div>

          <div className="mermaid-viewport">
            {/* Controles de Zoom */}
            <div className="zoom-controls">
              <button className="zoom-btn" onClick={zoomIn} title="Aumentar Zoom">＋</button>
              <button className="zoom-btn" onClick={zoomOut} title="Diminuir Zoom">－</button>
              <button className="zoom-btn" onClick={resetZoom} title="Resetar Zoom" style={{ fontSize: '0.85rem' }}>100%</button>
            </div>

            {/* Canvas */}
            <MermaidViewer chartCode={chartCode} scale={scale} containerRef={mermaidContainerRef} />
          </div>
        </section>

      </main>

      {/* Rodapé (Footer) */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>2026 Simulador BST. Desenvolvido para a disciplina PCO001 - Algoritmos (UNIFEI).</p>
          <a 
            href="https://github.com/propercioggj/PCO001-BST" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="github-link"
          >
            <Icons.Github />
            <span>propercioggj/PCO001-BST</span>
          </a>
        </div>
      </footer>

      {/* Toasts */}
      <div className="notification-area">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
