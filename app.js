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
      <option value="linkedIn_referral">linkedIn_Asking for Referral</option>
      <option value="linkedIn_interest">linkedIn_Interest in Role</option>
      <option value="linkedIn_applied">linkedIn_Already Applied</option>
      <option value="linkedIn_followup">linkedIn_Follow Up</option>
      <option value="linkedIn_explore">linkedIn_explore Opportunities</option>
      <option value="linkedIn_connection">linkedIn_Connection</option>
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
    referral: `Subject: Thank You for Offering to Refer Me at [Company], Job Links/Ids are attached

    Hi [Name], 
    
    Thank you so much for agreeing to refer me for roles at [Company]. I truly appreciate your support.
    
    Here are the roles I’m most interested in:  
    [Role]
    
    I've attached my resume. Please let me know if you need any additional information from my end. 
    
    Thanks again for your help!`,
    
      interest: `Subject: Regarding Interest in [Role] role at [Company]
    
    Hi [Name], 
    
    I’m Ankit, a full-time MBA (STEM-designated) student at University of Minnesota. I have a Bachelor's in Computer Science from IIT Kanpur. I’m looking to transition into [Role] roles and would love the opportunity to join [Company]. 
    
    Before pursuing my MBA, I spent five years as a Software Engineer on the SD-WAN team at Juniper Networks, where I worked in a highly technical environment. During my MBA, I served as the founding Product Manager for a rideshare startup in Minneapolis through a summer internship. I’ve also worked as a strategy consultant for Minnesota-based companies, helping shape their go-to-market strategies.
    
    I’ve also applied to the following roles at [Company]:  
    [Role]
    
    If possible, I’d really appreciate a referral or connection to a hiring manager in your network. I've attached my resume for your reference. Looking forward to hearing from you!`,
    
      applied: `Subject: Reaching out regarding [Role] at [Company]
    
    Hi [Name], 

    I'm Ankit Gupta. I've an MBA from the University of Minnesota and a B.Tech in Computer Science from IIT Kanpur. I recently applied for the [Role] position on your team at [Company], and wanted to reach out directly to express my enthusiasm.
    
    I’d love to connect for a quick introductory call to learn more about your team. Please let me know your availability. I'll send a zoom invite accordingly. 

    I've attached my resume. Looking forward to hearing from you!`,
    
      followup: `Subject: Following-up regarding [Role] at [Company]
    
    Hi [Name], 
    
    I hope you're doing well. I wanted to follow up on my previous message.
    
    Please let me know if you need any additional information from my end. 
    
    Thanks again for your time!`,
    
      explore: `Subject: Regarding Interest in [Role] role at [Company]
    
    Hi [Name], 
    
    I’m Ankit, a full-time MBA (STEM-designated) student at University of Minnesota. I have a Bachelor's in Computer Science from IIT Kanpur. I’m looking to transition into [Role] roles and would love the opportunity to join [Company]. 
    
    Before pursuing my MBA, I spent five years as a Software Engineer on the SD-WAN team at Juniper Networks, where I worked in a highly technical environment. During my MBA, I served as the founding Product Manager for a rideshare startup in Minneapolis through a summer internship. I’ve also worked as a strategy consultant for Minnesota-based companies, helping shape their go-to-market strategies.
    
    I’ve also applied to the following roles at [Company]:  
    [Role]
    
    If possible, I’d really appreciate a referral or connection to a hiring manager in your network. I've attached my resume for your reference. Looking forward to hearing from you!`,
    
      linkedIn_referral: `Hi [Name], 
    
    Thank you for agreeing to refer me for [Role] role at [Company]. I truly appreciate your support.
    
    I look forward to next steps in the process.
    
    Regards,  
    Ankit`,
    
      linkedIn_interest: `Hi [Name], 
    
    So awesome to see your team hiring for [Role]. I am interested in the opportunity & would love to be considered.
    
    I am a MBA grad from UMN and I have 5+ years of experience in software/product management. I think my skills would be a great fit. I am looking forward to connecting.
    
    Regards,  
    Ankit`,
    
      linkedIn_applied: `Hi [Name], 
    
    So awesome to see your team hiring for [Role]. I've applied & would love to be considered.
    
    I am a MBA grad from UMN and I have 5+ years of experience in software/product management. I think my skills would be a great fit. I am looking forward to connecting.
    
    Regards,  
    Ankit`,
    
      linkedIn_followup: `Hi [Name], 
    
    Following up on my earlier note—I'm exploring [Role] opportunities at [Company] and would really appreciate your insights.
    
    Would love to connect if you're open.
    
    Regards,  
    Ankit`,
    
      linkedIn_explore: `Hi [Name], 
    
    I am a MBA grad from UMN and I have 5+ years of experience in software/product management. I am exploring [Role] roles and would love to join [Company]. I’d love to connect for a quick introductory call to learn more about your team.
    
    Regards,  
    Ankit`,
    
      linkedIn_connection: `Hi [Name], 
    
    I came across your profile and was really impressed by your career journey. I’d love to connect and stay in touch.
    
    Regards,  
    Ankit`
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
