// Import recipes
import recipes from "./recipes.mjs";


//Random Functions 

function random(num) {
    return Math.floor(Math.random() * num);
}

function getRandomListEntry(list) {
    const index = random(list.length);
    return list[index];
}


// Template Functions

// Tags template
function tagsTemplate(tags) {
    let html = "";
    for (const tag of tags) {
        html += `<span class="tag">${tag}</span>`;
    }
    return html;
}

// Rating template
function ratingTemplate(rating) {
    let html = `
        <span class="rating" role="img" aria-label="Rating: ${rating} out of 5 stars">
    `;

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
        } else {
            html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
        }
    }

    html += `</span>`;
    return html;
}

// Recipe card template
function recipeTemplate(recipe) {
    return `
    <article class="card">
        <img class="card-image" src="${recipe.image}" alt="${recipe.description}">
        <div class="card-body">

            <div class="tags">
                ${tagsTemplate(recipe.tags)}
            </div>

            <h2 class="card-title">
                <a class="card-link" href="#">${recipe.name}</a>
            </h2>

            ${ratingTemplate(recipe.rating)}

            <p class="card-desc">
                ${recipe.description}
            </p>

        </div>
    </article>
    `;
}


// Rendering Functions

function renderRecipes(recipeList) {
    const resultsElement = document.getElementById("results");

    const html = recipeList.map(recipeTemplate).join("");

    resultsElement.innerHTML = html;
}

function init() {
    const recipe = getRandomListEntry(recipes);
    renderRecipes([recipe]); 
}

init();

// Filtering Recipes 

function filterRecipes(query) {
    const filtered = recipes.filter(recipe => {
        const q = query.toLowerCase();

        const nameMatch = recipe.name.toLowerCase().includes(q);
        const descMatch = recipe.description.toLowerCase().includes(q);

        const tagMatch = recipe.tags.find(tag =>
            tag.toLowerCase().includes(q)
        );

        const ingredientMatch = recipe.recipeIngredient.find(ing =>
            ing.toLowerCase().includes(q)
        );

        return nameMatch || descMatch || tagMatch || ingredientMatch;
    });

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
}

function searchHandler(e) {
    e.preventDefault();

    const input = document.getElementById("q");
    const query = input.value.toLowerCase().trim();

    const results = filterRecipes(query);
    renderRecipes(results);
}

const searchForm = document.querySelector(".search");
searchForm.addEventListener("submit", searchHandler);
