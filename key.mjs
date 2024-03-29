import fs from 'fs';
import readlineSync from 'readline-sync';
import jwt from 'jsonwebtoken';

// Prompt the user for their details
const name = readlineSync.question('Enter your name: ');
const email = readlineSync.question('Enter your email: ');
const organization = readlineSync.question('Enter your organization: ');

// Generate a JWT token based on the user's details
const userDetails = { name, email, organization };
const secret = 'TRAP-HUB'; // Change this to a secure secret key
const token = jwt.sign(userDetails, secret);

// Save the generated token in a token.txt file
fs.writeFileSync('token.txt', token);

// Display the generated token
console.log('Your generated token:');
console.log(token);
