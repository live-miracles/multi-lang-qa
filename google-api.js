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
        return [];
    }
}

async function addQuestion(q) {
    try {
        showSavingBadge(true);
        const res = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .addQuestion(q);
        });
        showSavingBadge(false);
        if (res.success === false) {
            showErrorAlert(res.error);
        } else {
            showSuccessAlert('Question added successfully');
        }
        return res;
    } catch (error) {
        showErrorAlert(error);
        return { success: false };
    }
}

async function updateQuestion(newQ) {
    try {
        showSavingBadge(true);
        const res = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .updateQuestion(newQ);
        });
        updateTime = Date.now();
        if (res.success === false) {
            showErrorAlert(res.error);
        } else {
            if (newQ.status !== 'data') {
                showSuccessAlert('Question updated');
            } else {
                hideAlerts();
            }
        }
        return res;
    } catch (error) {
        showErrorAlert(error);
        return { success: false };
    }
}

async function updateQuestionStatus(newQ) {
    try {
        showSavingBadge(true);
        const res = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .updateQuestionStatus(newQ);
        });
        updateTime = Date.now();
        if (res.success === false) {
            showErrorAlert(res.error);
        } else {
            hideAlerts();
        }
    } catch (error) {
        showErrorAlert(error);
    }
}

async function deleteQuestion(timestamp) {
    try {
        showSavingBadge(true);
        const res = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .deleteQuestion(timestamp);
        });
        updateTime = Date.now();
        if (res.success === false) {
            showErrorAlert(res.error);
        } else {
            hideAlerts();
        }
    } catch (error) {
        showErrorAlert(error);
    }
}

async function getTranslation(text, sourceLanguage, targetLanguage = 'en') {
    try {
        const res = await new Promise((resolve, reject) => {
            window.google.script.run
                .withFailureHandler((error) => reject(error))
                .withSuccessHandler((data) => resolve(data))
                .getTranslation(text, sourceLanguage, targetLanguage);
        });
        return res;
    } catch (error) {
        showErrorAlert(error);
    }
}
