let clients = JSON.parse(localStorage.getItem("fk_clients")) || [];
let projects = JSON.parse(localStorage.getItem("fk_projects")) || [];
let invoices = JSON.parse(localStorage.getItem("fk_invoices")) || [];
let invoiceCounter = Number(localStorage.getItem("fk_invoice_counter")) || 0;

function saveData() {
    localStorage.setItem("fk_clients", JSON.stringify(clients));
    localStorage.setItem("fk_projects", JSON.stringify(projects));
    localStorage.setItem("fk_invoices", JSON.stringify(invoices));
    localStorage.setItem("fk_invoice_counter", String(invoiceCounter));
    showData();
}

function showPage(pageName, btn) {
    let pages = ["dashboard", "clients", "projects", "invoices", "earnings"];
    for (let i = 0; i < pages.length; i++) {
        document.getElementById("page-" + pages[i]).classList.add("hidden");
    }
    document.getElementById("page-" + pageName).classList.remove("hidden");
    let allBtns = document.querySelectorAll(".menu-btn");
    for (let i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove("active");
    }
    if (btn) {
        btn.classList.add("active");
    }
    document.getElementById("sidebar").classList.remove("open");
    window.scrollTo(0, 0);
}

function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("open");
}

function addClient() {
    let name = document.getElementById("clientName").value.trim();
    let email = document.getElementById("clientEmail").value.trim();
    let phone = document.getElementById("clientPhone").value.trim();
    let error = document.getElementById("clientError");
    if (name === "" || email === "" || email.includes("@") === false) {
        error.style.display = "block";
        return;
    }
    error.style.display = "none";
    if (phone === "") phone = "Not Given";
    clients.push({ name: name, email: email, phone: phone });
    document.getElementById("clientName").value = "";
    document.getElementById("clientEmail").value = "";
    document.getElementById("clientPhone").value = "";
    saveData();
    alert("Client Add Ho Gaya!");
}

function editClient(index) {
    let newName = prompt("New Name Likho:", clients[index].name);
    if (newName === null || newName.trim() === "") return;
    let newEmail = prompt("New Email Likho:", clients[index].email);
    if (newEmail === null || newEmail.trim() === "") return;
    clients[index].name = newName.trim();
    clients[index].email = newEmail.trim();
    saveData();
    alert("Client Update Ho Gaya!");
}

function deleteClient(index) {
    if (confirm("Delete karna hai? " + clients[index].name)) {
        clients.splice(index, 1);
        saveData();
    }
}

function addProject() {
    let title = document.getElementById("projectTitle").value.trim();
    let client = document.getElementById("projectClient").value.trim();
    let budget = document.getElementById("projectBudget").value;
    let status = document.getElementById("projectStatus").value;
    if (title === "" || client === "" || budget === "") {
        alert("Sab fields bharo!");
        return;
    }
    if (Number(budget) <= 0) {
        alert("Budget 0 se bara hona chahiye!");
        return;
    }
    projects.push({ title: title, client: client, budget: Number(budget), status: status });
    document.getElementById("projectTitle").value = "";
    document.getElementById("projectClient").value = "";
    document.getElementById("projectBudget").value = "";
    saveData();
    alert("Project Add Ho Gaya!");
}

function deleteProject(index) {
    if (confirm("Delete karna hai?")) {
        projects.splice(index, 1);
        saveData();
    }
}

function addInvoice() {
    let client = document.getElementById("invClient").value.trim();
    let amount = document.getElementById("invAmount").value;
    let status = document.getElementById("invStatus").value;
    if (client === "" || amount === "") {
        alert("Client aur Amount zaroori hai!");
        return;
    }
    if (Number(amount) <= 0) {
        alert("Amount 0 se bara hona chahiye!");
        return;
    }
    invoiceCounter = invoiceCounter + 1;
    let newId = "INV-" + String(invoiceCounter).padStart(3, "0");
    invoices.push({ id: newId, client: client, amount: Number(amount), status: status });
    document.getElementById("invClient").value = "";
    document.getElementById("invAmount").value = "";
    saveData();
    alert("Invoice Ban Gaya! " + newId);
}

function deleteInvoice(index) {
    if (confirm("Delete karna hai?")) {
        invoices.splice(index, 1);
        saveData();
    }
}

function resetData() {
    if (confirm("Sab data clear karna hai?")) {
        localStorage.clear();
        clients = [];
        projects = [];
        invoices = [];
        invoiceCounter = 0;
        showData();
    }
}

function searchClient(word) {
    showData(word.toLowerCase());
}

