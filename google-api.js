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
            showErrorAlert(res.error);
        } else {
            showSuccessAlert('Question added successfully');
        }
    } catch (error) {
        showErrorAlert(error);
        console.error(error);
    }
}

async function updateQuestion(newQ) {
    try {
        showLoadingAlert('Updating...');
        const res = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .updateQuestion(newQ);
        });
        if (res.success === false) {
            showErrorAlert(res.error);
        } else {
            hideAlerts();
        }
    } catch (error) {
        showErrorAlert(error);
        console.error(error);
    }
}

async function updateQuestionStatus(newQ) {
    try {
        showLoadingAlert('Updating...');
        const res = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .updateQuestionStatus(newQ);
        });
        if (res.success === false) {
            showErrorAlert(res.error);
        } else {
            hideAlerts();
        }
    } catch (error) {
        showErrorAlert(error);
        console.error(error);
    }
}

async function deleteQuestion(timestamp) {
    try {
        showLoadingAlert('Deleting question...');
        const res = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .deleteQuestion(timestamp);
        });
        if (res.success === false) {
            showErrorAlert(res.error);
        } else {
            showSuccessAlert('Question removed');
        }
    } catch (error) {
        showErrorAlert(error);
        console.error(error);
    }
}
