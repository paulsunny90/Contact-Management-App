let editId = null;

const form = document.getElementById("contactform");
const nameInput = document.getElementById("name");
const countrycodeInput = document.getElementById("countrycode");
const phnumberInput = document.getElementById("phnumber");
const contactlist = document.getElementById("contactlist");

function fetchcontact() {
  fetch("/api/contact")
    .then(res => res.json())
    .then(data => {
      contactlist.innerHTML = "";

      data.forEach(contact => {
        const div = document.createElement("div");
        div.className = "contact-card";

        div.innerHTML = `
          <div class="contact-info">
            <div class="text">
              <h3>${contact.name}</h3>
              <p>Country Code: ${contact.countrycode}</p>
              <p>Phone: ${contact.phnumber}</p>
            </div>
            <button onclick="deleteContact('${contact._id}')">Delete</button>
            <button onclick="editContact('${contact._id}', '${contact.name}', '${contact.countrycode}', '${contact.phnumber}')">Edit</button>
          </div>
        `;
        contactlist.appendChild(div);
      });
    })
    .catch(err => console.error("Fetch error:", err));
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const contactData = {
    name: nameInput.value.trim(),
    countrycode: countrycodeInput.value.trim(),
    phnumber: phnumberInput.value.trim()
  };

  if (!contactData.name || !contactData.phnumber) {
    alert("Name and Phone number are required!");
    return;
  }

  if (editId) {
    // EDIT contact
    fetch(`/api/contact/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData)
    })
    .then(res => res.json())
    .then(() => {
      editId = null;
      form.reset();
      fetchcontact();
    })
    .catch(err => console.error("Update error:", err));
  } else {
    // ADD new contact
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData)
    })
    .then(res => res.json())
    .then(() => {
      form.reset();
      fetchcontact();
    })
    .catch(err => console.error("Add error:", err));
  }
});

function deleteContact(id) {
  fetch(`/api/contact/${id}`, { method: "DELETE" })
    .then(() => fetchcontact())
    .catch(err => console.error("Delete error:", err));
}

function editContact(id, name, countrycode, phnumber) {
  editId = id;
  nameInput.value = name;
  countrycodeInput.value = countrycode;
  phnumberInput.value = phnumber;
}

// Initial fetch
fetchcontact();
