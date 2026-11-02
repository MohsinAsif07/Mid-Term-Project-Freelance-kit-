function showPage(pageId, btn) {
    let pages = document.querySelectorAll('.page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }

    let currentPage = document.getElementById(pageId);
    currentPage.classList.add('active');

    let title = document.getElementById('page-title');
    if (title) {
        title.innerText = pageId;
    }

    let buttons = document.querySelectorAll('.nav-button');
    for (let j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove('active');
    }
    btn.classList.add('active');
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
    let projectName = document.getElementById('projectName').value;
    let budget = document.getElementById('projectBudget').value;
    let client = document.getElementById('projectClient').value;

    if (projectName == "") {
        alert("Please enter project name");
        return;
    }

    let table = document.getElementById('projectsTable');
    let row = "<tr><td>" + projectName + "</td><td>" + client + "</td><td>$" + budget + "</td><td>In Progress</td></tr>";
    table.innerHTML = table.innerHTML + row;

    document.getElementById('projectName').value = "";
    document.getElementById('projectBudget').value = "";
}

function addInvoice() {
    let client = document.getElementById('invoiceClient').value;
    let amount = document.getElementById('invoiceAmount').value;

    if (client == "" || amount == "") {
        alert("Please fill all fields");
        return;
    }

    let date = new Date().toLocaleDateString();
    let table = document.getElementById('invoicesTable');
    let row = "<tr><td>" + client + "</td><td>$" + amount + "</td><td>" + date + "</td></tr>";
    table.innerHTML = table.innerHTML + row;

    document.getElementById('invoiceClient').value = "";
    document.getElementById('invoiceAmount').value = "";
}
