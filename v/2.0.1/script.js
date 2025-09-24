const LANGUAGES = ['English', 'Russian', 'German', 'French', 'Italian', 'Arabic'];
const LANGUAGE_MAP = {
    English: 'en',
    Russian: 'ru',
    German: 'de',
    French: 'fr',
    Italian: 'it',
    Arabic: 'ar',
};
const STATS = ['total', 'none', 'answered', 'hidden'];

function renderLanguages() {
    const html = LANGUAGES.map(
        (lang) => `
            <option value="${lang}">${lang}</option>`,
    ).join('');
    document.querySelectorAll('.language-select').forEach((el) => (el.innerHTML += html));
}

function getSelectedId(questions) {
    if (questions.length === 0) {
        console.error('No questions available');
        return -1;
    }
    if (questions[0].status !== 'data' || questions[0].name !== 'selected') {
        console.error('Selected question is missing');
        return -1;
    }
    return questions[0].text;
}

function setSelectedId(questions, timestamp) {
    if (questions.length === 0) {
        console.error('No questions available');
    }
    if (questions[0].status !== 'data' || questions[0].name !== 'selected') {
        console.error('Selected question is missing');
    }
    questions[0].text = timestamp;
}

function getQuestionStats(questions) {
    const stats = {
        All: Object.fromEntries(STATS.map((k) => [k, 0])),
    };
    questions
        .filter((q) => q.language)
        .forEach((q) => {
            if (!stats[q.language]) {
                stats[q.language] = Object.fromEntries(STATS.map((k) => [k, 0]));
            }
            stats[q.language]['total']++;
            stats[q.language][q.status]++;
            stats['All']['total']++;
            stats['All'][q.status]++;
        });
    return stats;
}

function getQuestionHtml(q, selectedId, stats) {
    const stat = stats[q.language]?.answered + '/' + stats[q.language]?.total;
    const starUrl = 'https://live-miracles.github.io/multi-lang-qa/star-solid.svg';
    return `
        <div class="question relative bg-base-200 rounded-box mb-5 p-2 shadow-md ${'q-' + q.status}"
            id="${q.timestamp}">
          ${
              q.timestamp === selectedId
                  ? `
              <img src="${starUrl}" class="absolute w-[10%] left-[60%] top-[50%] -translate-x-1/2 -translate-y-1/2 transform opacity-25 pointer-events-none" />
              <img src="${starUrl}" class="absolute w-[5%] left-[10%] top-[25%] -translate-x-1/2 -translate-y-1/2 transform opacity-15 pointer-events-none" />
              <img src="${starUrl}" class="absolute w-[5%] left-[30%] top-[80%] -translate-x-1/2 -translate-y-1/2 transform opacity-20 pointer-events-none" />
              <img src="${starUrl}" class="absolute w-[8%] left-[85%] top-[40%] -translate-x-1/2 -translate-y-1/2 transform opacity-30 pointer-events-none" />
              <img src="${starUrl}" class="absolute w-[7%] left-[40%] top-[30%] -translate-x-1/2 -translate-y-1/2 transform opacity-20 pointer-events-none" />`
                  : ''
          }
          <div class="q-translation z-10">
            <span class="font-semibold">${q.nameTranslation ? q.nameTranslation + ': ' : ''}</span>
            ${q.translation ? q.translation : q.text}
          </div>

          <div class="q-text text-primary mt-1 z-10">
            <span class="font-semibold">${q.translation && q.name ? q.name + ': ' : ''}</span>
            <span>${q.translation ? q.text : ''}</span>
          </div>

          <div class="mt-2 flex items-center z-10">
            <label class="swap mr-2">
              <input type="checkbox" ${q.timestamp === selectedId ? 'checked' : ''} onchange="updateSelected(event)" />
              <div class="swap-on badge badge-warning">★</div>
              <div class="swap-off badge badge-warning badge-soft">★</div>
            </label>

            <label class="swap mr-2 z-10">
              <input type="checkbox" ${q.status === 'answered' ? 'checked' : ''} onchange="updateStatus(event)" />
              <div class="swap-on badge badge-primary">Done</div>
              <div class="swap-off badge badge-primary badge-soft">Done</div>
            </label>

            <label class="swap mr-2 z-10">
              <input type="checkbox" ${q.status === 'hidden' ? 'checked' : ''} onchange="updateStatus(event)" />
              <div class="swap-on badge badge-primary">Hide</div>
              <div class="swap-off badge badge-primary badge-soft">Hide</div>
            </label>

            <div class="badge z-10">${q.language} (${stat})</div>
            <div class="flex-grow"></div>

            <button class="edit-q-btn focus btn btn-soft btn-sm btn-primary z-10" onclick="showEditQuestionForm(event)">✎</button>
            <button class="focus btn btn-soft btn-sm btn-error ml-1 z-10" onclick="showDeleteQuestionForm(event)">✕</button>
          </div>
        </div>`;
}

