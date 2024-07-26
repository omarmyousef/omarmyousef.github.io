async function load_reviews() {
    let reviews = await (await fetch("/content/posts.json")).json();
    console.log( reviews )
    window.reviews = reviews;
    show_reviews();
}

async function show_reviews() {
    let data = window.reviews;
}

load_reviews();