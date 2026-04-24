const inquiryData = [
    { id: 1, name: 'Clinic Schedule', icon: 'ðŸ•’', response: 'Mon-Fri 7:00 AM - 5:00 PM\nSaturday 8:00 AM - 5:00 PM\nSunday 10:00 AM - 5:00 PM', count: 25, lastUpdated: 'Feb 14, 2026', action: 'No action' },
    { id: 2, name: 'Vaccination Requirements', icon: 'ðŸ’‰', response: 'What type of animal is your pet?\nHow old is your pet?\nIs your pet vaccinated before?', count: 5, lastUpdated: 'Feb 15, 2026', action: 'Schedule Now' },
    { id: 3, name: 'Book An Appointment', icon: 'ðŸ“˜', response: 'Redirected to Book Appointment', count: 10, lastUpdated: 'Feb 15, 2026', action: 'Book Appointment' },
    { id: 4, name: 'Lost and Found', icon: 'ðŸ”', response: '...', count: 10, lastUpdated: 'Feb 16, 2026', action: 'No action' }
];

const consultationData = [
    { id: 1, petType: 'Dog', symptoms: ['Vomiting', 'Lethargy'], duration: '>3d', condition: 'Acute Gastritis', severity: 'Critical', recommendation: 'Immediate clinic visit, withhold food for 12h', lastUpdate: 'Oct 12, 2023' },
    { id: 2, petType: 'Dog', symptoms: ['Mild Itching', 'Redness'], duration: '<24h', condition: 'Seasonal Allergy', severity: 'Active', recommendation: 'Monitor for 24h, clean paws after walks', lastUpdate: 'Oct 12, 2025' },
    { id: 3, petType: 'Cat', symptoms: ['Mild Itching', 'Redness'], duration: '<24h', condition: 'Seasonal Allergy', severity: 'Active', recommendation: 'Monitor for 24h, clean paws after walks', lastUpdate: 'Oct 12, 2025' },
    { id: 4, petType: 'Others', symptoms: ['Limping', 'Swelling'], duration: '1-3 Days', condition: 'Soft Tissue Injury', severity: 'Moderate', recommendation: 'Rest and limit movement, book checkup', lastUpdate: 'Oct 12, 2025' }
];

