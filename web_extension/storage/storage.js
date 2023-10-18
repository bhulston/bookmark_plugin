export async function syncStoreWithExtStorage(store) {
    await loadAllFromExtStorageTo(store);
    initStorageListeners(store);
    initReactiveStoreListeners(store);
}

// Load all extension storage values to store variable to sync them initially
export async function loadAllFromExtStorageTo(store) {
    return browser.storage.sync.get().then((data) => {
        store.protocol = data.protocol;
        store.customPort = Boolean(data.customPort);
        store.port = Number(data.port);
        store.apiKey = data.apiKey;
        store.obsidianRestUrl = data.protocol;
        store.searchUrls = data.searchUrls.split(',') ?? [];
        store.excludes = data.excludes.split(',') ?? [];
        store.noteNumber = Number(data.noteNumber);
        store.minChars = Number(data.minChars);
        store.show = Boolean(data.show);
        store.searchString = data?.searchString;
        store.contextLength = Number(data.contextLength);
        store.liveSearch = Boolean(data.liveSearch);
        store.showInPageIcon = Boolean(data?.showInPageIcon);
        store.vault = data.vault;
        store.matchCount = Number(data.matchCount);

        store.status = data.status;
        store.statusText = data.statusText;
        store.results = data.results;
        store.color = data.color;
    });
}

// Save all store values to extension storage to persist them across sessions, pages & devices
export async function saveToExtStorageFrom(store) {
    browser.storage.sync.set({
        protocol: store.protocol,
        customPort: Boolean(store.customPort),
        port: Number(store.port),
        apiKey: store.apiKey,
        obsidianRestUrl: store.protocol,
        searchUrls: store.searchUrls.join(','),
        excludes: store.excludes.join(','),
        noteNumber: Number(store.noteNumber),
        minChars: Number(store.minChars),
        show: Boolean(store.show),
        searchString: store.searchString,
        contextLength: Number(store.contextLength),
        liveSearch: Boolean(store.liveSearch),
        showInPageIcon: Boolean(store.showInPageIcon),
        vault: store.vault,
        matchCount: Number(store.matchCount),

        status: store.status,
        statusText: store.statusText,
        results: store.results,
        color: store.color,
    });
}

// Save a single value to extension storage to persist it across sessions, pages & devices
export function saveToExtStorage(name, value) {
    browser.storage.sync.set({
        [name]: value,
    });
}

// Save a single value to extension storage and additional store object to persist it across sessions, pages & devices
export function saveToExtStorageAnd(store = {}, name, value) {
    store[name] = value;
    saveToExtStorage(name, value);
    return store;
}

// Load a single value from extension storage
export async function loadFromExtStorage(propName) {
    return browser.storage.sync.get(propName).then((result) => {
        return result[propName];
    });
}

// Initialize extension storage listeners to to sync extension storage changes to reactive store (ext->store)
export function initStorageListeners(store = {}) {
    setStorageListeners([saveExtStorageChangesTo(store)], [saveExtStorageChangesTo(store)]);
}

// Initializes watcher to sync reactive store changes to the extension storage (store->ext)
export function initReactiveStoreListeners(store = {}) {
    watch(
        () => store, // Getter function to access the reactive object
        (newVal, oldVal) => {
            for (const key in newVal) {
                if (newVal[key] === oldVal[key]) continue;
                if (loadFromExtStorage(key) === newVal[key]) continue;
                saveToExtStorage(key, newVal[key]);
            }
        },
        { deep: true } // Set deep to true if you want to watch nested properties
    );
}

// Save all changes from extension storage event to store variable
export const saveExtStorageChangesTo = (store = {}) => (changes) => {
    for (const key in changes) {
        if (store[key] === changes[key].newValue) continue
        store[key] = changes[key].newValue;
    }
}

// Set listeners for extension storage changes
export function setStorageListeners(syncFunctions = [], localFunctions = []) {
    browser.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "sync") {
            for (const func of syncFunctions) {
                func(changes);
            }
        } else if (areaName === "local") {
            for (const func of localFunctions) {
                func(changes);
            }
        }
    });
}