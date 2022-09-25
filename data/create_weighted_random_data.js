const fs = require('fs');
const {
    cyan, red
} = require("../utils/utils.js")

const animals = ["kittycat", "cat", "dog", "bird", "dinosaur", "bewick", "finch", "chicken"]
const genders = ["girls", "boys", "men", "women"]
const letters = ["A", "B", "C", "D"]
const states = ["happy", "sad", "angry"]

let output = "i,animals,genders,letters,states"
let count = 0 
for ( let i = 0 ; i < 1000; i++ ) { 
    const a = animals[Math.floor(Math.random() * animals.length)];
    const g = genders[Math.floor(Math.random() * genders.length)];
    const l = letters[Math.floor(Math.random() * letters.length)];
    const s = states[Math.floor(Math.random() * states.length)];

    output += `\n${i},${a},${g},${l},${s}`
    count++ 
}
fs.writeFile('noise.csv', output, err => {
  if (err) {
    red("OH NO! " + err.message)
    red(err);
  } else {
    cyan("YAY wrote " + count + " to 'noise.csv'")
  }
});






