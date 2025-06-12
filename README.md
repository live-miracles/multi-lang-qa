# Multi Language QA

<img width="979" alt="Screenshot 2025-06-10 at 20 59 07" src="https://github.com/user-attachments/assets/7903406f-7e0c-43fd-9bae-f3f47e565a96" />

This is an App Script app that uses a Google Sheet as a database. People can submit questions with translations, and the host can star, hide or mark any of the questions as completed.

## Demo

A demo of the website is available at (live-miracles.github.io/multi-lang-qa/)[https://live-miracles.github.io/multi-lang-qa/], but all the changes will be gone after the refresh.

## Steps to create Apps Script webpage

If you want ot collaborate with others you will need to create an Apps Script (it is free).

1. Go to (script.google.com/home)[https://script.google.com/home].
2. Create a new project.
3. Modify `Code.gs` file, you can copy/paste the `Code.js` file from this repo.
4. Create a new `Index.html` file, you can copy/paste the `index.html` file from this repo.
5. Go to **Project Settings** and add a new script property named `SPREADSHEET_ID`, and put the ID of your google spreadsheet (you can find it in the URL).
6. Click the **Deploy** button -> New deployment -> Web app -> Execute as Me; Anyone with Google account can have access.
7. Done, a link to access you new Web app will appear!
