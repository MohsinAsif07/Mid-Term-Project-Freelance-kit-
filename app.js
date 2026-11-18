let clients = JSON.parse(localStorage.getItem("clients")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
let invoiceCount = Number(localStorage.getItem("invoiceCount")) || 0;

let sidebar = document.getElementById("sidebar");
let overlay = document.getElementById("overlay");

function saveData() {
    localStorage.setItem("clients", JSON.stringify(clients));
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("invoices", JSON.stringify(invoices));
    localStorage.setItem("invoiceCount", invoiceCount);
}

function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
}

function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}

document.getElementById("menuToggle").onclick = openMenu;
overlay.onclick = closeMenu;

function showPage(pageName) {
    let pages = document.querySelectorAll(".page");
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    }
    document.getElementById(pageName).classList.add("active");

    let buttons = document.querySelectorAll(".nav-btn");
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].dataset.page === pageName) {
            buttons[i].classList.add("active");
        } else {
            buttons[i].classList.remove("active");
        }
    }

    let titles = {
        dashboard: "Dashboard",
        clients: "Clients",
        projects: "Projects",
        earnings: "Earnings",
        invoices: "Invoices"
    };
    document.getElementById("pageTitle").innerText = titles[pageName];
    document.getElementById("searchInput").value = "";
    closeMenu();
}

let navButtons = document.querySelectorAll(".nav-btn");
for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].onclick = function() {
        showPage(this.dataset.page);
    };
}

let openButtons = document.querySelectorAll("[data-open]");
for (let i = 0; i < openButtons.length; i++) {
    openButtons[i].onclick = function() {
        showPage(this.dataset.open);
    };
}

function getClientName(id) {
    for (let i = 0; i < clients.length; i++) {
        if (clients[i].id === id) {
            return clients[i].name;
        }
    }
    return "Unknown";
}

function getProjectName(id) {
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === id) {
            return projects[i].name;
        }
    }
    return "Unknown";
}

document.getElementById("clientForm").onsubmit = function(event) {
    event.preventDefault();
    let name = document.getElementById("clientName").value.trim();
    let email = document.getElementById("clientEmail").value.trim();
    let phone = document.getElementById("clientPhone").value.trim();
    if (name === "" || email === "") {
        alert("Please enter client name and email.");
        return;
    }
    clients.push({ id: Date.now(), name: name, email: email, phone: phone });
    saveData();
    showAll();
    document.getElementById("clientForm").reset();
};

function deleteClient(id) {
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].clientId === id) {
            alert("Delete this client's projects first.");
            return;
        }
    }
    if (confirm("Delete this client?")) {
        let newList = [];
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].id !== id) {
                newList.push(clients[i]);
            }
        }
        clients = newList;
        saveData();
        showAll();
    }
}

document.getElementById("projectForm").onsubmit = function(event) {
    event.preventDefault();
    let name = document.getElementById("projectName").value.trim();
    let clientId = Number(document.getElementById("projectClient").value);
    let budget = Number(document.getElementById("projectBudget").value);
    if (name === "" || clientId === 0 || budget <= 0) {
        alert("Please enter valid project details.");
        return;
    }
    projects.push({ id: Date.now(), name: name, clientId: clientId, budget: budget, status: "Active" });
    saveData();
    showAll();
    document.getElementById("projectForm").reset();
};

function deleteProject(id) {
    for (let i = 0; i < invoices.length; i++) {
        if (invoices[i].projectId === id) {
            alert("Delete the related invoice first.");
            return;
        }
    }
    if (confirm("Delete this project?")) {
        let newList = [];
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id !== id) {
                newList.push(projects[i]);
            }
        }
        projects = newList;
        saveData();
        showAll();
    }
}

function changeStatus(id) {
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === id) {
            if (projects[i].status === "Active") {
                projects[i].status = "Completed";
            } else {
                projects[i].status = "Active";
            }
        }
    }
    saveData();
    showAll();
}

