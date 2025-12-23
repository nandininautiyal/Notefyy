/* ===============================
   SUBJECT DATA
================================ */
const subjects = [
    { name: "Operating Systems", icon: "💽", id: "1mbXk6wG-CFQQ-38teFUvPQDIiPV13UcA" },
    { name: "Database Management", icon: "🗄️", id: "1OiYni45WrWMBlnc996uQ4VVo8e3nCiav" },
    { name: "Machine Learning", icon: "🤖", id: "1C40UCBOYt96SDryVnNxMgGKFOu58vgX4" },
    { name: "Probability & Stats", icon: "📊", id: "1rHTlYbaUYIvjjrERJlNiGIrxc2m9emRT" },
    { name: "Algorithms (DAA)", icon: "♾️", id: "1gQxW8nTjV5_7OrCSpY2d_Q_xIDX8yifQ" },
    { name: "Architecture (CAO)", icon: "🔌", id: "1gSR8u9y-5bTM9ss2pWP0C6WC2yVhLApj" },
    { name: "Microprocessors & MCUs", icon: "📟", id: "11aJGPw_EOdR6w55tT3HucP-fIOa3G1-j" },
    { name: "Optimization Techniques", icon: "📈", id: "1-fx56-p54zwKcGE5PHn7HB1PESirYLKA" },
    { name: "Theory of Automata", icon: "⚙️", id: "1jGXmvO4fHKklNK--T3I4DLktjcMFzwDW" }
];

const grid = document.getElementById("subject-grid");

/* ===============================
   1. RENDER SUBJECT CARDS
================================ */
function renderSubjects(items) {
    grid.innerHTML = items.map(s => `
        <div class="subject-card" onclick="openNotes('${s.id}', '${s.name}')">
            <span class="icon-box">${s.icon}</span>
            <h4>${s.name}</h4>
            <p style="color:rgba(255,255,255,0.4); font-size:0.8rem;">
                Click to view notes
            </p>
        </div>
    `).join("");
}

/* ===============================
   2. SEARCH FILTER
================================ */
document.getElementById("searchBar").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = subjects.filter(s =>
        s.name.toLowerCase().includes(term)
    );
    renderSubjects(filtered);
});

/* ===============================
   3. THEME TOGGLE
================================ */
function toggleTheme() {
    document.body.classList.toggle("light-mode");
    const icon = document.querySelector(".theme-icon");
    const isLight = document.body.classList.contains("light-mode");
    icon.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
}
window.toggleTheme = toggleTheme;

/* ===============================
   4. FEEDBACK MODAL
================================ */
function toggleModal() {
    document.getElementById("feedback-modal").classList.toggle("active");
}
window.toggleModal = toggleModal;

async function sendFeedback() {
    const email = document.getElementById("emailInput").value;
    const message = document.getElementById("messageInput").value;

    if (!email || !message) {
        alert("Please fill in all fields");
        return;
    }

    try {
        const res = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, message })
        });

        if (res.ok) {
            alert("Thank you for your feedback!");
            toggleModal();
            document.getElementById("emailInput").value = "";
            document.getElementById("messageInput").value = "";
        } else {
            alert("Failed to send feedback");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}
window.sendFeedback = sendFeedback;

/* ===============================
   5. NOTES MODAL (DRIVE FETCH)
================================ */
async function openNotes(folderId, name) {
    const modal = document.getElementById("notes-modal");
    const status = document.getElementById("modal-status");
    const container = document.getElementById("file-container");

    document.getElementById("modal-subject-name").innerText = name;
    container.innerHTML = "";
    status.innerText = "Loading files...";
    modal.classList.add("active");

    try {
        const res = await fetch(`/api/drive/${folderId}`);
        const files = await res.json();

        if (!files || files.length === 0) {
            status.innerText = "No files found.";
            return;
        }

        status.innerText = `${files.length} files available:`;
        container.innerHTML = files.map(file => `
            <div class="file-item">
                <span class="file-name">📄 ${file.name}</span>
                <button class="btn-view" onclick='openPdf(${JSON.stringify(file)})'>
                    View
                </button>
            </div>
        `).join("");
    } catch (err) {
        console.error(err);
        status.innerText = "Error loading files. Check server logs.";
    }
}
window.openNotes = openNotes;

function closeNotesModal() {
    document.getElementById("notes-modal").classList.remove("active");
}
window.closeNotesModal = closeNotesModal;

/* ===============================
   6. PDF PREVIEW MODAL
================================ */
function openPdf(file) {
    const modal = document.getElementById("pdf-modal");
    const frame = document.getElementById("pdf-frame");
    const title = document.getElementById("pdf-title");
    const driveLink = document.getElementById("drive-link");

    title.innerText = file.name;
    frame.src = `https://drive.google.com/file/d/${file.id}/preview`;
    driveLink.href = file.webViewLink;

    modal.classList.add("active");
}

function closePdfModal() {
    const modal = document.getElementById("pdf-modal");
    const frame = document.getElementById("pdf-frame");

    frame.src = "";
    modal.classList.remove("active");
}

window.openPdf = openPdf;
window.closePdfModal = closePdfModal;

/* ===============================
   7. INIT ON LOAD
================================ */
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        document.querySelector(".theme-icon").textContent = "☀️";
    }
    renderSubjects(subjects);
});
