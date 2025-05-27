const LANGUAGES = ['English', 'Russian', 'German', 'French', 'Italian', 'Arabic'];
const STATUS_RANK = {
    '': 0,
    skipped: 1,
    hidden: 2,
    answered: 3,
};

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

function getSelectedQuestion(questions) {
    questions = questions.filter((q) => q.status === 'data' && q.text === 'selected');
    if (questions.length === 0) {
        return null;
    }
    console.assert(questions.length === 1, 'Only one question can be selected');
    return questions[0].translation;
}

function getQuestionStats(questions) {
    const stats = {};
    questions
        .filter((q) => q.language)
        .forEach((q) => {
            if (!stats[q.language]) {
                stats[q.language] = {
                    total: 0,
                    none: 0,
                    answered: 0,
                    skipped: 0,
                    hidden: 0,
                };
            }
            stats[q.language].total++;
            stats[q.language][q.status] += 1;
        });
    return stats;
}

function getQuestionHtml(q, selectedId, stats) {
    const stat = stats[q.language].answered + '/' + stats[q.language].total;
    return `
        <div class="question ${q.timestamp === selectedId ? 'bg-primary/10' : 'bg-base-200'} 
                rounded-box mb-5 p-5 shadow-md ${'q-' + q.status}" id="${q.timestamp}">
            <div class="q-translation">
            <div class="badge">${q.language} ${stat}</div>
                <span class="font-semibold">${q.nameTranslation ? q.nameTranslation + ': ' : ''}</span>
                ${q.translation ? q.translation : q.text}
            </div>

            <div class="q-text text-primary mt-1">
                <span class="font-semibold">${q.translation ? q.name + ': ' : ''}</span>
                <span>${q.translation ? q.text : ''}</span>
            </div>

            <div class="mt-2 flex items-center">
            <button class="btn btn-sm btn-primary ${q.timestamp === selectedId ? '' : 'btn-soft'} mr-2">Select</button>
            <button class="btn btn-sm btn-primary ${q.status === 'answered' ? '' : 'btn-soft'} mr-2">Done</button>
            <button class="btn btn-sm btn-primary ${q.status === 'skipped' ? '' : 'btn-soft'} mr-2">Skip</button>
            <button class="btn btn-sm btn-primary ${q.status === 'hidden' ? '' : 'btn-soft'}">Hide</button>
            <div class="flex-grow"></div>
            <button class="focus btn btn-soft btn-sm btn-primary" onclick="showEditQuestionForm(event)">Edit</button> 
            <button class="focus btn btn-soft btn-sm btn-error ml-1" onclick="showDeleteQuestionForm(event)">Delete</button>
            </div>
        </div>`;
}

function renderQuestions(questions) {
    const selectedId = getSelectedQuestion(questions);
    const stats = getQuestionStats(questions);
    const html = questions
        .filter((q) => q.status !== 'data')
        .sort((a, b) => {
            if (STATUS_RANK[a.status] !== STATUS_RANK[b.status]) {
                return STATUS_RANK[a.status] - STATUS_RANK[b.status];
            }
            b.timestamp - a.timestamp;
        })
        .map((q) => getQuestionHtml(q, selectedId, stats))
        .join('');
    document.getElementById('questions').innerHTML = html;
    showElements();
}

function showLoadingAlert(msg = 'Loading...') {
    const loadingElem = document.getElementById('loading-alert');
    const successElem = document.getElementById('success-alert');
    const errorElem = document.getElementById('error-alert');
    loadingElem.querySelector('.msg').innerHTML = msg;
    loadingElem.classList.remove('hidden');
    successElem.classList.add('hidden');
    errorElem.classList.add('hidden');
}

function showSuccessAlert(msg = 'Success!', time = 3000) {
    const loadingElem = document.getElementById('loading-alert');
    const successElem = document.getElementById('success-alert');
    const errorElem = document.getElementById('error-alert');
    successElem.querySelector('.msg').innerHTML = msg;
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
    errorElem.querySelector('.msg').innerHTML = msg;
    loadingElem.classList.add('hidden');
    successElem.classList.add('hidden');
    errorElem.classList.remove('hidden');
    setTimeout(() => {
        errorElem.classList.add('hidden');
    }, time);
}

function showEditQuestionForm(e) {
    const questionId = e.target.closest('.question').id;
    const q = questions.find((q) => q.timestamp === questionId);
    if (!q) {
        showErrorAlert('Error: Question not found');
        return;
    }
    const modal = document.getElementById('edit-question-modal');
    modal.querySelector('.q-timestamp').innerText = questionId;
    modal.querySelector('.q-text').value = q.text;
    modal.querySelector('.q-translation').value = q.translation;
    modal.querySelector('.q-language').value = q.language;
    modal.querySelector('.q-name').value = q.name;
    modal.querySelector('.q-version').innerText = q.version;
    modal.showModal();
}

function showDeleteQuestionForm(e) {
    const questionId = e.target.closest('.question').id;
    const q = questions.find((q) => q.timestamp === questionId);
    console.log(e, questionId, q);
    if (!q) {
        showErrorAlert('Error: Question not found ' + questionId);
        return;
    }
    const modal = document.getElementById('delete-question-modal');
    modal.querySelector('.question-timestamp').innerText = questionId;
    modal.showModal();
}

if (typeof google === 'undefined') {
    window.google = googleMock;
}

let questions = [];

(async () => {
    renderLanguages();
    showElements();

    document
        .querySelectorAll('.show-toggle')
        .forEach((elem) => elem.addEventListener('click', showElements));

    //  setInputElements();
    //  document
    //      .querySelectorAll('.url-param')
    //      .forEach((elem) => elem.addEventListener('change', updateUrlParam));

    document.getElementById('add-question').addEventListener('click', async () => {
        const q = {
            name: document.getElementById('add-q-name').value,
            text: document.getElementById('add-q-text').value,
            translation: document.getElementById('add-q-translation').value,
            language: document.getElementById('add-q-language').value,
        };

        if (!q.text) {
            showErrorAlert('Please specify question text');
            return;
        }

        addQuestion(q);
    });

    questions = await getAllQuestions();
    renderQuestions(questions);
    showElements();

    setInterval(async () => {
        questions = await getAllQuestions();
        renderQuestions(questions);
        showElements();
    }, 5000);
})();
