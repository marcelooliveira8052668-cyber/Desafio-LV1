// 1. VARIÁVEIS GLOBAIS (O controle do nosso sistema)
// Imagina que "let" cria caixinhas na memória do computador para guardar brinquedos ou informações.

let listaCompleta = [];     // Uma caixinha que começa vazia. Ela vai guardar a bandeja gigante cheia de doces (investimentos) que vem lá da cozinha central (internet).
let filtroAtual = "todos";  // Guarda qual botão o cliente clicou. Começa mostrando "todos" os doces.
let filtroTexto = "";       // Guarda as letrinhas que o cliente digitar na barra de pesquisa. Começa sem nada.
let posicaoAtual = 0;       // Controla quantos doces já mostramos. Começa do número zero.

// As linhas com "const" criam ganchos que seguram as caixas do HTML (as divisórias do site) para o JavaScript poder mexer nelas.
const containerAtivos = document.getElementById('container-ativos'); // Pega o espaço onde vamos desenhar os cartões de investimentos.
const containerBotoes = document.getElementById('container-botoes'); // Pega o espaço onde vamos colocar os botões de categorias.
const botaoVerMais = document.getElementById('botao-ver-mais');       // Pega o botão "Ver Mais" para sabermos quando ele for clicado.
const inputBusca = document.getElementById('input-busca');           // Pega a caixinha de texto onde o usuário digita.

// 2. BUSCANDO OS DADOS NA API
// O "fetch" é como enviar um motoboy buscar uma encomenda em outro site.
fetch('https://brapi.dev/api/quote/list')
  .then(resposta => resposta.json()) // Quando o motoboy volta, ele transforma o pacote fechado em uma lista que o computador entende (JSON).
  .then(dados => { // Agora que temos os dados na mão...
    listaCompleta = dados.stocks; // Guardamos os doces (as ações/stocks) dentro da nossa caixinha "listaCompleta".
    
    fabricarBotoesDeFiltro(); // Chama o robozinho construtor para criar os botões na tela.
    carregarProximosAtivos(); // Chama o outro robozinho para colocar os 6 primeiros doces na vitrine.
    
    // Se a caixinha de busca realmente existir no site...
    if (inputBusca) {
      // Fique olhando para ela! Toda vez que o usuário digitar uma única letra ('input'), chame a função "lidarComBuscaTexto".
      inputBusca.addEventListener('input', lidarComBuscaTexto);
    }
  })
  // Se o motoboy sofrer um acidente ou a internet cair, avisa no diário secreto do computador (console) qual foi o erro.
  .catch(erro => console.log("Erro ao buscar dados:", erro));


// 3. FÁBRICA DE BOTÕES DINÂMICOS
// Essa função olha todos os doces e cria botões baseados nos tipos que existem.
function fabricarBotoesDeFiltro() {
  // Pega a lista completa e faz um mapa só com os tipos de investimentos (ex: Ação, Fundo, etc).
  const todasAsEtiquetas = listaCompleta.map(ativo => ativo.type);
  // O "Set" é mágico: ele joga fora os tipos repetidos para não criar botões iguais.
  const etiquetasUnicas = new Set(todasAsEtiquetas);
  // Transforma essa coleção mágica de volta em uma lista organizada.
  const listaDeTipos = Array.from(etiquetasUnicas);
  
  // Cria o primeiro botão principal chamado "TODOS" dentro da caixinha de botões do HTML.
  containerBotoes.innerHTML = `<button onclick="mudarFiltro('todos')" style="padding: 8px 16px; cursor: pointer; font-weight: bold;">TODOS</button>`;
  
  // Para cada tipo que sobrou na lista única...
  listaDeTipos.forEach(tipo => {
    // Se o tipo não estiver em branco...
    if (tipo) {
      // Adiciona (+=) mais um botão no site com o nome do tipo em letras maiúsculas.
      containerBotoes.innerHTML += `
        <button onclick="mudarFiltro('${tipo}')" style="padding: 8px 16px; cursor: pointer; text-transform: uppercase;">
          ${tipo}
        </button>
      `;
    }
  });
}


