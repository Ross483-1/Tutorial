document.getElementById("firstwordinthejavascriptsection").textContent = "I change this word into Goodbye";
document.getElementById("firstletter").textContent = "a b c d e f g h i j k l m n o p q r s t u v w y z";

// ----------------------------------------------------

console.log("I like Pizza");
console.log("I like play football");
// ----------------------------------------------------
// By displaying variable there are three ways how to do it first way is by let which can be change at any time
let j = 12
let o = 13
let d = 14

console.log(j, o, d);

// By using "let" you can change variable in any time where as "const" or "var" you cant. So you have to know that.
const h = 15
const b = 16
const k = 17

console.log(h, b, k);

var n = 18
var u = 19
var l = 20

console.log(n, u, l);

// ----------------------------------------------------
// VARIABLES
// These are all numbers types
let x = 100 
let y = 5.99
let z = 60 / 89

console.log(x, y, z);
console.log(typeof x, typeof y, typeof z);

// ------------------------------------------------------
// String variables can be numbers but javascript cant do math with them.
let firstName = "ross!"
let email = "rostyslavsudenko123@gmail.com"
let age = "25"
let adress = "sandres way door 14 lichfield"

console.log(firstName, email, age);

// Booleans are two types true or false and it can only be them two.
let isStudent = true;
let isAdult = false;

console.log(isStudent, isAdult);

// Lets get variable into html 

document.getElementById("p1").textContent = `Your name is ${firstName}`;
document.getElementById("p2").textContent = `Your age is ${age}`;
document.getElementById("p3").textContent = `Your email is ${email}`;
document.getElementById("p4").textContent = `Your adress is ${adress}`;
document.getElementById("p5").textContent = `Are you a student? ${isStudent}`;
document.getElementById("p6").textContent = `Are you an adult? ${isAdult}`;

// ------------------------------------------------------
// Arithmetic operators 
/* Arithmetic operators = operands (value, variable, etc)
                        = operators (+ - * / **)
*/

let students = 30;

// we can change value as what ever we want
// students = students + 1; - it would add up to students value of (30) +1.
// students = students - 1; - it would substract from students value (30) -1.
// students = students * 2; - it would multiply to students value (30) *2.
// students = students / 2; - it would divide the students value (30) by 2.
// students = students ** 2; - it would square the students value (30).
// students = students % 2; - it would see if there are some left overs from the students value (30) after dividing by 2

// There are of course can be shortcuts for to write a code down.
// To add - students += 1;
// To substract - students -= 1;
// To multiply - students *= 2;
// To divide - students /= 2;
// To square - students **= 2;
// To see leftovers - students %= 2;
// console.log(students);

// Or you can evenmake more shorter
// It will add one to the students value - student++;
// It will substract one from the students value - student--;

// How to acept user input
// let username = window.prompt("What is your name? ");
// console.log(username);

// ------------------------------------------------------
// How to do it by HTML

let username;

document.getElementById("submitbuttonforusername").onclick = function () {
  username = document.getElementById("inputtextforname").value;
  console.log(username);
}

// const = a variable that cant be changed
// For instanst if you ever or someone would change the pi you would get mistakes so that no one would change the variable.

const pi = 3.14159;
let radius;
let circumference;

document.getElementById("submitforcircle").onclick = function () {
  radius = window.prompt('Enter the radius of a circle');
  radius = Number(radius);

  circumference = 2 * pi * radius;

  document.getElementById("myH3").textContent = circumference + "cm";
}

// ------------------------------------------------------
// Counter program

const decreaseBtn = document.getElementById("decreaseBtn");
const increaseBtn = document.getElementById("increaseBtn");
const resetBtn = document.getElementById("resetBtn");
const countLabel = document.getElementById("countLabel");
let count = 0;

increaseBtn.onclick = function () {
  count++;
  countLabel.textContent = count;
}
decreaseBtn.onclick = function () {
  count--;
  countLabel.textContent = count;
}
resetBtn.onclick = function () {
  count = 0;
  countLabel.textContent = count;
}

// ------------------------------------------------------
// Math in JS = built-in object that provides a collection of properties and methods

