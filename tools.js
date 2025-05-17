function showElements() {
    document.querySelectorAll('.show-toggle').forEach((elem) => {
        const name = elem.id.slice('show-'.length);
        const show = elem.checked;
        document.querySelectorAll('.' + name).forEach((e) => {
            if (show) {
                e.classList.remove('hidden');
            } else {
                e.classList.add('hidden');
            }
        });
    });
}

export { showElements };