const state = {
    inquiryEditingId: null,
    inquiryDeletingId: null,
    ruleEditingId: null,
    ruleDeletingId: null,
    selectedAnimal: '',
    selectedDuration: '',
    selectedSymptoms: []
};

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const todayLabel = (date = new Date()) => `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;

function openModal(id) {
    const modal = $(id);
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const modal = $(id);
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.show')) document.body.style.overflow = '';
}

function renderInquiryTable(rows = inquiryData) {
    const tbody = $('inquiryTableBody');
    const count = $('inquiryCountText');
    if (!tbody || !count) return;

    tbody.innerHTML = rows.map((row) => `
        <tr>
            <td><div class="inquiry-name-cell"><span class="inquiry-icon">${esc(row.icon)}</span><span>${esc(row.name)}</span></div></td>
            <td>${esc(row.response.split('\n')[0])}</td>
            <td>${esc(row.lastUpdated)}</td>
            <td>${row.count}</td>
            <td><div class="actions-inline"><button type="button" class="action-btn edit" data-action="edit-inquiry" data-id="${row.id}">Edit</button><button type="button" class="action-btn delete" data-action="delete-inquiry" data-id="${row.id}">Delete</button></div></td>
        </tr>
    `).join('');

    count.textContent = `Showing ${rows.length} of ${inquiryData.length} categories`;
}

function renderConsultationTable(rows = consultationData) {
    const tbody = $('consultationTableBody');
    const count = $('consultationCountText');
    if (!tbody || !count) return;

    tbody.innerHTML = rows.map((row) => `
        <tr>
            <td>${esc(row.petType)}</td>
            <td>${esc(row.symptoms.join(', '))}</td>
            <td>${esc(row.duration)}</td>
            <td>${esc(row.condition)}</td>
            <td><span class="severity-pill ${row.severity === 'Critical' ? 'critical' : row.severity === 'Active' ? 'active' : 'moderate'}">${esc(row.severity)}</span></td>
            <td>${esc(row.recommendation)}</td>
            <td>${esc(row.lastUpdate)}</td>
            <td><div class="actions-inline"><button type="button" class="action-btn edit" data-action="edit-rule" data-id="${row.id}">Edit</button><button type="button" class="action-btn delete" data-action="delete-rule" data-id="${row.id}">Delete</button></div></td>
        </tr>
    `).join('');

    count.textContent = `Showing ${rows.length} of ${consultationData.length} results`;
}

function setActiveTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach((button) => button.classList.toggle('active', button.dataset.tab === tabName));
    document.querySelectorAll('.tab-content').forEach((section) => section.classList.remove('active'));
    const activeSection = $(tabName);
    if (activeSection) activeSection.classList.add('active');
}

function filterInquiry(term) {
    const value = term.trim().toLowerCase();
    if (!value) return renderInquiryTable();
    renderInquiryTable(inquiryData.filter((row) => row.name.toLowerCase().includes(value) || row.response.toLowerCase().includes(value)));
}

function filterConsultation(term) {
    const value = term.trim().toLowerCase();
    if (!value) return renderConsultationTable();
    renderConsultationTable(consultationData.filter((row) => row.petType.toLowerCase().includes(value) || row.condition.toLowerCase().includes(value) || row.symptoms.join(', ').toLowerCase().includes(value)));
}

function openInquiryModal(id = null) {
    state.inquiryEditingId = id;
    const title = $('inquiryModalTitle');
    const submit = $('submitInquiryBtn');
    const form = $('inquiryForm');
    if (!title || !submit || !form) return;

    if (id === null) {
        title.textContent = 'Add New Inquiry Type';
        submit.textContent = 'Add Inquiry';
        form.reset();
    } else {
        const row = inquiryData.find((item) => item.id === id);
        if (!row) return;
        title.textContent = 'Edit Inquiry Type';
        submit.textContent = 'Save Changes';
        $('inquiryName').value = row.name;
        $('inquiryIcon').value = row.icon;
        $('inquiryResponse').value = row.response;
        $('primaryAction').value = row.action;
    }

    openModal('inquiryModal');
}

function saveInquiry(event) {
    event.preventDefault();

    const name = $('inquiryName').value.trim();
    const icon = $('inquiryIcon').value || 'ðŸ“';
    const response = $('inquiryResponse').value.trim();
    const action = $('primaryAction').value;
    if (!name) return;

    if (state.inquiryEditingId === null) {
        inquiryData.push({ id: Math.max(0, ...inquiryData.map((item) => item.id)) + 1, name, icon, response, count: 0, lastUpdated: todayLabel(), action });
    } else {
        const row = inquiryData.find((item) => item.id === state.inquiryEditingId);
        if (!row) return;
        row.name = name;
        row.icon = icon;
        row.response = response;
        row.action = action;
        row.lastUpdated = todayLabel();
    }

    renderInquiryTable();
    closeModal('inquiryModal');
}

function promptDeleteInquiry(id) {
    const row = inquiryData.find((item) => item.id === id);
    if (!row) return;
    state.inquiryDeletingId = id;
    $('deleteInquiryName').textContent = row.name;
    $('deleteInquiryCount').textContent = String(row.count);
    $('deleteInquiryResponse').textContent = row.response.split('\n')[0] || '...';
    $('deleteInquiryDate').textContent = row.lastUpdated;
    openModal('deleteInquiryModal');
}

function confirmDeleteInquiry() {
    const index = inquiryData.findIndex((item) => item.id === state.inquiryDeletingId);
    if (index >= 0) inquiryData.splice(index, 1);
    state.inquiryDeletingId = null;
    renderInquiryTable();
    closeModal('deleteInquiryModal');
}

function resetRuleBuilder() {
    state.selectedAnimal = '';
    state.selectedDuration = '';
    state.selectedSymptoms = [];
    document.querySelectorAll('.animal-card, .duration-option, .symptom-chip').forEach((button) => button.classList.remove('active'));
    $('conditionInput').value = '';
    $('severitySelect').value = '';
    $('recommendationInput').value = '';
}

function openRuleModal(id = null) {
    state.ruleEditingId = id;
    if (id === null) {
        resetRuleBuilder();
        openModal('createRulesModal');
        return;
    }

    const row = consultationData.find((item) => item.id === id);
    if (!row) return;
    state.selectedAnimal = row.petType;
    state.selectedDuration = row.duration;
    state.selectedSymptoms = [...row.symptoms];
    $('editCondition').value = row.condition;
    $('editSeverity').value = row.severity;
    $('editRecommendation').value = row.recommendation;
    drawEditSymptoms(row.symptoms);
    openModal('editRuleModal');
}

function drawEditSymptoms(symptoms) {
    const holder = $('selectedSymptoms');
    if (!holder) return;
    holder.innerHTML = symptoms.map((symptom) => `<span class="tag" data-value="${esc(symptom)}">${esc(symptom)} <button type="button" aria-label="Remove">Ã—</button></span>`).join('');
}

function currentEditSymptoms() {
    return Array.from($('selectedSymptoms').querySelectorAll('.tag')).map((tag) => tag.dataset.value);
}

function saveRule() {
    const condition = $('conditionInput').value.trim();
    const severity = $('severitySelect').value;
    const recommendation = $('recommendationInput').value.trim();

    if (!state.selectedAnimal) return alert('Please select animal type.');
    if (!state.selectedSymptoms.length) return alert('Please select at least one symptom.');
    if (!state.selectedDuration) return alert('Please select symptom duration.');
    if (!condition || !severity || !recommendation) return alert('Please complete all required fields.');

    consultationData.push({ id: Math.max(0, ...consultationData.map((item) => item.id)) + 1, petType: state.selectedAnimal, symptoms: [...state.selectedSymptoms], duration: state.selectedDuration, condition, severity, recommendation, lastUpdate: todayLabel() });
    renderConsultationTable();
    closeModal('createRulesModal');
}

function saveEditedRule(event) {
    event.preventDefault();
    const row = consultationData.find((item) => item.id === state.ruleEditingId);
    if (!row) return;

    row.symptoms = currentEditSymptoms();
    row.condition = $('editCondition').value.trim();
    row.severity = $('editSeverity').value;
    row.recommendation = $('editRecommendation').value.trim();
    row.lastUpdate = todayLabel();

    renderConsultationTable();
    closeModal('editRuleModal');
}

function promptDeleteRule(id) {
    const row = consultationData.find((item) => item.id === id);
    if (!row) return;
    state.ruleDeletingId = id;
    $('deletePetType').textContent = row.petType;
    $('deleteSymptoms').textContent = row.symptoms.join(', ');
    $('deleteSymptomsDuration').textContent = row.duration;
    $('deleteCondition').textContent = row.condition;
    $('deleteSeverity').textContent = row.severity;
    $('deleteRecommendation').textContent = row.recommendation;
    $('deleteConfirmInput').value = '';
    openModal('deleteRuleModal');
}

function confirmDeleteRule() {
    if ($('deleteConfirmInput').value.trim().toUpperCase() !== 'DELETE') {
        alert('Type DELETE to confirm.');
        return;
    }

    const index = consultationData.findIndex((item) => item.id === state.ruleDeletingId);
    if (index >= 0) consultationData.splice(index, 1);
    state.ruleDeletingId = null;
    renderConsultationTable();
    closeModal('deleteRuleModal');
}

document.addEventListener('DOMContentLoaded', () => {
    renderInquiryTable();
    renderConsultationTable();

    document.querySelectorAll('.tab-btn').forEach((button) => {
        button.addEventListener('click', () => setActiveTab(button.dataset.tab));
    });

    $('inquirySearch').addEventListener('input', (event) => filterInquiry(event.target.value));
    $('consultationSearch').addEventListener('input', (event) => filterConsultation(event.target.value));

    $('addInquiryBtn').addEventListener('click', () => openInquiryModal());
    $('inquiryForm').addEventListener('submit', saveInquiry);
    $('confirmDeleteInquiryBtn').addEventListener('click', confirmDeleteInquiry);

    $('createRulesBtn').addEventListener('click', () => openRuleModal());
    $('cancelRuleBtn').addEventListener('click', () => closeModal('createRulesModal'));
    $('backBtn').addEventListener('click', () => closeModal('createRulesModal'));
    $('saveRuleBtn').addEventListener('click', saveRule);

    $('editRuleForm').addEventListener('submit', saveEditedRule);
    $('confirmDeleteRuleBtn').addEventListener('click', confirmDeleteRule);
    $('addSymptomBtn').addEventListener('click', () => openModal('addSymptomsModal'));

    document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.close)));
    document.querySelectorAll('.modal').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal.id); }));

    document.querySelectorAll('.animal-card').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.animal-card').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.selectedAnimal = button.dataset.animal;
        });
    });

    document.querySelectorAll('.duration-option').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.duration-option').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.selectedDuration = button.dataset.duration;
        });
    });

    document.querySelectorAll('.symptom-chip').forEach((button) => {
        button.addEventListener('click', () => {
            const symptom = button.textContent.trim();
            button.classList.toggle('active');
            state.selectedSymptoms = button.classList.contains('active')
                ? [...state.selectedSymptoms, symptom]
                : state.selectedSymptoms.filter((item) => item !== symptom);
        });
    });

    $('symptomsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const symptom = $('symptomName').value.trim();
        if (!symptom) return;

        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'symptom-chip active';
        chip.textContent = symptom;
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            state.selectedSymptoms = chip.classList.contains('active')
                ? [...state.selectedSymptoms, symptom]
                : state.selectedSymptoms.filter((item) => item !== symptom);
        });
        $('symptomChips').appendChild(chip);
        state.selectedSymptoms.push(symptom);
        $('symptomsForm').reset();
        closeModal('addSymptomsModal');
    });

    $('selectedSymptoms').addEventListener('click', (event) => {
        const removeButton = event.target.closest('button');
        if (!removeButton) return;
        const tag = removeButton.closest('.tag');
        if (tag) tag.remove();
    });

    $('addSymptomSelect').addEventListener('change', (event) => {
        const value = event.target.value;
        if (!value) return;
        const current = currentEditSymptoms();
        if (!current.includes(value)) drawEditSymptoms([...current, value]);
        event.target.value = '';
    });

    $('inquiryTableBody').addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'edit-inquiry') openInquiryModal(id);
        if (button.dataset.action === 'delete-inquiry') promptDeleteInquiry(id);
    });

    $('consultationTableBody').addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'edit-rule') openRuleModal(id);
        if (button.dataset.action === 'delete-rule') promptDeleteRule(id);
    });
});
const inquiryData = [
    { id: 1, name: 'Clinic Schedule', icon: '🕒', response: 'Mon-Fri 7:00 AM - 5:00 PM\nSaturday 8:00 AM - 5:00 PM\nSunday 10:00 AM - 5:00 PM', count: 25, lastUpdated: 'Feb 14, 2026', action: 'No action' },
    { id: 2, name: 'Vaccination Requirements', icon: 'ðŸ’‰', response: 'What type of animal is your pet?\nHow old is your pet?\nIs your pet vaccinated before?', count: 5, lastUpdated: 'Feb 15, 2026', action: 'Schedule Now' },
    { id: 3, name: 'Book An Appointment', icon: 'ðŸ“˜', response: 'Redirected to Book Appointment', count: 10, lastUpdated: 'Feb 15, 2026', action: 'Book Appointment' },
    { id: 4, name: 'Lost and Found', icon: 'ðŸ”', response: '...', count: 10, lastUpdated: 'Feb 16, 2026', action: 'No action' }
];

const consultationData = [
    { id: 1, petType: 'Dog', symptoms: ['Vomiting', 'Lethargy'], duration: '>3d', condition: 'Acute Gastritis', severity: 'Critical', recommendation: 'Immediate clinic visit, withhold food for 12h', lastUpdate: 'Oct 12, 2023' },
    { id: 2, petType: 'Dog', symptoms: ['Mild Itching', 'Redness'], duration: '<24h', condition: 'Seasonal Allergy', severity: 'Active', recommendation: 'Monitor for 24h, clean paws after walks', lastUpdate: 'Oct 12, 2025' },
    { id: 3, petType: 'Cat', symptoms: ['Mild Itching', 'Redness'], duration: '<24h', condition: 'Seasonal Allergy', severity: 'Active', recommendation: 'Monitor for 24h, clean paws after walks', lastUpdate: 'Oct 12, 2025' },
    { id: 4, petType: 'Others', symptoms: ['Limping', 'Swelling'], duration: '1-3 Days', condition: 'Soft Tissue Injury', severity: 'Moderate', recommendation: 'Rest and limit movement, book checkup', lastUpdate: 'Oct 12, 2025' }
];

const state = {
    inquiryEditingId: null,
    inquiryDeletingId: null,
    ruleEditingId: null,
    ruleDeletingId: null,
    selectedAnimal: '',
    selectedDuration: '',
    selectedSymptoms: []
};

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const todayLabel = (date = new Date()) => `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;

