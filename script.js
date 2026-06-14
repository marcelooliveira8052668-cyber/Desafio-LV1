// 1. VARIÁVEIS GLOBAIS (O controle do nosso sistema)
let listaCompleta = [];    // A bandeja cheia que vem da cozinha
let filtroAtual = "todos";  // Guarda qual botão está clicado (começa com "todos")
let posicaoAtual = 0;      // Controla de onde até onde vamos fatiar (.slice)

// Pegamos os elementos do HTML
const containerAtivos = document.getElementById('container-ativos');
const containerBotoes = document.getElementById('container-botoes');
const botaoVerMais = document.getElementById('botao-ver-mais');

// 2. BUSCANDO OS DADOS NA API
fetch('https://brapi.dev/api/quote/list')
  .then(resposta => resposta.json())
  .then(dados => {
    listaCompleta = dados.stocks;
    
    // Fabricamos os botões dinâmicos assim que os dados chegam
    fabricarBotoesDeFiltro();
    
    // Carrega os primeiros 6 ativos da tela
    carregarProximosAtivos();
  })
  .catch(erro => console.log("Erro ao buscar dados:", erro));


// 3. FÁBRICA DE BOTÕES DINÂMICOS
function fabricarBotoesDeFiltro() {
  // Descobrimos as etiquetas únicas da bandeja (Seu código do Set!)
  const todasAsEtiquetas = listaCompleta.map(ativo => ativo.type);
  const etiquetasUnicas = new Set(todasAsEtiquetas);
  const listaDeTipos = Array.from(etiquetasUnicas);
  
  // Criamos o primeiro botão fixo que serve para resetar e mostrar "Todos"
  containerBotoes.innerHTML = `<button onclick="mudarFiltro('todos')" style="padding: 8px 16px; cursor: pointer; font-weight: bold;">TODOS</button>`;
  
  // Para cada tipo único, criamos um botão que chama a função mudarFiltro() ao ser clicado
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


// 4. A FUNÇÃO QUE PENEIRA E MOSTRA OS CARDS
function carregarProximosAtivos() {
  // Passo A: Peneirar a lista de acordo com o botão clicado
  let listaFiltrada = [];
  
  if (filtroAtual === "todos") {
    listaFiltrada = listaCompleta; // Se for todos, a lista filtrada é a bandeja cheia
  } else {
    // Se for um tipo específico, peneiramos (.filter) para pegar só os iguais
    listaFiltrada = listaCompleta.filter(ativo => ativo.type === filtroAtual);
  }

  // Passo B: Fatiar a lista que foi peneirada
  const pedacoDaLista = listaFiltrada.slice(posicaoAtual, posicaoAtual + 6);
  
  // Passo C: Desenhar na tela
  pedacoDaLista.forEach(ativo => {
    containerAtivos.innerHTML += `
      <div style="background: white; padding: 15px; margin: 10px; border-radius: 8px; border: 1px solid #ccc; max-width: 300px;">
        <span style="font-size: 11px; background: #e0e0e0; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${ativo.type}</span>
        <h3 style="margin: 8px 0 4px 0;">${ativo.stock}</h3>
        <p style="margin: 0; color: #666;">${ativo.name}</p>
      </div>
    `;
  });
  
  // Jogamos a posição 6 números para a frente
  posicaoAtual += 6;

  // Se os cards visíveis já chegaram ao fim da lista filtrada, esconde o botão "Ver Mais"
  if (posicaoAtual >= listaFiltrada.length) {
    botaoVerMais.style.display = 'none';
  } else {
    botaoVerMais.style.display = 'block'; // Garante que o botão reaparece se mudar o filtro
  }
}


// 5. A FUNÇÃO QUE REAGE AO CLIQUE DOS BOTÕES DE FILTRO
function mudarFiltro(novoFiltro) {
  filtroAtual = novoFiltro; // Atualiza o filtro ativo (ex: mudou de 'todos' para 'BDR')
  posicaoAtual = 0;         // Reseta a contagem para fatiar do começo
  containerAtivos.innerHTML = ""; // Limpa a tela para os novos cards entrarem
  
  carregarProximosAtivos(); // Roda a função para carregar os 6 primeiros do novo filtro
}


// 6. OUVINTE DO BOTÃO VER MAIS
botaoVerMais.addEventListener('click', carregarProximosAtivos);