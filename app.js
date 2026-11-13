let clients = JSON.parse(localStorage.getItem("clients")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
let invoiceCount = Number(localStorage.getItem("invoiceCount")) || 1;
function saveData() {
    localStorage.setItem("clients", JSON.stringify(clients));
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("invoices", JSON.stringify(invoices));
    localStorage.setItem("invoiceCount", invoiceCount);
}
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("show");
}
function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");
}
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
    document.getElementById("pageTitle").innerText = name.charAt(0).toUpperCase() + name.slice(1);
    closeSidebar();
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
    if (email.includes("@") == false || email.includes(".") == false) {
        alert("Please enter correct email like ali@gmail.com");
        return;
    }
    for (let i = 0; i < clients.length; i++) {
        if (clients[i].email.toLowerCase() == email.toLowerCase()) {
            alert("Ye client pehle se hai!");
            return;
        }
    }
    let client = {
        name: name,
        email: email
    };
    clients.push(client);
    saveData();
    document.getElementById("clientName").value = "";
    document.getElementById("clientEmail").value = "";
    showClients();
    updateDashboard();
}
function showClients() {
    let table = document.getElementById("clientsTable");
    table.innerHTML = "<tr><th>Name</th><th>Email</th><th>Action</th></tr>";
    for (let i = 0; i < clients.length; i++) {
        let row = table.insertRow();
        row.insertCell(0).innerText = clients[i].name;
        row.insertCell(1).innerText = clients[i].email;
        let del = document.createElement("button");
        del.innerText = "Delete";
        del.className = "deleteBtn";
        del.onclick = function() {
            deleteClient(i);
        };
        row.insertCell(2).appendChild(del);
    }
    fillClientDropdown();
}
function fillClientDropdown() {
    let select = document.getElementById("projectClient");
    if (select == null) {
        return;
    }
    select.innerHTML = '<option value="">Select Client</option>';
    for (let i = 0; i < clients.length; i++) {
        let opt = document.createElement("option");
        opt.value = clients[i].name;
        opt.innerText = clients[i].name;
        select.appendChild(opt);
    }
}
function deleteClient(index) {
    let ok = confirm("Delete this client?");
    if (ok == true) {
        clients.splice(index, 1);
        saveData();
        showClients();
        updateDashboard();
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
    saveData();
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
        let cell = row.insertCell(4);
        let button = document.createElement("button");
        button.innerText = "Complete";
        button.disabled = projects[i].status == "Completed";
        button.onclick = function() {
            completeProject(i);
        };
        cell.appendChild(button);
        let del = document.createElement("button");
        del.innerText = "Delete";
        del.className = "deleteBtn";
        del.onclick = function() {
            deleteProject(i);
        };
        cell.appendChild(del);
    }
}
function completeProject(index) {
    projects[index].status = "Completed";
    saveData();
    showProjects();
    updateDashboard();
}
function deleteProject(index) {
    let ok = confirm("Delete this project?");
    if (ok == true) {
        projects.splice(index, 1);
        saveData();
        showProjects();
        updateDashboard();
    }
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
    saveData();
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
        let cell = row.insertCell(4);
        let button = document.createElement("button");
        button.innerText = invoices[i].status == "Paid" ? "Paid" : "Mark Paid";
        button.disabled = invoices[i].status == "Paid";
        button.onclick = function() {
            markPaid(i);
        };
        cell.appendChild(button);
        let del = document.createElement("button");
        del.innerText = "Delete";
        del.className = "deleteBtn";
        del.onclick = function() {
            deleteInvoice(i);
        };
        cell.appendChild(del);
    }
}
function markPaid(index) {
    invoices[index].status = "Paid";
    saveData();
    showInvoices();
    updateDashboard();
    alert("Payment marked as paid");
}
function deleteInvoice(index) {
    let ok = confirm("Delete this invoice?");
    if (ok == true) {
        invoices.splice(index, 1);
        saveData();
        showInvoices();
        updateDashboard();
    }
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
    document.getElementById("paymentInfo").innerText = "Received: $" + total + " | Pending: $" + pending;
    let eTable = document.getElementById("earningsTable");
    if (eTable != null) {
        eTable.innerHTML = "<tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th></tr>";
        for (let i = 0; i < invoices.length; i++) {
            let row = eTable.insertRow();
            row.insertCell(0).innerText = invoices[i].number;
            row.insertCell(1).innerText = invoices[i].client;
            row.insertCell(2).innerText = "$" + invoices[i].amount;
            row.insertCell(3).innerText = invoices[i].status;
        }
    }
    showRecentProjects();
    updateChart();
}
function updateChart() {
    let chart = document.getElementById("myChart");
    if (chart == null) {
        return;
    }
    chart.innerHTML = "";
    let last6 = invoices.slice(-6);
    while (last6.length < 6) {
        last6.unshift({ amount: 0 });
    }
    let max = 0;
    for (let i = 0; i < last6.length; i++) {
        if (last6[i].amount > max) {
            max = last6[i].amount;
        }
    }
    if (max == 0) {
        max = 100;
    }
    for (let i = 0; i < last6.length; i++) {
        let h = (last6[i].amount / max) * 100;
        if (h < 10) {
            h = 10;
        }
        let bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = h + "%";
        bar.title = "$" + last6[i].amount;
        chart.appendChild(bar);
    }
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
    let activePage = document.querySelector(".page.active");
    if (activePage == null) {
        return;
    }
    let tables = activePage.querySelectorAll("table");
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
showClients();
showProjects();
showInvoices();
updateDashboard();
