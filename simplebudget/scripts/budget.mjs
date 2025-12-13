const STORAGE_KEY = "simplebudget-transactions";
const SAVINGS_GOAL = 1500;

const defaultTransactionList = [
    { id: 1, name: "Paycheck", amount: 1900.0, category: "Income", date: "2025-12-15" },
    { id: 2, name: "Groceries", amount: -62.45, category: "Food", date: "2025-12-15" },
    { id: 3, name: "Gas Station", amount: -40.0, category: "Transportation", date: "2025-12-16" },
    { id: 4, name: "Rent Payment", amount: -1200.0, category: "Housing", date: "2025-12-13" },
    { id: 5, name: "Coffee Shop", amount: -8.75, category: "Food", date: "2025-12-14" },
    { id: 6, name: "Savings", amount: 500.0, category: "Savings", date: "2025-12-13" }
];

function loadTransactionList() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        const defaultsCopy = [...defaultTransactionList];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultsCopy));
        return defaultsCopy;
    }

    try {
        return JSON.parse(stored);
    } catch {
        return [...defaultTransactionList];
    }
}


function saveTransactionList(transactionList) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactionList));
}

function formatCurrencyAmount(amount) {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });
    return formatter.format(amount);
}

function formatTransactionDate(dateString) {
    return dateString;
}

function computeSummaryValues(transactionList) {
    let totalIncomeAmount = 0;
    let totalExpenseAmount = 0;
    let totalSavingsAmount = 0;

    for (const entry of transactionList) {
        const categoryLower = entry.category.toLowerCase();

        if (categoryLower === "income") {
            totalIncomeAmount += entry.amount;
        } else if (categoryLower === "savings") {
            totalSavingsAmount += entry.amount;
        } else if (entry.amount < 0) {
            totalExpenseAmount += Math.abs(entry.amount);
        }
    }

    const balanceAmount = totalIncomeAmount - totalExpenseAmount - totalSavingsAmount;

    const currentDate = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    let weeklySpendingTotal = 0;

    for (const entry of transactionList) {
        const entryDate = new Date(entry.date);

        if (!Number.isNaN(entryDate.getTime())) {
            const isExpense = entry.amount < 0;

            if (
                isExpense &&
                entryDate >= oneWeekAgo &&
                entryDate <= currentDate
            ) {
                weeklySpendingTotal += Math.abs(entry.amount);
            }
        }
    }

    const categorySet = new Set();

    for (const entry of transactionList) {
        const entryDate = new Date(entry.date);
        const categoryLower = entry.category.toLowerCase();

        if (!Number.isNaN(entryDate.getTime())) {
            const isRegularCategory =
                categoryLower !== "income" &&
                categoryLower !== "savings";

            if (
                isRegularCategory &&
                entryDate.getMonth() === currentDate.getMonth() &&
                entryDate.getFullYear() === currentDate.getFullYear()
            ) {
                categorySet.add(entry.category);
            }
        }
    }

    const rawPercent = (totalSavingsAmount / SAVINGS_GOAL) * 100;
    const savingsPercentage = Math.max(0, Math.min(100, Math.round(rawPercent)));

    return {
        totalIncomeAmount,
        totalExpenseAmount,
        balanceAmount,
        weeklySpendingTotal,
        categoryCount: categorySet.size,
        savingsPercentage
    };
}

function getCategoryList(transactionList) {
    const categorySet = new Set();

    for (const entry of transactionList) {
        categorySet.add(entry.category);
    }

    return Array.from(categorySet).sort();
}

function initHomePage() {
    const incomeTotalElement = document.querySelector("#incomeTotal");
    const expenseTotalElement = document.querySelector("#expenseTotal");
    const balanceTotalElement = document.querySelector("#balanceTotal");
    const weeklySpendingElement = document.querySelector("#weeklySpending");
    const categoryCountElement = document.querySelector("#categoryCount");
    const savingsPercentElement = document.querySelector("#savingsPercent");
    const savingsBarElement = document.querySelector("#savingsBar");

    if (!incomeTotalElement) {
        return;
    }

    const transactionList = loadTransactionList();
    const summary = computeSummaryValues(transactionList);

    incomeTotalElement.textContent = formatCurrencyAmount(summary.totalIncomeAmount);
    expenseTotalElement.textContent = formatCurrencyAmount(summary.totalExpenseAmount);
    balanceTotalElement.textContent = formatCurrencyAmount(summary.balanceAmount);
    weeklySpendingElement.textContent = formatCurrencyAmount(summary.weeklySpendingTotal);
    categoryCountElement.textContent = summary.categoryCount.toString();

    savingsPercentElement.textContent = summary.savingsPercentage + "%";
    savingsBarElement.style.width = summary.savingsPercentage + "%";
}

