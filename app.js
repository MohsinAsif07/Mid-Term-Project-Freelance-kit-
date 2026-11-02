let invoiceCount = 1;

function showPage(pageId, btn) {
    let pages = document.querySelectorAll('.page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }

    let current = document.getElementById(pageId);
    current.classList.add('active');

    let title = document.getElementById('page-title');
    if (title) {
        let name = pageId.charAt(0).toUpperCase() + pageId.slice(1);
        title.innerText = name;
    }

    let buttons = document.querySelectorAll('.nav-button');
    for (let j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove('active');
    }

    if (btn) {
        btn.classList.add('active');
    }
}

function goToInvoice() {
    let btns = document.querySelectorAll('.nav-button');
    let invBtn = btns[4];
    showPage('invoices', invBtn);
}

function addClient() {
    let name = document.getElementById('clientName').value;
    let email = document.getElementById('clientEmail').value;

    if (name == "") {
        alert("Please enter client name");
        return;
    }

    let table = document.getElementById('clientsTable');
    let row = "<tr><td>" + name + "</td><td>" + email + "</td></tr>";
    table.innerHTML = table.innerHTML + row;

    let select = document.getElementById('projectClient');
    let option = "<option>" + name + "</option>";
    select.innerHTML = select.innerHTML + option;

    document.getElementById('clientName').value = "";
    document.getElementById('clientEmail').value = "";
}

function addProject() {
    let pName = document.getElementById('projectName').value;
    let budget = document.getElementById('projectBudget').value;
    let client = document.getElementById('projectClient').value;

    if (pName == "") {
        alert("Please enter project name");
        return;
    }

    let table = document.getElementById('projectsTable');
    let row = "<tr><td>" + pName + "</td><td>" + client + "</td><td>$" + budget + "</td><td>In Progress</td></tr>";
    table.innerHTML = table.innerHTML + row;

    document.getElementById('projectName').value = "";
    document.getElementById('projectBudget').value = "";
}

function addInvoice() {
    let client = document.getElementById('invoiceClient').value;
    let project = document.getElementById('invoiceProject').value;
    let amount = document.getElementById('invoiceAmount').value;

    if (client == "" || amount == "") {
        alert("Please fill client and amount");
        return;
    }

    let num = "INV-" + String(invoiceCount).padStart(3, '0');
    let date = new Date().toLocaleDateString();
    let desc = project == "" ? "Freelance Service" : project;

    document.getElementById('invNumber').innerText = num;
    document.getElementById('invDate').innerText = "Date: " + date;
    document.getElementById('invClientName').innerText = client;
    document.getElementById('invProjectName').innerText = "Project: " + desc;
    document.getElementById('invDesc').innerText = desc;
    document.getElementById('invAmount').innerText = "$" + amount;
    document.getElementById('invTotal').innerHTML = "<b>$" + amount + "</b>";

    let preview = document.getElementById('invoicePreview');
    preview.style.display = "block";

    let table = document.getElementById('invoicesTable');
    let row = "<tr><td>" + num + "</td><td>" + client + "</td><td>$" + amount + "</td><td>" + date + "</td></tr>";
    table.innerHTML = table.innerHTML + row;

    invoiceCount = invoiceCount + 1;

    document.getElementById('invoiceClient').value = "";
    document.getElementById('invoiceProject').value = "";
    document.getElementById('invoiceAmount').value = "";

    preview.scrollIntoView({ behavior: 'smooth' });
}
