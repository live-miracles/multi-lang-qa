const testQuestions = [
    {
        timestamp: '108',
        language: '',
        name: 'selected',
        nameTranslation: '',
        text: '3',
        translation: '',
        status: 'data',
    },
    {
        timestamp: '1',
        language: 'German',
        name: 'Migüel',
        nameTranslation: 'Miguel',
        text: '¿Cuál es la capital de Spain?',
        translation: 'What is the capital of Spain?',
        status: 'answered',
    },
    {
        timestamp: '2',
        language: 'English',
        name: 'Rafåel',
        nameTranslation: 'Rafael',
        text: 'Do you like programming?',
        translation: '',
        status: 'answered',
    },
    {
        timestamp: '3',
        language: 'English',
        name: 'Marceslo',
        nameTranslation: '',
        text: 'How many languages do you speak?',
        translation: '',
        status: 'none',
    },
    {
        timestamp: '4',
        language: 'French',
        name: 'Donœtello',
        nameTranslation: 'Donatello',
        text: 'Quelle est la capitale de la France?',
        translation: 'What is the capital of France?',
        status: 'none',
    },
    {
        timestamp: '5',
        language: 'French',
        name: 'Миша',
        nameTranslation: 'Misha',
        text: 'Quelle est la capitale de la Paris?',
        translation: 'What is the capital of Paris?',
        status: 'hidden',
    },
];

function getAllQuestionsMock() {
    return structuredClone(testQuestions); // important to return copy
}

function addQuestionMock(q) {
    if (!q) {
        return {
            success: false,
            error: 'Invalid parameters',
        };
    }

    q.status = 'none';
    q.timestamp = String(Date.now());
    testQuestions.push(q);

    return { success: true };
}

function updateQuestionMock(newQ) {
    for (let i = 0; i < testQuestions.length; i++) {
        const q = testQuestions[i];
        if (q.timestamp !== newQ.timestamp) {
            continue;
        }
        if (newQ.text === '') {
            return {
                success: false,
                error: "Invalid data: the question text can't be empty.",
            };
        }
        Object.assign(q, newQ);
        return { success: true };
    }

    return { success: false, error: 'Question not found.' };
}

function updateQuestionStatusMock(newQ) {
    for (let i = 0; i < testQuestions.length; i++) {
        const q = testQuestions[i];
        if (q.timestamp !== newQ.timestamp) {
            continue;
        }
        q.status = newQ.status;
        return { success: true };
    }

    return { success: false, error: 'Question not found.' };
}

function updateSelectedQuestionMock(timestamp) {
    testQuestions[0].text = timestamp;
    return { success: true };
}

function deleteQuestionMock(timestamp) {
    const index = testQuestions.findIndex((q) => q.timestamp === timestamp);
    if (index !== -1 || console.assert(false)) {
        testQuestions.splice(index, 1);
    } else {
        return { success: false, error: 'Question not found.' };
    }
    return { success: true };
}

function deleteAllQuestionsMock() {
    testQuestions.splice(1, testQuestions.length);
    return { success: true };
}

function getTranslationMock(text) {
    return transliterate(text);
}

function getRandomWaitTime() {
    return parseInt((2 + Math.random()) * 1000);
}

const googleMock = {};
googleMock.script = {};
googleMock.script.run = {};
googleMock.script.run.withFailureHandler = (_) => ({
    withSuccessHandler: (f) => ({
        getAllQuestions: () => {
            setTimeout(() => f(getAllQuestionsMock()), getRandomWaitTime());
        },
        addQuestion: (q) => {
            setTimeout(() => f(addQuestionMock(q)), getRandomWaitTime());
        },
        updateQuestion: (q) => {
            setTimeout(() => f(updateQuestionMock(q)), getRandomWaitTime());
        },
        updateQuestionStatus: (q) => {
            setTimeout(() => f(updateQuestionStatusMock(q)), getRandomWaitTime());
        },
        updateSelectedQuestion: (q) => {
            setTimeout(() => f(updateSelectedQuestionMock(q)), getRandomWaitTime());
        },
        deleteQuestion: (id) => {
            setTimeout(() => f(deleteQuestionMock(id)), getRandomWaitTime());
        },
        deleteAllQuestions: () => {
            setTimeout(() => f(deleteAllQuestionsMock()), getRandomWaitTime());
        },
        getTranslation: (text) => {
            setTimeout(() => f(getTranslationMock(text)), getRandomWaitTime());
        },
    }),
});
