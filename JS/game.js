// Teclas do teclado
const Teclas =  [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                 ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                 ['Z', 'X', 'C', 'V', 'B', 'N', 'M']];

// Futuros elementos #game e #keyboard
let g = null;
let k = null;

// Boxes de #game e #keyboard
let gbox = null;
let kbox = null;

// Quando o site carrega
window.onload = function() {

 // Captura o jogo
 g = document.getElementById("game");

 // Após carregamento do site cria o teclado
 k = document.getElementById("keyboard");

 // Cria as Boxes para entrada das palavra-teste
 for(i = 1; i<7; i++){
   var box = '<div id="w' + i + '" class="word">\n';
    for(j = 1; j<6; j++)
      box += '<div class="box" data-position="' + j + '"></div>\n';
   box += '</div>';
  g.innerHTML += box;
 }

 // Carrega as boxes do game na variável gbox
 gbox = g.getElementsByClassName("box");

 // Carrega as boxes do teclado na variável kbox
 kbox = k.getElementsByClassName("box");

 // Marca a primeira caixinha como ativa
 gbox[0].classList.add("active");

 // Adiciona as letras do keyboard virtual
 Teclas.forEach((N1) => {
   // Inicia uma nova linha do teclado
   k.innerHTML += '<div  class="teclado">\n';
   N1.forEach((N2) => {
     // Add uma tecla
     k.innerHTML += '<div class="box black" data-codigo="' + N2 + '">' + N2 + '</div>\n';
   });
   // Finaliza a linha do teclado
   k.innerHTML += '</div>\n';
 });

  // Add o evento de clique para selecionar a caixa do game
  for(i = 0; i<gbox.length; i++)
     gbox[i].addEventListener('click', selecionaBox, false);

  // Add o evento de clique ao teclado virtual
  for(i = 0; i<kbox.length; i++)
    kbox[i].addEventListener('click', teclaKeyboard, false);

  // Add o evento de clique no teclado físico
  document.addEventListener('keypress', teclaKeyboard, false);

};


// Pesquisa pela palavra-chave
var pesquisaPC = function(){

 // Separa o padrão da palavra chave PPC
 var PPC = ["[^*]","[^*]","[^*]","[^*]","[^*]"]; // Padrão da Palavra-Chave

 // Variáveis auxiliares
 var LPE = []; // Letras em Posições Erradas
 var LNC = []; // Letras Não Correspondentes

 // Varre as todas as boxes (procurando letras presentes e não-presentes)
 for(i=0; i< gbox.length ; i++)
   if (gbox[i].classList.contains("black")){ // Letra não existe
     LNC.push(gbox[i].innerText); // Adiciona a letra na lista de letras inexistentes
   }else if (gbox[i].classList.contains("orange")){                 // Letra conhecida em local errado
     LPE.push(gbox[i].innerText);                                   // Add a letra na lista de letras presentes em locais errados
     var Pos = gbox[i].getAttribute("data-position");               // Identifica a posição da letra
     PPC[Pos-1] = PPC[Pos-1].replace("^", "^" + gbox[i].innerText); // Adiciona exceção naquela posição específica
   }else if (gbox[i].classList.contains("green")){                  // Letra conhecida em local correto
     var Pos = gbox[i].getAttribute("data-position");               // Captura a posição
     PPC[Pos-1] = gbox[i].innerText;                                // Substitui o conteudo pela letra correta
   }

   // Retorna valores únicos
   LPE = Array.from(new Set(LPE));
   LNC = Array.from(new Set(LNC));

   // Adiciona as letras pretas ao padrão após filtragem das laranjas
   // Exemplo: a palavra correta é 'boiar' e a pessoa digitou: 'forró'. Um 'r' aparece laranaja e o outro preto.
   LNC.filter( C => (LPE.indexOf(C) === -1 && !(typeof(C) === "undefined"))).forEach( C => {
       for(var i = 0; i<PPC.length; i++)
           PPC[i] = PPC[i].replace("^","^" + C);
   });

  // Procura pelas palavras-chave
  var words = [];
  var regex = new RegExp('(' + PPC.join('') + ')');
  P.forEach( R => {
    // Força letra maiúscula sem acento
    W = R.toUpperCase().replace("Ç", "C").replace(/[\300-\306]/g, "A").replace(/[\310-\313]/g, "E").replace(/[\314-\317]/g, "I").replace(/[\322-\330]/g, "O").replace(/[\331-\334]/g, "U");
    
    // Verifica se passa no teste básico do padrão
    if (regex.test(W)){

      // Extrai as letras nas posições desconhecidas
      var H = 0;
      LPE.forEach( G => {
        H += (W.indexOf(G) >= 0);
      });

      // Verifica se é possível preencher as posições desconhecidas com as letras H
      if (H == LPE.length)
        words.push(R);

    }


  });

   // Preenche a sugestão de palavras
   var R = document.getElementById("words");
   if(words.length>15)
      R.innerHTML = "<strong>Limitado as 15 primeiras ocorrências</strong>\n";
   else if (words.length==0)
      R.innerHTML = "<strong>Nenhuma correspondência</strong>\n";
    else
      R.innerHTML = "";

  // Calcula a quantidade total
  var qto = (words.length>15)? 15 : words.length ;

   // Imprime o resultado da busca em sugestões
   for(i=0;i < qto ;i++){
      R.innerHTML  += "\n<li>" + words[i] + "</li>";
   }

   // Preenche demais informações
   document.getElementById("outLetters").innerText = LNC.join(' ');
   document.getElementById("wrongPosition").innerText = LPE.join(' ');
   document.getElementById("total").innerText = words.length;
}