console.log(Math.PI);
console.log(Math.E);

let p = 45;
let t = 2;
let r;

// r = Math.round(p); - it will round number.
// r = Math.floor(p); - floor will always round down.
// r = Math.ceil(p); - ceil will always round up.
// r = Math.trunc(p); - trunc will eliminate any decimals.
// r = Math.pow(p, t); - pow will power of t to p so 45 power of 2
// r = Math.sqrt(p); - square root will be of p.
// r = Math.log(p); - it will give of the logarithm.
// Trigeometry
// r = Math.sin(p); - sin of the p.
// r = Math.cos(p); - cos of the p.
// r = Math.tan(p); - tan of the p.
// r = Math.abs(p); - absolute number.
// r = Math.sign(p); - it will give result as positive or negative number -1, 0, 1.
// r = Math.max(p, t); - it will show maximum value of two numbers.
// r = Math.min(p, t); - it will show minimum value of two numbers
// r = Math.random(); - this will generate random number

// ------------------------------------------------------
// Random number generator

let randomNum = Math.floor(Math.random() * 6) + 1;

console.log(randomNum);

const rollBtn = document.getElementById("rollBtn");
const rollLabel1 = document.getElementById("rollLabel1");
const rollLabel2 = document.getElementById("rollLabel2");
const rollLabel3 = document.getElementById("rollLabel3");
const rollResetBtn = document.getElementById("rollResetBtn");
const min = 1;
const max = 6;
let rollNum1;
let rollNum2;
let rollNum3;

rollBtn.onclick = function () {
  rollNum1 = Math.floor(Math.random() * max) + min;
  rollNum2 = Math.floor(Math.random() * max) + min;
  rollNum3 = Math.floor(Math.random() * max) + min;
  rollLabel1.textContent = rollNum1;
  rollLabel2.textContent = rollNum2;
  rollLabel3.textContent = rollNum3;
}

rollResetBtn.onclick = function () {
  rollNum1 = 0;
  rollNum2 = 0;
  rollNum3 = 0;
  rollLabel1.textContent = rollNum1;
  rollLabel2.textContent = rollNum2;
  rollLabel3.textContent = rollNum3;
}

// ------------------------------------------------------
// IF statements = if a condition is true , execute some code , if not, do something else.

let q = document.getElementById("ageBtn");
let e = document.getElementById("ageInput").value;
let w = document.getElementById("ageOutput");

q.onclick = function () {
  if (e >= 18) {
    w.textContent = "You are old enough to visit this   website";
  }
  else if (e < 18) {
    w.textContent = "You are not old enough to visit this   website. You must be 18+! BAN";
  }
}

// ------------------------------------------------------
// .checked = property that determins the checked state of an HTML checkbox or radio button element.

const visaBtn = document.getElementById("visaBtn");
const mastercardBtn = document.getElementById("mastercardBtn");
const giftCardBtn = document.getElementById("giftCardBtn");
const payPalBtn = document.getElementById("payPalBtn");
const payBtn = document.getElementById("payBtn");
const subResult = document.getElementById("subResult");
const paymentResult = document.getElementById("paymentResult");

payBtn.onclick = function(){

  if (visaBtn.checked) {
    paymentResult.textContent = `You are paying with Visa`;
  }
  else if (mastercardBtn.checked) {
    paymentResult.textContent = `You are paying with Master Card`;
  }
  else if (giftCardBtn.checked) {
    paymentResult.textContent = `You are paying with Gift Card`;
  }
  else if (payPalBtn.checked) {
    paymentResult.textContent = `You are paying with Pay Pal`;
  }
  else {
    paymentResult.textContent = `You must select payment type`;
  }

}


// ------------------------------------------------------
// Ternary operator - a shortcut to if{} and else{} statements helps assign variable by a condition - Condition ? codeIfTrue : codeIfFalse ; 

let childrenAgeInput = document.getElementById("childrenAgeInput").value;
let childrenAgeOutput = document.getElementById("childrenAgeOutput");
let childrenAgeBtn = document.getElementById("childrenAgeBtn");

