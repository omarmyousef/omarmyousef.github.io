async function load_articles() {
    let articles = await (await fetch("/content/posts.json")).json();
    window.articles = articles;
    show_article();
}

async function show_article() {
    const url_params = new URLSearchParams(window.location.search);
            
    // Fetch article data from the API
    const post_id = url_params.get('post'); // Extract article ID from URL
    let article = window.articles[parseInt(post_id)];

    document.querySelector("title").innerHTML = article.title;
    // Set article title
    document.getElementById('article-title').textContent = article.title;

    // Set article content
    document.getElementById('article-content').innerHTML = marked.parse(article.content);

    // Set article tags
    const tagsElement = document.querySelector('#article-tags .tags');
    article.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.textContent = tag;
        tagsElement.appendChild(tagElement);
    });

    // Set published date
    document.querySelector('#article-date span').textContent = article.publishedDate;
}

load_articles();