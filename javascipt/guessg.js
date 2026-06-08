const minNum = 1;
const maxNum = 100;
const aNswer = Math.round(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);


let att = 0;
let running = true;
let guess;
let diff;

do {
  guess = window.prompt(`Guess number between 1 - 100. You had ${att} attempts`);

  diff = aNswer - guess;

  if (guess == aNswer) {
    alert(`You guess it right Well Done! It was ${aNswer}`);
    running = false;
    break;
  }
  else if (guess > 100 || guess < 1 || isNaN(guess)) {
    alert(`Its must be a number between 1 - 100`);
  }
  
  
  if (diff < 0) {
    alert(`Down`);
    att++;
  }
  else if (diff > 0) {
    alert(`Up`);
    att++;
  }

}while (running)