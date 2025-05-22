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

function getInputValue(input) {
    console.assert(input);

    if (input.type === 'checkbox') {
        return input.checked ? '1' : '0';
    } else if (input.type === 'text' || input.type === 'number') {
        return input.value;
    } else {
        console.error('Unknown input type: ' + input.type);
        return '';
    }
}

function setInputValue(id, value) {
    const input = document.getElementById(id);
    if (!input) {
        return;
    }

    if (input.type === 'checkbox') {
        console.assert(['0', '1'].includes(value));
        input.checked = value === '1';
    } else if (input.type === 'text' || input.type === 'number') {
        input.value = value;
    } else {
        console.error('Unknown input type: ' + input.type);
    }
}

function updateUrlParam(e) {
    const urlParams = new URLSearchParams(window.location.search);
    const name = e.target.id;
    urlParams.set(name, getInputValue(e.target));
    window.history.replaceState({}, '', '?' + urlParams.toString());
}
function getConfigUrlParams() {
    const url = window.location.href;
    const searchParams = new URLSearchParams(new URL(url).search);
    const params = [];
    searchParams.forEach(function (value, key) {
        if (key === '' || !key.startsWith('__')) return;
        params.push({ key: key.substring(2), value: value });
    });
    return params;
}

function setInputElements() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
        setInputValue(key, value);
    });
}
