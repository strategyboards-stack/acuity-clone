import { isCrmAllowed } from "./lib/auth.js";
import { generateClientId, searchAndFilterClients, seedClients, validateClientInput } from "./lib/clients-crm.js";

const role = new URLSearchParams(window.location.search).get("role") ?? "owner";
const listPanel = document.querySelector("#list-panel");
const detailPanel = document.querySelector("#detail-panel");

if (!isCrmAllowed(role)) {
  listPanel.innerHTML = "<h2>Unauthorized</h2><p>You do not have access to this CRM surface.</p>";
  detailPanel.innerHTML = "<h2>Client not found</h2><p>Access restricted.</p>";
} else {
  const state = { clients: [...seedClients], search: "", filter: "all", selectedId: seedClients[0]?.id ?? null, editMode: false, error: "" };

  const render = () => {
    const visible = searchAndFilterClients(state.clients, state.search, state.filter);
    listPanel.innerHTML = `
      <label>Search clients<input id="search" value="${state.search}" placeholder="Search name/email/phone"></label>
      <label>Filter<select id="filter">
        <option value="all" ${state.filter === "all" ? "selected" : ""}>All clients</option>
        <option value="withUpcoming" ${state.filter === "withUpcoming" ? "selected" : ""}>With upcoming</option>
        <option value="withoutUpcoming" ${state.filter === "withoutUpcoming" ? "selected" : ""}>Without upcoming</option>
        <option value="inactive" ${state.filter === "inactive" ? "selected" : ""}>Inactive</option>
      </select></label>
      ${visible.length === 0 ? '<p class="meta">No clients found. Adjust filters or add a client.</p>' : visible.map((c) => `<button class="list-item ${state.selectedId === c.id ? "selected" : ""}" data-id="${c.id}"><strong>${c.firstName} ${c.lastName}</strong><div class="meta">${c.email || c.phone || "No contact path"}</div></button>`).join("")}
      <hr><h3>Add client</h3>
      <div class="row"><input id="add-first" placeholder="First name"><input id="add-last" placeholder="Last name"></div>
      <div class="row"><input id="add-email" placeholder="Email"><input id="add-phone" placeholder="Phone"></div>
      <textarea id="add-notes" placeholder="Client notes"></textarea>
      <button id="add-save">Save new client</button>
      ${state.error ? `<p class="error">${state.error}</p>` : ""}
    `;

    const selected = state.clients.find((c) => c.id === state.selectedId);
    detailPanel.innerHTML = !selected
      ? "<h2>Client not found</h2><p>Select a client from the list or add one.</p>"
      : `
        <h2>${selected.firstName} ${selected.lastName}</h2>
        <p class="meta">Upcoming appointments: ${selected.upcomingAppointments}</p>
        <button id="toggle-edit">${state.editMode ? "Cancel edit" : "Edit client"}</button>
        <label>First name<input id="edit-first" value="${selected.firstName}" ${state.editMode ? "" : "disabled"}></label>
        <label>Last name<input id="edit-last" value="${selected.lastName}" ${state.editMode ? "" : "disabled"}></label>
        <label>Email<input id="edit-email" value="${selected.email}" ${state.editMode ? "" : "disabled"}></label>
        <label>Phone<input id="edit-phone" value="${selected.phone}" ${state.editMode ? "" : "disabled"}></label>
        <label>Client notes<textarea id="edit-notes" ${state.editMode ? "" : "disabled"}>${selected.notes}</textarea></label>
        ${state.editMode ? '<button id="save-edit">Save edits</button>' : ""}
      `;

    listPanel.querySelector("#search")?.addEventListener("input", (e) => { state.search = e.target.value; render(); });
    listPanel.querySelector("#filter")?.addEventListener("change", (e) => { state.filter = e.target.value; render(); });
    listPanel.querySelectorAll("[data-id]").forEach((btn) => btn.addEventListener("click", () => { state.selectedId = btn.dataset.id; state.editMode = false; render(); }));
    listPanel.querySelector("#add-save")?.addEventListener("click", () => {
      const payload = {
        firstName: listPanel.querySelector("#add-first").value,
        lastName: listPanel.querySelector("#add-last").value,
        email: listPanel.querySelector("#add-email").value,
        phone: listPanel.querySelector("#add-phone").value,
        notes: listPanel.querySelector("#add-notes").value
      };
      const validationError = validateClientInput(payload);
      if (validationError) { state.error = validationError; render(); return; }
      const nextClient = { id: generateClientId(state.clients), status: "active", upcomingAppointments: 0, lastAppointmentAt: null, ...payload };
      state.clients.unshift(nextClient);
      state.selectedId = nextClient.id;
      state.error = "";
      render();
    });

    detailPanel.querySelector("#toggle-edit")?.addEventListener("click", () => { state.editMode = !state.editMode; render(); });
    detailPanel.querySelector("#save-edit")?.addEventListener("click", () => {
      const selectedIndex = state.clients.findIndex((c) => c.id === state.selectedId);
      if (selectedIndex < 0) return;
      const candidate = {
        ...state.clients[selectedIndex],
        firstName: detailPanel.querySelector("#edit-first").value,
        lastName: detailPanel.querySelector("#edit-last").value,
        email: detailPanel.querySelector("#edit-email").value,
        phone: detailPanel.querySelector("#edit-phone").value,
        notes: detailPanel.querySelector("#edit-notes").value
      };
      const validationError = validateClientInput(candidate);
      if (validationError) { state.error = validationError; render(); return; }
      state.clients[selectedIndex] = candidate;
      state.editMode = false;
      state.error = "";
      render();
    });
  };

  render();
}