function showData(filterWord = "") {
    let totalEarned = 0;
    let totalPending = 0;
    for (let i = 0; i < invoices.length; i++) {
        if (invoices[i].status === "Paid") {
            totalEarned = totalEarned + invoices[i].amount;
        } else {
            totalPending = totalPending + invoices[i].amount;
        }
    }
    let activeCount = 0;
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].status === "In Progress") activeCount++;
    }
    document.getElementById("totalEarnings").innerText = "Rs. " + totalEarned.toLocaleString();
    document.getElementById("pendingPayments").innerText = "Rs. " + totalPending.toLocaleString();
    document.getElementById("activeProjects").innerText = activeCount;
    document.getElementById("totalClients").innerText = clients.length;
    document.getElementById("earnTotal").innerText = "Rs. " + totalEarned.toLocaleString();
    document.getElementById("earnPending").innerText = "Rs. " + totalPending.toLocaleString();
    document.getElementById("earnCount").innerText = invoices.length;
    document.getElementById("earnClients").innerText = clients.length;
    document.getElementById("clientCount").innerText = clients.length;
    let total = totalEarned + totalPending;
    let percent = 0;
    if (total > 0) percent = Math.round((totalEarned / total) * 100);
    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressText").innerText = percent + "% payment mil gayi hai. Total: Rs. " + total.toLocaleString();
    let clientHTML = "";
    for (let i = 0; i < clients.length; i++) {
        if (clients[i].name.toLowerCase().includes(filterWord)) {
            clientHTML += "<tr><td><b>" + clients[i].name + "</b></td><td>" + clients[i].email + "</td><td>" + clients[i].phone + "</td><td><button class='btn btn-small btn-edit' onclick='editClient(" + i + ")'>Edit</button><button class='btn btn-small btn-red' onclick='deleteClient(" + i + ")'>Delete</button></td></tr>";
        }
    }
    if (clientHTML === "") clientHTML = "<tr><td colspan='4'>No client found. Add a new client.</td></tr>";
    document.getElementById("clientList").innerHTML = clientHTML;
    let topHTML = "";
    if (clients.length === 0) {
        topHTML = "<p style='padding:10px 0;color:#64748b;font-size:14px;'>No clients yet. Add a client to see it here.</p>";
    }
    for (let i = 0; i < clients.length && i < 3; i++) {
        topHTML += "<p style='padding:10px 0;border-bottom:1px solid #f1f5f9;'><b>" + clients[i].name + "</b><br><span style='color:#64748b;font-size:13px;'>" + clients[i].email + "</span></p>";
    }
    document.getElementById("topClients").innerHTML = topHTML;
    let projectHTML = "";
    for (let i = 0; i < projects.length; i++) {
        let badge = projects[i].status === "Completed" ? "completed" : "progress";
        projectHTML += "<tr><td><b>" + projects[i].title + "</b></td><td>" + projects[i].client + "</td><td>Rs. " + projects[i].budget.toLocaleString() + "</td><td><span class='badge " + badge + "'>" + projects[i].status + "</span></td><td><button class='btn btn-small btn-red' onclick='deleteProject(" + i + ")'>Delete</button></td></tr>";
    }
    if (projectHTML === "") projectHTML = "<tr><td colspan='5'>No project found. Add a new project.</td></tr>";
    document.getElementById("projectList").innerHTML = projectHTML;
    let invoiceHTML = "";
    for (let i = 0; i < invoices.length; i++) {
        let badge = invoices[i].status === "Paid" ? "paid" : "pending";
        invoiceHTML += "<tr><td><b>" + invoices[i].id + "</b></td><td>" + invoices[i].client + "</td><td>Rs. " + invoices[i].amount.toLocaleString() + "</td><td><span class='badge " + badge + "'>" + invoices[i].status + "</span></td><td><button class='btn btn-small btn-red' onclick='deleteInvoice(" + i + ")'>Delete</button></td></tr>";
    }
    if (invoiceHTML === "") invoiceHTML = "<tr><td colspan='5'>No invoice found. Generate a new invoice.</td></tr>";
    document.getElementById("invoiceList").innerHTML = invoiceHTML;
    let recentHTML = "";
    let start = invoices.length - 3;
    if (start < 0) start = 0;
    for (let i = start; i < invoices.length; i++) {
        let badge = invoices[i].status === "Paid" ? "paid" : "pending";
        recentHTML += "<tr><td>" + invoices[i].id + "</td><td>" + invoices[i].client + "</td><td>Rs. " + invoices[i].amount.toLocaleString() + "</td><td><span class='badge " + badge + "'>" + invoices[i].status + "</span></td></tr>";
    }
    if (recentHTML === "") recentHTML = "<tr><td colspan='4'>No invoices yet.</td></tr>";
    document.getElementById("recentInvoices").innerHTML = recentHTML;
}

showData();
