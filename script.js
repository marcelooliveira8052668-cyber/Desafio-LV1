// 1. VARIÁVEIS GLOBAIS (O controle do nosso sistema)
let listaCompleta = [];     // A bandeja cheia que vem da cozinha
let filtroAtual = "todos";  // Guarda qual botão está clicado (começa com "todos")
let filtroTexto = "";       // NOVO: Guarda o que foi digitado na barra de pesquisa
let posicaoAtual = 0;       // Controla de onde até onde vamos fatiar (.slice)

// Pegamos os elementos do HTML
const containerAtivos = document.getElementById('container-ativos');
const containerBotoes = document.getElementById('container-botoes');
const botaoVerMais = document.getElementById('botao-ver-mais');
const inputBusca = document.getElementById('input-busca'); // NOVO: Elemento do input de texto

// 2. BUSCANDO OS DADOS NA API
fetch('https://brapi.dev/api/quote/list')
  .then(resposta => resposta.json())
  .then(dados => {
    listaCompleta = dados.stocks;
    
    fabricarBotoesDeFiltro();
    carregarProximosAtivos();
    
    // NOVO: Ouvinte para capturar o que o usuário digita na busca
    if (inputBusca) {
      inputBusca.addEventListener('input', lidarComBuscaTexto);
    }
  })
  .catch(erro => console.log("Erro ao buscar dados:", erro));


// 3. FÁBRICA DE BOTÕES DINÂMICOS (Continua igual)
function fabricarBotoesDeFiltro() {
  const todasAsEtiquetas = listaCompleta.map(ativo => ativo.type);
  const etiquetasUnicas = new Set(todasAsEtiquetas);
  const listaDeTipos = Array.from(etiquetasUnicas);
  
  containerBotoes.innerHTML = `<button onclick="mudarFiltro('todos')" style="padding: 8px 16px; cursor: pointer; font-weight: bold;">TODOS</button>`;
  
  listaDeTipos.forEach(tipo => {
    if (tipo) {
      containerBotoes.innerHTML += `
        <button onclick="mudarFiltro('${tipo}')" style="padding: 8px 16px; cursor: pointer; text-transform: uppercase;">
          ${tipo}
        </button>
      `;
    }
  });
}


// 4. A FUNÇÃO QUE PENEIRA E MOSTRA OS CARDS (Atualizada!)
function carregarProximosAtivos() {
  // Passo A: Peneira 1 - Filtrar pelo botão selecionado
  let listaFiltrada = [];
  if (filtroAtual === "todos") {
    listaFiltrada = listaCompleta;
  } else {
    listaFiltrada = listaCompleta.filter(ativo => ativo.type === filtroAtual);
  }

  // NOVO: Passo A.2: Peneira 2 - Filtrar pelo texto digitado acessando qualquer campo do objeto
  if (filtroTexto !== "") {
    const termo = filtroTexto.toLowerCase();
    
    listaFiltrada = listaFiltrada.filter(ativo => {
      // Object.values pega os valores do objeto (ex: ["AAPL", "Apple Inc", "stock"])
      // .some verifica se pelo menos um desses valores contém o termo digitado
      return Object.values(ativo).some(valor => 
        String(valor).toLowerCase().includes(termo)
      );
    });
  }

  // Passo B: Fatiar a lista que foi duplamente peneirada
  const pedacoDaLista = listaFiltrada.slice(posicaoAtual, posicaoAtual + 6);
  
  // Passo C: Desenhar na tela
  pedacoDaLista.forEach(ativo => {
    containerAtivos.innerHTML += `
      <div style="background: white; padding: 15px; margin: 10px; border-radius: 8px; border: 1px solid #ccc; max-width: 300px;">
        <span style="font-size: 11px; background: #e0e0e0; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${ativo.type || 'N/A'}</span>
        <h3 style="margin: 8px 0 4px 0;">${ativo.stock}</h3>
        <p style="margin: 0; color: #666;">${ativo.name}</p>
      </div>
    `;
  });
  
  posicaoAtual += 6;

  if (posicaoAtual >= listaFiltrada.length) {
    botaoVerMais.style.display = 'none';
  } else {
    botaoVerMais.style.display = 'block';
  }
}


// 5. A FUNÇÃO QUE REAGE AO CLIQUE DOS BOTÕES DE FILTRO (Continua igual)
function mudarFiltro(novoFiltro) {
  filtroAtual = novoFiltro; 
  posicaoAtual = 0;         
  containerAtivos.innerHTML = ""; 
  
  carregarProximosAtivos(); 
}


// NOVO: 6. A FUNÇÃO QUE REAGE À DIGITAÇÃO NA BARRA DE PESQUISA
function lidarComBuscaTexto(evento) {
  filtroTexto = evento.target.value; // Atualiza o texto global com o que foi digitado
  posicaoAtual = 0;                  // Reseta a paginação para começar do primeiro card filtrado
  containerAtivos.innerHTML = "";    // Limpa os cards antigos da tela
  
  carregarProximosAtivos();          // Renderiza os novos resultados filtrados
}


// 7. OUVINTE DO BOTÃO VER MAIS
botaoVerMais.addEventListener('click', carregarProximosAtivos);