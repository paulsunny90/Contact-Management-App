let editId = null;
const form = document.getElementById("contactform");
const nameInput = document.getElementById("name");
const countrycodeInput = document.getElementById("countrycode");
const phnumberInput = document.getElementById("phnumber");
const contactlist = document.getElementById("contactlist");
const searchBox = document.querySelector(".search-box");
const searchdropdown = document.querySelector(".search-dropdown");

// fetch
function fetchcontact() {
  fetch("/api/contact")
    .then(res => res.json())
    .then(data => {

     Contacts = data;

      contactlist.innerHTML = "";

      searchdropdown.innerHTML = `<option value="all">All Country Codes</option>`;

      const codes = new Set();

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
            <button onclick="editContact(
              '${contact._id}',
              '${contact.name}',
              '${contact.countrycode}',
              '${contact.phnumber}'
            )">Edit</button>
          </div>
        `;

        contactlist.appendChild(div);

        //options
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

 // edit
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

  const isDuplicate =data.some(contact =>
  contact.phnumber === contactData.phnumber &&
  contact._id !== editId
);

  if(isDuplicate){
    alert("this phone number already exists!")
    return
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
      });
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
      });
  }
});

// delete
function deleteContact(id) {
  fetch(`/api/contact/${id}`, { method: "DELETE" })
    .then(() => fetchcontact());
}

// edit
function editContact(id, name, countrycode, phnumber) {
  editId = id;
  nameInput.value = name;
  countrycodeInput.value = countrycode;
  phnumberInput.value = phnumber;
}

// search
searchBox.addEventListener("input", () => {
  const value = searchBox.value.toLowerCase();
  const cards = document.querySelectorAll(".contact-card");

  cards.forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const countryCode = card
      .querySelectorAll("p")[0]
      .textContent.replace("Country Code:", "")
      .trim()
      .toLowerCase();
    const phone = card
      .querySelectorAll("p")[1]
      .textContent.replace("Phone:", "")
      .trim()
      .toLowerCase();

    if (
      name.includes(value) ||
      countryCode.includes(value) ||
      phone.includes(value)
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// fillter
searchdropdown.addEventListener("change", () => {
  const selectedCode = searchdropdown.value;
  const cards = document.querySelectorAll(".contact-card");

  cards.forEach(card => {
    const countryCode = card
      .querySelectorAll("p")[0]
      .textContent.replace("Country Code:", "")
      .trim();

    if (selectedCode === "all" || countryCode === `selectedCode`) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});


fetchcontact();
