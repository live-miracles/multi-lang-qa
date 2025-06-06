const LANGUAGES = ['English', 'Russian', 'German', 'French', 'Italian', 'Arabic'];
//const STATUS_RANK = {
//    none: 0,
//    hidden: 1,
//    answered: 2,
//    data: 3,
//};

function renderLanguages() {
    const html = LANGUAGES.map(
        (lang) => `
            <option value="${lang}">${lang}</option>`,
    ).join('');
    document.querySelectorAll('.language-select').forEach((el) => (el.innerHTML += html));
}

function getSelectedQuestion(questions) {
    questions = questions.filter((q) => q.status === 'data' && q.name === 'selected');
    if (questions.length === 0) {
        console.assert(false, 'Selected question data is missing.');
        return null;
    }
    console.assert(questions.length === 1, 'Duplicated selected question data.');
    return questions[0];
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
                    hidden: 0,
                };
            }
            stats[q.language].total++;
            stats[q.language][q.status] += 1;
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
              <input type="checkbox" ${q.timestamp === selectedId ? 'checked' : ''} onchange="updateStatus(event)" />
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

            <div class="badge z-10">${q.language} ${stat}</div>
            <div class="flex-grow"></div>

            <button class="focus btn btn-soft btn-sm btn-primary z-10" onclick="showEditQuestionForm(event)">✎</button>
            <button class="focus btn btn-soft btn-sm btn-error ml-1 z-10" onclick="showDeleteQuestionForm(event)">✕</button>
          </div>
        </div>`;
}

async function renderQuestions(questions) {
    const stats = getQuestionStats(questions);
    const filterLang = document.getElementById('filter-q-language');
    for (let i = 0; i < filterLang.options.length; i++) {
        const option = filterLang.options[i];
        const val = option.value;
        if (val === '') {
            continue;
        }
        if (!stats[val]) {
            option.classList.add('hidden');
        } else {
            const text = `${val} ${stats[val].answered}/${stats[val].total}`;
            if (option.text != text) {
                // otherwise the dropdown refreshes even if no changes
                option.text = text;
            }
            option.classList.remove('hidden');
        }
    }

    const selectedId = getSelectedQuestion(questions).text;
    const html = questions
        .filter((q) => q.status !== 'data')
        .filter((q) => filterLang.value === '' || filterLang.value === q.language)
        //      .sort((a, b) => {
        //          if (STATUS_RANK[a.status] !== STATUS_RANK[b.status]) {
        //              return STATUS_RANK[a.status] - STATUS_RANK[b.status];
        //          }
        //          b.timestamp - a.timestamp;
        //      })
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
    const modal = document.getElementById('edit-question-modal');
    modal.querySelector('.q-timestamp').value = timestamp;
    modal.querySelector('.q-version').value = q.version;
    modal.querySelector('.q-language').value = q.language;
    modal.querySelector('.q-name').value = q.name;
    modal.querySelector('.q-name-translation').value = q.nameTranslation;
    modal.querySelector('.q-text').value = q.text;
    modal.querySelector('.q-translation').value = q.translation;
    modal.showModal();
}

function showDeleteQuestionForm(e) {
    const timestamp = e.target.closest('.question').id;
    const modal = document.getElementById('delete-question-modal');
    modal.querySelector('.q-timestamp').value = timestamp;
    modal.showModal();
}

async function updateStatus(e) {
    const timestamp = e.target.closest('.question').id;
    const status = {
        '★': 'selected',
        Done: 'answered',
        Hide: 'hidden',
    }[e.target.nextElementSibling.innerText];

    const isOn = !e.target.checked;
    if (status === 'selected') {
        const q = getSelectedQuestion(questions);
        if (!q) {
            showErrorAlert('Error: Selected question not found.');
            return;
        }
        q.text = isOn ? '-1' : timestamp;

        updateTime = Date.now();
        renderQuestions(questions);
        await updateQuestion(q);
    } else {
        const q = questions.find((q) => q.timestamp === timestamp);
        if (!q) {
            showErrorAlert('Error: Question not found ' + timestamp);
            return;
        }
        q.status = isOn ? 'none' : status;

        updateTime = Date.now();
        renderQuestions(questions);
        await updateQuestionStatus(q);
    }
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
            input.nextElementSibling.value = transliterate(input.value);
        }),
    );

    document.getElementById('add-question-btn').addEventListener('click', async (e) => {
        const container = e.target.parentElement;
        const newQ = {
            language: container.querySelector('.q-language').value,
            name: container.querySelector('.q-name').value,
            nameTranslation: container.querySelector('.q-name-translation').value,
            text: container.querySelector('.q-text').value,
            translation: container.querySelector('.q-translation').value,
        };
        if (!newQ.text) {
            showErrorAlert('Please specify question text');
            return;
        }
        e.target.setAttribute('disabled', 'disabled');
        await addQuestion(newQ);
        e.target.removeAttribute('disabled');
        fetchAndRenderQuestions();
    });

    document.getElementById('update-question-btn').addEventListener('click', async (e) => {
        const container = e.target.closest('.modal-box');
        const newQ = {
            timestamp: container.querySelector('.q-timestamp').value,
            version: container.querySelector('.q-version').value,
            language: container.querySelector('.q-language').value,
            name: container.querySelector('.q-name').value,
            nameTranslation: container.querySelector('.q-name-translation').value,
            text: container.querySelector('.q-text').value,
            translation: container.querySelector('.q-translation').value,
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
        Object.assign(questions[index], newQ);
        updateTime = Date.now();
        renderQuestions(questions);
        await updateQuestion(newQ);
    });

    document.getElementById('delete-question-btn').addEventListener('click', async (e) => {
        const container = e.target.closest('.modal-box');
        const timestamp = container.querySelector('.q-timestamp').value;

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

    await fetchAndRenderQuestions();
    setInterval(async () => await fetchAndRenderQuestions(), 5000);
})();
