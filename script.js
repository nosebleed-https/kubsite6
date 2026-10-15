document.addEventListener("DOMContentLoaded", function () {
    const orderForm = document.getElementById("order-form");
    const quantityInput = document.getElementById("quantity");
    const quantityError = document.getElementById("quantity-error");
    const optionField = document.getElementById("option-field");
    const optionSelect = document.getElementById("option");
    const propertyField = document.getElementById("property-field");
    const propertyCheckbox = document.getElementById("property");
    const resultText = document.getElementById("result-text");

    const quantityPattern = /^[1-9]\d*$/;

    function getSelectedProduct() {
        return orderForm.querySelector("input[name='product']:checked");
    }

    function getPrice(element) {
        return parseInt(element.getAttribute("data-price"), 10);
    }

    function showError(message) {
        quantityError.textContent = message;
        quantityError.hidden = false;
        quantityInput.setAttribute("aria-invalid", "true");
        resultText.textContent = "Стоимость: —";
    }

    function clearError() {
        quantityError.textContent = "";
        quantityError.hidden = true;
        quantityInput.removeAttribute("aria-invalid");
    }

    function updateFieldsVisibility(productType) {
        optionField.hidden = productType !== "notebook";
        propertyField.hidden = productType !== "folder";

        if (productType !== "folder") {
            propertyCheckbox.checked = false;
        }
    }

    function calculate() {
        const product = getSelectedProduct();
        const quantityValue = quantityInput.value.trim();
        let unitPrice = getPrice(product);
        let quantity = 0;
        let total = 0;

        updateFieldsVisibility(product.value);

        if (!quantityPattern.test(quantityValue)) {
            showError("Ошибка: введите целое положительное число.");
            return;
        }

        quantity = parseInt(quantityValue, 10);

        if (!Number.isSafeInteger(quantity)) {
            showError("Ошибка: введённое количество слишком велико.");
            return;
        }

        if (product.value === "notebook") {
            unitPrice += getPrice(
                optionSelect.options[optionSelect.selectedIndex]
            );
        }

        if (product.value === "folder" && propertyCheckbox.checked) {
            unitPrice += getPrice(propertyCheckbox);
        }

        total = unitPrice * quantity;

        if (!Number.isSafeInteger(total)) {
            showError("Ошибка: стоимость заказа слишком велика.");
            return;
        }

        clearError();

        resultText.textContent = "Стоимость: " +
                unitPrice.toLocaleString("ru-RU") + " ₽ × " +
                quantity.toLocaleString("ru-RU") + " = " +
                total.toLocaleString("ru-RU") + " ₽";
    }

    orderForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    quantityInput.addEventListener("input", calculate);
    optionSelect.addEventListener("change", calculate);
    propertyCheckbox.addEventListener("change", calculate);

    orderForm.querySelectorAll("input[name='product']").forEach(
        function (radio) {
            radio.addEventListener("change", calculate);
        }
    );

    calculate();
});