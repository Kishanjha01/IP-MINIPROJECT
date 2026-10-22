  // 1. A list (array) that stores all customers
  var customers = [
    { id: 1, name: "Asha Patil", email: "asha@example.com", phone: "9876543210", company: "Patil Traders", status: "Active" },
    { id: 2, name: "Rahul Jadhav", email: "rahul@example.com", phone: "9123456780", company: "Jadhav Foods", status: "Lead" },
    { id: 3, name: "Sneha Kulkarni", email: "sneha@example.com", phone: "9988776655", company: "Kulkarni Textiles", status: "Inactive" }
  ];

  var nextId = 4;        // the id given to the next new customer
  var editingId = null;  // remembers which customer we are editing (null = adding new)

  // 2. Show the customers in the table
  function showCustomers() {
    var search = document.getElementById("searchBox").value.toLowerCase();
    var table = document.getElementById("customerTable");
    var rows = "";

    for (var i = 0; i < customers.length; i++) {
      var c = customers[i];

      // Check if the search words match this customer
      var text = (c.name + " " + c.email + " " + c.company).toLowerCase();
      if (text.indexOf(search) === -1) {
        continue; // skip customers that do not match
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

  // 3. Update the four summary boxes at the top
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

  // 4. Save a new customer (or save changes to an existing one)
  function saveCustomer() {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var company = document.getElementById("company").value.trim();
    var status = document.getElementById("status").value;

    // Simple validation
    if (name === "" || email === "") {
      document.getElementById("message").textContent = "Please enter at least a name and an email.";
      return;
    }
    if (email.indexOf("@") === -1) {
      document.getElementById("message").textContent = "Please enter a valid email address.";
      return;
    }

    if (editingId === null) {
      // Add a new customer
      customers.push({ id: nextId, name: name, email: email, phone: phone, company: company, status: status });
      nextId++;
    } else {
      // Update the customer we are editing
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

    clearForm();
    showCustomers();
  }

  // 5. Fill the form with a customer's details so it can be edited
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

  // 6. Delete a customer after asking for confirmation
  function deleteCustomer(id) {
    if (confirm("Delete this customer?")) {
      var remaining = [];
      for (var i = 0; i < customers.length; i++) {
        if (customers[i].id !== id) {
          remaining.push(customers[i]);
        }
      }
      customers = remaining;
      showCustomers();
    }
  }

  // 7. Empty the form and go back to "add" mode
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

  // 8. Show the table when the page opens
  showCustomers();
