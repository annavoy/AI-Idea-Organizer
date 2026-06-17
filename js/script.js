const STORAGE_KEY = "ai-idea-organizer-ideas";

const ideaInput = document.getElementById("ideaInput");
const addButton = document.getElementById("addButton");
const ideasList = document.getElementById("ideasList");
const ideasCount = document.getElementById("ideasCount");
const emptyState = document.getElementById("emptyState");
const errorToast = document.getElementById("errorToast");

let ideas = loadIdeas();

function loadIdeas() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveIdeas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

function showError(message) {
  errorToast.textContent = message;
  errorToast.classList.add("visible");
  setTimeout(() => errorToast.classList.remove("visible"), 2500);
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderIdeas() {
  ideasList.innerHTML = "";
  ideasCount.textContent = `(${ideas.length})`;
  emptyState.hidden = ideas.length > 0;

  ideas.forEach((idea) => {
    const li = document.createElement("li");
    li.className = "idea-item";
    li.dataset.id = idea.id;

    li.innerHTML = `
      <div class="idea-content">
        <p class="idea-text">${escapeHtml(idea.text)}</p>
        <span class="idea-date">${formatDate(idea.createdAt)}</span>
      </div>
      <button class="delete-btn" aria-label="Delete idea" title="Delete">×</button>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => deleteIdea(idea.id));
    ideasList.appendChild(li);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function addIdea() {
  const text = ideaInput.value.trim();

  if (!text) {
    showError("Please enter an idea first");
    ideaInput.focus();
    return;
  }

  ideas.unshift({
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  });

  saveIdeas();
  renderIdeas();
  ideaInput.value = "";
  ideaInput.focus();
}

function deleteIdea(id) {
  ideas = ideas.filter((idea) => idea.id !== id);
  saveIdeas();
  renderIdeas();
}

addButton.addEventListener("click", addIdea);

ideaInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addIdea();
});

renderIdeas();
ideaInput.focus();
