import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');

export function createClassList(initialClasses = []) {
    const classes = new Set(initialClasses);

    return {
        add(className) {
            classes.add(className);
        },
        remove(className) {
            classes.delete(className);
        },
        toggle(className, force) {
            if (force === undefined ? !classes.has(className) : force) {
                classes.add(className);
                return true;
            }
            classes.delete(className);
            return false;
        },
        contains(className) {
            return classes.has(className);
        },
        values() {
            return [...classes];
        },
    };
}

export function createElementStub({ classes = [], matches = () => false } = {}) {
    const attributes = new Map();

    return {
        classList: createClassList(classes),
        disabled: false,
        value: '',
        checked: false,
        innerHTML: '',
        textContent: '',
        style: {},
        matches,
        setAttribute(name, value) {
            attributes.set(name, value);
        },
        getAttribute(name) {
            return attributes.get(name);
        },
        querySelector() {
            return null;
        },
    };
}

export function loadFrontendScripts(files, { trimScriptBoot = false, googleRun = null } = {}) {
    const storage = new Map();
    const context = {
        console,
        setTimeout,
        clearTimeout,
        setInterval() {
            return 1;
        },
        structuredClone,
        URL,
        URLSearchParams,
        localStorage: {
            getItem(key) {
                return storage.get(key) ?? null;
            },
            setItem(key, value) {
                storage.set(key, String(value));
            },
        },
        document: {
            documentElement: {
                setAttribute() {},
            },
            body: {
                style: {},
            },
            addEventListener() {},
            getElementById() {
                return createElementStub();
            },
            querySelectorAll() {
                return [];
            },
            querySelector() {
                return createElementStub();
            },
        },
        window: {
            location: new URL('https://example.test/app'),
            google: googleRun ? { script: { run: googleRun } } : undefined,
            history: {
                pushState() {},
            },
        },
    };
    context.globalThis = context;
    if (googleRun) {
        context.google = context.window.google;
    }

    vm.createContext(context);

    for (const file of files) {
        let source = fs.readFileSync(path.join(root, file), 'utf8');
        if (trimScriptBoot && file === 'frontend/script.js') {
            source = source.split("\nif (typeof google === 'undefined')")[0];
        }
        vm.runInContext(source, context, { filename: file });
    }

    return {
        context,
        storage,
        get(name) {
            return vm.runInContext(name, context);
        },
        set(name, value) {
            context[name] = value;
        },
    };
}
