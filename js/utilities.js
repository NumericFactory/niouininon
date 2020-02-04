/*
 Role : retourner un nombre au hasard entre un min et un max
*/
function getRandomInt(min, max) {
 min = Math.ceil(min);
 max = Math.floor(max);
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setIntervalAndExecute(fn, t) {
 fn();
 return (setInterval(fn, t));
}

/*
 Role : retourner un tableau de 10 questions au hasard
 @param : int - nombre de questions que l'on veut générer
 @return : array<string> - X questions au hasard
*/
function getRandomQuestions(num) {
 let randQuestions = [];
 let randIndex;

 while (randQuestions.length < num) {
  randIndex = getRandomInt(0, questions.length - 1);
  if (randQuestions.indexOf(questions[randIndex]) == -1) {
   randQuestions.push(questions[randIndex]);
  }
 }
 return randQuestions;
}

/*
 Role : retourner le temps de lecture d'une phrase en (secondes)
 @param : string - phrase
 @return : int - nombre de secondes
*/
function getTimerReader(sentence) {
 let nbWords = sentence.split(' ').length;
 return Math.ceil(nbWords * 60 / 250);
}

/*
 Generer un id comme un id MongoDB
*/
function objectId(m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) {
 return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
}
