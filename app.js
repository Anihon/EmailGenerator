const counterDisplay = document.getElementById("counter");
const addEntryBtn = document.getElementById("add-entry");
const subtractCounterBtn = document.getElementById("subtract-counter");
const resetCounterBtn = document.getElementById("reset-counter");
const formsContainer = document.getElementById("forms");

let emailCount = parseInt(localStorage.getItem("emailCount")) || 0;
updateCounter();

addEntryBtn.onclick = () => addForm();
subtractCounterBtn.onclick = () => {
  emailCount = Math.max(0, emailCount - 1);
  localStorage.setItem("emailCount", emailCount);
  updateCounter();
};
resetCounterBtn.onclick = () => {
  emailCount = 0;
  localStorage.setItem("emailCount", emailCount);
  updateCounter();
};

function updateCounter() {
  counterDisplay.textContent = `Emails Today: ${emailCount} / 100`;
}

function addForm() {
  const form = document.createElement("form");
  form.innerHTML = `
    <input placeholder="Name" required />
    <input placeholder="Email" required />
    <input placeholder="Role" required />
    <input placeholder="Company" required />

    <select class="purpose-select">
      <option disabled selected>Select Purpose</option>
      <option value="referral">Asking for Referral</option>
      <option value="interest">Interest in Role</option>
      <option value="applied">Already Applied</option>
      <option value="followup">Follow Up</option>
      <option value="explore">Looking for Opportunities</option>
    </select>

    <textarea placeholder="Purpose (you can edit markdown)"></textarea>
    <button type="button" class="generate-btn">Generate Email</button>
    <div class="output"></div>
    <button type="button" class="copy-btn">Copy Email</button>
    <button type="button" class="delete-btn">Delete</button>
  `;
  formsContainer.appendChild(form);

  const textarea = form.querySelector("textarea");
  const output = form.querySelector(".output");
  const copyBtn = form.querySelector(".copy-btn");
  const generateBtn = form.querySelector(".generate-btn");
  const deleteBtn = form.querySelector(".delete-btn");
  const select = form.querySelector(".purpose-select");
  const [name, email, role, company] = form.querySelectorAll("input");

  const templates = {
    referral: "Hi [Name],\n\nI saw a [Role] opening at [Company] and wanted to ask if you'd be open to referring me...",
    interest: "Hi [Name],\n\nI'm interested in the [Role] role at [Company] and would love to connect...",
    applied: "Hi [Name],\n\nI've applied to the [Role] role at [Company] and wanted to follow up...",
    followup: "Hi [Name],\n\nJust checking in on the [Role] role at [Company] we discussed earlier...",
    explore: "Hi [Name],\n\nI’m currently exploring new opportunities in [Role] and came across [Company]..."
  };

  select.onchange = () => {
    textarea.value = templates[select.value];
  };

  generateBtn.onclick = () => {
    let filled = textarea.value
      .replaceAll("[Name]", name.value)
      .replaceAll("[Role]", role.value)
      .replaceAll("[Company]", company.value);
    output.innerHTML = marked.parse(filled);
    emailCount++;
    localStorage.setItem("emailCount", emailCount);
    updateCounter();
  };

  copyBtn.onclick = () => {
    const temp = document.createElement("textarea");
    temp.value = output.textContent;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  };

  deleteBtn.onclick = () => {
    form.remove();
  };
}
