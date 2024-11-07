async function addEntry() {
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');
    const tagsInput = document.getElementById('tagsInput');

    const newEntry = {
        title: titleInput.value,
        content: contentInput.value,
        tags: tagsInput.value.split(',').map(tag => tag.trim()),
    };

    const response = await fetch('http://localhost:5000/api/entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
    });

    titleInput.value = '';
    contentInput.value = '';
    tagsInput.value = '';
    loadEntries();
}

async function loadEntries() {
    const response = await fetch('http://localhost:5000/api/entries');
    const entries = await response.json();
    const entryList = document.getElementById('entryList');
    entryList.innerHTML = '';

    entries.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.title} - ${entry.tags.join(', ')}`;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = async () => {
            await fetch(`http://localhost:5000/api/entries/${entry._id}`, { method: 'DELETE' });
            loadEntries();
        };

        li.appendChild(deleteButton);
        entryList.appendChild(li);
    });
}

async function searchEntries() {
    const searchTag = document.getElementById('searchTag').value.trim();
    const searchKeyword = document.getElementById('searchKeyword').value.trim();

    const response = await fetch(`http://localhost:5000/api/entries/search?tag=${searchTag}&keyword=${searchKeyword}`);
    const entries = await response.json();
    const entryList = document.getElementById('entryList');
    entryList.innerHTML = '';

    entries.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.title} - ${entry.tags.join(', ')}`;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = async () => {
            await fetch(`http://localhost:5000/api/entries/${entry._id}`, { method: 'DELETE' });
            loadEntries();
        };

        li.appendChild(deleteButton);
        entryList.appendChild(li);
    });
}

// Function to toggle the visibility of the search section
function toggleSearchSection() {
    const searchSection = document.getElementById('searchSection');
    if (searchSection.style.display === 'none') {
        searchSection.style.display = 'block';
    } else {
        searchSection.style.display = 'none';
    }
}

// Load entries on page load
window.onload = loadEntries;
