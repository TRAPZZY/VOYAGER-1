import fs from 'fs';
import chalk from 'chalk';
import Table from 'cli-table3';
import { parsePhoneNumberFromString, isValidNumber, getNumberType } from 'libphonenumber-js';
import readlineSync from 'readline-sync';

// Function to display a table with carrier network options
function displayCarrierNetworkOptions() {
    const table = new Table();
    table.push(
        { '1. AT&T': 'AT&T' },
        { '2. Verizon': 'Verizon' },
        { '3. T-Mobile': 'T-Mobile' },
        { '4. Sprint': 'Sprint' }
    );
    console.log(table.toString());
}

// Function to display a table with lead validation results
function displayLeadValidationResults(leads) {
    const table = new Table({
        head: ['Lead', 'Country Code', 'Valid'],
        colWidths: [20, 20, 10]
    });

    leads.forEach(lead => {
        const phoneNumber = parsePhoneNumberFromString(lead);
        const isValid = phoneNumber ? isValidNumber(phoneNumber) : false;
        const countryCode = phoneNumber ? phoneNumber.countryCallingCode : '';
        const leadType = phoneNumber ? getNumberType(phoneNumber) : '';
        table.push([lead, countryCode, isValid ? 'Yes' : 'No']);
    });

    console.log(table.toString());
}

// Function to validate a phone number
function validatePhoneNumber(number) {
    try {
        const phoneNumber = parsePhoneNumberFromString(number);
        return {
            valid: phoneNumber ? isValidNumber(phoneNumber) : false,
            carrier: phoneNumber ? phoneNumber.getPhoneType().toString() : 'Unknown'
        };
    } catch (error) {
        return { valid: false, carrier: 'Unknown' };
    }
}

// Prompt the user to choose a carrier network
console.log(chalk.bold.green('Choose your carrier network:'));
displayCarrierNetworkOptions();
const carrierChoice = readlineSync.question(chalk.bold.yellow('Enter your choice: '));

// Map the carrier choice to the carrier name
let carrierName;
switch (carrierChoice) {
    case '1':
        carrierName = 'AT&T';
        break;
    case '2':
        carrierName = 'Verizon';
        break;
    case '3':
        carrierName = 'T-Mobile';
        break;
    case '4':
        carrierName = 'Sprint';
        break;
    default:
        console.log(chalk.red('Invalid carrier choice. Exiting...'));
        process.exit(1);
}

// Prompt the user to enter the path to the leads file
const leadsPath = readlineSync.question(chalk.bold.yellow('Enter the path to the leads file: '));

// Read and validate the leads
const leads = fs.readFileSync(leadsPath, 'utf8').split('\n').map(lead => lead.trim()).filter(lead => lead !== '');
console.clear();
console.log(chalk.bold.green('Lead Validation Results:\n'));
displayLeadValidationResults(leads);

// Display leads in a table format
console.log(chalk.bold.green('Leads:\n'));
const leadTable = new Table({
    head: ['Phone Number', 'Valid', 'Carrier'],
    colWidths: [30, 10, 20]
});

leads.forEach(lead => {
    const { valid, carrier } = validatePhoneNumber(lead);
    leadTable.push([lead, valid ? 'Yes' : 'No', carrier]);
});

console.log(leadTable.toString());

// Prompt the user for the path to the message file
const messageFilePath = readlineSync.question(chalk.bold.yellow('Enter the path to the message file (e.g., message.txt): '));

// Read the message from the message file
const message = fs.readFileSync(messageFilePath, 'utf8');

// Clear the screen
console.clear();

// Send SMS messages
console.log(chalk.bold.green('Sending SMS messages...\n'));
const smsResultsTable = new Table({
    head: ['Phone Number', 'Status', 'Date', 'Time', 'Carrier'],
    colWidths: [30, 15, 15, 15, 20]
});

leads.forEach(lead => {
    const { valid, carrier } = validatePhoneNumber(lead);
    if (valid && carrier === carrierName) {
        const dateTime = new Date().toLocaleString();
        sendSMS(lead, message);
        smsResultsTable.push([lead, 'Success', dateTime.split(',')[0], dateTime.split(',')[1], carrier]);
    } else {
        smsResultsTable.push([lead, 'Failed', '-', '-', carrier]);
    }
});

console.log(smsResultsTable.toString());
