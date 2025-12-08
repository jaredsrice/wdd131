const STORAGE_KEY = "simplebudget-transactions";
const SAVINGS_GOAL = 1500;

const defaultTransactions = [
    {
        id: 1,
        name: "Paycheck",
        amount: 1500.0,
        category: "Income",
        date: "2025-02-01"
    },
    {
        id: 2,
        name: "Groceries",
        amount: -62.45,
        category: "Food",
        date: "2025-02-02"
    },
    {
        id: 3,
        name: "Gas Station",
        amount: -40.0,
        category: "Transportation",
        date: "2025-02-03"
    },
    {
        id: 4,
        name: "Rent Payment",
        amount: -1200.0,
        category: "Housing",
        date: "2025-02-01"
    },
    {
        id: 5,
        name: "Coffee Shop",
        amount: -8.75,
        category: "Food",
        date: "2025-02-03"
    }
];

function loadTransactions() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return [...defaultTransactions];
    }

    try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [...defaultTransactions];
    } catch {
        return [...defaultTransactions];
    }
}

function saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });
    return formatter.format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return dateString;
    }
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function getSummary(transactions) {
    let income = 0;
    let expenses = 0;

    for (const t of transactions) {
        if (t.amount > 0) {
            income += t.amount;
        } else if (t.amount < 0) {
            expenses += Math.abs(t.amount);
        }
    }

    const balance = income - expenses;

    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    let weeklySpending = 0;
    const monthlyCategories = new Set();

    for (const t of transactions) {
        const tDate = new Date(t.date);
        if (!Number.isNaN(tDate.getTime())) {
            if (t.amount < 0 && tDate >= oneWeekAgo && tDate <= now) {
                weeklySpending += Math.abs(t.amount);
            }

            if (
                t.category.toLowerCase() !== "income" &&
                tDate.getMonth() === now.getMonth() &&
                tDate.getFullYear() === now.getFullYear()
            ) {
                monthlyCategories.add(t.category);
            }
        }
    }

    const progressRaw = (balance / SAVINGS_GOAL) * 100;
    const savingsProgress = Math.max(0, Math.min(100, Math.round(progressRaw)));

    return {
        totalIncome: income,
        totalExpenses: expenses,
        balance,
        weeklySpending,
        categoriesCount: monthlyCategories.size,
        savingsProgress
    };
}

function getUniqueCategories(transactions) {
    const categories = new Set();
    for (const t of transactions) {
        categories.add(t.category);
    }
    return Array.from(categories).sort();
}

function initHomePage() {
    const incomeTotal = document.querySelector("#incomeTotal");
    const expenseTotal = document.querySelector("#expenseTotal");
    const balanceTotal = document.querySelector("#balanceTotal");
    const weeklySpending = document.querySelector("#weeklySpending");
    const categoryCount = document.querySelector("#categoryCount");
    const savingsPercent = document.querySelector("#savingsPercent");
    const savingsBar = document.querySelector("#savingsBar");

    if (!incomeTotal || !expenseTotal || !balanceTotal) {
        return;
    }

    const transactions = loadTransactions();
    const summary = getSummary(transactions);

    incomeTotal.textContent = formatCurrency(summary.totalIncome);
    expenseTotal.textContent = formatCurrency(summary.totalExpenses);
    balanceTotal.textContent = formatCurrency(summary.balance);

    weeklySpending.textContent = formatCurrency(summary.weeklySpending);
    categoryCount.textContent = summary.categoriesCount.toString();

    savingsPercent.textContent = `${summary.savingsProgress}%`;
    savingsBar.style.width = `${summary.savingsProgress}%`;
}

function initTransactionsPage() {
    let transactions = loadTransactions();

    const tableBody = document.querySelector("#tableBody");
    const filterSelect = document.querySelector("#filterSelect");
    const addForm = document.querySelector("#addForm");
    const inputName = document.querySelector("#inputName");
    const inputAmount = document.querySelector("#inputAmount");
    const inputCategory = document.querySelector("#inputCategory");
    const inputDate = document.querySelector("#inputDate");

    if (!tableBody || !filterSelect || !addForm) {
        return;
    }

    const today = new Date().toISOString().split("T")[0];
    inputDate.value = today;

    function buildCategoryFilterOptions() {
        const categories = getUniqueCategories(transactions);
        const existing = new Set();
        filterSelect.querySelectorAll("option").forEach((opt) => {
            existing.add(opt.value);
        });

        for (const category of categories) {
            if (!existing.has(category)) {
                const opt = document.createElement("option");
                opt.value = category;
                opt.textContent = category;
                filterSelect.appendChild(opt);
            }
        }
    }

    function renderTable() {
        const selected = filterSelect.value;
        tableBody.innerHTML = "";

        const filtered =
            selected === "all"
                ? transactions
                : transactions.filter((t) => t.category === selected);

        for (const t of filtered) {
            const tr = document.createElement("tr");

            const nameTd = document.createElement("td");
            nameTd.textContent = t.name;

            const amountTd = document.createElement("td");
            const isIncome = t.amount > 0;
            const sign = isIncome ? "+" : "";
            amountTd.textContent = `${sign}${formatCurrency(t.amount)}`;
            amountTd.classList.add(isIncome ? "amount-good" : "amount-bad");

            const catTd = document.createElement("td");
            const tag = document.createElement("span");
            tag.className = "category-tag";
            tag.textContent = t.category;
            catTd.appendChild(tag);

            const dateTd = document.createElement("td");
            dateTd.textContent = formatDate(t.date);

            tr.appendChild(nameTd);
            tr.appendChild(amountTd);
            tr.appendChild(catTd);
            tr.appendChild(dateTd);

            tableBody.appendChild(tr);
        }
    }

    filterSelect.addEventListener("change", () => {
        renderTable();
    });

    addForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = inputName.value.trim();
        const amountNumber = Number(inputAmount.value);
        const category = inputCategory.value;
        const date = inputDate.value;

        if (!name || !category || Number.isNaN(amountNumber) || !date) {
            return;
        }

        const newTransaction = {
            id: Date.now(),
            name,
            amount: amountNumber,
            category,
            date
        };

        transactions = transactions.filter(t => t.id > 100);

        transactions.push(newTransaction);
        saveTransactions(transactions);

        buildCategoryFilterOptions();
        renderTable();

        addForm.reset();
        inputDate.value = today;
    });

    buildCategoryFilterOptions();
    renderTable();
}

export { initHomePage, initTransactionsPage };
