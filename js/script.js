let timerReader; // Le temps de lecture de la question
let timerAnswer = 3; // Le temps qu'on laisse au joueur pour répondre
var timerGlobal; // = timerReader +  timerAnswer
let idSetinterval;


// Création de l'objet de la class webkitSpeechRecognition
let rec = new webkitSpeechRecognition();
rec.lang = 'fr-FR';
rec.continuous = true;
rec.interimResults = true;

let gameState = {
 randomQuestions: [],
 currentIndex: 0,
 score: 0,
 isPlaying: false
}

let startGameBtn = document.querySelector("button#startGame");

let questionBlock = document.querySelector('.question');
let questionTitleElt = document.querySelector('h2.question-title');
let questionTitle = document.querySelector('h2.question-title span');
let questionElt = document.querySelector('.question p');

let responseElt = document.querySelector('p.responseTime');
let responseTimeElt = document.querySelector('p.responseTime em');
let progressBar = document.querySelector('progress');

let scoreElt = document.querySelector('div.score figure');
let modalElt = document.querySelector('div.modal');
let modalScoreElt = document.querySelector('div.modal .empty-title strong');

let modalCloseBtn = document.querySelector('div.modal a.btn-clear');
let modalBadWordElt = document.querySelector('div.modal div.modal-title em');
let replayBtn = document.querySelector('.replaynow');

let classementListElt = document.querySelector('div.classement');

let classement = [
 { id: 1, pseudo: "Natasha Romanoff", avatar: 'avatar-4.png', bestScore: 7 },
 { id: 2, pseudo: "Fred Lossignol", avatar: 'avatar-4.png', bestScore: 6 },
 { id: 3, pseudo: "Adrien Sergent", avatar: 'avatar-3.png', bestScore: 4 },
 { id: 4, pseudo: "Bruce Banner", avatar: 'avatar-2.png', bestScore: 3 },
 { id: 5, pseudo: "Steve Rogers", avatar: 'avatar-1.png', bestScore: 3 },
 { id: 6, pseudo: "Thor Odinson", avatar: 'avatar-3.png', bestScore: 1 },
];

player = {
 //arrayOfWordsPlayerSaid: [],
 //lastBadWordSaid: '',
 //pseudo: '',
 //scores: [],
 //bestScore: 0
}

//localStorage.setItem('player', JSON.stringify(player) );
//JSON.parse( localStorage.getItem('player') )

let questions = [
 "Tu es prêt à jouer à ce jeu ?",
 "Tu veux jouer à ce jeu avec moi ?",
 "Tu peux me redire de quoi on parlait à l'instant ?",
 "… Tu es sur ?",
 "Ouah mais tu es trop fort, tu t'es beaucoup entraîner à ce jeu ?",
 "Ah tu as perdu !",
 "Je t'aime beaucoup, et toi ?",
 "Tu ne veux pas te mêler de tes affaires ?",
 "Est-ce que tu fais souvent preuve d’imagination ?",
 "Sais-tu ce qu'il y a juste derrière toi ?",
 "J'ai un trou de mémoire, on joue à quel jeu déjà ?",
 "Quel est le but de ce jeu ?",
 "Tu as perdu ! (C'est pas vrai je sais...)",
 "Tu mens souvent ?",
 "Tu rigoles en ce moment ?",
 "Je fais du Curling en sport, et toi tu pratiques un sport ?",
 "Est-ce que tu sais faire du vélo en pédalant avec les mains ?",
 "Comment appelle-t-on les personnes qui ne fument pas ? :)",
 "Je surfe beaucoup sur la toile, et toi tu aimes surfer?",
 "Tu étais au courant de la dernière nouvelle ?",
 "Aimes-tu les vacances ?",
 "Tu trouves que la vie est belle, toi ?",
 "Pouah! C'est toi qu'a pété ?"
];


let wrongWords = ["oui", "non"];

// let wrongWords2 = [
//  { word: "tout à fait", repeat: 1 }
// ]

//let synomyms = [""]

function initializeGameState() {
 gameState.randomQuestions = [];
 gameState.currentIndex = 0;
 gameState.score = 0;
 gameState.isPlaying = false;
 gameState.classement = localStorage.getItem('classement') == null ? gameState.classement = classement : gameState.classement = JSON.parse(localStorage.getItem('classement'));
}

function initializePlayer() {
 if (localStorage.getItem('player') != null) {
  player = JSON.parse(localStorage.getItem('player'));
 }
 else {
  player = {
   id: objectId(),
   arrayOfWordsPlayerSaid: [],
   lastBadWordSaid: '',
   pseudo: '',
   avatar: 'avatar-1.png',
   scores: [],
   bestScore: 0
  }
 }
 console.log(player);
}

function printScore(score) {
 scoreElt.dataset.badge = score;
 modalScoreElt.textContent = score;
}