// 4. A FUNÇÃO QUE PENEIRA E MOSTRA OS CARDS
// Essa função é o coração! Ela filtra os dados e desenha as caixinhas na tela.
function carregarProximosAtivos() {
  // Criamos uma lista temporária para guardar o que passou pelas peneiras.
  let listaFiltrada = [];
  
  // Passo A: Peneira do Botão. Se o botão clicado for "todos"...
  if (filtroAtual === "todos") {
    listaFiltrada = listaCompleta; // A lista filtrada recebe todo mundo.
  } else {
    // Se não, filtre (.filter) mantendo apenas os investimentos que têm o tipo igual ao botão clicado.
    listaFiltrada = listaCompleta.filter(ativo => ativo.type === filtroAtual);
  }

  // Passo A.2: Peneira do Texto. Se o usuário digitou alguma coisa na busca...
  if (filtroTexto !== "") {
    // Transforma o texto digitado em letras minúsculas para não dar erro se ele digitar Maiúsculo.
    const termo = filtroTexto.toLowerCase();
    
    // Filtra de novo a lista que já tinha sido filtrada pelo botão!
    listaFiltrada = listaFiltrada.filter(ativo => {
      // Pega todos os textos de dentro do investimento (Ex: o código, o nome da empresa e o tipo) e transforma em uma lista de palavras.
      // E verifica se PELO MENOS UMA (.some) dessas palavras contém as letras que o usuário digitou.
      return Object.values(ativo).some(valor => 
        String(valor).toLowerCase().includes(termo)
      );
    });
  }

  // Passo B: Fatiar a lista. Como não queremos mostrar 500 coisas de uma vez só, usamos o .slice para pegar um pedaço (da posição atual até ela + 6).
  const pedacoDaLista = listaFiltrada.slice(posicaoAtual, posicaoAtual + 6);
  
  // Passo C: Desenhar na tela. Para cada investimento desse pedaço...
  pedacoDaLista.forEach(ativo => {
    // Nós "injetamos" um bloco de código HTML lá no site para criar o cartão visual dele com o tipo, o código e o nome!
    containerAtivos.innerHTML += `
      <div style="background: white; padding: 15px; margin: 10px; border-radius: 8px; border: 1px solid #ccc; max-width: 300px;">
        <span style="font-size: 11px; background: #e0e0e0; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${ativo.type || 'N/A'}</span>
        <h3 style="margin: 8px 0 4px 0;">${ativo.stock}</h3>
        <p style="margin: 0; color: #666;">${ativo.name}</p>
      </div>
    `;
  });
  
  // Depois de mostrar as 6 caixinhas, somamos 6 na nossa posição atual para saber que a próxima rodada começa depois delas.
  posicaoAtual += 6;

  // Se a nossa posição atual passou do tamanho total da lista filtrada (ou seja, os doces acabaram)...
  if (posicaoAtual >= listaFiltrada.length) {
    botaoVerMais.style.display = 'none'; // Esconde o botão "Ver Mais" (display: none).
  } else {
    botaoVerMais.style.display = 'block'; // Se ainda tem doce, deixa o botão aparecendo.
  }
}


// 5. A FUNÇÃO QUE REAGE AO CLIQUE DOS BOTÕES DE FILTRO
// Quando você clica em um botão de categoria, essa função roda:
function mudarFiltro(novoFiltro) {
  filtroAtual = novoFiltro;       // Atualiza a caixinha do filtro com o novo botão clicado.
  posicaoAtual = 0;               // Zera o contador para começarmos a mostrar os doces lá do início (do zero).
  containerAtivos.innerHTML = ""; // Limpa a tela inteira (apaga os cartões antigos) para colocar os novos.
  
  carregarProximosAtivos();       // Chama a função principal para desenhar os cartões da nova categoria.
}


// 6. A FUNÇÃO QUE REAGE À DIGITAÇÃO NA BARRA DE PESQUISA
// Toda vez que você aperta uma tecla na barra de busca:
function lidarComBuscaTexto(evento) {
  filtroTexto = evento.target.value; // Olha o que acabou de ser digitado na caixinha de texto e guarda.
  posicaoAtual = 0;                  // Zera o contador para começar do início da nova pesquisa.
  containerAtivos.innerHTML = "";    // Limpa a tela para sumir com os cartões antigos.
  
  carregarProximosAtivos();          // Desenha na tela apenas os cartões que combinam com o texto digitado!
}


// 7. OUVINTE DO BOTÃO VER MAIS (Código finalizado por nós para fazer sentido)
// Fica vigiando o botão "Ver Mais". Se o usuário clicar nele...
botaoVerMais.addEventListener('click', carregarProximosAtivos); // Chama a função para buscar e desenhar mais 6 cartões logo abaixo!