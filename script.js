const main = document.getElementById("main");
const nameInput = document.getElementById("name");
const numberInput = document.getElementById("number");
const addUser = document.getElementById("addUser");
const contacts = document.getElementById("contacts");


numberInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (!value.startsWith("998")) {
        value = "998" + value;
    }

    value = value.slice(0, 12); 

    value = value.replace(/(\d{3})(\d{2})?(\d{3})?(\d{2})?(\d{2})?/, (_, c, a, b, d, e) => 
        `+${c} (${a ? a : ""})${b ? " " + b : ""}${d ? "-" + d : ""}${e ? "-" + e : ""}`);

    e.target.value = value;

    
    if (value.length === 8) {
        e.target.setSelectionRange(9, 9); 
    }
});

numberInput.addEventListener("focus", function (e) {
    if (!e.target.value || e.target.value === "+") {
        e.target.value = "+998 () "; 
    }
});



addUser.addEventListener('click', () => {
    if (nameInput.value === "" || numberInput.value === "+998 () ") {

    } else {
        fetch("https://67ee9307c11d5ff4bf7a2071.mockapi.io/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nameInput.value,
                number: numberInput.value
            })
        })
            .then(response => response.json())
            .then(data => {
                const contact = document.createElement("div");
                contact.classList.add("contact");
                contact.innerHTML = `
                    <img src="img/icon.png" alt="" class="photo">
    
                    <div class="section">
                        <div class="nameAndNumber">
                            <p class="contact-name">${data.name}</p>
                            <p class="contact-number">${data.number}</p>
                        </div>
    
                        <div class="functions">
                        </div>
                    </div>
                `;

                const edit = document.createElement("img");
                edit.src = "img/edit.png";
                edit.classList.add("edit");

                const deleteImg = document.createElement("img");
                deleteImg.src = "img/delete.png";
                deleteImg.classList.add("delete");


                const functionsDiv = contact.querySelector(".functions");
                functionsDiv.appendChild(edit);
                functionsDiv.appendChild(deleteImg);

                contacts.appendChild(contact);

                deleteImg.addEventListener("click", () => {
                    fetch(`https://67ee9307c11d5ff4bf7a2071.mockapi.io/api/users/${data.id}`, {
                        method: "DELETE"
                    })
                        .then(() => {
                            contact.remove();
                        })
                        .catch(error => {
                            console.error("Error deleting contact:", error);
                        });
                })



                const nameAndNumber = contact.querySelector(".nameAndNumber");
                edit.addEventListener("click", () => {
                    nameAndNumber.innerHTML = `
                        <input type="text" class="contact-name-input" value="${data.name}">
                        <input type="tel" class="contact-number-input" value="${data.number}">
                    `;
                
                    // Получаем поля ввода
                    const contactNameInput = contact.querySelector(".contact-name-input");
                    const contactNumberInput = contact.querySelector(".contact-number-input");
                
                    // Добавляем обработчик на нажатие Enter в этих полях
                    contactNameInput.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") {
                            updateContact();
                        }
                    });
                
                    contactNumberInput.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") {
                            updateContact();
                        }
                    });
                
                    // Функция для обновления контакта
                    function updateContact() {
                        data.name = contactNameInput.value;
                        data.number = contactNumberInput.value;
                
                        fetch(`https://67ee9307c11d5ff4bf7a2071.mockapi.io/api/users/${data.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(data)
                        })
                        .then(() => {
                            nameAndNumber.innerHTML = `
                                <p class="contact-name">${data.name}</p>
                                <p class="contact-number">${data.number}</p>
                            `;
                        })
                        .catch(error => {
                            console.error("Error updating contact:", error);
                        });
                    }
                });
                
            });
    }

    nameInput.value = "";
    numberInput.value = "+998 () ";
})