async function renderQuestions(questions) {
    if (questions === null) {
        return;
    }
    const stats = getQuestionStats(questions);
    const filterLang = document.getElementById('filter-q-language');
    for (let i = 0; i < filterLang.options.length; i++) {
        const option = filterLang.options[i];
        const val = option.value;
        if (!stats[val]) {
            option.classList.add('hidden');
        } else {
            const text = `${val} (${stats[val].answered}/${stats[val].total})`;
            if (option.text != text) {
                // otherwise the dropdown refreshes even if no changes
                option.text = text;
            }
            option.classList.remove('hidden');
        }
    }

    const noQ = document.getElementById('no-questions');
    if (questions.filter((q) => q.status !== 'data').length === 0) {
        noQ.classList.remove('hidden');
    } else {
        noQ.classList.add('hidden');
    }

    const deleteAllQ = document.getElementById('delete-all');
    if (questions.filter((q) => q.status !== 'data').length > 1) {
        deleteAllQ.style.display = '';
    } else {
        deleteAllQ.style.display = 'none';
    }

    const selectedId = getSelectedId(questions);
    const html = questions
        .filter((q) => q.timestamp !== '' && q.status !== 'data')
        .filter((q) => filterLang.value === 'All' || filterLang.value === q.language)
        .map((q) => getQuestionHtml(q, selectedId, stats))
        .join('');
    document.getElementById('questions').innerHTML = html;
    showElements();
}

async function fetchAndRenderQuestions() {
    if (Date.now() - updateTime > 5000) {
        const newQuestions = await getAllQuestions();
        if (Date.now() - updateTime > 5000) {
            questions = newQuestions;
            renderQuestions(questions);
        }
    }
}

function showSavingBadge(show) {
    const elem = document.getElementById('saving-badge');
    elem.checked = show;
}

function showSuccessAlert(msg = 'Success!', time = 3000) {
    const successElem = document.getElementById('success-alert');
    const errorElem = document.getElementById('error-alert');
    successElem.querySelector('.msg').innerHTML = msg;
    showSavingBadge(false);
    successElem.classList.remove('hidden');
    errorElem.classList.add('hidden');
    setTimeout(() => {
        successElem.classList.add('hidden');
    }, time);
}

function showErrorAlert(msg = 'Error', time = 5000) {
    console.error(msg);
    const successElem = document.getElementById('success-alert');
    const errorElem = document.getElementById('error-alert');
    errorElem.querySelector('.msg').innerHTML = msg;
    showSavingBadge(false);
    successElem.classList.add('hidden');
    errorElem.classList.remove('hidden');
    setTimeout(() => {
        errorElem.classList.add('hidden');
    }, time);
}

function hideAlerts() {
    showSavingBadge(false);
    const successElem = document.getElementById('success-alert');
    const errorElem = document.getElementById('error-alert');
    successElem.classList.add('hidden');
    errorElem.classList.add('hidden');
}

function showEditQuestionForm(e) {
    const timestamp = e.target.closest('.question').id;
    const q = questions.find((q) => q.timestamp === timestamp);
    if (!q) {
        showErrorAlert('Error: Question not found ' + timestamp);
        return;
    }
    const modal = document.getElementById('edit-q-modal');
    modal.querySelector('.q-timestamp').value = timestamp;
    modal.querySelector('.q-language').value = q.language;
    modal.querySelector('.q-name').value = q.name;
    modal.querySelector('.q-name-translation').value = q.nameTranslation;
    modal.querySelector('.q-text').value = q.text;
    modal.querySelector('.q-translation').value = q.translation;
    modal.showModal();
}

function showDeleteQuestionForm(e) {
    const timestamp = e.target.closest('.question').id;
    const modal = document.getElementById('delete-q-modal');
    modal.querySelector('.q-timestamp').value = timestamp;
    modal.showModal();
}

function showDeleteAllQuestionsForm() {
    const modal = document.getElementById('delete-all-q-modal');
    modal.querySelector('.confirm-text').value = '';
    modal.showModal();
}

async function updateStatus(e) {
    const timestamp = e.target.closest('.question').id;
    const status = {
        Done: 'answered',
        Hide: 'hidden',
    }[e.target.nextElementSibling.innerText];

    const q = questions.find((q) => q.timestamp === timestamp);
    if (!q) {
        showErrorAlert('Error: Question not found ' + timestamp);
        return;
    }
    q.status = e.target.checked ? status : 'none';

    updateTime = Date.now();
    renderQuestions(questions);
    await updateQuestionStatus(q);
}

async function updateSelected(e) {
    const timestamp = e.target.closest('.question').id;
    if (!questions.find((q) => q.timestamp === timestamp)) {
        showErrorAlert('Error: Question not found ' + timestamp);
        return;
    }

    const newSelectedId = e.target.checked ? timestamp : '-1';
    setSelectedId(questions, newSelectedId);

    updateTime = Date.now();
    renderQuestions(questions);
    await updateSelectedQuestion(newSelectedId);
    updateTime = Date.now();
}

