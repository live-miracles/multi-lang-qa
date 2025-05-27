async function getAllQuestions(sheetId) {
    try {
        const list = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .getAllQuestions(sheetId);
        });
        return list;
    } catch (error) {
        showErrorAlert('Error loading questions: ' + error);
        console.error(error);
        return [];
    }
}

async function addQuestion(q) {
    try {
        showLoadingAlert('Adding question...');
        const res = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .addQuestion(q);
        });
        if (res.success === false) {
            showErrorAlert("Something went wrong, couldn't add question :(");
            return null;
        } else {
            showSuccessAlert('Question added successfully');
            return res;
        }
    } catch (error) {
        showErrorAlert('Error adding question: ' + error);
        console.error(error);
        return [];
    }
}

function updateQuestion() {}

function updateQuestionStatus() {}

function deleteQuestion() {}
