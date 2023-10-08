// 1. select all useable element

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
// const passwordlength = document.querySelector('[data-length]');
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

const symbols = "~!@#$%^&*{}[]|?:<>";

// 2.set default values
let password = "";
let passwordlength = 10;
let checkCount = 0;
// set strength color to grey
setIndicator("#ccc");

// set password length
function handleSlider() {
  inputSlider.value = passwordlength;
  lengthDisplay.innerText = passwordlength;
  const max = inputSlider.max;
  const min = inputSlider.min;
  inputSlider.style.backgroundSize = ((passwordlength-min)*100/(max-min)) + "% 100%";

}
handleSlider();

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  // it print min to max random integer number
  // but it includes min number and exclude max number
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 10);
}

function generateUpperCase() {
  // String.fromCharCode() is method to convert number(ascii number) into a character
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateSymbol() {
  const rndNum = getRandomInteger(0, symbols.length);
  return symbols.charAt(rndNum);
}

function calculateStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNum || hasSym) &&
    passwordlength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// async and await used for asychronously work of code
// first copy the content and then show "copied" text
async function copyContent() {
  // try and catch method used for error handling

  try {
    // navigator.clipboard.writeText(je content ne copy karvano hoy ae) is method to copy the content/text to the clipboard
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }

  // to make copied msg in span is visible
  copyMsg.classList.add("active");

  // to remove copied text after 2 second of visibility
  setTimeout(() => {
    copyMsg.classList.remove("active");
    copyMsg.innerText = "";
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordlength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if(passwordDisplay.value){
      copyContent();
  }
  // // or
  // if (passwordlength > 0) {
  //   copyContent();
  // }
});

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  // special condition
  if (passwordlength < checkCount) {
    passwordlength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});


function shufflePassword(array){
    // Fisher yates method
    for (let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener("click", () => {
  // none of the checkbox are selected
  if (checkCount <= 0) return;

  // special condition
  if (passwordlength < checkCount) {
    passwordlength = checkCount;
    handleSlider();
  }

  // // * let's start the journey to find new password

  // remove old password
  password = "";

  // // let's put the stuff mentioned by checkboxes

  // if(uppercaseCheck.checked) {
  //     password += generateUpperCase();
  // }
  // if(lowercaseCheck.checked) {
  //     password += generateLowerCase();
  // }
  // if(numbersCheck.checked) {
  //     password += generateRandomNumber();
  // }
  // if(symbolsCheck.checked) {
  //     password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  // compulsory addition
  for(let i=0; i<funcArr.length; i++) {
    password += funcArr[i]();
  }

  // remaining addition
  for(let i=0; i<passwordlength-funcArr.length; i++) {
    let randomIndex = getRandomInteger(0,funcArr.length);
    password += funcArr[randomIndex]();
  }

  // shuffle the password
  password = shufflePassword(Array.from(password));

  // show on UI
  passwordDisplay.value = password;

  // calculate strength
  calculateStrength();

});
