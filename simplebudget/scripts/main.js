import { initHomePage, initTransactionsPage } from "./budget.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    if (page === "home") {
        initHomePage();
    } else if (page === "transactions") {
        initTransactionsPage();
    }
});
