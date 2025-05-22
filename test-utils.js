function getAllQuestionsMock() {
    return [
        {
            timestamp: '108',
            language: '',
            name: '',
            text: 'selected',
            translation: '1747454696375',
            status: 'data',
            version: 0,
        },
        {
            timestamp: '1747454396375',
            language: 'German',
            name: 'Marcelo',
            text: '¿Cuál es la capital de Spain?',
            translation: 'What is the capital of Spain?',
            status: 'none',
            version: 0,
        },
        {
            timestamp: '1747454496375',
            language: 'English',
            name: 'Rafael',
            text: 'Do you like programming?',
            translation: '',
            status: 'skipped',
            version: 0,
        },
        {
            timestamp: '1747454596375',
            language: 'English',
            name: 'Miguel',
            text: 'How many languages do you speak?',
            translation: '',
            status: 'answered',
            version: 0,
        },
        {
            timestamp: '1747454696375',
            language: 'French',
            name: 'Donatello',
            text: 'Quelle est la capitale de la France?',
            translation: 'What is the capital of France?',
            status: 'none',
            version: 0,
        },
        {
            timestamp: '1747454796375',
            language: 'French',
            name: 'Donatello',
            text: 'Quelle est la capitale de la Paris?',
            translation: 'What is the capital of Paris?',
            status: 'hidden',
            version: 0,
        },
    ];
}

function addQuestionMock(q) {}

function updateQuestionMock(q) {}

function deleteQuestionMock(id) {}

const googleMock = {};
googleMock.script = {};
googleMock.script.run = {};
googleMock.script.run.withFailureHandler = (_) => ({
    withSuccessHandler: (f) => ({
        getAllQuestions: () => {
            setTimeout(() => f(getAllQuestionsMock()), 500);
        },
        addQuestion: (q) => {
            setTimeout(() => f(addQuestionMock(q)), 500);
        },
        updateQuestion: (q) => {
            setTimeout(() => f(updateQuestionMock(q)), 500);
        },
        deleteQuestion: (id) => {
            setTimeout(() => f(deleteQuestionMock(id)), 500);
        },
    }),
});