function openModal(id) {
    const modal = $(id);
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const modal = $(id);
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.show')) document.body.style.overflow = '';
}

function renderInquiryTable(rows = inquiryData) {
    const tbody = $('inquiryTableBody');
    const count = $('inquiryCountText');
    if (!tbody || !count) return;

    tbody.innerHTML = rows.map((row) => `
        <tr>
            <td><div class="inquiry-name-cell"><span class="inquiry-icon">${esc(row.icon)}</span><span>${esc(row.name)}</span></div></td>
            <td>${esc(row.response.split('\n')[0])}</td>
            <td>${esc(row.lastUpdated)}</td>
            <td>${row.count}</td>
            <td><div class="actions-inline"><button type="button" class="action-btn edit" data-action="edit-inquiry" data-id="${row.id}">Edit</button><button type="button" class="action-btn delete" data-action="delete-inquiry" data-id="${row.id}">Delete</button></div></td>
        </tr>
    `).join('');

    count.textContent = `Showing ${rows.length} of ${inquiryData.length} categories`;
}

function renderConsultationTable(rows = consultationData) {
    const tbody = $('consultationTableBody');
    const count = $('consultationCountText');
    if (!tbody || !count) return;

    tbody.innerHTML = rows.map((row) => `
        <tr>
            <td>${esc(row.petType)}</td>
            <td>${esc(row.symptoms.join(', '))}</td>
            <td>${esc(row.duration)}</td>
            <td>${esc(row.condition)}</td>
            <td><span class="severity-pill ${row.severity === 'Critical' ? 'critical' : row.severity === 'Active' ? 'active' : 'moderate'}">${esc(row.severity)}</span></td>
            <td>${esc(row.recommendation)}</td>
            <td>${esc(row.lastUpdate)}</td>
            <td><div class="actions-inline"><button type="button" class="action-btn edit" data-action="edit-rule" data-id="${row.id}">Edit</button><button type="button" class="action-btn delete" data-action="delete-rule" data-id="${row.id}">Delete</button></div></td>
        </tr>
    `).join('');

    count.textContent = `Showing ${rows.length} of ${consultationData.length} results`;
}

function setActiveTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach((button) => button.classList.toggle('active', button.dataset.tab === tabName));
    document.querySelectorAll('.tab-content').forEach((section) => section.classList.remove('active'));
    const activeSection = $(tabName);
    if (activeSection) activeSection.classList.add('active');
}

function filterInquiry(term) {
    const value = term.trim().toLowerCase();
    if (!value) return renderInquiryTable();
    renderInquiryTable(inquiryData.filter((row) => row.name.toLowerCase().includes(value) || row.response.toLowerCase().includes(value)));
}

function filterConsultation(term) {
    const value = term.trim().toLowerCase();
    if (!value) return renderConsultationTable();
    renderConsultationTable(consultationData.filter((row) => row.petType.toLowerCase().includes(value) || row.condition.toLowerCase().includes(value) || row.symptoms.join(', ').toLowerCase().includes(value)));
}

function openInquiryModal(id = null) {
    state.inquiryEditingId = id;
    const title = $('inquiryModalTitle');
    const submit = $('submitInquiryBtn');
    const form = $('inquiryForm');
    if (!title || !submit || !form) return;

    if (id === null) {
        title.textContent = 'Add New Inquiry Type';
        submit.textContent = 'Add Inquiry';
        form.reset();
    } else {
        const row = inquiryData.find((item) => item.id === id);
        if (!row) return;
        title.textContent = 'Edit Inquiry Type';
        submit.textContent = 'Save Changes';
        $('inquiryName').value = row.name;
        $('inquiryIcon').value = row.icon;
        $('inquiryResponse').value = row.response;
        $('primaryAction').value = row.action;
    }

    openModal('inquiryModal');
}

function saveInquiry(event) {
    event.preventDefault();

    const name = $('inquiryName').value.trim();
    const icon = $('inquiryIcon').value || 'ðŸ“';
    const response = $('inquiryResponse').value.trim();
    const action = $('primaryAction').value;
    if (!name) return;

    if (state.inquiryEditingId === null) {
        inquiryData.push({
            id: Math.max(0, ...inquiryData.map((item) => item.id)) + 1,
            name,
            icon,
            response,
            count: 0,
            lastUpdated: todayLabel(),
            action
        });
    } else {
        const row = inquiryData.find((item) => item.id === state.inquiryEditingId);
        if (!row) return;
        row.name = name;
        row.icon = icon;
        row.response = response;
        row.action = action;
        row.lastUpdated = todayLabel();
    }

    renderInquiryTable();
    closeModal('inquiryModal');
}

function promptDeleteInquiry(id) {
    const row = inquiryData.find((item) => item.id === id);
    if (!row) return;
    state.inquiryDeletingId = id;
    $('deleteInquiryName').textContent = row.name;
    $('deleteInquiryCount').textContent = String(row.count);
    $('deleteInquiryResponse').textContent = row.response.split('\n')[0] || '...';
    $('deleteInquiryDate').textContent = row.lastUpdated;
    openModal('deleteInquiryModal');
}

function confirmDeleteInquiry() {
    const index = inquiryData.findIndex((item) => item.id === state.inquiryDeletingId);
    if (index >= 0) inquiryData.splice(index, 1);
    state.inquiryDeletingId = null;
    renderInquiryTable();
    closeModal('deleteInquiryModal');
}

function resetRuleBuilder() {
    state.selectedAnimal = '';
    state.selectedDuration = '';
    state.selectedSymptoms = [];
    document.querySelectorAll('.animal-card, .duration-option, .symptom-chip').forEach((button) => button.classList.remove('active'));
    $('conditionInput').value = '';
    $('severitySelect').value = '';
    $('recommendationInput').value = '';
}

