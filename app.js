
let clients = JSON.parse(localStorage.getItem("clients")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

let invoiceCount = Number(localStorage.getItem("invoiceCount")) || 0;

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuToggle = document.getElementById("menuToggle");

function saveData() {
    localStorage.setItem("clients", JSON.stringify(clients));
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("invoices", JSON.stringify(invoices));
    localStorage.setItem("invoiceCount", invoiceCount);
}

function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
}

menuToggle.addEventListener("click", openMenu);
overlay.addEventListener("click", closeMenu);

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});

function showPage(pageName) {
    let pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    document.getElementById(pageName).classList.add("active");

    let buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(function(button) {
        button.classList.remove("active");

        if (button.dataset.page === pageName) {
            button.classList.add("active");
        }
    });

    let titles = {
        dashboard: "Dashboard",
        clients: "Clients",
        projects: "Projects",
        earnings: "Earnings",
        invoices: "Invoices"
    };

    document.getElementById("pageTitle").innerText = titles[pageName];

    closeMenu();
}

document.querySelectorAll(".nav-btn").forEach(function(button) {
    button.addEventListener("click", function() {
        showPage(button.dataset.page);
    });
});

document.querySelectorAll("[data-open]").forEach(function(button) {
    button.addEventListener("click", function() {
        showPage(button.dataset.open);
    });
});

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

function addClient(event) {
    event.preventDefault();

    let name = document.getElementById("clientName").value.trim();
    let email = document.getElementById("clientEmail").value.trim();
    let phone = document.getElementById("clientPhone").value.trim();

    if (name === "" || email === "") {
        alert("Please enter client details.");
        return;
    }

    let client = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone
    };

    clients.push(client);

    saveData();
    renderAll();

    document.getElementById("clientForm").reset();

    alert("Client added successfully!");
}

document.getElementById("clientForm").addEventListener("submit", addClient);

function deleteClient(id) {
    let used = projects.some(function(project) {
        return project.clientId === id;
    });

    if (used) {
        alert("Delete this client's projects first.");
        return;
    }

    if (confirm("Are you sure you want to delete this client?")) {
        clients = clients.filter(function(client) {
            return client.id !== id;
        });

        saveData();
        renderAll();
    }
}