childrenAgeBtn.onclick = function () {
  childrenAgeInput >= 12 ? childrenAgeOutput.textContent = ("You are old enough to go and watch movie with your friends") : childrenAgeOutput.textContent = ("You are not old enough to go and watch movie with your friends");
}

// ------------------------------------------------------
// Time indicator

let time = 18;
let greetings = time > 12 ? "Its PM; Good Afternoon!" : "Its AM; Good Morning!";
console.log(greetings);

// ------------------------------------------------------
// Switch - can be an efficient replacement to many else if statements.

let day = 7;

switch (day) {
  case 1:
    console.log("Its Monday! Start of the Week.");
    break;
  case 2:
    console.log("Its Tuesday! Second day of the Week.");
    break;
  case 3:
    console.log("Its Wednesday! Middle of the Week.");
    break;
  case 4:
    console.log("Its Thursday! Middle of the Week.");
    break;
  case 5:
    console.log("Its Friday! Fifth day of the Week.");
    break;
  case 6:
    console.log("Its Saturday! Sixth day of the Week. First day of the weekends.");
    break;
  case 7:
    console.log("Its Sunday! Last day of the Week. Last day of the weekends.");
    break;
  default:
    console.log(`${day} is not a day`);
    break;

}


// Complex Switch

let testScore = 99;
let letterGrade;

switch (true) {
  case testScore >= 98:
    letterGrade = 'A++';
    break;
  case testScore >= 95:
    letterGrade = 'A+';
    break;
  case testScore >= 90:
    letterGrade = 'A';
    break;
  case testScore >= 80:
    letterGrade = 'B';
    break;
  case testScore >= 70:
    letterGrade = 'C';
    break;
  case testScore >= 60:
    letterGrade = 'D';
    break;
  case testScore >= 50:
    letterGrade = 'E';
    break;
  case testScore >= 40:
    letterGrade = 'F';
    break;
  default:
    letterGrade = 'F';
}

console.log(`Your letter is ${letterGrade} because your score is ${testScore}`);

// ------------------------------------------------------
// String methods = allow ou to manipulate and work with string (text).

// let userName = "RostyFrosty";

// userName.charAt(0) - it will find symbol in the index 0 so first letter which is R.
// userName.indexOf("R") - it will find in which index R is so it is going to output answer 0.
// userName.lastIndexOf("y") - it will find last symbol y and output its index location.
// userName.lenght - it will output how many characters are in the string which is 11 characters.
// userName.trim() - it will delete space in the string if it got any.
// userName.toUpperCase() - it will upper case string which is already in the upper case.
// userName.toLowerCase() - it will lower case string which would make string rostyfrosty.
// userName.repeat(3) - it will repeat string as many times as you want.
// userName.startsWith("R") - it will check if string starts with R in that moment it is.
// userName.endsWith("y") - it will check if string ends with y in that moment it is.
// userName.includes("R") - it will check if string includes in it letter R in that moment it is.
// userName.replaceAll("R", "") - it will replace all charcters R to the no character.
// userName.padStart(15, "0") - it will add 0 until total amount in the string would get up to 15 characters.
// userName.padEnd(15, "0") - it will do ad last one but only add 0 in the end of the string.

// -------------------------------------------------------
// String slicing = creating a substring from a portion of the another string.
// string.slice(start, end);
// so that string we could slice where we want by showing in index format starts from 0.

// -------------------------------------------------------
// Method Chaining = calling one method after another in the continuos line of code.

// let namE = window.prompt("Enter your name:");
// ------------- NO METHOD CHAINING -------------------

/*
name = name.trim();
let nAme = name.charAt(0);
nAme = nAme.toUpperCase();

name = name.slice(1);
let naMe = name.toLowerCase();
name = nAme + naMe;
console.log(name);
*/

// ------------- METHOD CHAINING ----------------------

// namE = namE.trim().charAt(0).toUpperCase() + namE.trim().slice(1).toLowerCase();

// -------------------------------------------------------
// Logical Operators = used to combined or manipulate bolean values. (True/False)
// And &&, Or ||, Not !.