function openRuleModal(id = null) {
    state.ruleEditingId = id;
    resetRuleBuilder();

    if (id !== null) {
        const row = consultationData.find((item) => item.id === id);
        if (!row) return;
        state.selectedAnimal = row.petType;
        state.selectedDuration = row.duration;
        state.selectedSymptoms = [...row.symptoms];
        drawEditSymptoms(row.symptoms);
        $('editCondition').value = row.condition;
        $('editSeverity').value = row.severity;
        $('editRecommendation').value = row.recommendation;
        openModal('editRuleModal');
        return;
    }

    openModal('createRulesModal');
}

function drawEditSymptoms(symptoms) {
    const holder = $('selectedSymptoms');
    if (!holder) return;
    holder.innerHTML = symptoms.map((symptom) => `<span class="tag" data-value="${esc(symptom)}">${esc(symptom)} <button type="button" aria-label="Remove">Ã—</button></span>`).join('');
}

function currentEditSymptoms() {
    return Array.from($('selectedSymptoms').querySelectorAll('.tag')).map((tag) => tag.dataset.value);
}

function saveRule() {
    const condition = $('conditionInput').value.trim();
    const severity = $('severitySelect').value;
    const recommendation = $('recommendationInput').value.trim();

    if (!state.selectedAnimal) return alert('Please select animal type.');
    if (!state.selectedSymptoms.length) return alert('Please select at least one symptom.');
    if (!state.selectedDuration) return alert('Please select symptom duration.');
    if (!condition || !severity || !recommendation) return alert('Please complete all required fields.');

    consultationData.push({
        id: Math.max(0, ...consultationData.map((item) => item.id)) + 1,
        petType: state.selectedAnimal,
        symptoms: [...state.selectedSymptoms],
        duration: state.selectedDuration,
        condition,
        severity,
        recommendation,
        lastUpdate: todayLabel()
    });

    renderConsultationTable();
    closeModal('createRulesModal');
}

function saveEditedRule(event) {
    event.preventDefault();
    const row = consultationData.find((item) => item.id === state.ruleEditingId);
    if (!row) return;

    row.symptoms = currentEditSymptoms();
    row.condition = $('editCondition').value.trim();
    row.severity = $('editSeverity').value;
    row.recommendation = $('editRecommendation').value.trim();
    row.lastUpdate = todayLabel();

    renderConsultationTable();
    closeModal('editRuleModal');
}

function promptDeleteRule(id) {
    const row = consultationData.find((item) => item.id === id);
    if (!row) return;
    state.ruleDeletingId = id;
    $('deletePetType').textContent = row.petType;
    $('deleteSymptoms').textContent = row.symptoms.join(', ');
    $('deleteSymptomsDuration').textContent = row.duration;
    $('deleteCondition').textContent = row.condition;
    $('deleteSeverity').textContent = row.severity;
    $('deleteRecommendation').textContent = row.recommendation;
    $('deleteConfirmInput').value = '';
    openModal('deleteRuleModal');
}

function confirmDeleteRule() {
    if ($('deleteConfirmInput').value.trim().toUpperCase() !== 'DELETE') {
        alert('Type DELETE to confirm.');
        return;
    }

    const index = consultationData.findIndex((item) => item.id === state.ruleDeletingId);
    if (index >= 0) consultationData.splice(index, 1);
    state.ruleDeletingId = null;
    renderConsultationTable();
    closeModal('deleteRuleModal');
}

function filterDelete(ruleId) {
    state.ruleDeletingId = ruleId;
}