function initTransactionsPage() {
    let transactionList = loadTransactionList();

    const tableBodyElement = document.querySelector("#tableBody");
    const filterSelectElement = document.querySelector("#filterSelect");
    const addFormElement = document.querySelector("#addForm");
    const inputNameElement = document.querySelector("#inputName");
    const inputAmountElement = document.querySelector("#inputAmount");
    const inputCategoryElement = document.querySelector("#inputCategory");
    const inputDateElement = document.querySelector("#inputDate");

    if (!tableBodyElement) {
        return;
    }

    const todayString = new Date().toISOString().split("T")[0];
    inputDateElement.value = todayString;

    function populateCategoryFilterOptions() {
        const categories = getCategoryList(transactionList);
        const existingOptions = new Set();

        filterSelectElement.querySelectorAll("option").forEach(option => {
            existingOptions.add(option.value);
        });

        for (const category of categories) {
            if (!existingOptions.has(category)) {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                filterSelectElement.appendChild(option);
            }
        }
    }

    function renderTransactionTable() {
        const selectedCategory = filterSelectElement.value;
        tableBodyElement.innerHTML = "";

        const displayedList =
            selectedCategory === "all"
                ? transactionList
                : transactionList.filter(entry => entry.category === selectedCategory);

        for (const entry of displayedList) {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = entry.name;

            const amountCell = document.createElement("td");
            const isIncome = entry.amount > 0 && entry.category.toLowerCase() !== "savings";
            const prefix = isIncome ? "+" : "";
            amountCell.textContent = prefix + formatCurrencyAmount(entry.amount);
            amountCell.className = isIncome ? "amount-good" : "amount-bad";

            const categoryCell = document.createElement("td");
            const categoryTagElement = document.createElement("span");
            categoryTagElement.className = "category-tag";
            categoryTagElement.textContent = entry.category;
            categoryCell.appendChild(categoryTagElement);

            const dateCell = document.createElement("td");
            dateCell.textContent = formatTransactionDate(entry.date);

            const removeCell = document.createElement("td");
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.className = "remove-button";

            removeButton.addEventListener("click", () => {
                transactionList = transactionList.filter(x => x.id !== entry.id);
                saveTransactionList(transactionList);
                renderTransactionTable();
            });

            removeCell.appendChild(removeButton);

            row.appendChild(nameCell);
            row.appendChild(amountCell);
            row.appendChild(categoryCell);
            row.appendChild(dateCell);
            row.appendChild(removeCell);

            tableBodyElement.appendChild(row);
        }
    }

    filterSelectElement.addEventListener("change", () => {
        renderTransactionTable();
    });

    addFormElement.addEventListener("submit", event => {
        event.preventDefault();

        const nameValue = inputNameElement.value.trim();
        const amountValue = Number(inputAmountElement.value);
        const categoryValue = inputCategoryElement.value;
        const dateValue = inputDateElement.value;

        const invalidInput =
            !nameValue ||
            !categoryValue ||
            Number.isNaN(amountValue) ||
            !dateValue;

        if (invalidInput) {
            return;
        }

        const newTransactionEntry = {
            id: Date.now(),
            name: nameValue,
            amount: amountValue,
            category: categoryValue,
            date: dateValue
        };

        
        if (transactionList.some(t => t.id <= 6)) {
        transactionList = transactionList.filter(t => t.id > 6);
        }

        transactionList.push(newTransactionEntry);
        saveTransactionList(transactionList);


        populateCategoryFilterOptions();
        renderTransactionTable();

        addFormElement.reset();
        inputDateElement.value = todayString;
    });

    populateCategoryFilterOptions();
    renderTransactionTable();

    const resetButtonElement = document.querySelector("#resetApp");
    if (resetButtonElement) {
        resetButtonElement.addEventListener("click", () => {
            const confirmReset = confirm("Clear all transactions and restore defaults?");
            if (confirmReset) {
                localStorage.removeItem("simplebudget-transactions");
                location.reload();
            }
        });
    }
}

export { initHomePage, initTransactionsPage };