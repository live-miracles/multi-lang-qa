const LANGUAGE_OPTIONS = [
    { name: 'Afrikaans', code: 'af' },
    { name: 'Albanian', code: 'sq' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Arabic (Saudi Arabia)', code: 'ar-SA' },
    { name: 'Azerbaijani', code: 'az' },
    { name: 'Belarusian', code: 'be' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Bengali (India)', code: 'bn-IN' },
    { name: 'Bosnian', code: 'bs' },
    { name: 'Bosnian (Cyrillic)', code: 'bs-Cyrl' },
    { name: 'Bulgarian', code: 'bg' },
    { name: 'Burmese', code: 'my' },
    { name: 'Catalan', code: 'ca' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Chinese (China)', code: 'zh-CN' },
    { name: 'Chinese (Hong Kong)', code: 'zh-HK' },
    { name: 'Chinese (Simplified)', code: 'zh-Hans' },
    { name: 'Chinese (Taiwan)', code: 'zh-TW' },
    { name: 'Chinese (Traditional)', code: 'zh-Hant' },
    { name: 'Croatian', code: 'hr' },
    { name: 'Czech', code: 'cs' },
    { name: 'Danish', code: 'da' },
    { name: 'Dutch', code: 'nl' },
    { name: 'Dutch (Belgium)', code: 'nl-BE' },
    { name: 'English', code: 'en' },
    { name: 'English (Australia)', code: 'en-AU' },
    { name: 'English (Canada)', code: 'en-CA' },
    { name: 'English (New Zealand)', code: 'en-NZ' },
    { name: 'English (Philippines)', code: 'en-PH' },
    { name: 'English (South Africa)', code: 'en-ZA' },
    { name: 'English (United Kingdom)', code: 'en-GB' },
    { name: 'English (United States)', code: 'en-US' },
    { name: 'Estonian', code: 'et' },
    { name: 'Filipino', code: 'fil' },
    { name: 'Finnish', code: 'fi' },
    { name: 'French', code: 'fr' },
    { name: 'French (Canada)', code: 'fr-CA' },
    { name: 'French (Switzerland)', code: 'fr-CH' },
    { name: 'Frisian', code: 'fy' },
    { name: 'Galician', code: 'gl' },
    { name: 'Georgian', code: 'ka' },
    { name: 'German', code: 'de' },
    { name: 'Greek', code: 'el' },
    { name: 'Guarani', code: 'gn' },
    { name: 'Gujarati', code: 'gu' },
    { name: 'Hebrew', code: 'he' },
    { name: 'Hebrew (iw)', code: 'iw' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Hungarian', code: 'hu' },
    { name: 'Icelandic', code: 'is' },
    { name: 'Indonesian', code: 'id' },
    { name: 'Italian', code: 'it' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Kannada', code: 'kn' },
    { name: 'Khmer', code: 'km' },
    { name: 'Korean', code: 'ko' },
    { name: 'Kyrgyz', code: 'ky' },
    { name: 'Lao', code: 'lo' },
    { name: 'Latvian', code: 'lv' },
    { name: 'Lingala', code: 'ln' },
    { name: 'Lithuanian', code: 'lt' },
    { name: 'Macedonian', code: 'mk' },
    { name: 'Malay', code: 'ms' },
    { name: 'Malayalam', code: 'ml' },
    { name: 'Marathi', code: 'mr' },
    { name: 'Nepali', code: 'ne' },
    { name: 'Norwegian', code: 'no' },
    { name: 'Norwegian Bokmal', code: 'nb' },
    { name: 'Odia', code: 'or' },
    { name: 'Persian', code: 'fa' },
    { name: 'Polish', code: 'pl' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Portuguese (Brazil)', code: 'pt-BR' },
    { name: 'Portuguese (Portugal)', code: 'pt-PT' },
    { name: 'Punjabi', code: 'pa' },
    { name: 'Punjabi (Pakistan)', code: 'pa-PK' },
    { name: 'Romanian', code: 'ro' },
    { name: 'Russian', code: 'ru' },
    { name: 'Slovak', code: 'sk' },
    { name: 'Slovenian', code: 'sl' },
    { name: 'Spanish', code: 'es' },
    { name: 'Spanish (Argentina)', code: 'es-AR' },
    { name: 'Spanish (Chile)', code: 'es-CL' },
    { name: 'Spanish (Colombia)', code: 'es-CO' },
    { name: 'Spanish (Costa Rica)', code: 'es-CR' },
    { name: 'Spanish (Ecuador)', code: 'es-EC' },
    { name: 'Spanish (El Salvador)', code: 'es-SV' },
    { name: 'Spanish (Guatemala)', code: 'es-GT' },
    { name: 'Spanish (Haiti)', code: 'es-HT' },
    { name: 'Spanish (Honduras)', code: 'es-HN' },
    { name: 'Spanish (Latin America)', code: 'es-419' },
    { name: 'Spanish (Mexico)', code: 'es-MX' },
    { name: 'Spanish (Nicaragua)', code: 'es-NI' },
    { name: 'Spanish (Panama)', code: 'es-PA' },
    { name: 'Spanish (Paraguay)', code: 'es-PY' },
    { name: 'Spanish (Peru)', code: 'es-PE' },
    { name: 'Spanish (Puerto Rico)', code: 'es-PR' },
    { name: 'Spanish (Spain)', code: 'es-ES' },
    { name: 'Spanish (United States)', code: 'es-US' },
    { name: 'Spanish (Uruguay)', code: 'es-UY' },
    { name: 'Spanish (Venezuela)', code: 'es-VE' },
    { name: 'Swahili', code: 'sw' },
    { name: 'Swedish', code: 'sv' },
    { name: 'Tagalog', code: 'tl' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Telugu', code: 'te' },
    { name: 'Thai', code: 'th' },
    { name: 'Turkish', code: 'tr' },
    { name: 'Ukrainian', code: 'uk' },
    { name: 'Urdu', code: 'ur' },
    { name: 'Uzbek', code: 'uz' },
    { name: 'Vietnamese', code: 'vi' },
    { name: 'Welsh', code: 'cy' },
    { name: 'Zulu', code: 'zu' },
];
const LANGUAGES = LANGUAGE_OPTIONS.map(({ name }) => name);
const LANGUAGE_MAP = Object.fromEntries(LANGUAGE_OPTIONS.map(({ name, code }) => [name, code]));
const DEFAULT_LANGUAGE = 'English';
const STATS = ['total', 'answered'];

function renderLanguages() {
    const html = LANGUAGES.map(
        (lang) => `
            <option value="${lang}">${lang}</option>`,
    ).join('');
    document.querySelectorAll('.language-select').forEach((el) => (el.innerHTML += html));
    document.querySelectorAll('.translation-language').forEach((el) => {
        el.value = DEFAULT_LANGUAGE;
    });
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
            stats[q.language].total++;
            stats.All.total++;
            if (q.status === 'answered') {
                stats[q.language].answered++;
                stats.All.answered++;
            }
        });
    return stats;
}

const STAR_SVG =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">` +
    `<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329l-24.6 145.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329l104.2-103.1c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>` +
    `</svg>`;

function getQuestionHtml(q, selectedId) {
    return `
        <div class="question relative bg-base-200 rounded-box mb-3 border border-base-content/15 shadow-md flex items-stretch overflow-hidden ${'q-' + q.status}"
            id="${q.timestamp}">
          ${
              q.timestamp === selectedId
                  ? `
              <span class="absolute w-[6%] left-[58%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none text-warning">${STAR_SVG}</span>
              <span class="absolute w-[3%] left-[20%] top-[25%] -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none text-warning">${STAR_SVG}</span>
              <span class="absolute w-[3%] left-[35%] top-[75%] -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none text-warning">${STAR_SVG}</span>
              <span class="absolute w-[5%] left-[80%] top-[35%] -translate-x-1/2 -translate-y-1/2 opacity-25 pointer-events-none text-warning">${STAR_SVG}</span>
              <span class="absolute w-[4%] left-[45%] top-[22%] -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none text-warning">${STAR_SVG}</span>`
                  : ''
          }

          <div class="flex flex-col items-center justify-center gap-2 px-2.5 py-2 border-r border-base-content/10 z-10">
            <label class="swap cursor-pointer" title="Mark as done">
              <input type="checkbox" data-status="answered" ${q.status === 'answered' ? 'checked' : ''} onchange="updateStatus(event)" />
              <svg class="swap-on h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
              </svg>
              <svg class="swap-off h-4 w-4 text-base-content/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
              </svg>
            </label>
            <label class="swap cursor-pointer" title="Select question">
              <input type="checkbox" ${q.timestamp === selectedId ? 'checked' : ''} onchange="updateSelected(event)" />
              <svg class="swap-on h-4 w-4 text-warning" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg class="swap-off h-4 w-4 text-base-content/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </label>
          </div>

          <div class="flex-1 py-2 px-3 z-10 min-w-0 flex flex-col justify-center">
            <div class="q-translation">
              <span class="badge badge-sm badge-outline mr-1 align-middle">${q.language.slice(0, 3)}</span><span class="font-semibold">${q.nameTranslation ? q.nameTranslation + ': ' : ''}</span>${q.translation ? q.translation : q.text}
            </div>
            <div class="q-text text-primary mt-1">
              <span class="font-semibold">${q.translation && q.name ? q.name + ': ' : ''}</span><span>${q.translation ? q.text : ''}</span>
            </div>
          </div>

          <div class="focus flex flex-col items-center justify-center gap-2 px-3 border-l border-base-content/10 z-10">
            <button class="edit-q-btn btn btn-ghost btn-xs h-6 w-6 p-0 text-primary" onclick="showEditQuestionForm(event)" title="Edit">
              <svg class="h-3.5 w-3.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn btn-ghost btn-xs h-6 w-6 p-0 text-error" onclick="showDeleteQuestionForm(event)" title="Delete">
              <svg class="h-3.5 w-3.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
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
        .map((q) => getQuestionHtml(q, selectedId))
        .join('');
    document.getElementById('questions').innerHTML = `<div class="w-full">${html}</div>`;
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

function showElements() {
    document.querySelectorAll('.show-toggle').forEach((elem) => {
        const name = elem.id.slice('show-'.length);
        const show = elem.checked;
        document.querySelectorAll('.' + name).forEach((el) => {
            if (el.matches('textarea, input, select')) return;
            if (show) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    });
}

function updateTranslationControls(container) {
    const sourceLanguage = container.querySelector('.q-language').value;
    const targetLanguage = container.querySelector('.translation-language').value;
    const isSameLanguage = sourceLanguage === targetLanguage;
    const translationInput = container.querySelector('.q-translation');
    const translateBtn = container.querySelector('#translate-q-btn');
    translationInput.disabled = isSameLanguage;
    if (isSameLanguage) {
        translationInput.value = '';
        setTextareaError(translationInput, false);
    }
    if (translateBtn) {
        translateBtn.disabled = isSameLanguage;
    }
}

function setTextareaError(textarea, hasError) {
    textarea.classList.toggle('textarea-error', hasError);
    if (textarea.classList.contains('q-text')) {
        textarea.classList.toggle('textarea-primary', !hasError);
        textarea.classList.toggle('text-primary', !hasError);
    }
    textarea.setAttribute('aria-invalid', hasError ? 'true' : 'false');
}

function setInputError(input, hasError) {
    input.classList.toggle('input-error', hasError);
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
}

function showAddQuestionForm() {
    const modal = document.getElementById('edit-q-modal');
    modal.querySelector('.q-timestamp').value = '';
    modal.querySelector('.q-language').value =
        localStorage.getItem('last-language') || DEFAULT_LANGUAGE;
    modal.querySelector('.translation-language').value =
        localStorage.getItem('last-translation-language') || DEFAULT_LANGUAGE;
    modal.querySelector('.q-name').value = '';
    modal.querySelector('.q-name-translation').value = '';
    modal.querySelector('.q-text').value = '';
    setTextareaError(modal.querySelector('.q-text'), false);
    modal.querySelector('.q-translation').value = '';
    setTextareaError(modal.querySelector('.q-translation'), false);
    updateTranslationControls(modal);
    document.getElementById('update-q-btn').textContent = 'Add Question';
    modal.showModal();
    modal.querySelector('.q-text').focus();
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
    modal.querySelector('.translation-language').value =
        localStorage.getItem('last-translation-language') || DEFAULT_LANGUAGE;
    modal.querySelector('.q-name').value = q.name;
    modal.querySelector('.q-name-translation').value = q.nameTranslation;
    modal.querySelector('.q-text').value = q.text;
    setTextareaError(modal.querySelector('.q-text'), false);
    modal.querySelector('.q-translation').value = q.translation;
    setTextareaError(modal.querySelector('.q-translation'), false);
    updateTranslationControls(modal);
    document.getElementById('update-q-btn').textContent = 'Update';
    modal.showModal();
    modal.querySelector('.q-text').focus();
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
    setInputError(modal.querySelector('.confirm-text'), false);
    modal.showModal();
}

async function updateStatus(e) {
    const timestamp = e.target.closest('.question').id;
    const status = e.target.dataset.status;

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

    const themeCheckbox = document.getElementById('theme-checkbox');
    themeCheckbox.checked = (localStorage.getItem('theme') || 'dim') === 'dim';
    themeCheckbox.addEventListener('change', () => {
        const theme = themeCheckbox.checked ? 'dim' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    let zoom = parseFloat(localStorage.getItem('zoom') || '1');
    const zoomStatus = document.getElementById('zoom-status');
    function setZoom(nextZoom) {
        zoom = Math.max(0.5, Math.min(2, Math.round(nextZoom * 10) / 10));
        applyZoom();
    }
    function applyZoom() {
        document.body.style.minHeight = `${100 / zoom}vh`;
        if ('zoom' in document.body.style) {
            document.body.style.zoom = zoom;
        } else {
            // Firefox < 126 fallback
            document.body.style.transform = `scale(${zoom})`;
            document.body.style.transformOrigin = 'top center';
            document.body.style.width = `${100 / zoom}%`;
        }
        zoomStatus.textContent = Math.round(zoom * 100) + '%';
        localStorage.setItem('zoom', zoom);
    }
    document.getElementById('zoom-in').addEventListener('click', () => {
        setZoom(zoom + 0.1);
    });
    document.getElementById('zoom-out').addEventListener('click', () => {
        setZoom(zoom - 0.1);
    });
    zoomStatus.addEventListener('click', () => {
        setZoom(1);
    });
    applyZoom();

    document.addEventListener('keydown', (e) => {
        if (!(e.ctrlKey || e.metaKey)) return;
        const key = e.key.toLowerCase();
        const isZoomIn = key === '+' || key === '=' || e.key === 'Add';
        const isZoomOut = key === '-' || e.key === '_' || e.key === 'Subtract';
        const isReset = key === '0';
        if (!isZoomIn && !isZoomOut && !isReset) return;
        e.preventDefault();
        if (isZoomIn) setZoom(zoom + 0.1);
        if (isZoomOut) setZoom(zoom - 0.1);
        if (isReset) setZoom(1);
    });

    const fsEl = document.documentElement;
    document.getElementById('toggle-fullscreen').addEventListener('click', () => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
        if (!isFullscreen) {
            if (fsEl.requestFullscreen) {
                fsEl.requestFullscreen();
            } else {
                fsEl.webkitRequestFullscreen?.();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else {
                document.webkitExitFullscreen?.();
            }
        }
    });

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

    document.querySelectorAll('.q-language').forEach((elem) =>
        elem.addEventListener('change', (e) => {
            updateTranslationControls(e.target.closest('dialog'));
        }),
    );

    document.querySelectorAll('.translation-language').forEach((elem) =>
        elem.addEventListener('change', (e) => {
            updateTranslationControls(e.target.closest('dialog'));
        }),
    );

    document.getElementById('translate-q-btn').addEventListener('click', async (e) => {
        const btn = e.target;
        const container = btn.closest('.q-form');
        const sourceLanguage = container.querySelector('.q-language').value;
        const targetLanguage = container.querySelector('.translation-language').value;
        const sourceLang = LANGUAGE_MAP[sourceLanguage];
        const targetLang = LANGUAGE_MAP[targetLanguage];
        const text = container.querySelector('.q-text').value.trim();
        if (!text) {
            showErrorAlert("Can't translate empty text :)");
            return;
        }
        if (sourceLanguage === targetLanguage) {
            showErrorAlert('Please select two different languages :)');
            return;
        }
        btn.disabled = true;
        btn.innerHTML = '<span class="loading loading-infinity loading-xs"></span>';
        const translation = await getTranslation(text, sourceLang, targetLang);
        btn.textContent = 'Translate';
        btn.disabled = false;
        const translationInput = container.querySelector('.q-translation');
        translationInput.value = translation ?? '';
        setTextareaError(translationInput, !translationInput.value.trim());
    });

    document
        .getElementById('edit-q-modal')
        .querySelectorAll('textarea')
        .forEach((textarea) => {
            textarea.addEventListener('input', (e) => {
                if (e.target.matches('.q-text, .q-translation') && e.target.value.trim()) {
                    setTextareaError(e.target, false);
                }
            });
            textarea.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    document.getElementById('update-q-btn').click();
                }
            });
        });

    document.querySelector('#delete-all-q-modal .confirm-text').addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            setInputError(e.target, false);
        }
    });

    document.getElementById('update-q-btn').addEventListener('click', async (e) => {
        const modal = document.getElementById('edit-q-modal');
        const container = modal.querySelector('.modal-box');
        const timestamp = container.querySelector('.q-timestamp').value.trim();
        const newQ = {
            timestamp,
            language: container.querySelector('.q-language').value.trim(),
            targetLanguage: container.querySelector('.translation-language').value.trim(),
            name: container.querySelector('.q-name').value.trim(),
            nameTranslation: container.querySelector('.q-name-translation').value.trim(),
            text: container.querySelector('.q-text').value.trim(),
            translation: container.querySelector('.q-translation').value.trim(),
        };

        if (!newQ.text) {
            const questionTextInput = container.querySelector('.q-text');
            setTextareaError(questionTextInput, true);
            questionTextInput.focus();
            return;
        }
        if (!newQ.translation && newQ.language !== newQ.targetLanguage) {
            const translationInput = container.querySelector('.q-translation');
            setTextareaError(translationInput, true);
            translationInput.focus();
            return;
        }

        localStorage.setItem('last-language', newQ.language);
        localStorage.setItem('last-translation-language', newQ.targetLanguage);
        delete newQ.targetLanguage;
        modal.close();

        if (timestamp) {
            const index = questions.findIndex((q) => q.timestamp === timestamp);
            if (index === -1) {
                showErrorAlert('Something went wrong :(');
                return;
            }
            updateTime = Date.now();
            Object.assign(questions[index], newQ);
            renderQuestions(questions);
            const qEditBtn = document.getElementById(newQ.timestamp)?.querySelector('.edit-q-btn');
            if (!qEditBtn) {
                showErrorAlert('Something went wrong :(');
                return;
            }
            const originalHTML = qEditBtn.innerHTML;
            qEditBtn.setAttribute('disabled', 'disabled');
            qEditBtn.innerHTML = '<span class="loading loading-infinity loading-xs"></span>';
            await updateQuestion(newQ);
            qEditBtn.innerHTML = originalHTML;
            qEditBtn.removeAttribute('disabled');
        } else {
            const addBtn = document.getElementById('add-q-btn');
            const originalHTML = addBtn.innerHTML;
            addBtn.disabled = true;
            addBtn.innerHTML = '<span class="loading loading-infinity loading-xs"></span>';
            const res = await addQuestion(newQ);
            addBtn.innerHTML = originalHTML;
            addBtn.disabled = false;
            if (res.success) {
                container.querySelector('.q-name').value = '';
                container.querySelector('.q-name-translation').value = '';
                container.querySelector('.q-text').value = '';
                setTextareaError(container.querySelector('.q-text'), false);
                container.querySelector('.q-translation').value = '';
                setTextareaError(container.querySelector('.q-translation'), false);
                fetchAndRenderQuestions();
            }
        }
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
        const confirmInput = container.querySelector('.confirm-text');
        const confirmText = confirmInput.value.trim();
        if (confirmText !== 'Delete all questions') {
            setInputError(confirmInput, true);
            confirmInput.focus();
            return;
        }

        questions.splice(1, questions.length);
        updateTime = Date.now();
        renderQuestions(questions);
        document.getElementById('delete-all-q-modal').close();
        await deleteAllQuestions();
    });

    await fetchAndRenderQuestions();
    setInterval(async () => await fetchAndRenderQuestions(), 5000);
})();
