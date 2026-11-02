let clients = [
    {id:1, name:"Sarah Khan", email:"sarah@gmail.com", phone:"0300-1234567"},
    {id:2, name:"John Smith", email:"john@gmail.com", phone:"0301-7654321"}
];
let projects = [
    {id:1, name:"Logo Design", client:"Sarah Khan", budget:300, status:"Completed"},
    {id:2, name:"Website Design", client:"John Smith", budget:500, status:"In Progress"}
];
let earnings = [
    {project:"Logo Design", amount:300, status:"paid"},
    {project:"Website Design", amount:200, status:"pending"}
];

function showPage(pageName){
    // hide all pages
    let allPages = document.querySelectorAll('.page');
    for(let i=0;i<allPages.length;i++){
        allPages[i].classList.remove('active');
    }
    document.getElementById(pageName).classList.add('active');

    // change heading
    document.getElementById('mainHeading').innerText = pageName;

    // active button
    let btns = document.querySelectorAll('.nav-button');
    for(let b of btns){ b.classList.remove('active'); }
    event.target.classList.add('active');

    if(pageName=='dashboard'){ updateDashboard(); }
}

function updateDashboard(){
    document.getElementById('totalClients').innerText = clients.length;
    let active = projects.filter(p=>p.status=='In Progress').length;
    document.getElementById('activeProjects').innerText = active;
    
    let total = 0;
    let pending = 0;
    for(let e of earnings){
        total += e.amount;
        if(e.status=='pending') pending += e.amount;
    }
    document.getElementById('totalEarnings').innerText = '$' + total;
    document.getElementById('pendingPayments').innerText = '$' + pending;

    // recent projects table
    let html = '<table border="1" cellpadding="8" style="border-collapse:collapse; width:100%;"><tr><th>Project</th><th>Client</th><th>Budget</th><th>Status</th></tr>';
    for(let p of projects){
        html += '<tr><td>'+p.name+'</td><td>'+p.client+'</td><td>$'+p.budget+'</td><td>'+p.status+'</td></tr>';
    }
    html += '</table>';
    document.getElementById('dashboardProjects').innerHTML = html;
    
    showClientsTable();
    showProjectsTable();
    showEarningsTable();
}

function addClient(){
    let name = document.getElementById('clientName').value;
    let email = document.getElementById('clientEmail').value;
    let phone = document.getElementById('clientPhone').value;
    if(name=='' || email==''){
        alert('Please enter name and email');
        return;
    }
    clients.push({id:clients.length+1, name:name, email:email, phone:phone});
    document.getElementById('clientName').value='';
    document.getElementById('clientEmail').value='';
    document.getElementById('clientPhone').value='';
    showClientsTable();
    updateDashboard();
}

function showClientsTable(){
    let t = '<tr><th>Name</th><th>Email</th><th>Phone</th></tr>';
    for(let c of clients){
        t += '<tr><td>'+c.name+'</td><td>'+c.email+'</td><td>'+c.phone+'</td></tr>';
    }
    let tbl = document.getElementById('clientsTable');
    if(tbl) tbl.innerHTML = t;

    // update dropdowns
    let opt = '<option>Select Client</option>';
    for(let c of clients){ opt += '<option>'+c.name+'</option>'; }
    let pc = document.getElementById('projectClient');
    if(pc) pc.innerHTML = opt;
}

function addProject(){
    let name = document.getElementById('projectName').value;
    let client = document.getElementById('projectClient').value;
    let budget = document.getElementById('projectBudget').value;
    let status = document.getElementById('projectStatus').value;
    if(name=='' || client=='Select Client' || budget==''){
        alert('Fill all fields');
        return;
    }
    projects.push({id:projects.length+1, name:name, client:client, budget:budget, status:status});
    document.getElementById('projectName').value='';
    document.getElementById('projectBudget').value='';
    showProjectsTable();
    updateDashboard();
}

function showProjectsTable(){
    let t = '<tr><th>Project</th><th>Client</th><th>Budget</th><th>Status</th></tr>';
    for(let p of projects){
        t += '<tr><td>'+p.name+'</td><td>'+p.client+'</td><td>$'+p.budget+'</td><td>'+p.status+'</td></tr>';
    }
    let tbl = document.getElementById('projectsTable');
    if(tbl) tbl.innerHTML = t;

    let opt = '<option>Select Project</option>';
    for(let p of projects){ opt += '<option>'+p.name+'</option>'; }
    let ep = document.getElementById('earningProject');
    if(ep) ep.innerHTML = opt;
}

function addEarning(){
    let proj = document.getElementById('earningProject').value;
    let amt = document.getElementById('earningAmount').value;
    let stat = document.getElementById('earningStatus').value;
    if(proj=='Select Project' || amt==''){
        alert('select project and amount');
        return;
    }
    earnings.push({project:proj, amount:parseInt(amt), status:stat});
    document.getElementById('earningAmount').value='';
    showEarningsTable();
    updateDashboard();
}

function showEarningsTable(){
    let t = '<tr><th>Project</th><th>Amount</th><th>Status</th></tr>';
    for(let e of earnings){
        t += '<tr><td>'+e.project+'</td><td>$'+e.amount+'</td><td>'+e.status+'</td></tr>';
    }
    let tbl = document.getElementById('earningsTable');
    if(tbl) tbl.innerHTML = t;
    let it = document.getElementById('invoicesTable');
    if(it) it.innerHTML = t;
}

// first time load
updateDashboard();