document.addEventListener('DOMContentLoaded', () => {
    renderInquiryTable();
    renderConsultationTable();

    document.querySelectorAll('.tab-btn').forEach((button) => {
        button.addEventListener('click', () => setActiveTab(button.dataset.tab));
    });

    $('inquirySearch').addEventListener('input', (event) => filterInquiry(event.target.value));
    $('consultationSearch').addEventListener('input', (event) => filterConsultation(event.target.value));

    $('addInquiryBtn').addEventListener('click', () => openInquiryModal());
    $('inquiryForm').addEventListener('submit', saveInquiry);
    $('confirmDeleteInquiryBtn').addEventListener('click', confirmDeleteInquiry);

    $('createRulesBtn').addEventListener('click', () => openRuleModal());
    $('cancelRuleBtn').addEventListener('click', () => closeModal('createRulesModal'));
    $('backBtn').addEventListener('click', () => closeModal('createRulesModal'));
    $('saveRuleBtn').addEventListener('click', saveRule);

    $('editRuleForm').addEventListener('submit', saveEditedRule);
    $('confirmDeleteRuleBtn').addEventListener('click', confirmDeleteRule);
    $('addSymptomBtn').addEventListener('click', () => openModal('addSymptomsModal'));

    document.querySelectorAll('[data-close]').forEach((button) => {
        button.addEventListener('click', () => closeModal(button.dataset.close));
    });

    document.querySelectorAll('.modal').forEach((modal) => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal(modal.id);
        });
    });

    document.querySelectorAll('.animal-card').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.animal-card').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.selectedAnimal = button.dataset.animal;
        });
    });

    document.querySelectorAll('.duration-option').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.duration-option').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.selectedDuration = button.dataset.duration;
        });
    });

    document.querySelectorAll('.symptom-chip').forEach((button) => {
        button.addEventListener('click', () => {
            const symptom = button.textContent.trim();
            button.classList.toggle('active');
            if (button.classList.contains('active')) {
                state.selectedSymptoms.push(symptom);
            } else {
                state.selectedSymptoms = state.selectedSymptoms.filter((item) => item !== symptom);
            }
        });
    });

    $('symptomsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const symptom = $('symptomName').value.trim();
        if (!symptom) return;

        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'symptom-chip active';
        chip.textContent = symptom;
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            state.selectedSymptoms = chip.classList.contains('active') ? [...state.selectedSymptoms, symptom] : state.selectedSymptoms.filter((item) => item !== symptom);
        });
        $('symptomChips').appendChild(chip);
        state.selectedSymptoms.push(symptom);
        $('symptomsForm').reset();
        closeModal('addSymptomsModal');
    });

    $('selectedSymptoms').addEventListener('click', (event) => {
        const removeButton = event.target.closest('button');
        if (!removeButton) return;
        const tag = removeButton.closest('.tag');
        if (tag) tag.remove();
    });

    $('addSymptomSelect').addEventListener('change', (event) => {
        const value = event.target.value;
        if (!value) return;
        const current = currentEditSymptoms();
        if (!current.includes(value)) drawEditSymptoms([...current, value]);
        event.target.value = '';
    });

    $('inquiryTableBody').addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'edit-inquiry') openInquiryModal(id);
        if (button.dataset.action === 'delete-inquiry') promptDeleteInquiry(id);
    });

    $('consultationTableBody').addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'edit-rule') openRuleModal(id);
        if (button.dataset.action === 'delete-rule') promptDeleteRule(id);
    });
});
const inquiryData = [
    {
        id: 1,
        name: 'Clinic Schedule',
        icon: 'ðŸ•’',
        response: 'Mon-Fri 7:00 AM - 5:00 PM\nSaturday 8:00 AM - 5:00 PM\nSunday 10:00 AM - 5:00 PM',
        count: 25,
        lastUpdated: 'Feb 14, 2026',
        action: 'No action'
    },
    {
        id: 2,
        name: 'Vaccination Requirements',
        icon: 'ðŸ’‰',
        response: 'What type of animal is your pet?\nHow old is your pet?\nIs your pet vaccinated before?',
        count: 5,
        lastUpdated: 'Feb 15, 2026',
        action: 'Schedule Now'
    },
    {
        id: 3,
        name: 'Book An Appointment',
        icon: 'ðŸ“˜',
        response: 'Redirected to Book Appointment',
        count: 10,
        lastUpdated: 'Feb 15, 2026',
        action: 'Book Appointment'
    },
    {
        id: 4,
        name: 'Lost and Found',
        icon: 'ðŸ”',
        response: '... ',
        count: 10,
        lastUpdated: 'Feb 16, 2026',
        action: 'No action'
    }
];

const consultationData = [
    {
        id: 1,
        petType: 'Dog',
        symptoms: ['Vomiting', 'Lethargy'],
        duration: '>3d',
        condition: 'Acute Gastritis',
        severity: 'Critical',
        recommendation: 'Immediate clinic visit, withhold food for 12h',
        lastUpdate: 'Oct 12, 2023'
    },
    {
        id: 2,
        petType: 'Dog',
        symptoms: ['Mild Itching', 'Redness'],
        duration: '<24h',
        condition: 'Seasonal Allergy',
        severity: 'Active',
        recommendation: 'Monitor for 24h, clean paws after walks',
        lastUpdate: 'Oct 12, 2025'
    },
    {
        id: 3,
        petType: 'Cat',
        symptoms: ['Mild Itching', 'Redness'],
        duration: '<24h',
        condition: 'Seasonal Allergy',
        severity: 'Active',
        recommendation: 'Monitor for 24h, clean paws after walks',
        lastUpdate: 'Oct 12, 2025'
    },
    {
        id: 4,
        petType: 'Others',
        symptoms: ['Limping', 'Swelling'],
        duration: '1-3 Days',
        condition: 'Soft Tissue Injury',
        severity: 'Moderate',
        recommendation: 'Rest and limit movement, book checkup',
        lastUpdate: 'Oct 12, 2025'
    }
];

const state = {
    editingInquiryId: null,
    deletingInquiryId: null,
    editingRuleId: null,
    deletingRuleId: null,
    selectedAnimal: '',
    selectedDuration: '',
    selectedSymptoms: []
};

function byId(id) {
    return document.getElementById(id);
}

function escapeHTML(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span.innerHTML;
}

    state.editingInquiryId = id;
    const title = byId('inquiryModalTitle');
    const submit = byId('submitInquiryBtn');
    const form = byId('inquiryForm');

    if (!title || !submit || !form) return;

    if (id === null) {
        title.textContent = 'Add New Inquiry Type';
        submit.textContent = 'Add Inquiry';
        form.reset();
    } else {
        const item = inquiryData.find((entry) => entry.id === id);
        if (!item) return;
        title.textContent = 'Edit Inquiry Type';
        submit.textContent = 'Save Changes';
        byId('inquiryName').value = item.name;
        byId('inquiryIcon').value = item.icon;
        byId('inquiryResponse').value = item.response;
        byId('primaryAction').value = item.action;
    }

    openModal('inquiryModal');
}

function saveInquiry(event) {
    event.preventDefault();

    const name = byId('inquiryName').value.trim();
    const response = byId('inquiryResponse').value.trim();
    const action = byId('primaryAction').value;
    const icon = byId('inquiryIcon').value || 'ðŸ“';

    if (!name) return;

    if (state.editingInquiryId === null) {
        inquiryData.push({
            id: Math.max(0, ...inquiryData.map((item) => item.id)) + 1,
            name,
            icon,
            response,
            count: 0,
            lastUpdated: formatDate(),
            action
        });
    } else {
        const item = inquiryData.find((entry) => entry.id === state.editingInquiryId);
        if (!item) return;
        item.name = name;
        item.icon = icon;
        item.response = response;
        item.action = action;
        item.lastUpdated = formatDate();
    }

    renderInquiryTable();
    closeModal('inquiryModal');
}

