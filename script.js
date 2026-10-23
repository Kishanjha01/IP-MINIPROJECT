
// 1. Sample customer data
var sampleCustomers = [
    { id: 1, name: "Asha Patil", email: "asha@example.com", phone: "9876543210", company: "Patil Traders", status: "Active" },
    { id: 2, name: "Rahul Jadhav", email: "rahul@example.com", phone: "9123456780", company: "Jadhav Foods", status: "Lead" },
    { id: 3, name: "Sneha Kulkarni", email: "sneha@example.com", phone: "9988776655", company: "Kulkarni Textiles", status: "Inactive" }
];

// 2. Load saved customers from Local Storage
var savedCustomers = localStorage.getItem("crmCustomers");

var customers = savedCustomers !== null
    ? JSON.parse(savedCustomers)
    : sampleCustomers;

var nextId = customers.length > 0
    ? Math.max(...customers.map(function(c) {
        return c.id;
    })) + 1
    : 1;

var editingId = null;

// 3. Save customer data to Local Storage
function saveCustomersToStorage() {
    localStorage.setItem("crmCustomers", JSON.stringify(customers));
}

// 4. Show customers in the table
function showCustomers() {
    var search = document.getElementById("searchBox").value.toLowerCase();
    var statusFilter = document.getElementById("statusFilter").value;
    var table = document.getElementById("customerTable");
    var rows = "";

    for (var i = 0; i < customers.length; i++) {
        var c = customers[i];

        var text = (c.name + " " + c.email + " " + c.company).toLowerCase();

        if (
            text.indexOf(search) === -1 ||
            (statusFilter !== "All" && c.status !== statusFilter)
        ) {
            continue;
        }

        rows += "<tr>" +
            "<td>" + c.name + "</td>" +
            "<td>" + c.email + "</td>" +
            "<td>" + c.phone + "</td>" +
            "<td>" + c.company + "</td>" +
            "<td><span class='badge " + c.status + "'>" + c.status + "</span></td>" +
            "<td>" +
                "<button class='edit' onclick='editCustomer(" + c.id + ")'>Edit</button> " +
                "<button class='delete' onclick='deleteCustomer(" + c.id + ")'>Delete</button>" +
            "</td>" +
        "</tr>";
    }

    if (rows === "") {
        rows = "<tr><td colspan='6' class='empty'>No customers found. Add one using the form above.</td></tr>";
    }

    table.innerHTML = rows;
    updateStats();
}

// 5. Update the summary boxes
function updateStats() {
    var leads = 0, active = 0, inactive = 0;

    for (var i = 0; i < customers.length; i++) {
        if (customers[i].status === "Lead") leads++;
        if (customers[i].status === "Active") active++;
        if (customers[i].status === "Inactive") inactive++;
    }

    document.getElementById("totalCount").textContent = customers.length;
    document.getElementById("leadCount").textContent = leads;
    document.getElementById("activeCount").textContent = active;
    document.getElementById("inactiveCount").textContent = inactive;
}

// 6. Add a new customer or update an existing customer
function saveCustomer() {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var company = document.getElementById("company").value.trim();
    var status = document.getElementById("status").value;

    if (name === "" || email === "") {
        document.getElementById("message").textContent =
            "Please enter at least a name and an email.";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        document.getElementById("message").textContent =
            "Please enter a valid email.";
        return;
    }

    if (editingId === null) {
        customers.push({
            id: nextId,
            name: name,
            email: email,
            phone: phone,
            company: company,
            status: status
        });

        nextId++;
    } else {
        for (var i = 0; i < customers.length; i++) {
            if (customers[i].id === editingId) {
                customers[i].name = name;
                customers[i].email = email;
                customers[i].phone = phone;
                customers[i].company = company;
                customers[i].status = status;
            }
        }
    }

    saveCustomersToStorage();
    clearForm();
    showCustomers();
}

// 7. Edit a customer's details
function editCustomer(id) {
    for (var i = 0; i < customers.length; i++) {
        if (customers[i].id === id) {
            document.getElementById("name").value = customers[i].name;
            document.getElementById("email").value = customers[i].email;
            document.getElementById("phone").value = customers[i].phone;
            document.getElementById("company").value = customers[i].company;
            document.getElementById("status").value = customers[i].status;
        }
    }

    editingId = id;
    document.getElementById("formTitle").textContent = "Edit customer";
    document.getElementById("saveBtn").textContent = "Update customer";
    document.getElementById("message").textContent = "";

    window.scrollTo(0, 0);
}

// 8. Delete a customer
function deleteCustomer(id) {
    if (confirm("Delete this customer?")) {
        var remaining = [];

        for (var i = 0; i < customers.length; i++) {
            if (customers[i].id !== id) {
                remaining.push(customers[i]);
            }
        }

        customers = remaining;

        saveCustomersToStorage();
        showCustomers();
    }
}

// 9. Clear the form
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("company").value = "";
    document.getElementById("status").value = "Lead";
    document.getElementById("message").textContent = "";
    document.getElementById("formTitle").textContent = "Add a customer";
    document.getElementById("saveBtn").textContent = "Save customer";

    editingId = null;
}

// 10. Display customers when the page opens
showCustomers();

// 11. Export customer records to CSV
function exportCustomers() {
    if (customers.length === 0) {
        alert("There are no customers to export.");
        return;
    }

    var headers = ["ID", "Name", "Email", "Phone", "Company", "Status"];

    var rows = customers.map(function(c) {
        return [c.id, c.name, c.email, c.phone, c.company, c.status];
    });

    function escapeCSV(value) {
        return '"' + String(value ?? "").replace(/"/g, '""') + '"';
    }

    var csv = [headers, ...rows]
        .map(function(row) {
            return row.map(escapeCSV).join(",");
        })
        .join("\r\n");

    var blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");

    link.href = url;
    link.download = "customers.csv";
    link.click();

    URL.revokeObjectURL(url);
}
