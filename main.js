let hasScrolledToBottom = false;

let page = window.location.search.split("?page=")[1] || 1;

const searchInput = document.querySelector("#search-form input");
const searchExactCheckbox = document.querySelector("#search-form input[type='checkbox']");

const loading = document.querySelector(".loader");

const loadArticles = (commentAuthor) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://ludvig.cloudno.de/milena/api/v1/articles?page=${page}&commentAuthor=${commentAuthor}&searchExact=${searchExactCheckbox.checked}`, true);
    xhr.addEventListener("load", () => {
        const articles = JSON.parse(xhr.responseText).data;

        articles.forEach(article => {
            document.querySelector(".articles").innerHTML += createArticle(article);
    
            // Get the last one of all the articles (the new one)
            const newArticle = document.querySelectorAll(".article")[document.querySelectorAll(".article").length - 1];
    
            newArticle.lastElementChild.childNodes.forEach(commentElement => commentElement.firstChild.innerHTML += expandLessIcon());
    
        });

        // Hide the loading element
        loading.classList.add("hidden");
        
        hasScrolledToBottom = false;
    });

    xhr.send();
};

loadArticles(searchInput.value);

const createArticle = ({ url, subject, subjectColor, title, date, comments }) => {
    return (
        `<article class="article article-large">
            <p class="category-header" style="background-color: ${subjectColor}">${subject}</p>
            <div class="title">
                <h2><a href="${url}" target="_blank">${title}</a></h2>
                <span class="date">${date}</span>
            </div>
            <hr />
            <div class="comments">${comments.toString().split(",").join("")}</div>
        </article>`);
}

const expandLessIcon = () => {
    const onclick = `this.parentElement.parentElement.classList.toggle('article-collapsed'); this.outerHTML = expandMoreIcon();`

    return (
        `<div class="expand-button" onclick="${onclick}">
            <svg class="expand-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill="#202020" title="ExpandLess">
                <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
            </svg>
        </div>`);
};

const expandMoreIcon = () => {
    const onclick = `this.parentElement.parentElement.classList.toggle('article-collapsed'); this.outerHTML = expandLessIcon();`

    return (
        `<div class="expand-button" onclick="${onclick}">
            <svg class="expand-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill="#202020" title="ExpandMore">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
            </svg>
        </div>`);
}

const search = (event) => {
    event.preventDefault();

    document.querySelector(".articles").innerHTML = "";

    page = 1;

    loadArticles(searchInput.value);
};

window.addEventListener('scroll', event => {
    const margin = 3;
    const body = document.documentElement;

    if (!hasScrolledToBottom && Math.abs(body.scrollHeight - body.scrollTop - body.clientHeight) <= margin) {
        hasScrolledToBottom = true;

        page++;

        // Show the loading element
        loading.classList.remove("hidden");

        loadArticles(searchInput.value);
    }
});