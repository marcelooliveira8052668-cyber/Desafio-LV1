// Criamos as caixas vazias no topo para usar em todo o código
let listaCompleta = [];
let posicaoAtual = 0;

// Pegamos os elementos do HTML que vamos usar
const container = document.getElementById('container-ativos');
const botao = document.getElementById('botao-ver-mais');

// 1. O garçom vai buscar os dados na cozinha assim que o site abre
fetch('https://brapi.dev/api/quote/list')
  .then(resposta => resposta.json())
  .then(dados => {
    // Guardamos a lista completa de ações que veio da internet
    listaCompleta = dados.stocks;
    
    // Chamamos a função para carregar os primeiros 6 itens
    carregarProximosAtivos();
  })
  .catch(erro => console.log("Erro ao buscar dados:", erro));


// 2. A Função que pega um pedaço da bandeja e desenha na tela
function carregarProximosAtivos() {
  
  // Fatiamos a lista da posição atual (ex: 0) até a posição atual + 6 (ex: 6)
  const pedacoDaLista = listaCompleta.slice(posicaoAtual, posicaoAtual + 6);
  
  // PARA CADA ativo desse pedaço, desenhamos na tela
  pedacoDaLista.forEach(ativo => {
    container.innerHTML += `
      <div style="background: white; padding: 15px; margin: 10px; border-radius: 8px; border: 1px solid #ccc; max-width: 300px;">
        <h3>${ativo.stock}</h3>
        <p>${ativo.name}</p>
      </div>
    `;
  });
  
  // Depois de desenhar os 6, jogamos a nossa posição 6 números para a frente
  posicaoAtual += 6;

  // Se a nossa posição passar do tamanho total da lista, escondemos o botão
  if (posicaoAtual >= listaCompleta.length) {
    botao.style.display = 'none';
  }
}

// 3. O Ouvinte do Botão: Quando clicar no botão "Ver Mais", roda a função de novo!
botao.addEventListener('click', carregarProximosAtivos);