function printClassement() {

 classementListElt.innerHTML = "";
 gameState.classement.map((gamer) => {
  let template = `
  <div data-id="${gamer.id}" class="tile">
  <div class="tile-icon">
   <figure class="avatar"><img src="img/${gamer.avatar}" alt="Avatar"></figure>
  </div>
  <div class="tile-content">
   <p class="tile-title text-bold">${gamer.pseudo}</p>
   <p class="tile-subtitle">${gamer.bestScore}pts</p>
  </div>
 </div>
  `;
  classementListElt.innerHTML += template;
 });

 let playersElt = document.querySelectorAll('.tile')
 for (let playerDiv of playersElt) {
  if (playerDiv.dataset.id === player.id) {
   playerDiv.classList.add('player')
  }
 }
}

function resetPrint() {
 questionTitleElt.style.opacity = 0;
 questionElt.textContent = "";
 startGameBtn.querySelector('span').textContent = "Démarrer le jeu";
 progressBar.value = 0;
 progressBar.max = 0;
 responseTimeElt.textContent = "";
 responseElt.style.display = 'none';
 scoreElt.dataset.badge = 0;
}

function printPseudo(elt) {
 if (player.pseudo.length > 0) {
  elt.textContent = player.pseudo
 }
}


function setPlayerInLocalStorage() {
 player.scores.push(gameState.score)
 let highscore = Math.max(...player.scores);
 player.bestScore = highscore;
 localStorage.setItem('player', JSON.stringify(player));
}

function setClassementInLocalStorage() {
 localStorage.setItem('classement', JSON.stringify(classement));
}


/*
function updateClassement() {
 let foundPlayer = classement.find((joueur) => joueur.id == player.id);
 if (foundPlayer != undefined) {
  foundPlayer.bestScore = player.bestScore;
 }
 else {

 }

}
*/


function updateClassement() {
 let allScores = [];
 for (let joueur of classement) {
  allScores.push(joueur.bestScore)
 };
 let maxScore = Math.max(...allScores);

 // EFFACER LE JOUEUR DU CLASSEMENT SI IL Y EST
 let foundPlayer = classement.find((joueur) => joueur.id == player.id);
 if (foundPlayer != undefined) {
  classement.splice(classement.indexOf(foundPlayer), 1);
 }

 // SI C'EST LE MEILLEUR ON L'INSERE TOUT EN HAUT
 if (player.bestScore > maxScore) {
  classement.splice(0, 0, player)
 }
 // SINON (si le joueur a le même score ou un socre juste en dessous un autre joueur)
 else {
  let inverseClassement = [...classement].sort((a, b) => a.bestScore - b.bestScore);
  // le joueur qui a le même score OU superieur
  let otherPlayer;
  let indexPosition;
  let insertBefore;
  // Récuper LE joueur dans le classement qui a le même score OU le score supérieur
  for (let autreJoueur of inverseClassement) {
   if (player.bestScore == autreJoueur.bestScore) {
    otherPlayer = autreJoueur;
    insertBefore = true;
    break;
   }
   else if (player.bestScore < autreJoueur.bestScore) {
    otherPlayer = autreJoueur;
    insertBefore = false;
    break;
   }
  }
  indexPosition = classement.indexOf(otherPlayer);
  // Insertion SI un joueur a le même score
  if (insertBefore) {
   classement.splice(indexPosition, 0, player)
  }
  // Insertion SI un joueur a un score supérieur
  else {
   indexPosition++;
   inverseClassement.splice(indexPosition, 0, player);
   classement = inverseClassement.sort((a, b) => b.bestScore - a.bestScore);
  }
 }

 /* SAUVEGARDER ET AFFICHER LE CLASSEMENT MIS A JOUR */
 gameState.classement = classement;
 setClassementInLocalStorage();
 printClassement();
}

/*
/**************************************************************************
 Role : animer la progressbar en modifiant la valeur de son attribut value
**************************************************************************/
function animateProgressBar() {
 // changer la valeur de l'attribut value de l'elt HTML <progress>
 progressBar.value = timerGlobal;
 // changer le texte du <em> qui affiche ex: "3s"
 responseTimeElt.textContent = timerGlobal;
 timerGlobal--; // décrémentation de timerGlobal

 if (timerGlobal < 0) {
  responseTimeElt.textContent = 0;
  setTimeout(function () {
   clearInterval(idSetinterval);
   nextQuestion();
  }, 995);
 }
}


/******************************************************************
 Role attendre la réponse du user et décider si il a gagné ou perdu
******************************************************************/
async function waitResponse() {
 idSetinterval = setIntervalAndExecute(animateProgressBar, 1000);
}

