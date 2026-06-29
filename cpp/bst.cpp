// Implementação baseada nas anotações de aula do Professor Sandro Carvalho Izidoro

#include <string>
#include <vector>
#include <sstream>
#include <emscripten/bind.h>
#include <emscripten/val.h>

// Estrutura do nó da árvore
struct Noh {
    int valor;
    Noh* esq;
    Noh* dir;

    Noh(int val) : valor(val), esq(nullptr), dir(nullptr) {}
};

// Classe principal da Árvore Binária de Busca (BST)
class ArvoreBinariaBusca {
private:
    Noh* raiz;

    // Auxiliar recursivo para inserção
    Noh* inserirHelper(Noh* atual, int valor) {
        if (atual == nullptr) {
            return new Noh(valor);
        }
        if (valor < atual->valor) {
            atual->esq = inserirHelper(atual->esq, valor);
        } else if (valor > atual->valor) {
            atual->dir = inserirHelper(atual->dir, valor);
        }
        // Valores duplicados são ignorados (padrão de BST)
        return atual;
    }

    // Auxiliar recursivo para busca
    bool buscarHelper(Noh* atual, int valor) {
        if (atual == nullptr) {
            return false;
        }
        if (valor == atual->valor) {
            return true;
        }
        if (valor < atual->valor) {
            return buscarHelper(atual->esq, valor);
        }
        return buscarHelper(atual->dir, valor);
    }

    // Encontra o nó com o menor valor (usado na remoção)
    Noh* encontrarMinimo(Noh* atual) {
        while (atual && atual->esq != nullptr) {
            atual = atual->esq;
        }
        return atual;
    }

    // Auxiliar recursivo para remoção
    Noh* removerHelper(Noh* atual, int valor) {
        if (atual == nullptr) {
            return nullptr;
        }

        if (valor < atual->valor) {
            atual->esq = removerHelper(atual->esq, valor);
        } else if (valor > atual->valor) {
            atual->dir = removerHelper(atual->dir, valor);
        } else {
            // Caso 1: O nó possui apenas um filho ou nenhum
            if (atual->esq == nullptr) {
                Noh* temp = atual->dir;
                delete atual;
                return temp;
            } else if (atual->dir == nullptr) {
                Noh* temp = atual->esq;
                delete atual;
                return temp;
            }

            // Caso 2: O nó possui dois filhos
            // Obtém o sucessor em ordem (menor da subárvore direita)
            Noh* temp = encontrarMinimo(atual->dir);
            atual->valor = temp->valor;
            // Remove o sucessor em ordem
            atual->dir = removerHelper(atual->dir, temp->valor);
        }
        return atual;
    }

    // Auxiliares de percurso
    void preOrdemHelper(Noh* atual, std::vector<std::string>& res) {
        if (atual == nullptr) return;
        res.push_back(std::to_string(atual->valor));
        preOrdemHelper(atual->esq, res);
        preOrdemHelper(atual->dir, res);
    }

    void emOrdemHelper(Noh* atual, std::vector<std::string>& res) {
        if (atual == nullptr) return;
        emOrdemHelper(atual->esq, res);
        res.push_back(std::to_string(atual->valor));
        emOrdemHelper(atual->dir, res);
    }

    void posOrdemHelper(Noh* atual, std::vector<std::string>& res) {
        if (atual == nullptr) return;
        posOrdemHelper(atual->esq, res);
        posOrdemHelper(atual->dir, res);
        res.push_back(std::to_string(atual->valor));
    }

    // Auxiliares de percursos para animação (retornando inteiros)
    void obterPreOrdemHelper(Noh* atual, std::vector<int>& res) {
        if (atual == nullptr) return;
        res.push_back(atual->valor);
        obterPreOrdemHelper(atual->esq, res);
        obterPreOrdemHelper(atual->dir, res);
    }

    void obterEmOrdemHelper(Noh* atual, std::vector<int>& res) {
        if (atual == nullptr) return;
        obterEmOrdemHelper(atual->esq, res);
        res.push_back(atual->valor);
        obterEmOrdemHelper(atual->dir, res);
    }

