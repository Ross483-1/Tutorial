let loggedIn = false; // 1. Обязательно объявляем переменную!
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