/******************************************************************
 Role : Poser une question au joueur
 @param : int - index de la questions dans le array randomQuestions
*******************************************************************/
function askQuestionToUser(i) {
 // AFFICHER LA QUESTION
 let numberOfQuestion = gameState.currentIndex + 1; // Affiche "question 1" au lieu "question 0"
 questionTitleElt.style.opacity = 0.7;
 questionTitle.textContent = numberOfQuestion
 questionElt.textContent = gameState.randomQuestions[i];
 // DELAI POUR REPONDRE A LA QUESTION
 timerReader = getTimerReader(gameState.randomQuestions[i]); // Nombre de seconde de temps de lecture de la question
 timerGlobal = timerReader + timerAnswer;
 progressBar.max = timerGlobal;
 // AFFICHER <p>il vous reste x secondes...</p> et <progress>
 questionBlock.style.display = 'block';
 responseElt.style.display = 'block';
 progressBar.style.display = 'block';
 // ATTENDDRE LA REPONSE DU JOUEUR ET ANIMER LA PROGRESSBAR
 waitResponse();
}

/******************************************************************
 Role: Appeler la prochaine question ou stopper le jeu
*******************************************************************/
function nextQuestion() {
 gameState.currentIndex++;
 gameState.score++;
 console.log('score', gameState.score);
 printScore(gameState.score);
 if (gameState.currentIndex < 10) {
  askQuestionToUser(gameState.currentIndex)
 }
 else {
  stopGame()
 }
}

/****************************** /
DEMARRER OU ARRETER LE JEU
*******************************/
function startOrStop() {
 if (gameState.isPlaying == false) {
  startGame();
  startGameBtn.querySelector('span').textContent = "Arrêter le jeu"
 }
 else {
  stopGame();
  startGameBtn.querySelector('span').textContent = "Démarrer le jeu";
  openModal();
 }
}

function stopGame() {
 clearInterval(idSetinterval);
 setPlayerInLocalStorage();
 if (player.scores[player.scores.length - 1] >= player.bestScore) {
  updateClassement();
 }
 initializeGameState();
 gameState.isPlaying = false;

 document.querySelector('.icon-pause').classList.toggle('hide');
 document.querySelector('.icon-play').classList.toggle('hide');

 resetPrint();
 rec.abort();
 console.log(gameState);
 //alert("Fin") 


}

function listen() {
 rec.onresult = function (e) {
  //console.log(e);
  for (let vocal of e.results) {
   //console.log(vocal[0].transcript)
   // rechercher un mot interdit dans ce que dit le joueur (dans la string vocal[0].transcript)

   /*
    SI un mot présent dans le tableau des mots interdits (wrongWords)
    existe dans le tableau des mots prononcé (player.arrayOfWordsPlayerSaid) 
    found vaut TRUE
   */
   player.arrayOfWordsPlayerSaid = vocal[0].transcript.split(" ");
   console.log(player.arrayOfWordsPlayerSaid);
   let found = player.arrayOfWordsPlayerSaid.some(badWord => {
    if (wrongWords.indexOf(badWord) != -1) {
     player.lastBadWordSaid = badWord;
     modalBadWordElt.textContent = player.lastBadWordSaid;
     return true;
    }
   });
   //if (vocal[0].transcript.includes('oui') || vocal[0].transcript.includes('non'))  {
   if (found) {
    rec.abort();
    //alert("Vous avez perdu !!! Votre score est de " + gameState.score);
    openModal();
    stopGame();
    break;
   }
  }
 }
}



/***********************************************
 Role : démarrer le jeu
***********************************************/
function startGame() {
 if (player.pseudo == "") {
  player.pseudo = prompt("Entrez votre pseudo").toUpperCase();
  printPseudo(document.querySelector('div.score p'));
 }

 rec.start();
 rec.onaudiostart = function () {
  console.log("démarrage");
  initializeGameState();
  gameState.isPlaying = true;
  document.querySelector('.icon-pause').classList.toggle('hide');
  document.querySelector('.icon-play').classList.toggle('hide');
  // Charger le array randomQuestions de 10 questions au hasard
  gameState.randomQuestions = getRandomQuestions(10);
  console.log(gameState);
  askQuestionToUser(gameState.currentIndex);
  listen();

 }
}

function openModal() {
 modalElt.classList.add('active');
}

function closeModal() {
 modalElt.classList.remove('active');
}

function replay() {
 closeModal();
 startGame();
 startGameBtn.querySelector('span').textContent = "Arrêter le jeu";
}


initializePlayer();
initializeGameState();
printPseudo(document.querySelector('div.score p'));
printClassement();

/************************************************
 ECOUTEURS D'EVENEMENTS
*************************************************/
// Au clic sur le bouton "Démarrer le jeu"
startGameBtn.addEventListener('click', startOrStop);
modalCloseBtn.addEventListener('click', closeModal);
replayBtn.addEventListener('click', replay);