let temp = 10;
if (30 >= temp > 0) {
  console.log("Temperature is GOOD!");
}
else {
  console.log("Temperature is BAD!");
}

// -------------------------------------------------------
// While loops = repeat some code while some condition is true.

/* let Name = "";

while (Name === "" || Name === null) {
  Name = window.prompt("Enter Your Name Please:")
}

console.log(`Hello ${Name}`);
*/

/* let loggedIn = false; // Добавляем объявление переменной

while(!loggedIn){
  let hat = window.prompt(`Enter your Name:`);
  let family = window.prompt(`Enter your password:`);

  if (hat === "ross" && family === "pass") {
    loggedIn = true;
    console.log("You have successfully logged in.");
  }
  else {
    console.log("Invalid Username or Password. Try again.");
  }
}
*/

/* let loggedIn = false; // 1. Обязательно объявляем переменную!
let attempts = 0;

while (!loggedIn && attempts < 100) {
  let hat = window.prompt("Enter your Name:");
  let family = window.prompt("Enter your password:");

  if (hat === "Rostyslav" && family === "1509") {
    loggedIn = true;
    alert("You have successfully logged in.");
    console.log("Success!");
  } else {
    attempts++;
    alert("Invalid login. Attempts left: " + (100 - attempts));
  }
}

if (!loggedIn) {
  alert("Too many failed attempts.");
}
*/

//-------------------------------------------------------
// For Loops = repeat some code limited amount of times.

/* let number = window.prompt("Enter a number that is going to be first:");
let li = window.prompt("Enter how many numbers do you want to be long of it:");
console.log(number);

for (let i = 1; i <= li; i++){
  number++;
  console.log(number);
}
*/

for (let i = 5; i > 0; i--){

  if (i == 3) {
    continue;
  }
  else if (i == 1) {
    break;
  }
  else {
    console.log(i);
  }
}
console.log("Happy New Year");


//-------------------------------------------------------
// Number Guessing Game

/*
const minNum = 1;
const maxNum = 100;
const aNswer = Math.round(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);

let att = 0;
let running = true;
let guess;


do {
  guess = window.prompt(`Guess number between 1 - 100. You had ${att} attempts`);



  if (guess == aNswer) {
    alert(`You guess it right Well Done! It was ${aNswer}`);
    running = false;
    break;
  }
  else if (guess > 100 || guess < 1 || isNaN(guess)) {
    alert(`Its must be a number between 1 - 100`);
  }
  
  let diff = Math.abs(guess - aNswer);
  
  if (diff <= 5) {
    alert("Hot like in the volcano. You are close");
    att++;
  }
  else if (diff <= 10) {
    alert("Hot. You are close");
    att++;
  }
  else if (diff <= 20) {
    alert("Warm. You are close");
    att++;
  }
  else if (diff <= 30) {
    alert("Cold.");
    att++;
  }
  else if (diff <= 40) {
    alert("Very Cold.");
    att++;
  }
  else if (diff <= 50) {
    alert("Freezing");
    att++;
  }
  else if (diff <= 60) {
    alert("Freezing");
    att++;
  }
  else if (diff <= 70) {
    alert("Freezing");
    att++;
  }
  else if (diff <= 80) {
    alert("Freezing");
    att++;
  }
  else if (diff <= 90) {
    alert("Freezing");
    att++;
  }
  else if (diff <= 100) {
    alert("Freezing");
    att++;
  }
  else {
    alert("I will die of the freeze in a sec");
  att++;
  } 
}while (running)
*/


//-------------------------------------------------------
// Temperature conversion program

const temperaturebox = document.getElementById("temperaturebox");
const toFahrenheit = document.getElementById("toFahrenheit");
const toCelsius = document.getElementById("toCelsius");
const conversionrs = document.getElementById("conversion-result");
let conversiontemp;

function convert() {
  
  if (toFahrenheit.checked) {
    conversionrs.textContent = "You Selected to Fahrenheit";
  }
  else if (toCelsius.checked) {
    conversionrs.textContent = "You selected to Celsius";
  }
  else {
    conversionrs.textContent = "Select unit";
  }
};