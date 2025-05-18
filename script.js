import { googleMock } from './test-utils.js';
import { showElements } from './tools.js';

const LANGUAGES = ['English', 'Russian', 'German', 'French', 'Italian', 'Arabic'];

class Question {
    constructor(q) {
        this.timestamp = q.timestamp;
        this.name = q.name;
        this.language = q.language;
        this.text = q.text;
        this.translation = q.translation;
        this.answered = q.answered;
        this.skipped = q.skipped;
        this.hidden = q.hidden;
        this.version = q.version;
    }
}

function renderLanguages() {
    const html = LANGUAGES.map(
        (lang) => `
            <option value="${lang}">${lang}</option>`,
    ).join('');
    document.querySelectorAll('.language-select').forEach((el) => (el.innerHTML += html));
}

function renderQuestions(questions) {
    const html = questions
        .map(
            (q) => `
            <div class="question bg-base-200 rounded-box mb-5 p-5 shadow-md ${q.status ? 'q-' + q.status : ''}">
              <div class="q-translation">
                <div class="badge">${q.language}</div>
                <span class="font-semibold">${q.name ? q.name + ': ' : ''}</span>
                ${q.translation ? q.translation : q.text}
              </div>

              <div class="q-text mt-1">
                <span class="text-primary">${q.translation ? q.text : ''}</span>
              </div>
                  
              <div class="mt-2 flex items-center">
                <button class="btn btn-sm btn-primary ${q.status === 'answered' ? '' : 'btn-soft'} mr-2">Answer</button>
                <button class="btn btn-sm btn-primary ${q.status === 'skipped' ? '' : 'btn-soft'} mr-2">Skip</button>
                <button class="btn btn-sm btn-primary ${q.status === 'hidden' ? '' : 'btn-soft'}">Hide</button>
                <div class="flex-grow"></div>
                <button class="btn btn-soft btn-sm btn-primary">Edit</button> 
                <button class="btn btn-soft btn-sm btn-error ml-1">Delete</button>
              </div>
            </div>`,
        )
        .join('');
    document.getElementById('questions').innerHTML = html;
}

function showLoadingAlert(msg = 'Loading...') {
    const loadingElem = document.getElementById('loading-alert');
    const successElem = document.getElementById('success-alert');
    const errorElem = document.getElementById('error-alert');
    loadingElem.innerHTML = msg;
    loadingElem.classList.remove('hidden');
    successElem.classList.add('hidden');
    errorElem.classList.add('hidden');
}

function showSuccessAlert(msg = 'Success!', time = 3000) {
    const loadingElem = document.getElementById('loading-alert');
    const successElem = document.getElementById('success-alert');
    const errorElem = document.getElementById('error-alert');
    successElem.innerHTML = msg;
    loadingElem.classList.add('hidden');
    successElem.classList.remove('hidden');
    errorElem.classList.add('hidden');
    setTimeout(() => {
        successElem.classList.add('hidden');
    }, time);
}

function showErrorAlert(msg = 'Error', time = 5000) {
    const loadingElem = document.getElementById('loading-alert');
    const successElem = document.getElementById('success-alert');
    const errorElem = document.getElementById('error-alert');
    errorElem.innerHTML = msg;
    loadingElem.classList.add('hidden');
    successElem.classList.add('hidden');
    errorElem.classList.remove('hidden');
    setTimeout(() => {
        errorElem.classList.add('hidden');
    }, time);
}

async function getAllQuestions() {
    showLoadingAlert('Loading questions...');
    try {
        const list = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .getAllQuestions();
        });
        showSuccessAlert('Questions loaded successfully!');
        return list;
    } catch (error) {
        showErrorAlert('Error loading questions: ' + error);
        console.error(error);
        return [];
    }
}

function addQuestion() {}

if (typeof google === 'undefined') {
    window.google = googleMock;
}

(async () => {
    renderLanguages();

    const questions = await getAllQuestions();
    renderQuestions(await getAllQuestions());

    showElements();
    document
        .querySelectorAll('.show-toggle')
        .forEach((elem) => elem.addEventListener('click', showElements));
})();
