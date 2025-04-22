document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const addButton = document.querySelector(".add-button");
    const submitButton = document.querySelector(".submit-button");

    function updateHeaders() {
        document.querySelectorAll(".beverage").forEach((fieldset, index) => {
            fieldset.querySelector(".beverage-count").textContent = `Напиток №${index + 1}`;
            const milkInputs = fieldset.querySelectorAll("input[type=radio]");
            milkInputs.forEach(input => {
                input.name = `milk-${index + 1}`;
            });
        });
    }

    function addRemoveButton(fieldset) {
        const removeButton = document.createElement("button");
        removeButton.textContent = "✖";
        removeButton.type = "button";
        removeButton.style.float = "right";
        removeButton.style.marginLeft = "10px";
        removeButton.classList.add("remove-button");

        removeButton.addEventListener("click", () => {
            const beverages = document.querySelectorAll(".beverage");
            if (beverages.length > 1) {
                fieldset.remove();
                updateHeaders();
            }
        });

        fieldset.insertBefore(removeButton, fieldset.firstChild);
    }

    addButton.addEventListener("click", () => {
        const beverages = document.querySelectorAll(".beverage");
        const lastBeverage = beverages[beverages.length - 1];
        const clone = lastBeverage.cloneNode(true);

        clone.querySelector("select").selectedIndex = 1;
        clone.querySelectorAll("input").forEach(input => {
            if (input.type === "radio") {
                input.checked = input.value === "usual";
            } else if (input.type === "checkbox") {
                input.checked = false;
            }
        });

        const oldRemove = clone.querySelector(".remove-button");
        if (oldRemove) oldRemove.remove();

        addRemoveButton(clone);
        lastBeverage.insertAdjacentElement("afterend", clone);
        updateHeaders();
    });

    const initialBeverage = document.querySelector(".beverage");
    addRemoveButton(initialBeverage);
    updateHeaders();

    function createModal(orderCount, beverageData) {
        const existingOverlay = document.querySelector(".modal-overlay");
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement("div");
        overlay.classList.add("modal-overlay");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = 1000;

        const modal = document.createElement("div");
        modal.style.backgroundColor = "#fff";
        modal.style.width = "500px";
        modal.style.padding = "20px";
        modal.style.borderRadius = "10px";
        modal.style.position = "relative";

        const closeButton = document.createElement("button");
        closeButton.textContent = "✖";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.border = "none";
        closeButton.style.background = "transparent";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "16px";

        closeButton.addEventListener("click", () => overlay.remove());

        const declension = (number) => {
            const lastDigit = number % 10;
            const lastTwoDigits = number % 100;
            if (lastDigit === 1 && lastTwoDigits !== 11) return "напиток";
            if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) return "напитка";
            return "напитков";
        };

        const content = document.createElement("div");
        content.innerHTML = `<p>Вы заказали ${orderCount} ${declension(orderCount)}.</p>`;

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = "15px";
        table.innerHTML = `
      <thead>
        <tr>
          <th style="border: 1px solid #ccc; padding: 5px;">Напиток</th>
          <th style="border: 1px solid #ccc; padding: 5px;">Молоко</th>
          <th style="border: 1px solid #ccc; padding: 5px;">Дополнительно</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

        const tbody = table.querySelector("tbody");

        beverageData.forEach(data => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td style="border: 1px solid #ccc; padding: 5px;">${data.drink}</td>
        <td style="border: 1px solid #ccc; padding: 5px;">${data.milk}</td>
        <td style="border: 1px solid #ccc; padding: 5px;">${data.additions}</td>
      `;
            tbody.appendChild(row);
        });

        content.appendChild(table);
        modal.appendChild(closeButton);
        modal.appendChild(content);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const beverages = document.querySelectorAll(".beverage");
        const beverageData = [];

        beverages.forEach((fieldset, index) => {
            const drink = fieldset.querySelector("select").selectedOptions[0].textContent;

            const milkRadio = fieldset.querySelector(`input[name="milk-${index + 1}"]:checked`);
            const milk = milkRadio ? milkRadio.nextElementSibling.textContent : "";

            const additions = Array.from(fieldset.querySelectorAll("input[type=checkbox]:checked"))
                .map(cb => cb.nextElementSibling.textContent)
                .join(", ");

            beverageData.push({ drink, milk, additions });
        });

        createModal(beverages.length, beverageData);
    });
});
