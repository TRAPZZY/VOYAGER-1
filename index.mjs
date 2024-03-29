import fs from 'fs';
import chalk from 'chalk';
import Table from 'cli-table3';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import readlineSync from 'readline-sync';
import { exec } from 'child_process';

// Function to read the JWT token from a file
function readToken() {
    try {
        return fs.readFileSync('token.txt', 'utf8').trim();
    } catch (err) {
        console.error(chalk.red(`Failed to read token: ${err.message}`));
        process.exit(1);
    }
}

// Function to validate the JWT token
function validateToken(token, secret) {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

// Function to read content from an HTML file
function readFromHTMLFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(chalk.red(`Failed to read HTML file at path ${filePath}: ${err.message}`));
        process.exit(1);
    }
}

// Function to verify email format
function verifyEmail(email) {
    // Regular expression to validate email format
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Function to send SMS (example implementation, replace with your actual SMS sender implementation)
function sendSMS(phoneNumber, message) {
    console.log(chalk.bold.green(`Sending SMS to ${phoneNumber}: ${message}`));
    // Implement your SMS sending logic here
}

// Prompt the user to enter the JWT token
let token = readlineSync.question(chalk.bold.yellow('Enter your JWT token: '));

// Validate the JWT token
const secret = 'TRAP-HUB'; // Change this to the same secret key used for generating the token
let decodedToken = validateToken(token, secret);

// Keep prompting the user until a valid token is entered
while (!decodedToken) {
    console.log(chalk.red('Invalid token. Please enter a valid token or contact trapzzy for assistance.'));
    token = readlineSync.question(chalk.bold.yellow('Enter your JWT token: '));
    decodedToken = validateToken(token, secret);
}

// Clear the screen
console.clear();

// Display welcome message
console.log(chalk.bold.green('Welcome to the Advanced Office 365 Sender Tool!\n'));

// Display options for the user
console.log(chalk.bold.green('Choose an option:'));
console.log('1. Advanced Email Sender');
console.log('2. Advanced SMS Sender');

// Get user's choice
const choice = readlineSync.question(chalk.bold.yellow('Enter your choice: '));

// Handle user's choice
switch (choice) {
    case '1':
        // Email sender
        console.log('You chose Advanced Email Sender.');

        // Define file paths
        const contentFilePath = 'content.html';
        const leadsFilePath = 'leads.txt';
        const nonValidEmailsFilePath = 'non-valid-emails.txt';

        // Read content from files
        const emailContent = readFromHTMLFile(contentFilePath);
        const leads = fs.readFileSync(leadsFilePath, 'utf8').split('\n').map(lead => lead.trim()).filter(lead => lead !== '');

        // Configure SMTP transporter with pool option
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: 'traphubs@outlook.com',
                pass: 'Maxwellonyia1!!'
            },
            tls: {
                ciphers: 'SSLv3'
            },
            pool: true, // Enable pooling
            maxConnections: 1 // Maximum number of parallel connections
        });

        // Display project name and author
        console.log(chalk.bold.green('********************************************'));
        console.log(chalk.bold.green('*                                          *'));
        console.log(chalk.bold.green('*          Project Name: VOYAGER 1         *'));
        console.log(chalk.bold.green('*          Author:       trapzzy           *'));
        console.log(chalk.bold.green('*                                          *'));
        console.log(chalk.bold.green('********************************************\n'));

        // Display email content
        console.log(chalk.bold.green('Email Content: ') + chalk.bold.blue.italic('content.html\n'));

        // Display leads in a table format
        console.log(chalk.bold.green('Leads:\n'));
        const leadTable = new Table({
            head: ['Lead', 'Valid'],
            colWidths: [30, 10]
        });

        leads.forEach(lead => {
            const isValid = verifyEmail(lead);
            leadTable.push([lead, isValid ? 'Yes' : 'No']);
        });

        console.log(leadTable.toString());

        // Ask for subject
        const subject = readlineSync.question(chalk.bold.yellow('Enter email subject: '));

        // Send emails to valid leads
        console.log(chalk.bold.green('\nSending emails...\n'));
        const emailResultsTable = new Table({
            head: ['Lead', 'Status', 'Date', 'Time', 'Verified'],
            colWidths: [30, 15, 15, 15, 10]
        });

        // An array to store promises for each email sent
        const emailPromises = leads.map(lead => {
            const isValid = verifyEmail(lead);
            const dateTime = new Date().toLocaleString();

            if (isValid) {
                const mailOptions = {
                    from: 'traphubs@outlook.com',
                    to: lead,
                    subject: subject,
                    html: emailContent,
                    attachments: [{
                        filename: 'attachment.txt',
                        content: fs.createReadStream('C:\\Users\\Dell\\Desktop\\1.txt')
                    }]
                };

                // Return a promise for sending the email
                return new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error, info) => {
                        const status = error ? 'Failed' : 'Success';
                        const verified = error ? 'No' : 'Yes';
                        const statusColor = error ? chalk.red(status) : chalk.green(status);
                        emailResultsTable.push([lead, statusColor, dateTime.split(',')[0], dateTime.split(',')[1], chalk.green(verified)]);
                        if (error) {
                            console.error(chalk.red(`Failed to send email to ${lead}: ${error.message}`));
                            reject(error);
                        } else {
                            resolve(info);
                        }
                    });
                });
            } else {
                // Save non-valid email to file
                fs.appendFileSync(nonValidEmailsFilePath, `${lead}\n`, 'utf8');
                return Promise.resolve(); // Return a resolved promise for non-valid emails
            }
        });

        // Wait for all emails to be sent before displaying the results
        Promise.all(emailPromises)
            .then(() => {
                // Display email sending results
                console.log('\nEmail Sending Results:\n');
                console.log(emailResultsTable.toString());
            })
            .catch(error => {
                console.error(chalk.red('An error occurred while sending emails:', error));
            });

        break;
    case '2':
    // SMS sender
    console.log('You chose Advanced SMS Sender.');

    // Import and execute sms-sender.mjs
    import('./sms-sender.mjs').then((module) => {
        module.default();
    }).catch((err) => {
        console.error(chalk.red(`Failed to import sms-sender.mjs: ${err.message}`));
        process.exit(1);
    });

    break;
}