document.getElementById("invoiceClient").onchange = function() {
    let clientId = Number(this.value);
    let html = '<option value="">Select project</option>';
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].clientId === clientId) {
            html += '<option value="' + projects[i].id + '">' + projects[i].name + '</option>';
        }
    }
    document.getElementById("invoiceProject").innerHTML = html;
    document.getElementById("invoiceAmount").value = "";
};

document.getElementById("invoiceProject").onchange = function() {
    let projectId = Number(this.value);
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === projectId) {
            document.getElementById("invoiceAmount").value = projects[i].budget;
        }
    }
};

document.getElementById("invoiceForm").onsubmit = function(event) {
    event.preventDefault();
    let clientId = Number(document.getElementById("invoiceClient").value);
    let projectId = Number(document.getElementById("invoiceProject").value);
    let amount = Number(document.getElementById("invoiceAmount").value);
    let status = document.getElementById("invoiceStatus").value;
    if (clientId === 0 || projectId === 0 || amount <= 0) {
        alert("Please select a valid client, project and amount.");
        return;
    }
    invoiceCount = invoiceCount + 1;
    let number = "INV-" + String(invoiceCount).padStart(3, "0");
    invoices.push({
        id: Date.now(),
        number: number,
        clientId: clientId,
        projectId: projectId,
        clientName: getClientName(clientId),
        projectName: getProjectName(projectId),
        amount: amount,
        status: status,
        date: new Date().toLocaleDateString()
    });
    saveData();
    showAll();
    document.getElementById("invoiceForm").reset();
    document.getElementById("invoiceNumber").value = "INV-" + String(invoiceCount + 1).padStart(3, "0");
};

function deleteInvoice(id) {
    if (confirm("Delete this invoice?")) {
        let newList = [];
        for (let i = 0; i < invoices.length; i++) {
            if (invoices[i].id !== id) {
                newList.push(invoices[i]);
            }
        }
        invoices = newList;
        saveData();
        showAll();
    }
}

function printInvoice(id) {
    let oneInvoice = null;
    for (let i = 0; i < invoices.length; i++) {
        if (invoices[i].id === id) {
            oneInvoice = invoices[i];
        }
    }
    if (oneInvoice === null) {
        return;
    }
    let win = window.open("", "_blank");
    win.document.write("<h1>FreelanceKit</h1><h2>INVOICE</h2><p>Invoice: " + oneInvoice.number + "</p><p>Date: " + oneInvoice.date + "</p><p>Client: " + oneInvoice.clientName + "</p><p>Project: " + oneInvoice.projectName + "</p><h2>Amount: Rs. " + oneInvoice.amount + "</h2><p>Status: " + oneInvoice.status + "</p>");
    win.document.close();
    win.print();
}

function showClients() {
    let table = document.getElementById("clientTable");
    let html = "";
    if (clients.length === 0) {
        html = '<tr><td colspan="4" class="empty-message">No clients added yet.</td></tr>';
    } else {
        for (let i = 0; i < clients.length; i++) {
            let phone = clients[i].phone;
            if (phone === "") phone = "-";
            html += "<tr><td>" + clients[i].name + "</td><td>" + clients[i].email + "</td><td>" + phone + "</td><td><button class='action-btn delete-btn' onclick='deleteClient(" + clients[i].id + ")'>Delete</button></td></tr>";
        }
    }
    table.innerHTML = html;

    let options = '<option value="">Select client</option>';
    for (let i = 0; i < clients.length; i++) {
        options += '<option value="' + clients[i].id + '">' + clients[i].name + '</option>';
    }
    document.getElementById("projectClient").innerHTML = options;
    document.getElementById("invoiceClient").innerHTML = options;
}

