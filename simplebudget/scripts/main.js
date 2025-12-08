import { initHomePage, initTransactionsPage } from "./budget.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const currentPageName = document.body.dataset.page;

    const isHomePage = currentPageName === "home";
    const isTransactionsPage = currentPageName === "transactions";

    if (isHomePage) {
        initHomePage();
    }

    if (isTransactionsPage) {
        initTransactionsPage();
    }
});