    void obterPosOrdemHelper(Noh* atual, std::vector<int>& res) {
        if (atual == nullptr) return;
        obterPosOrdemHelper(atual->esq, res);
        obterPosOrdemHelper(atual->dir, res);
        res.push_back(atual->valor);
    }

    // Auxiliar para soma dos nós
    int somaNosHelper(Noh* atual) {
        if (atual == nullptr) return 0;
        return atual->valor + somaNosHelper(atual->esq) + somaNosHelper(atual->dir);
    }

    // Auxiliar para contar folhas
    int contaFolhasHelper(Noh* atual) {
        if (atual == nullptr) return 0;
        if (atual->esq == nullptr && atual->dir == nullptr) return 1;
        return contaFolhasHelper(atual->esq) + contaFolhasHelper(atual->dir);
    }

    // Desaloca toda a árvore recursivamente
    void destruirArvore(Noh* atual) {
        if (atual == nullptr) return;
        destruirArvore(atual->esq);
        destruirArvore(atual->dir);
        delete atual;
    }

    // Gera um identificador válido para o Mermaid (suporta números negativos)
    std::string obterId(int valor) {
        if (valor < 0) {
            return "n_neg_" + std::to_string(-valor);
        }
        return "n_" + std::to_string(valor);
    }

    // Auxiliar recursivo para construir a estrutura do Mermaid
    void gerarMermaidHelper(Noh* atual, std::stringstream& ss, std::vector<std::string>& estilos) {
        if (atual == nullptr) return;

        std::string idAtual = obterId(atual->valor);
        ss << "  " << idAtual << "[\"" << atual->valor << "\"]\n";

        // Se tiver pelo menos um filho, precisamos estruturar esquerda/direita no Mermaid
        if (atual->esq != nullptr || atual->dir != nullptr) {
            // Subárvore Esquerda
            if (atual->esq != nullptr) {
                std::string idEsq = obterId(atual->esq->valor);
                ss << "  " << idAtual << " --> " << idEsq << "\n";
                gerarMermaidHelper(atual->esq, ss, estilos);
            } else {
                // Filho esquerdo nulo: insere nó invisível para manter o layout correto à esquerda
                std::string idNullL = "null_L_" + idAtual;
                ss << "  " << idAtual << " ~~~ " << idNullL << "\n";
                ss << "  " << idNullL << "[\" \"]\n";
                estilos.push_back("  style " + idNullL + " fill:none,stroke:none,color:none,opacity:0\n");
            }

            // Subárvore Direita
            if (atual->dir != nullptr) {
                std::string idDir = obterId(atual->dir->valor);
                ss << "  " << idAtual << " --> " << idDir << "\n";
                gerarMermaidHelper(atual->dir, ss, estilos);
            } else {
                // Filho direito nulo: insere nó invisível para manter o layout correto à direita
                std::string idNullR = "null_R_" + idAtual;
                ss << "  " << idAtual << " ~~~ " << idNullR << "\n";
                ss << "  " << idNullR << "[\" \"]\n";
                estilos.push_back("  style " + idNullR + " fill:none,stroke:none,color:none,opacity:0\n");
            }
        }
    }

    // Une os elementos de um vetor usando um delimitador
    std::string join(const std::vector<std::string>& vet, const std::string& delim) {
        if (vet.empty()) return "Árvore vazia";
        std::stringstream ss;
        for (size_t i = 0; i < vet.size(); ++i) {
            ss << vet[i];
            if (i < vet.size() - 1) {
                ss << delim;
            }
        }
        return ss.str();
    }

public:
    ArvoreBinariaBusca() : raiz(nullptr) {}

    ~ArvoreBinariaBusca() {
        destruirArvore(raiz);
    }

    void inserir(int valor) {
        raiz = inserirHelper(raiz, valor);
    }

    void remover(int valor) {
        raiz = removerHelper(raiz, valor);
    }

    bool buscar(int valor) {
        return buscarHelper(raiz, valor);
    }

