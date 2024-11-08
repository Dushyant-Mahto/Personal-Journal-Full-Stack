let currentFilter = 'all'; 

async function addEntry() {
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');
    const tagsInput = document.getElementById('tagsInput');

    const newEntry = {
        title: titleInput.value,
        content: contentInput.value,
        tags: tagsInput.value.split(',').map(tag => tag.trim()),
        important: false,
        bookmarked: false,
    };

    await fetch('http://localhost:5000/api/entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
    });

    titleInput.value = '';
    contentInput.value = '';
    tagsInput.value = '';
    loadEntries(currentFilter);
}

async function loadEntries(filter) {
    currentFilter = filter;
    const response = await fetch(`http://localhost:5000/api/entries`);
    const entries = await response.json();
    const entryList = document.getElementById('entryList');
    entryList.innerHTML = '';

    entries.forEach(entry => {
        if (filter === 'all' || (filter === 'important' && entry.important) || (filter === 'bookmarked' && entry.bookmarked)) {
            const card = document.createElement('div');
            card.className = 'entry-card' + (entry.important ? ' important' : '') + (entry.bookmarked ? ' bookmarked' : '');
            card.innerHTML = `
                <h3>${entry.title}</h3>
                <p>${entry.content}</p>
                <p class="tags">Tags: ${entry.tags.join(', ')}</p>
                <button class="delete-button" onclick="deleteEntry('${entry._id}')">Delete</button>
            `;
            entryList.appendChild(card);
        }
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.tab-button[onclick="loadEntries('${filter}')"]`).classList.add('active');
}

async function deleteEntry(entryId) {
    if (confirm("Are you sure you want to delete this entry?")) {
        await fetch(`http://localhost:5000/api/entries/${entryId}`, {
            method: 'DELETE',
        });
        loadEntries(currentFilter);
    }
}

async function searchEntries() {
    const searchTag = document.getElementById('searchTag').value.trim();
    const searchKeyword = document.getElementById('searchKeyword').value.trim();

    const query = new URLSearchParams();
    if (searchTag) {
        query.append('tag', searchTag);
    }
    if (searchKeyword) {
        query.append('keyword', searchKeyword);
    }

    const response = await fetch(`http://localhost:5000/api/entries/search?${query.toString()}`);
    const entries = await response.json();
    const entryList = document.getElementById('entryList');
    entryList.innerHTML = '';

    entries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        card.innerHTML = `
            <h3>${entry.title}</h3>
            <p>${entry.content}</p>
            <p class="tags">Tags: ${entry.tags.join(', ')}</p>
            <button class="delete-button" onclick="deleteEntry('${entry._id}')">Delete</button>
        `;
        entryList.appendChild(card);
    });
}

function toggleSearchSection() {
    const searchSection = document.getElementById('searchSection');
    searchSection.style.display = searchSection.style.display === 'none' ? 'block' : 'none';
}

window.onload = loadAllEntries;
