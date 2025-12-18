let editId = null;
let allContacts = [];

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
      renderContacts(allContacts);

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
  contactlist.innerHTML = "";
  contacts.forEach(contact => {
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
        <button onclick="editContact('${contact._id}','${contact.name}','${contact.countrycode}','${contact.phnumber}')">Edit</button>
      </div>
    `;
    contactlist.appendChild(div);
  });
  document.getElementById("add").style.display = "inline-block";
  document.getElementById("edit").style.display = "none";
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
    .then(() => fetchcontact());
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
  const cards = document.querySelectorAll(".contact-card");

  cards.forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const countryCode = card.querySelectorAll("p")[0].textContent.replace("Country Code:", "").trim().toLowerCase();
    const phone = card.querySelectorAll("p")[1].textContent.replace("Phone:", "").trim().toLowerCase();

    card.style.display = (name.includes(value) || countryCode.includes(value) || phone.includes(value)) ? "block" : "none";
  });
});

// Filter 
searchdropdown.addEventListener("change", () => {
  const selectedCode = searchdropdown.value;
  const cards = document.querySelectorAll(".contact-card");

  cards.forEach(card => {
    const countryCode = card.querySelectorAll("p")[0].textContent.replace("Country Code:", "").trim();
    card.style.display = (selectedCode === "all" || countryCode === selectedCode) ? "block" : "none";
  });
});

// Sort 
sortOptions.addEventListener("change", () => {
  let sorted = [...allContacts];
  if (sortOptions.value === "new") {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  if (sortOptions.value === "old") {
    sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
  renderContacts(sorted);
});

fetchcontact();