    std::string preOrdem() {
        std::vector<std::string> res;
        preOrdemHelper(raiz, res);
        return join(res, ", ");
    }

    std::string emOrdem() {
        std::vector<std::string> res;
        emOrdemHelper(raiz, res);
        return join(res, ", ");
    }

    std::string posOrdem() {
        std::vector<std::string> res;
        posOrdemHelper(raiz, res);
        return join(res, ", ");
    }

    int somaNos() {
        return somaNosHelper(raiz);
    }

    int contaFolhas() {
        return contaFolhasHelper(raiz);
    }

    emscripten::val obterPreOrdem() {
        std::vector<int> res;
        obterPreOrdemHelper(raiz, res);
        emscripten::val arr = emscripten::val::array();
        for (int val : res) {
            arr.call<void>("push", val);
        }
        return arr;
    }

    emscripten::val obterEmOrdem() {
        std::vector<int> res;
        obterEmOrdemHelper(raiz, res);
        emscripten::val arr = emscripten::val::array();
        for (int val : res) {
            arr.call<void>("push", val);
        }
        return arr;
    }

    emscripten::val obterPosOrdem() {
        std::vector<int> res;
        obterPosOrdemHelper(raiz, res);
        emscripten::val arr = emscripten::val::array();
        for (int val : res) {
            arr.call<void>("push", val);
        }
        return arr;
    }

    emscripten::val buscarAnimado(int valor) {
        std::vector<int> caminho;
        Noh* atual = raiz;
        while (atual != nullptr) {
            caminho.push_back(atual->valor);
            if (valor == atual->valor) {
                break;
            }
            if (valor < atual->valor) {
                atual = atual->esq;
            } else {
                atual = atual->dir;
            }
        }
        emscripten::val arr = emscripten::val::array();
        for (int val : caminho) {
            arr.call<void>("push", val);
        }
        return arr;
    }


    std::string gerarMermaid() {
        if (raiz == nullptr) {
            return "graph TD\n  vazio[\"Árvore Vazia\"]\n  style vazio fill:#ffffff,stroke:#e2e8f0,stroke-width:2px,color:#64748b,font-weight:bold;";
        }

        std::stringstream ss;
        ss << "graph TD\n";
        
        // Estilo premium de tema claro para nós reais da árvore
        ss << "  classDef default fill:#f0f2fe,stroke:#4f46e5,stroke-width:2px,color:#1e1b4b,font-weight:bold;\n";

        std::vector<std::string> estilos;
        gerarMermaidHelper(raiz, ss, estilos);

        // Aplica os estilos invisíveis para nós dummy de layout
        for (const auto& estilo : estilos) {
            ss << estilo;
        }

        return ss.str();
    }
};

// Definição das ligações do Emscripten para JavaScript
EMSCRIPTEN_BINDINGS(bst_module) {
    emscripten::class_<ArvoreBinariaBusca>("ArvoreBinariaBusca")
        .constructor<>()
        .function("inserir", &ArvoreBinariaBusca::inserir)
        .function("remover", &ArvoreBinariaBusca::remover)
        .function("buscar", &ArvoreBinariaBusca::buscar)
        .function("preOrdem", &ArvoreBinariaBusca::preOrdem)
        .function("emOrdem", &ArvoreBinariaBusca::emOrdem)
        .function("posOrdem", &ArvoreBinariaBusca::posOrdem)
        .function("obterPreOrdem", &ArvoreBinariaBusca::obterPreOrdem)
        .function("obterEmOrdem", &ArvoreBinariaBusca::obterEmOrdem)
        .function("obterPosOrdem", &ArvoreBinariaBusca::obterPosOrdem)
        .function("buscarAnimado", &ArvoreBinariaBusca::buscarAnimado)
        .function("somaNos", &ArvoreBinariaBusca::somaNos)
        .function("contaFolhas", &ArvoreBinariaBusca::contaFolhas)
        .function("gerarMermaid", &ArvoreBinariaBusca::gerarMermaid);
}
