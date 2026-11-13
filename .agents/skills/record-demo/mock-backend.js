(function () {
    const now = Date.now();
    const mk = (i, language, name, nameTranslation, text, translation, status = 'none') => ({
        timestamp: String(now - 100000 + i),
        status,
        language,
        name,
        nameTranslation,
        text,
        translation,
    });
    let qs = [
        mk(
            1,
            'Spanish',
            'Maria',
            'Maria',
            '¿Cómo puedo mantener la calma durante momentos difíciles?',
            'How can I stay calm during difficult moments?',
        ),
        mk(
            2,
            'Hindi',
            'Aarav',
            'Aarav',
            'जीवन में उद्देश्य कैसे खोजें?',
            'How do I find purpose in life?',
        ),
        mk(
            3,
            'French',
            'Camille',
            'Camille',
            'Comment développer la patience au quotidien ?',
            'How can I develop patience in daily life?',
        ),
        mk(
            4,
            'German',
            'Lukas',
            'Lukas',
            'Wie finde ich Balance zwischen Arbeit und Ruhe?',
            'How do I find balance between work and rest?',
        ),
    ];
    let selected = '-1';
    const rows = () =>
        [
            {
                timestamp: '0',
                status: 'data',
                language: '',
                name: 'selected',
                nameTranslation: '',
                text: selected,
                translation: '',
            },
        ].concat(qs);
    const api = {
        getAllQuestions: () => ({ success: true, questions: rows() }),
        addQuestion: (q) => {
            q.timestamp = String(Date.now());
            q.status = 'none';
            qs.push(q);
            return { success: true };
        },
        updateQuestion: (n) => {
            qs = qs.map((q) => (q.timestamp === n.timestamp ? n : q));
            return { success: true };
        },
        updateQuestionStatus: (n) => {
            qs = qs.map((q) => (q.timestamp === n.timestamp ? { ...q, status: n.status } : q));
            return { success: true };
        },
        updateSelectedQuestion: (t) => {
            selected = t;
            return { success: true };
        },
        deleteQuestion: (t) => {
            qs = qs.filter((q) => q.timestamp !== t);
            return { success: true };
        },
        deleteAllQuestions: () => {
            qs = [];
            return { success: true };
        },
        getTranslation: (t) => 'How can I bring more joy into my everyday life?',
    };
    window.__qs = () => ({ qs, selected });
    function runner(ok, fail) {
        return new Proxy(
            {},
            {
                get: (_, k) =>
                    k === 'withSuccessHandler'
                        ? (f) => runner(f, fail)
                        : k === 'withFailureHandler'
                          ? (f) => runner(ok, f)
                          : (...a) =>
                                setTimeout(() => {
                                    try {
                                        ok && ok(JSON.parse(JSON.stringify(api[k](...a))));
                                    } catch (e) {
                                        fail && fail(e);
                                    }
                                }, 150),
            },
        );
    }
    window.google = { script: { run: runner() } };
})();