// Seleciona uma box para inserir uma letra
var selecionaBox = function(){
  // Remove todas as classes active
  for(i = 0; i<gbox.length; i++)
    gbox[i].classList.remove("active");
  // Add a classe ativa no elemento clicado
  this.classList.add("active");
}

// Clique no teclado
var teclaKeyboard = function() {

	// Captura a box da vez (ativa)
    var index = g.getElementsByClassName("active")[0];

    // Captura o código do botão pressionado no teclado
    var codigo = (event.type == "keypress")?  event.key.toUpperCase() : this.getAttribute("data-codigo");

    // Verifica se é para inserir letra ou tecla de controle
    if (codigo.length == 1 && codigo >= "A" && codigo <= "Z" && !(typeof index === 'undefined')) {

	  index.innerText = codigo;
      index.className = kbox[7].className;

      // Pula para o próximo elemento
      var nS = index.nextElementSibling;
      if (nS != null) nS.classList.add("active");
      else pesquisaPC();

    }else if ((codigo >= '1' && codigo <= '6') || codigo.length == 5) {

	// Verifica a opção a ser realizada pelo teclado
      switch (codigo) {
        case '1': // Pinta tudo de verde
          for(i = 6; i<kbox.length; i++) kbox[i].className = "box green";
          break;
        case '2': // Pinta tudo de laranja
          for(i = 6; i<kbox.length; i++) kbox[i].className = "box orange";
          break;
        case '3': // Pinta tudo de preto
          for(i = 6; i<kbox.length; i++) kbox[i].className = "box black";
          break;
        case '4': // Apaga a tecla
          if (index === null) break;
          index.innerText = '';
          index.className = "box white";
          // Pula para o próximo elemento
          var nS = index.previousElementSibling;
          if (nS != null) nS.classList.add("active");
          break;
        case '5': 		// Pesquisa a palavra-chave
		case "ENTER": 	// Pesquisa a palavra-chave
          pesquisaPC();
          break;
        case '6': // Limpa a seleção
          for(i = 0; i<gbox.length; i++) {
            gbox[i].className = "box";
            gbox[i].innerText = "";
          }
          gbox[0].classList.add("active");
          document.getElementById("outLetters").innerText = "";
          document.getElementById("wrongPosition").innerText = "";
          document.getElementById("total").innerText = "";
          document.getElementById("words").innerText = "";
          break;
        default: // Debug
          console.log(`Falha ao acessar o código: ${codigo}.`);
      }

    }

};
