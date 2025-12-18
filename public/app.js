let editId = null;
let allContacts = [];
let filteredContacts = [];

const form = document.getElementById("contactform");
const nameInput = document.getElementById("name");
const countrycodeInput = document.getElementById("countrycode");
const phnumberInput = document.getElementById("phnumber");
const contactlist = document.getElementById("contactlist");
const searchBox = document.querySelector(".search-box");
const searchdropdown = document.querySelector(".search-dropdown");
const sortOptions = document.getElementById("sortOptions"); 





// Fetch contacts
function fetchcontact() {
  fetch("/api/contact")
    .then(res => res.json())
    .then(data => {
      allContacts = data;
      filteredContacts = [...allContacts];
      renderContacts(filteredContacts);

      //  country codes
      searchdropdown.innerHTML = `<option value="all">All Country Codes</option>`;
      const codes = new Set();
      data.forEach(contact => {
        if (!codes.has(contact.countrycode)) {
          codes.add(contact.countrycode);
          const option = document.createElement("option");
          option.value = contact.countrycode;
          option.textContent = contact.countrycode;
          searchdropdown.appendChild(option);
        }
      });
    })
    .catch(err => console.error("Fetch error:", err));
}

// Render contacts
function renderContacts(contacts) {
  const tbody = contactlist.querySelector('tbody');
  tbody.innerHTML = "";

  if (contacts.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="4" style="text-align: center; padding: 40px; color: var(--text-muted);">
        No contacts found. Add your first contact above!
      </td>
    `;
    tbody.appendChild(emptyRow);
    return;
  }

  contacts.forEach(contact => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="contact-name">${contact.name}</span></td>
      <td><span class="contact-country">+${contact.countrycode}</span></td>
      <td><span class="contact-phone">${contact.phnumber}</span></td>
      <td>
        <div class="contact-actions">
          <button onclick="editContact('${contact._id}','${contact.name}','${contact.countrycode}','${contact.phnumber}')">Edit</button>
          <button onclick="deleteContact('${contact._id}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}


function isValidName(name) {
  return /^[A-Za-z ]{3,}$/.test(name);
}


function isValidPhone(number) {
  return /^\d{5,15}$/.test(number);
}

//  duplicate
function isDuplicatePhone(number) {
  return allContacts.some(contact => contact.phnumber === number && contact._id !== editId);
}


//  submit
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

  if (!isValidName(contactData.name)) {
    alert("Name must contain only letters and at least 3 characters");
    return;
  }

  if (!isValidPhone(contactData.phnumber)) {
    alert("Phone number must be 5-15 digits");
    return;
  }

  

  if (editId) {
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
        alert("Contact updated successfully!");
      });
  } else if (isDuplicatePhone(contactData.phnumber)) {
    alert("This phone number already exists!");
    return;
  }
   else {
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        fetchcontact();
        alert("Contact added successfully!");
      });
  }
  
  
});

// Delete
function deleteContact(id) {
  fetch(`/api/contact/${id}`, { method: "DELETE" })
    .then(() => {
      fetchcontact();
      alert("Contact Deleted");
    });
}

// Edit
function editContact(id, name, countrycode, phnumber) {
  editId = id;
  nameInput.value = name;
  countrycodeInput.value = countrycode;
  phnumberInput.value = phnumber;
  document.getElementById("add").style.display = "none";
  document.getElementById("edit").style.display = "inline-block";
}

// Search
searchBox.addEventListener("input", () => {
  const value = searchBox.value.toLowerCase();
  filteredContacts = allContacts.filter(contact => {
    const name = contact.name.toLowerCase();
    const countryCode = contact.countrycode.toString().toLowerCase();
    const phone = contact.phnumber.toString().toLowerCase();

    return name.includes(value) || countryCode.includes(value) || phone.includes(value);
  });
  renderContacts(filteredContacts);
});

// Filter
searchdropdown.addEventListener("change", () => {
  const selectedCode = searchdropdown.value;
  if (selectedCode === "all") {
    filteredContacts = [...allContacts];
  } else {
    filteredContacts = allContacts.filter(contact => contact.countrycode.toString() === selectedCode);
  }
  renderContacts(filteredContacts);
});

// Sort
sortOptions.addEventListener("change", () => {
  let sorted = [...filteredContacts];
  if (sortOptions.value === "new") {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOptions.value === "old") {
    sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
  renderContacts(sorted);
});

fetchcontact();