if (typeof google === 'undefined') {
    window.google = googleMock;
}

let questions = [];
let updateTime = 0;

(async () => {
    renderLanguages();
    showElements();

    document
        .querySelectorAll('.show-toggle')
        .forEach((elem) => elem.addEventListener('click', showElements));

    document
        .getElementById('filter-q-language')
        .addEventListener('change', () => renderQuestions(questions));

    document.querySelectorAll('.q-name').forEach((elem) =>
        elem.addEventListener('change', (e) => {
            const input = e.target;
            const translInput = input.closest('.q-form').querySelector('.q-name-translation');
            translInput.value = transliterate(input.value.trim());
        }),
    );

    document.getElementById('translate-q-btn').addEventListener('click', async (e) => {
        const container = e.target.closest('.q-form');
        const language = container.querySelector('.q-language').value;
        const lang = LANGUAGE_MAP[language];
        const text = container.querySelector('.q-text').value.trim();
        if (!text) {
            showErrorAlert("Can't translate empty text :)");
            return;
        }
        if (lang === 'en') {
            showErrorAlert('Please select a different language :)');
            return;
        }
        container.querySelector('.q-translation').value = 'Translating...';
        const translation = await getTranslation(text, lang);
        container.querySelector('.q-translation').value = translation;
    });

    document.getElementById('add-q-btn').addEventListener('click', async (e) => {
        const container = e.target.closest('.q-form');
        const newQ = {
            language: container.querySelector('.q-language').value.trim(),
            name: container.querySelector('.q-name').value.trim(),
            nameTranslation: container.querySelector('.q-name-translation').value.trim(),
            text: container.querySelector('.q-text').value.trim(),
            translation: container.querySelector('.q-translation').value.trim(),
        };
        if (!newQ.text) {
            showErrorAlert('Please specify question text');
            return;
        }

        if (!newQ.translation && newQ.language !== 'English') {
            showErrorAlert('Please add translation for non-English questions');
            return;
        }

        e.target.setAttribute('disabled', 'disabled');
        const res = await addQuestion(newQ);
        if (res.success) {
            container.querySelector('.q-name').value = '';
            container.querySelector('.q-text').value = '';
            container.querySelector('.q-name-translation').value = '';
            container.querySelector('.q-translation').value = '';
        }
        e.target.removeAttribute('disabled');
        fetchAndRenderQuestions();
    });

    document.getElementById('update-q-btn').addEventListener('click', async (e) => {
        const container = e.target.closest('.modal-box');
        const newQ = {
            timestamp: container.querySelector('.q-timestamp').value.trim(),
            language: container.querySelector('.q-language').value.trim(),
            name: container.querySelector('.q-name').value.trim(),
            nameTranslation: container.querySelector('.q-name-translation').value.trim(),
            text: container.querySelector('.q-text').value.trim(),
            translation: container.querySelector('.q-translation').value.trim(),
        };
        if (!newQ.text) {
            showErrorAlert('Please specify question text');
            return;
        }

        const index = questions.findIndex((q) => q.timestamp === newQ.timestamp);
        if (index === -1) {
            showErrorAlert('Something went wrong :(');
            return;
        }
        updateTime = Date.now();
        Object.assign(questions[index], newQ);
        renderQuestions(questions);
        const qEditBtn = document.getElementById(newQ.timestamp).querySelector('.edit-q-btn');
        if (!qEditBtn) {
            showErrorAlert('Something went wrong :(');
            return;
        }
        qEditBtn.setAttribute('disabled', 'disabled');
        await updateQuestion(newQ);
    });

    document.getElementById('delete-q-btn').addEventListener('click', async (e) => {
        const container = e.target.closest('.modal-box');
        const timestamp = container.querySelector('.q-timestamp').value.trim();

        const index = questions.findIndex((q) => q.timestamp === timestamp);
        if (index === -1) {
            showErrorAlert('Something went wrong :(');
            return;
        }
        questions.splice(index, 1);
        updateTime = Date.now();
        renderQuestions(questions);
        await deleteQuestion(timestamp);
    });

    document.getElementById('delete-all-q-btn').addEventListener('click', async (e) => {
        const container = e.target.closest('.modal-box');
        const confirmText = container.querySelector('.confirm-text').value.trim();
        if (confirmText !== 'Delete all questions') {
            showErrorAlert('Please type "Delete all questions" to confirm');
            return;
        }

        questions.splice(1, questions.length);
        updateTime = Date.now();
        renderQuestions(questions);
        await deleteAllQuestions();
    });

    await fetchAndRenderQuestions();
    setInterval(async () => await fetchAndRenderQuestions(), 5000);
})();
