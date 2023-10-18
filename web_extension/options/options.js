import { checkApiKey } from '@/util.js';

const openObsidianUri = 'obsidian://open?vault=';

// How do we save these for future uses of the browser?
    // Figure this part out

// Saves options to browser.storage
async function saveSettings(event) {
    event?.preventDefault();

    browser.storage.sync.set(
        {
            apiKey: document.getElementById("apiKey").value,
            vault: document.getElementById("vault").value,
            protocol: document.getElementById("protocol").value,
            customPort: Boolean(document.getElementById("customPort").checked),
            port: Number(document.getElementById("port").value),
            liveSearch: Boolean(document.getElementById("liveSearch").checked),
            showInPageIcon: Boolean(document.getElementById("showInPageIcon").checked),
            minChars: Number(document.getElementById("minChars").value),
            contextLength: Number(document.getElementById("contextLength").value),
            matchCount: Number(document.getElementById("matchCount").value),
            noteNumber: Number(document.getElementById("noteNumber").value),
            searchUrls: document.getElementById("searchUrls").value,
            excludes: document.getElementById("excludes").value
        }
    );

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(() => status.textContent = "", 750);
    browser.storage.sync.get().then(console.log);
}

// Restores select box and checkbox state using the preferences stored in browser.storage.
async function restoreSettings() {
    browser.storage.sync.get()
        .then(data => {
            // Fill data fields
            for (const [key, value] of Object.entries(data)) {
                if (key == 'liveSearch' || key == 'showInPageIcon' || key == 'customPort') document.querySelector('#' + key).checked = value;
                else if (document.querySelector('#' + key)) document.querySelector('#' + key).value = value;
                if (key == 'vault') document.querySelector('#openVault').href = openObsidianUri + encodeURIComponent(value);
            }
            setStatus();
        });
}

// Connection check
async function setStatus() {
    const apiKey = document.getElementById('apiKey').value;
    const url = document.getElementById('protocol').value;
    const infoElem = document.getElementById('apiKeyCheck');
    infoElem.innerText = await checkApiKey(url, apiKey);
}

function setVaultLink(event) {
    document.getElementById('openVault').href = openObsidianUri + encodeURIComponent(event.target.value);
}

document.addEventListener("DOMContentLoaded", () => {
    const init = () => {
        restoreSettings();
        const portElem = document.getElementById('port-container');
        browser.storage.sync.get({ customPort: false }).then((data) => {
            if (data.customPort) portElem.classList.remove('hidden');
            else portElem.classList.add('hidden');
        });
        document.getElementById('customPort').addEventListener('change', () => {
            portElem.classList.toggle('hidden');
        });
        document.getElementById("settings").addEventListener("submit", saveSettings);
        document.getElementById('apiKey').addEventListener('change', setStatus);
        document.getElementById('vault').addEventListener('change', setVaultLink);
        document.getElementById('apiKey').addEventListener('input', setStatus);
        document.getElementById('protocol').addEventListener('change', setStatus);
    }
    setTimeout(init, 500);
});