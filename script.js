const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Function to store data in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Function to retrieve data from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Function to clear the local storage
function clearStorage() {
  localStorage.clear();
}

// Function to generate a random 3-digit number
function getRandomArbitrary(min, max) {
  const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
  return randomNum;
}

// Function to generate a SHA256 hash of a given string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Function to get the SHA256 hash of the random 3-digit number
async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (cached) {
    return cached;
  }

  const randomPin = getRandomArbitrary(MIN, MAX).toString();
  const hashedValue = await sha256(randomPin);
  store('sha256', hashedValue);
  store('pin', randomPin); // Store the pin for debugging or testing
  return hashedValue;
}

// Main function to initialize and display the SHA256 hash
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Function to test if the entered pin matches the stored hash
async function test() {
  const pin = pinInput.value;

  // Validate pin length
  if (pin.length !== 3) {
    resultView.innerHTML = '💡 Please enter a valid 3-digit number.';
    resultView.classList.remove('success', 'hidden');
    return;
  }

  // Hash the user input
  const hashedPin = await sha256(pin);
  const storedHash = sha256HashView.innerHTML;

  // Compare the hashes
  if (hashedPin === storedHash) {
    resultView.innerHTML = '🎉 Correct! You guessed the number!';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Incorrect. Try again!';
  }
  resultView.classList.remove('hidden');
}

// Ensure pinInput only accepts numbers and is limited to 3 digits
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach the test function to the button
document.getElementById('check').addEventListener('click', test);

// Run the main function to initialize the hash display
main();