function renderClients() {
    let table = document.getElementById("clientTable");

    if (clients.length === 0) {
        table.innerHTML = '<tr><td colspan="4" class="empty-message">No clients found.</td></tr>';
    } else {
        table.innerHTML = clients.map(function(client) {
            return `
                <tr>
                    <td>${escapeHTML(client.name)}</td>
                    <td>${escapeHTML(client.email)}</td>
                    <td>${escapeHTML(client.phone || "-")}</td>
                    <td>
                        <button class="action-btn delete-btn" onclick="deleteClient(${client.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    let options = '<option value="">Select Client</option>';

    clients.forEach(function(client) {
        options += `<option value="${client.id}">${escapeHTML(client.name)}</option>`;
    });

    document.getElementById("projectClient").innerHTML = options;
    document.getElementById("invoiceClient").innerHTML = options;
}

function addProject(event) {
    event.preventDefault();

    let name = document.getElementById("projectName").value.trim();
    let clientId = Number(document.getElementById("projectClient").value);
    let budget = Number(document.getElementById("projectBudget").value);

    if (name === "" || !clientId || budget <= 0 || !Number.isFinite(budget)) {
        alert("Please enter valid project details.");
        return;
    }

    let project = {
        id: Date.now(),
        name: name,
        clientId: clientId,
        budget: budget,
        status: "Active"
    };

    projects.push(project);

    saveData();
    renderAll();

    document.getElementById("projectForm").reset();

    alert("Project added successfully!");
}

document.getElementById("projectForm").addEventListener("submit", addProject);

function deleteProject(id) {
    let used = invoices.some(function(invoice) {
        return invoice.projectId === id;
    });

    if (used) {
        alert("Delete the invoice first.");
        return;
    }

    if (confirm("Delete this project?")) {
        projects = projects.filter(function(project) {
            return project.id !== id;
        });

        saveData();
        renderAll();
    }
}

function completeProject(id) {
    let project = projects.find(function(item) {
        return item.id === id;
    });

    if (project) {
        if (project.status === "Active") {
            project.status = "Completed";
        } else {
            project.status = "Active";
        }

        saveData();
        renderAll();
    }
}

function renderProjects() {
    let table = document.getElementById("projectTable");

    if (projects.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="empty-message">No projects found.</td></tr>';
    } else {
        table.innerHTML = projects.map(function(project) {
            let client = clients.find(function(item) {
                return item.id === project.clientId;
            });

            return `
                <tr>
                    <td>${escapeHTML(project.name)}</td>
                    <td>${escapeHTML(client ? client.name : "Unknown")}</td>
                    <td>$${project.budget.toLocaleString()}</td>
                    <td>${escapeHTML(project.status)}</td>
                    <td>
                        <button class="action-btn" onclick="completeProject(${project.id})">
                            ${project.status === "Active" ? "Complete" : "Reopen"}
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteProject(${project.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    let options = '<option value="">Select Project</option>';

    projects.forEach(function(project) {
        options += `<option value="${project.id}">${escapeHTML(project.name)}</option>`;
    });

    document.getElementById("invoiceProject").innerHTML = options;
}

document.getElementById("invoiceClient").addEventListener("change", function() {
    let clientId = Number(this.value);

    let options = '<option value="">Select Project</option>';

    projects.filter(function(project) {
        return project.clientId === clientId;
    }).forEach(function(project) {
        options += `<option value="${project.id}">${escapeHTML(project.name)}</option>`;
    });

    document.getElementById("invoiceProject").innerHTML = options;
    document.getElementById("invoiceAmount").value = "";
});

document.getElementById("invoiceProject").addEventListener("change", function() {
    let projectId = Number(this.value);

    let project = projects.find(function(item) {
        return item.id === projectId;
    });

    if (project) {
        document.getElementById("invoiceAmount").value = project.budget;
    }
});

function nextInvoiceNumber() {
    return "INV-" + String(invoiceCount + 1).padStart(3, "0");
}

function addInvoice(event) {
    event.preventDefault();

    let clientId = Number(document.getElementById("invoiceClient").value);
    let projectId = Number(document.getElementById("invoiceProject").value);
    let amount = Number(document.getElementById("invoiceAmount").value);
    let status = document.getElementById("invoiceStatus").value;

    let project = projects.find(function(item) {
        return item.id === projectId && item.clientId === clientId;
    });

    let client = clients.find(function(item) {
        return item.id === clientId;
    });

    if (!client || !project || amount <= 0 || !Number.isFinite(amount)) {
        alert("Please select valid invoice details.");
        return;
    }

    invoiceCount++;

    let invoice = {
        id: Date.now(),
        number: "INV-" + String(invoiceCount).padStart(3, "0"),
        clientId: clientId,
        projectId: projectId,
        clientName: client.name,
        projectName: project.name,
        amount: amount,
        status: status,
        date: new Date().toLocaleDateString()
    };

    invoices.push(invoice);

    saveData();
    renderAll();

    document.getElementById("invoiceForm").reset();
    document.getElementById("invoiceNumber").value = nextInvoiceNumber();

    alert("Invoice generated successfully!");
}

document.getElementById("invoiceForm").addEventListener("submit", addInvoice);

function deleteInvoice(id) {
    if (confirm("Delete this invoice?")) {
        invoices = invoices.filter(function(invoice) {
            return invoice.id !== id;
        });

        saveData();
        renderAll();
    }
}

function printInvoice(id) {
    let invoice = invoices.find(function(item) {
        return item.id === id;
    });

    if (!invoice) {
        return;
    }

    let printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Please allow pop-ups to print the invoice.");
        return;
    }

    printWindow.document.write(`
        <html>
        <head>
            <title>${escapeHTML(invoice.number)}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 35px;
                }
                h1, h2 {
                    color: #2964e8;
                }
                p {
                    margin: 15px 0;
                }
            </style>
        </head>
        <body>
            <h1>FreelanceKit</h1>
            <h2>INVOICE</h2>
            <p>Invoice Number: ${escapeHTML(invoice.number)}</p>
            <p>Date: ${escapeHTML(invoice.date)}</p>
            <hr>
            <h3>Bill To</h3>
            <p>${escapeHTML(invoice.clientName)}</p>
            <h3>Project</h3>
            <p>${escapeHTML(invoice.projectName)}</p>
            <h2>Amount: $${invoice.amount.toLocaleString()}</h2>
            <p>Status: ${escapeHTML(invoice.status)}</p>
            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>
        </body>
        </html>
    `);

    printWindow.document.close();
}

function renderInvoices() {
    let table = document.getElementById("invoiceTable");

    if (invoices.length === 0) {
        table.innerHTML = '<tr><td colspan="6" class="empty-message">No invoices found.</td></tr>';
    } else {
        table.innerHTML = invoices.map(function(invoice) {
            return `
                <tr>
                    <td>${escapeHTML(invoice.number)}</td>
                    <td>${escapeHTML(invoice.clientName)}</td>
                    <td>${escapeHTML(invoice.projectName)}</td>
                    <td>$${invoice.amount.toLocaleString()}</td>
                    <td>${escapeHTML(invoice.status)}</td>
                    <td>
                        <button class="action-btn" onclick="printInvoice(${invoice.id})">Print</button>
                        <button class="action-btn delete-btn" onclick="deleteInvoice(${invoice.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join("");
    }
}

function renderEarnings() {
    let received = 0;
    let pending = 0;

    invoices.forEach(function(invoice) {
        if (invoice.status === "Paid") {
            received += invoice.amount;
        } else {
            pending += invoice.amount;
        }
    });

    document.getElementById("receivedAmount").innerText = "$" + received.toLocaleString();
    document.getElementById("pendingAmount").innerText = "$" + pending.toLocaleString();

    let table = document.getElementById("earningTable");

    table.innerHTML = invoices.map(function(invoice) {
        return `
            <tr>
                <td>${escapeHTML(invoice.number)}</td>
                <td>${escapeHTML(invoice.clientName)}</td>
                <td>$${invoice.amount.toLocaleString()}</td>
                <td>${escapeHTML(invoice.status)}</td>
            </tr>
        `;
    }).join("") || '<tr><td colspan="4" class="empty-message">No payment records.</td></tr>';
}

function renderDashboard() {
    let received = 0;
    let pending = 0;

    invoices.forEach(function(invoice) {
        if (invoice.status === "Paid") {
            received += invoice.amount;
        } else {
            pending += invoice.amount;
        }
    });

    let active = projects.filter(function(project) {
        return project.status === "Active";
    }).length;

    document.getElementById("totalEarnings").innerText = "$" + received.toLocaleString();
    document.getElementById("activeProjects").innerText = active;
    document.getElementById("totalClients").innerText = clients.length;
    document.getElementById("pendingPayments").innerText = "$" + pending.toLocaleString();

    let recent = document.getElementById("recentProjects");

    if (projects.length === 0) {
        recent.innerHTML = '<p class="empty-message">No projects available.</p>';
    } else {
        recent.innerHTML = projects.slice(-5).reverse().map(function(project) {
            return `
                <p class="recent-item">
                    ${escapeHTML(project.name)} - ${escapeHTML(project.status)}
                </p>
            `;
        }).join("");
    }
}

function renderAll() {
    renderClients();
    renderProjects();
    renderInvoices();
    renderEarnings();
    renderDashboard();
}

document.getElementById("newInvoice").addEventListener("click", function() {
    showPage("invoices");
});

document.getElementById("quickInvoice").addEventListener("click", function() {
    showPage("invoices");
});

document.getElementById("searchInput").addEventListener("input", function() {
    let search = this.value.toLowerCase();

    let activePage = document.querySelector(".page.active");
    let rows = activePage.querySelectorAll("tbody tr");

    rows.forEach(function(row) {
        let text = row.innerText.toLowerCase();

        if (text.includes(search)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

document.getElementById("invoiceNumber").value = nextInvoiceNumber();

renderAll();
