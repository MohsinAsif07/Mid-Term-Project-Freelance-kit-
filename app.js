
let clients = [];
let projects = [];
let invoices = [];
let invoiceCount = 1;

function showPage(name, btn) {

    let pages = document.querySelectorAll(".page");

    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    }

    document.getElementById(name).classList.add("active");

    let buttons = document.querySelectorAll(".nav");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    if (btn) {
        btn.classList.add("active");
    }

    document.getElementById("pageTitle").innerText = name;
}

function goPage(name) {
    let buttons = document.querySelectorAll(".nav");
    let index = ["dashboard", "clients", "projects", "earnings", "invoices"].indexOf(name);
    showPage(name, buttons[index]);
}

function goInvoice() {
    goPage("invoices");
}

function addClient() {

    let name = document.getElementById("clientName").value.trim();
    let email = document.getElementById("clientEmail").value.trim();

    if (name == "" || email == "") {
        alert("Please fill all fields");
        return;
    }

    let client = {
        name: name,
        email: email
    };

    clients.push(client);

    document.getElementById("clientName").value = "";
    document.getElementById("clientEmail").value = "";

    showClients();
    updateDashboard();
}

function showClients() {

    let table = document.getElementById("clientsTable");

    table.innerHTML = "<tr><th>Name</th><th>Email</th></tr>";

    for (let i = 0; i < clients.length; i++) {

        let row = table.insertRow();

        row.insertCell(0).innerText = clients[i].name;
        row.insertCell(1).innerText = clients[i].email;
    }
}

function addProject() {

    let name = document.getElementById("projectName").value.trim();
    let client = document.getElementById("projectClient").value.trim();
    let budget = Number(document.getElementById("projectBudget").value);

    if (name == "" || client == "" || budget <= 0) {
        alert("Please enter correct project details");
        return;
    }

    let project = {
        name: name,
        client: client,
        budget: budget,
        status: "In Progress"
    };

    projects.push(project);

    document.getElementById("projectName").value = "";
    document.getElementById("projectClient").value = "";
    document.getElementById("projectBudget").value = "";

    showProjects();
    updateDashboard();
}

function showProjects() {

    let table = document.getElementById("projectsTable");

    table.innerHTML = "<tr><th>Project</th><th>Client</th><th>Budget</th><th>Status</th><th>Action</th></tr>";

    for (let i = 0; i < projects.length; i++) {

        let row = table.insertRow();

        row.insertCell(0).innerText = projects[i].name;
        row.insertCell(1).innerText = projects[i].client;
        row.insertCell(2).innerText = "$" + projects[i].budget;
        row.insertCell(3).innerText = projects[i].status;

        let button = document.createElement("button");

        button.innerText = "Complete";

        button.onclick = function() {
            completeProject(i);
        };

        row.insertCell(4).appendChild(button);
    }
}

function completeProject(index) {

    projects[index].status = "Completed";

    showProjects();
    updateDashboard();
}

function addInvoice() {

    let client = document.getElementById("invoiceClient").value.trim();
    let project = document.getElementById("invoiceProject").value.trim();
    let amount = Number(document.getElementById("invoiceAmount").value);

    if (client == "" || project == "" || amount <= 0) {
        alert("Please fill all invoice details");
        return;
    }

    let invoice = {
        number: "INV-" + String(invoiceCount).padStart(3, "0"),
        client: client,
        project: project,
        amount: amount,
        status: "Pending",
        date: new Date().toLocaleDateString()
    };

    invoices.push(invoice);
    invoiceCount++;

    document.getElementById("invNumber").innerText = invoice.number;
    document.getElementById("invDate").innerText = "Date: " + invoice.date;
    document.getElementById("invClient").innerText = client;
    document.getElementById("invProject").innerText = "Project: " + project;
    document.getElementById("invDescription").innerText = project;
    document.getElementById("invAmountText").innerText = "$" + amount;
    document.getElementById("invTotal").innerText = "Total: $" + amount;

    document.getElementById("invoicePreview").style.display = "block";

    document.getElementById("invoiceClient").value = "";
    document.getElementById("invoiceProject").value = "";
    document.getElementById("invoiceAmount").value = "";

    showInvoices();
    updateDashboard();
}

function showInvoices() {

    let table = document.getElementById("invoicesTable");

    table.innerHTML = "<tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th><th>Action</th></tr>";

    for (let i = 0; i < invoices.length; i++) {

        let row = table.insertRow();

        row.insertCell(0).innerText = invoices[i].number;
        row.insertCell(1).innerText = invoices[i].client;
        row.insertCell(2).innerText = "$" + invoices[i].amount;
        row.insertCell(3).innerText = invoices[i].status;

        let button = document.createElement("button");

        button.innerText = invoices[i].status == "Paid" ? "Paid" : "Mark Paid";
        button.disabled = invoices[i].status == "Paid";

        button.onclick = function() {
            markPaid(i);
        };

        row.insertCell(4).appendChild(button);
    }
}

function markPaid(index) {

    invoices[index].status = "Paid";

    showInvoices();
    updateDashboard();

    alert("Payment marked as paid");
}

function updateDashboard() {

    let total = 0;
    let pending = 0;
    let active = 0;

    for (let i = 0; i < invoices.length; i++) {

        if (invoices[i].status == "Paid") {
            total = total + invoices[i].amount;
        } else {
            pending = pending + invoices[i].amount;
        }
    }

    for (let i = 0; i < projects.length; i++) {

        if (projects[i].status == "In Progress") {
            active++;
        }
    }

    document.getElementById("totalEarnings").innerText = "$" + total;
    document.getElementById("earningsTotal").innerText = "$" + total;
    document.getElementById("pendingPayments").innerText = "$" + pending;
    document.getElementById("earningsPending").innerText = "$" + pending;
    document.getElementById("activeProjects").innerText = active;
    document.getElementById("totalClients").innerText = clients.length;

    document.getElementById("paymentInfo").innerText =
        "Received: $" + total + " | Pending: $" + pending;

    showRecentProjects();
}

function showRecentProjects() {

    let table = document.getElementById("recentProjects");

    table.innerHTML = "<tr><th>Project</th><th>Client</th><th>Budget</th><th>Status</th></tr>";

    for (let i = 0; i < projects.length; i++) {

        let row = table.insertRow();

        row.insertCell(0).innerText = projects[i].name;
        row.insertCell(1).innerText = projects[i].client;
        row.insertCell(2).innerText = "$" + projects[i].budget;
        row.insertCell(3).innerText = projects[i].status;
    }
}

function searchData() {

    let search = document.getElementById("search").value.toLowerCase();

    let tables = document.querySelectorAll("table");

    for (let i = 0; i < tables.length; i++) {

        let rows = tables[i].getElementsByTagName("tr");

        for (let j = 1; j < rows.length; j++) {

            let text = rows[j].innerText.toLowerCase();

            if (text.includes(search)) {
                rows[j].style.display = "";
            } else {
                rows[j].style.display = "none";
            }
        }
    }
}

updateDashboard();