function promptDeleteInquiry(id) {
    const item = inquiryData.find((entry) => entry.id === id);
    if (!item) return;

    state.deletingInquiryId = id;
    byId('deleteInquiryName').textContent = item.name;
    byId('deleteInquiryCount').textContent = String(item.count);
    byId('deleteInquiryResponse').textContent = item.response.split('\n')[0] || '...';
    byId('deleteInquiryDate').textContent = item.lastUpdated;
    openModal('deleteInquiryModal');
}

function confirmDeleteInquiry() {
    if (state.deletingInquiryId === null) return;

    const index = inquiryData.findIndex((entry) => entry.id === state.deletingInquiryId);
    if (index >= 0) {
        inquiryData.splice(index, 1);
    }

    state.deletingInquiryId = null;
    renderInquiryTable();
    closeModal('deleteInquiryModal');
}

function filterInquiry(term) {
    const value = term.trim().toLowerCase();
    if (!value) {
        renderInquiryTable();
        return;
    }

    renderInquiryTable(inquiryData.filter((item) => item.name.toLowerCase().includes(value) || item.response.toLowerCase().includes(value)));
}

function resetRuleBuilder() {
    state.selectedAnimal = '';
    state.selectedDuration = '';
    state.selectedSymptoms = [];
    document.querySelectorAll('.animal-card').forEach((button) => button.classList.remove('active'));
    document.querySelectorAll('.duration-option').forEach((button) => button.classList.remove('active'));
    document.querySelectorAll('.symptom-chip').forEach((button) => button.classList.remove('active'));
    byId('conditionInput').value = '';
    byId('severitySelect').value = '';
    byId('recommendationInput').value = '';
}

function openCreateRule() {
    resetRuleBuilder();
    openModal('createRulesModal');
}

function saveRule() {
    const condition = byId('conditionInput').value.trim();
    const severity = byId('severitySelect').value;
    const recommendation = byId('recommendationInput').value.trim();

    if (!state.selectedAnimal) return alert('Please select animal type.');
    if (!state.selectedSymptoms.length) return alert('Please select at least one symptom.');
    if (!state.selectedDuration) return alert('Please select symptom duration.');
    if (!condition || !severity || !recommendation) return alert('Please complete all required fields.');

    consultationData.push({
        id: Math.max(0, ...consultationData.map((item) => item.id)) + 1,
        petType: state.selectedAnimal,
        symptoms: [...state.selectedSymptoms],
        duration: state.selectedDuration,
        condition,
        severity,
        recommendation,
        lastUpdate: formatDate()
    });

    renderConsultationTable();
    closeModal('createRulesModal');
}

function editRule(id) {
    const item = consultationData.find((entry) => entry.id === id);
    if (!item) return;

    state.editingRuleId = id;
    byId('editCondition').value = item.condition;
    byId('editSeverity').value = item.severity;
    byId('editRecommendation').value = item.recommendation;
    drawEditSymptoms(item.symptoms);
    openModal('editRuleModal');
}

function drawEditSymptoms(symptoms) {
    const holder = byId('selectedSymptoms');
    if (!holder) return;
    holder.innerHTML = '';

    symptoms.forEach((symptom) => {
        const chip = document.createElement('span');
        chip.className = 'tag';
        chip.dataset.value = symptom;
        chip.innerHTML = `${escapeHTML(symptom)} <button type="button" aria-label="Remove">Ã—</button>`;
        holder.appendChild(chip);
    });
}

function getEditSymptoms() {
    return Array.from(byId('selectedSymptoms').querySelectorAll('.tag')).map((tag) => tag.dataset.value);
}

function submitEditRule(event) {
    event.preventDefault();
    const item = consultationData.find((entry) => entry.id === state.editingRuleId);
    if (!item) return;

    item.symptoms = getEditSymptoms();
    item.condition = byId('editCondition').value.trim();
    item.severity = byId('editSeverity').value;
    item.recommendation = byId('editRecommendation').value.trim();
    item.lastUpdate = formatDate();

    renderConsultationTable();
    closeModal('editRuleModal');
}

function promptDeleteRule(id) {
    const item = consultationData.find((entry) => entry.id === id);
    if (!item) return;

    state.deletingRuleId = id;
    byId('deletePetType').textContent = item.petType;
    byId('deleteSymptoms').textContent = item.symptoms.join(', ');
    byId('deleteSymptomsDuration').textContent = item.duration;
    byId('deleteCondition').textContent = item.condition;
    byId('deleteSeverity').textContent = item.severity;
    byId('deleteRecommendation').textContent = item.recommendation;
    byId('deleteConfirmInput').value = '';
    openModal('deleteRuleModal');
}

function confirmDeleteRule() {
    if (byId('deleteConfirmInput').value.trim().toUpperCase() !== 'DELETE') {
        alert('Type DELETE to confirm.');
        return;
    }

    const index = consultationData.findIndex((entry) => entry.id === state.deletingRuleId);
    if (index >= 0) {
        consultationData.splice(index, 1);
    }

    state.deletingRuleId = null;
    renderConsultationTable();
    closeModal('deleteRuleModal');
}

function filterConsultation(term) {
    const value = term.trim().toLowerCase();
    if (!value) {
        renderConsultationTable();
        return;
    }

    renderConsultationTable(consultationData.filter((item) => item.petType.toLowerCase().includes(value) || item.condition.toLowerCase().includes(value) || item.symptoms.join(', ').toLowerCase().includes(value)));
}

function wireInquiryEvents() {
    byId('addInquiryBtn').addEventListener('click', () => openInquiryForm());
    byId('inquiryForm').addEventListener('submit', saveInquiry);
    byId('confirmDeleteInquiryBtn').addEventListener('click', confirmDeleteInquiry);
    byId('inquirySearch').addEventListener('input', (event) => filterInquiry(event.target.value));

    byId('inquiryTableBody').addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'edit-inquiry') openInquiryForm(id);
        if (button.dataset.action === 'delete-inquiry') promptDeleteInquiry(id);
    });
}