function showProjects() {
    let table = document.getElementById("projectTable");
    let html = "";
    if (projects.length === 0) {
        html = '<tr><td colspan="5" class="empty-message">No projects added yet.</td></tr>';
    } else {
        for (let i = 0; i < projects.length; i++) {
            let btnText = "Complete";
            if (projects[i].status !== "Active") btnText = "Reopen";
            html += "<tr><td>" + projects[i].name + "</td><td>" + getClientName(projects[i].clientId) + "</td><td>Rs. " + projects[i].budget + "</td><td>" + projects[i].status + "</td><td><button class='action-btn' onclick='changeStatus(" + projects[i].id + ")'>" + btnText + "</button><button class='action-btn delete-btn' onclick='deleteProject(" + projects[i].id + ")'>Delete</button></td></tr>";
        }
    }
    table.innerHTML = html;
}

function showInvoices() {
    let table = document.getElementById("invoiceTable");
    let html = "";
    if (invoices.length === 0) {
        html = '<tr><td colspan="6" class="empty-message">No invoices created yet.</td></tr>';
    } else {
        for (let i = 0; i < invoices.length; i++) {
            html += "<tr><td>" + invoices[i].number + "</td><td>" + invoices[i].clientName + "</td><td>" + invoices[i].projectName + "</td><td>Rs. " + invoices[i].amount + "</td><td>" + invoices[i].status + "</td><td><button class='action-btn' onclick='printInvoice(" + invoices[i].id + ")'>Print</button><button class='action-btn delete-btn' onclick='deleteInvoice(" + invoices[i].id + ")'>Delete</button></td></tr>";
        }
    }
    table.innerHTML = html;
}

function showEarnings() {
    let received = 0;
    let pending = 0;
    for (let i = 0; i < invoices.length; i++) {
        if (invoices[i].status === "Paid") {
            received = received + Number(invoices[i].amount);
        } else {
            pending = pending + Number(invoices[i].amount);
        }
    }
    document.getElementById("receivedAmount").innerText = "Rs. " + received;
    document.getElementById("pendingAmount").innerText = "Rs. " + pending;

    let html = "";
    for (let i = 0; i < invoices.length; i++) {
        html += "<tr><td>" + invoices[i].number + "</td><td>" + invoices[i].clientName + "</td><td>Rs. " + invoices[i].amount + "</td><td>" + invoices[i].status + "</td></tr>";
    }
    if (html === "") html = '<tr><td colspan="4" class="empty-message">No payment records.</td></tr>';
    document.getElementById("earningTable").innerHTML = html;
}

function showDashboard() {
    let received = 0;
    let pending = 0;
    for (let i = 0; i < invoices.length; i++) {
        if (invoices[i].status === "Paid") {
            received = received + Number(invoices[i].amount);
        } else {
            pending = pending + Number(invoices[i].amount);
        }
    }
    let active = 0;
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].status === "Active") active = active + 1;
    }
    document.getElementById("totalEarnings").innerText = "Rs. " + received;
    document.getElementById("activeProjects").innerText = active;
    document.getElementById("totalClients").innerText = clients.length;
    document.getElementById("pendingPayments").innerText = "Rs. " + pending;

    let recent = document.getElementById("recentProjects");
    if (projects.length === 0) {
        recent.innerHTML = '<p class="empty-message">No projects available.</p>';
    } else {
        let html = "";
        let start = projects.length - 5;
        if (start < 0) start = 0;
        for (let i = projects.length - 1; i >= start; i--) {
            html += '<p class="recent-item">' + projects[i].name + " - " + projects[i].status + '</p>';
        }
        recent.innerHTML = html;
    }
}

function showAll() {
    showClients();
    showProjects();
    showInvoices();
    showEarnings();
    showDashboard();
}

document.getElementById("newInvoice").onclick = function() {
    showPage("invoices");
};

document.getElementById("searchInput").oninput = function() {
    let search = this.value.toLowerCase();
    let page = document.querySelector(".page.active");
    let rows = page.querySelectorAll("tbody tr");
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].innerText.toLowerCase().includes(search)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
};

document.getElementById("invoiceNumber").value = "INV-" + String(invoiceCount + 1).padStart(3, "0");
showAll();
