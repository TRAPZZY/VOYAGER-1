# VOYAGER 1 - Advanced Office-365 Sender Tool

Voyager 1 is an advanced command-line tool developed by **trapzzy** in Node.js that allows users to send emails and SMS messages in an advanced and customizable way.

## TOKEN IS NEEDED TOO RUN THIS SCRIPT
==>**contact trapzzy for your token**


## Features

- **Email Sender**: Send emails to a list of leads with customizable content and attachments.
- **SMS Sender**: Send SMS messages to a list of phone numbers with customizable messages.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/voyager-1.git
   ```

2. Install dependencies:

   ```bash
   cd voyager-1
   npm install
   ```

3. Configure SMTP settings:

   - Open `index.mjs` and `sms-sender.mjs` files.
   - Update the SMTP settings in `index.mjs` for the email sender.
   - Update the carrier settings in `sms-sender.mjs` for the SMS sender.

## Requirements

- Node.js
- npm (Node Package Manager)

## Dependencies

- [cli-table3](https://www.npmjs.com/package/cli-table3): For creating ASCII tables in the terminal.
- [chalk](https://www.npmjs.com/package/chalk): For styling console output.
- [libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js): For phone number validation and formatting.
- [nodemailer](https://www.npmjs.com/package/nodemailer): For sending emails.

## Usage

### Email Sender

1. Run the tool:

   ```bash
   node index.mjs
   ```

2. Choose option `1` for the Email Sender.

3. Enter your JWT token when prompted.

4. Follow the on-screen instructions to send emails.

### SMS Sender

1. Run the tool:

   ```bash
   node index.mjs
   ```

2. Choose option `2` for the SMS Sender.

3. Follow the on-screen instructions to send SMS messages.

## Configuration

- **JWT Token**: A JWT token is required for authentication. You can generate a token using the `jsonwebtoken` library.
- **SMTP Settings**: Configure the SMTP settings in `index.mjs` for the email sender.
- **Carrier Settings**: Configure the carrier settings in `sms-sender.mjs` for the SMS sender.

## Files

- `index.mjs`: Main script for the Voyager 1 - Advanced Office 365 Sender Tool.
- `sms-sender.mjs`: Script for sending SMS messages.
- `content.html`: HTML content for the email sender.
- `leads.txt`: List of leads for the email sender.
- `non-valid-emails.txt`: List of non-valid emails.

## Contributing

Contributions are welcome! Fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

