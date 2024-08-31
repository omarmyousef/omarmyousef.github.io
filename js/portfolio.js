async function load_posts() {
    let reviews = await (await fetch("/content/posts.json")).json();
    console.log( reviews )
    window.reviews = reviews;
    show_posts();
}

async function show_posts() {
    let data = window.reviews.filter( e => e.tags.includes("portfolio") );
    document.querySelector(".items").innerHTML = data.map( e => {

        var current_time = moment();
        var diff = moment.preciseDiff(e.date, current_time, true);
        let arr = [];
        if (diff.years) {
            arr.push((diff.years > 1 ? `${diff.years} Years` : "A Year"))
        };
        if (diff.months) {
            arr.push((diff.months > 1 ? `${diff.months} Months` : "A Month"))
        };
        if (diff.days) {
            arr.push((diff.days > 1 ? `${diff.days} Days` : "A Day"))
        };
        if (arr.length == 0) {
            if (diff.hours) {
                arr.push((diff.hours > 1 ? `${diff.hours} Hours` : "An Hour"))
            };
            if (arr.length == 0) {
                if (diff.minutes) {
                    arr.push((diff.minutes > 1 ? `${diff.minutes} Minutes` : "A Minute"))
                };
            }
        }
        let last = arr.pop();
        let duration = `${( arr.length ? `${arr.join(", ")} and ${last}` : last )} ago.`;

        return `<div class="item">
            <img class="item-cover" src="${e.cover}">
            <div class="item-name" dir="auto">
                ${e.title}
            </div>
            <div class="item-details">
                <div class="item-timestamp">
                    <img src="/images/clock.png">
                    <span title="${(e.date).toLocaleString()}"> ${duration} </span>
                </div>
                <div class="item-tags">${e.tags.map( e2 => `<span>${e2}</span>`).join("")}</div>
            </div>
        </div>`
    }).join("");

    resize_grid()
}

load_posts();

function resize_grid(){
    let required = (window.matchMedia("(max-width: 900px)").matches ? 1 : (window.matchMedia("(max-width: 1400px)").matches ? 2 : 3));
    document.querySelector(".items").style.gridTemplateColumns = `repeat( ${required}, 1fr )`
}

addEventListener("resize", resize_grid); 