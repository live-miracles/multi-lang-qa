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

export function loadAppsScript({
    sheet = createSheetStub(),
    cacheValues = {},
    spreadsheetId = 'sheet-id-1',
} = {}) {
    const properties = new Map(spreadsheetId ? [['SPREADSHEET_ID', spreadsheetId]] : []);
    const cacheStore = new Map(Object.entries(cacheValues));
    const calls = {
        cachePuts: [],
        lockWaits: [],
        lockReleases: 0,
        openedSheets: [],
        createdSpreadsheets: [],
        renamedTabs: [],
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
                        return properties.get(name) ?? null;
                    },
                    setProperty(name, value) {
                        properties.set(name, value);
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
            create(title) {
                calls.createdSpreadsheets.push(title);
                return {
                    getId() {
                        return 'created-sheet-id';
                    },
                    getSheets() {
                        return [
                            {
                                setName(name) {
                                    calls.renamedTabs.push(name);
                                    return sheet;
                                },
                            },
                        ];
                    },
                };
            },
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
        properties,
        sheet,
        get(name) {
            return vm.runInContext(name, context);
        },
    };
}
