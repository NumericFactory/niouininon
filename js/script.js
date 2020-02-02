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
 { pseudo: "Fred Lossignol", avatar: 'avatar-4.png', score: 6 },
 { pseudo: "Adrien Sergent", avatar: 'avatar-3.png', score: 4 },
 { pseudo: "Bruce Banner", avatar: 'avatar-2.png', score: 3 },
 { pseudo: "Steve Rogers", avatar: 'avatar-1.png', score: 3 },
 { pseudo: "Natasha Romanoff", avatar: 'avatar-4.png', score: 2 },
 { pseudo: "Thor Odinson", avatar: 'avatar-3.png', score: 1 },
];

player = {
 arrayOfWordsPlayerSaid: [],
 lastBadWordSaid: '',
 pseudo: '',
 scores: []
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
}

function printScore(score) {
 scoreElt.dataset.badge = score;
 modalScoreElt.textContent = score;
}

function printClassement() {
 classementListElt.innerHTML = "";
 classement.map((gamer) => {
  let template = `
  <div class="tile">
  <div class="tile-icon">
   <figure class="avatar"><img src="img/${gamer.avatar}" alt="Avatar"></figure>
  </div>
  <div class="tile-content">
   <p class="tile-title text-bold">${gamer.pseudo}</p>
   <p class="tile-subtitle">${gamer.score}pts</p>
  </div>
 </div>
  `;
  classementListElt.innerHTML += template;
 })
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
 clearInterval(idSetinterval)
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
   player.arrayOfWordsPlayerSaid = vocal[0].transcript.split(" ");
   console.log(player.arrayOfWordsPlayerSaid);
   let found = player.arrayOfWordsPlayerSaid.some(badWord => {
    if (wrongWords.indexOf(badWord) >= 0) {
     player.lastBadWordSaid = badWord;
     modalBadWordElt.textContent = player.lastBadWordSaid;
     return true;
    }
   });
   //if (vocal[0].transcript.includes('oui') || vocal[0].transcript.includes('non')) {
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



printClassement();

/************************************************
 ECOUTEURS D'EVENEMENTS
*************************************************/
// Au clic sur le bouton "Démarrer le jeu"
startGameBtn.addEventListener('click', startOrStop);
modalCloseBtn.addEventListener('click', closeModal);
replayBtn.addEventListener('click', replay);