function wireRuleBuilderEvents() {
    byId('createRulesBtn').addEventListener('click', openCreateRule);
    byId('backBtn').addEventListener('click', () => closeModal('createRulesModal'));
    byId('cancelRuleBtn').addEventListener('click', () => closeModal('createRulesModal'));
    byId('saveRuleBtn').addEventListener('click', saveRule);

    document.querySelectorAll('.animal-card').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.animal-card').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.selectedAnimal = button.dataset.animal;
        });
    });

    document.querySelectorAll('.symptom-chip').forEach((button) => {
        button.addEventListener('click', () => {
            const symptom = button.textContent.trim();
            button.classList.toggle('active');
            if (button.classList.contains('active')) {
                state.selectedSymptoms.push(symptom);
            } else {
                state.selectedSymptoms = state.selectedSymptoms.filter((item) => item !== symptom);
            }
        });
    });

    document.querySelectorAll('.duration-option').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.duration-option').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.selectedDuration = button.dataset.duration;
        });
    });

    byId('addSymptomBtn').addEventListener('click', () => openModal('addSymptomsModal'));
    byId('symptomsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const symptom = byId('symptomName').value.trim();
        if (!symptom) return;

        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'symptom-chip active';
        chip.textContent = symptom;
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            if (chip.classList.contains('active')) {
                state.selectedSymptoms.push(symptom);
            } else {
                state.selectedSymptoms = state.selectedSymptoms.filter((item) => item !== symptom);
            }
        });

        byId('symptomChips').appendChild(chip);
        state.selectedSymptoms.push(symptom);
        byId('symptomsForm').reset();
        closeModal('addSymptomsModal');
    });
}

function wireConsultationEvents() {
    byId('consultationSearch').addEventListener('input', (event) => filterConsultation(event.target.value));
    byId('editRuleForm').addEventListener('submit', submitEditRule);
    byId('confirmDeleteRuleBtn').addEventListener('click', confirmDeleteRule);

    byId('consultationTableBody').addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'edit-rule') editRule(id);
        if (button.dataset.action === 'delete-rule') promptDeleteRule(id);
    });

    byId('selectedSymptoms').addEventListener('click', (event) => {
        const removeButton = event.target.closest('button');
        if (!removeButton) return;
        const tag = removeButton.closest('.tag');
        if (tag) tag.remove();
    });

    byId('addSymptomSelect').addEventListener('change', (event) => {
        const value = event.target.value;
        if (!value) return;
        const current = getEditSymptoms();
        if (!current.includes(value)) {
            current.push(value);
            drawEditSymptoms(current);
        }
        event.target.value = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    wireTabs();
    wireModalCloseActions();
    wireInquiryEvents();
    wireRuleBuilderEvents();
    wireConsultationEvents();
    renderInquiryTable();
    renderConsultationTable();
});
const inquiryData = [
    {
        id: 1,
        name: 'Clinic Schedule',
        icon: 'ðŸ•’',
        response: 'Mon-Fri 7:00 AM - 5:00 PM\nSaturday 8:00 AM - 5:00 PM\nSunday 10:00 AM - 5:00 PM',
        count: 25,
        lastUpdated: 'Feb 14, 2026',
        action: 'No action'
    },
    {
        id: 2,
        name: 'Vaccination Requirements',
        icon: 'ðŸ’‰',
            }
        });
    });

    document.querySelectorAll('.duration-option').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.duration-option').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.selectedDuration = button.dataset.duration;
        });
    });

    byId('addSymptomBtn').addEventListener('click', () => openModal('addSymptomsModal'));

    byId('symptomsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const symptom = byId('symptomName').value.trim();

        if (!symptom) {
            return;
        }

        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'symptom-chip active';
        chip.textContent = symptom;

        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            if (chip.classList.contains('active')) {
                state.selectedSymptoms.push(symptom);
            } else {
                state.selectedSymptoms = state.selectedSymptoms.filter((entry) => entry !== symptom);
            }
        });

        byId('symptomChips').appendChild(chip);
        state.selectedSymptoms.push(symptom);

        byId('symptomsForm').reset();
        closeModal('addSymptomsModal');
    });
}

function wireConsultationEvents() {
    byId('consultationSearch').addEventListener('input', (event) => filterConsultation(event.target.value));
    byId('editRuleForm').addEventListener('submit', submitEditRule);
    byId('confirmDeleteRuleBtn').addEventListener('click', confirmDeleteRule);

    byId('consultationTableBody').addEventListener('click', (event) => {
        const target = event.target.closest('[data-action]');
        if (!target) {
            return;
        }

        const id = Number(target.dataset.id);
        const action = target.dataset.action;

        if (action === 'edit-rule') {
            editRule(id);
        }

        if (action === 'delete-rule') {
            promptDeleteRule(id);
        }
    });

    byId('selectedSymptoms').addEventListener('click', (event) => {
        const removeButton = event.target.closest('button');
        if (!removeButton) {
            return;
        }

        const tag = removeButton.closest('.tag');
        if (tag) {
            tag.remove();
        }
    });

    byId('addSymptomSelect').addEventListener('change', (event) => {
        const value = event.target.value;
        if (!value) {
            return;
        }

        const current = getEditSymptoms();
        if (current.includes(value)) {
            event.target.value = '';
            return;
        }

        current.push(value);
        drawEditSymptoms(current);
        event.target.value = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    wireTabs();
    wireModalCloseActions();
    wireInquiryEvents();
    wireRuleBuilderEvents();
    wireConsultationEvents();

    renderInquiryTable();
    renderConsultationTable();
});
