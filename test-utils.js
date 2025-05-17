function getAllQuestionsMock() {
    return [
        {
            timestamp: '1747454396375',
            language: 'Spanish',
            name: 'Marcelo',
            text: '¿Cuál es la capital de Spain?',
            translation: 'What is the capital of Spain?',
            status: '',
        },
        {
            timestamp: '1747454496375',
            language: 'English',
            name: 'Rafael',
            text: 'Do you like programming?',
            translation: '',
            status: '',
        },
        {
            timestamp: '1747454596375',
            language: 'English',
            name: 'Miguel',
            text: 'How many languages do you speak?',
            translation: '',
            status: 'answered',
        },
        {
            timestamp: '1747454696375',
            language: 'French',
            name: 'Donatello',
            text: 'Quelle est la capitale de la France?',
            translation: 'What is the capital of France?',
            status: 'skipped',
        },
        {
            timestamp: '1747454796375',
            language: 'French',
            name: 'Donatello',
            text: 'Quelle est la capitale de la Paris?',
            translation: 'What is the capital of Paris?',
            status: 'hidden',
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
            f(getAllQuestionsMock());
        },
        addQuestion: (q) => {
            f(addQuestionMock(q));
        },
        updateQuestion: (q) => {
            f(updateQuestionMock(q));
        },
        deleteQuestion: (id) => {
            f(deleteQuestionMock(id));
        },
    }),
});

export { googleMock };
