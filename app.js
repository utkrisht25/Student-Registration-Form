const form = document.querySelector(".form");
const tableBody = document.getElementById("table-body");

let editingIndex = -1;

function loadFromLocalStorage() {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    //removing the index paramter from the forEach callback
    students.forEach((student) => addRow(student));
}

function saveToLocalStorage() {
    const rows = document.querySelectorAll("#table-body tr");
    const students = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        //now we have a nodelist of td in cells
        students.push({
            name: cells[0].innerText,
            id: cells[1].innerText,
            email: cells[2].innerText,
            phone: cells[3].innerText,
            dob: cells[4].innerText,
        });
    });

    localStorage.setItem("students", JSON.stringify(students));
}

function validateInputs(data) {
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const numberRegex = /^\d+$/;

    return (
        data.name && nameRegex.test(data.name) &&
        data.id && numberRegex.test(data.id) &&
        data.phone && numberRegex.test(data.phone) &&
        data.email && emailRegex.test(data.email) &&
        data.dob
    );
}

function addRow(data, index = null) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.id}</td>
        <td>${data.email}</td>
        <td>${data.phone}</td>
        <td class="dob-cell">${data.dob}</td>
        <td>
            <button onclick="editRow(this)" class="edit-btn">Edit</button>
        </td>
        <td>
         <button onclick="deleteRow(this)" class="delete-btn">Delete</button>
        </td>
    `;

    if (index !== null) {
        tableBody.children[index].replaceWith(row);
    } else {
        tableBody.appendChild(row);
    }

    saveToLocalStorage();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const studentData = {
        name: form.name.value.trim(),
        id: form.id.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        dob: form.dob.value.trim()
    };

    if (!validateInputs(studentData)) {
        alert("Please fill all fields with valid data!");
        return;
    }

    if (editingIndex > -1) {
        addRow(studentData, editingIndex);
        editingIndex = -1;
    } else {
        addRow(studentData);
    }

    form.reset();
});

window.editRow = (btn) => {
    const row = btn.parentElement.parentElement;
    const cells = row.querySelectorAll("td");

    form.name.value = cells[0].innerText;
    form.id.value = cells[1].innerText;
    form.email.value = cells[2].innerText;
    form.phone.value = cells[3].innerText;
    form.dob.value = cells[4].innerText;

    editingIndex = [...tableBody.children].indexOf(row);
};

window.deleteRow = (btn) => {
    if (confirm("Are you sure you want to delete this record?")) {
        btn.parentElement.parentElement.remove();
        saveToLocalStorage();
    }
};

loadFromLocalStorage();
