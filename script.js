document.addEventListener('DOMContentLoaded', () => {

    const MY_PASSWORD = "khoaitayngoo051930";

    // --- DOM Elements ---
    const passwordScreen = document.getElementById('password-screen');
    const mainContent = document.getElementById('main-content');
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');
    const passwordError = document.getElementById('password-error');
    
    const characterList = document.getElementById('character-list');
    const addCharBtn = document.getElementById('add-char-btn');
    
    const formModal = document.getElementById('char-form-modal');
    const modalTitle = document.getElementById('modal-title');
    const closeFormModalBtn = formModal.querySelector('.close-btn');
    const charForm = document.getElementById('char-form');
    const charPicInput = document.getElementById('char-pic');
    const editCharIndexInput = document.getElementById('edit-char-index');

    const detailsModal = document.getElementById('details-modal');
    const closeDetailsModalBtn = detailsModal.querySelector('.close-btn');

    let characters = [];

    // --- Password Logic ---
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (passwordInput.value === MY_PASSWORD) {
            passwordScreen.remove();
            mainContent.classList.add('active');
            loadCharacters();
        } else {
            passwordError.textContent = "Incorrect password.";
            passwordInput.value = "";
        }
    });

    // --- Modal Logic ---
    const openFormModalForNew = () => {
        charForm.reset();
        editCharIndexInput.value = "";
        modalTitle.textContent = "Add New Character";
        formModal.style.display = 'block';
    };

    const openFormModalForEdit = (index) => {
        const char = characters[index];
        if (!char) return;
        
        document.getElementById('char-pic').value = char.pic;
        document.getElementById('char-name').value = char.name;
        document.getElementById('char-hair').value = char.hair;
        document.getElementById('char-eyes').value = char.eyes;
        document.getElementById('char-figure').value = char.figure;
        document.getElementById('char-outfit').value = char.outfit;
        document.getElementById('char-personality').value = char.personality;
        document.getElementById('char-relationship').value = char.relationship;
        document.getElementById('char-preferences').value = char.preferences;
        document.getElementById('char-notes').value = char.notes;
        
        editCharIndexInput.value = index;
        modalTitle.textContent = "Edit Character";
        formModal.style.display = 'block';
    };
    
    const closeFormModal = () => {
        formModal.style.display = 'none';
        charForm.reset();
    };

    const openDetailsModal = (index) => {
        const char = characters[index];
        if (!char) return;

        document.getElementById('details-pic').src = char.pic;
        document.getElementById('details-name').textContent = char.name;
        document.getElementById('details-appearance').innerHTML = `<strong>Hair:</strong> ${char.hair}<br><strong>Eyes:</strong> ${char.eyes}<br><strong>Figure:</strong> ${char.figure}`;
        document.getElementById('details-outfit').textContent = char.outfit;
        document.getElementById('details-personality').textContent = char.personality;
        document.getElementById('details-relationship').textContent = char.relationship;
        document.getElementById('details-preferences').textContent = char.preferences;

        const notesGroup = document.getElementById('details-notes-group');
        if (char.notes && char.notes.trim() !== '') {
            document.getElementById('details-notes').textContent = char.notes;
            notesGroup.style.display = 'block';
        } else {
            notesGroup.style.display = 'none';
        }
        detailsModal.style.display = 'block';
    };

    const closeDetailsModal = () => detailsModal.style.display = 'none';

    addCharBtn.addEventListener('click', openFormModalForNew);
    closeFormModalBtn.addEventListener('click', closeFormModal);
    closeDetailsModalBtn.addEventListener('click', closeDetailsModal);

    window.addEventListener('click', (e) => {
        if (e.target === formModal) closeFormModal();
        if (e.target === detailsModal) closeDetailsModal();
    });

    charPicInput.addEventListener('paste', (e) => {
        const items = Array.from(e.clipboardData.items).filter(item => item.type.startsWith('image'));
        if (items.length === 0) return;
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (event) => { charPicInput.value = event.target.result; };
        reader.readAsDataURL(items[0].getAsFile());
    });

    const saveCharacters = () => localStorage.setItem('characterList', JSON.stringify(characters));
    const loadCharacters = () => {
        const saved = localStorage.getItem('characterList');
        characters = saved ? JSON.parse(saved) : [];
        renderCharacters();
    };

    // --- Rendering Logic - ★★★ UPDATED HTML STRUCTURE ★★★ ---
    const renderCharacters = () => {
        characterList.innerHTML = '';
        if (characters.length === 0) {
            characterList.innerHTML = `<p style="text-align: center;">No characters yet. Click '+' to add one!</p>`;
        } else {
            characters.forEach((char, index) => {
                const charCard = document.createElement('div');
                charCard.className = 'character-card';
                charCard.dataset.index = index;

                charCard.innerHTML = `
                    <div class="card-image-container">
                        <img src="${char.pic}" alt="${char.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/220/f0e6ff/6a5acd?text=Image+Not+Found';">
                    </div>
                    <div class="card-content">
                        <div class="card-actions">
                            <button class="action-btn edit-btn" data-index="${index}" title="Edit Character">✏️</button>
                            <button class="action-btn delete-btn" data-index="${index}" title="Delete Character">🗑️</button>
                        </div>
                        <h2>${char.name}</h2>
                        
                        <!-- New wrapper for the two-column grid -->
                        <div class="card-details-grid">
                            <div class="info-group">
                                <h3>Appearance</h3>
                                <p><strong>Hair:</strong> ${char.hair}<br><strong>Eyes:</strong> ${char.eyes}<br><strong>Figure:</strong> ${char.figure}</p>
                            </div>
                            <div class="info-group">
                                <h3>Outfit</h3>
                                <p>${char.outfit}</p>
                            </div>
                            <div class="info-group">
                                <h3>Personality</h3>
                                <p>${char.personality}</p>
                            </div>
                        </div>
                    </div>
                `;
                characterList.appendChild(charCard);
            });
        }
    };

    // --- Event Delegation ---
    characterList.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.action-btn');
        if (actionBtn) {
            const index = actionBtn.dataset.index;
            if (actionBtn.classList.contains('edit-btn')) {
                openFormModalForEdit(index);
            }
            if (actionBtn.classList.contains('delete-btn')) {
                if (confirm(`Are you sure you want to delete ${characters[index].name}?`)) {
                    characters.splice(index, 1);
                    saveCharacters();
                    renderCharacters();
                }
            }
            return;
        }
        const card = e.target.closest('.character-card');
        if (card) {
            openDetailsModal(card.dataset.index);
        }
    });

    // --- Form Submission Logic ---
    charForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const characterData = {
            pic: charPicInput.value,
            name: document.getElementById('char-name').value,
            hair: document.getElementById('char-hair').value,
            eyes: document.getElementById('char-eyes').value,
            figure: document.getElementById('char-figure').value,
            outfit: document.getElementById('char-outfit').value,
            personality: document.getElementById('char-personality').value,
            relationship: document.getElementById('char-relationship').value,
            preferences: document.getElementById('char-preferences').value,
            notes: document.getElementById('char-notes').value,
        };
        const editIndex = editCharIndexInput.value;
        if (editIndex !== "") {
            characters[editIndex] = characterData;
        } else {
            characters.push(characterData);
        }
        saveCharacters();
        renderCharacters();
        closeFormModal();
    });
});