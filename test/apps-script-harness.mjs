import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');

export function createSheetStub({ rows = [], lastRow = rows.length } = {}) {
    const calls = {
        appendRows: [],
        deletedRows: [],
        ranges: [],
    };

    return {
        calls,
        getDataRange() {
            return {
                getValues() {
                    return rows;
                },
            };
        },
        appendRow(row) {
            calls.appendRows.push(row);
        },
        getRange(row, column, numRows, numColumns) {
            const range = {
                row,
                column,
                numRows,
                numColumns,
                values: null,
                setValues(values) {
                    range.values = values;
                    calls.ranges.push(range);
                },
            };

            return range;
        },
        deleteRow(row) {
            calls.deletedRows.push(row);
        },
        deleteRows(row, count) {
            calls.deletedRows.push({ row, count });
        },
        getLastRow() {
            return lastRow;
        },
    };
}

export function loadAppsScript({ sheet = createSheetStub(), cacheValues = {} } = {}) {
    const cacheStore = new Map(Object.entries(cacheValues));
    const calls = {
        cachePuts: [],
        lockWaits: [],
        lockReleases: 0,
        openedSheets: [],
    };

    const context = {
        console,
        JSON,
        Object,
        String,
        Date: class extends Date {
            static now() {
                return 1234567890;
            }
        },
        PropertiesService: {
            getScriptProperties() {
                return {
                    getProperty(name) {
                        return name === 'SPREADSHEET_ID' ? 'sheet-id-1' : null;
                    },
                };
            },
        },
        CacheService: {
            getScriptCache() {
                return {
                    get(key) {
                        return cacheStore.get(key) ?? null;
                    },
                    put(key, value, seconds) {
                        cacheStore.set(key, value);
                        calls.cachePuts.push({ key, value, seconds });
                    },
                };
            },
        },
        SpreadsheetApp: {
            openById(id) {
                return {
                    getSheetByName(name) {
                        calls.openedSheets.push({ id, name });
                        return sheet;
                    },
                };
            },
        },
        LockService: {
            getScriptLock() {
                return {
                    waitLock(ms) {
                        calls.lockWaits.push(ms);
                    },
                    releaseLock() {
                        calls.lockReleases += 1;
                    },
                };
            },
        },
        LanguageApp: {
            translate(text, sourceLanguage, targetLanguage) {
                return `${text}:${sourceLanguage}:${targetLanguage}`;
            },
        },
        HtmlService: {
            createHtmlOutputFromFile(file) {
                return {
                    file,
                    title: null,
                    setTitle(title) {
                        this.title = title;
                        return this;
                    },
                };
            },
        },
    };
    context.globalThis = context;

    vm.createContext(context);
    const source = fs.readFileSync(path.join(root, 'Code.js'), 'utf8');
    vm.runInContext(source, context, { filename: 'Code.js' });

    return {
        calls,
        cacheStore,
        sheet,
        get(name) {
            return vm.runInContext(name, context);
        },
    };
}
