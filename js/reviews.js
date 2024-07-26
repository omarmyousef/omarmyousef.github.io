async function load_reviews() {
    let reviews = await (await fetch("/content/reviews.json")).json();
    console.log( reviews )
    window.reviews = reviews;
    show_reviews();
}

async function show_reviews() {
    let data = window.reviews;

    let rows = (window.matchMedia("(max-width: 900px)").matches ? 1 : (window.matchMedia("(max-width: 1400px)").matches ? 2 : 4));
    document.querySelector(".reviews").innerHTML = `${`<div class="reviews-row" style="width: ${100/(rows)}%;"></div>`.repeat(rows)}`

    data.sort((a, b) => {
        if (b.rating < a.rating) {
            return -1;
        }
        if (a.rating < b.rating) {
            return 1;
        }
        return (new Date(b.date)) - (new Date(a.date));
    });

    let content_rows = Array.from(document.getElementsByClassName("reviews-row"));
    let content = [];
    let content_length = [];
    for (let i = 0; i < content_rows.length; i++) {
        content.push([]);
        content_length.push(0);
    }

    let ratings_sum = 0;

    for (let i = 0; i < data.length; i++) {
        ratings_sum += data[i].rating;
        let row = 0;
        for (let j = 1; j < data.length; j++) {
            if (content_length[j] < content_length[row]) {
                row = j;
            }
        }
        let rating_decimal = data[i].rating - Math.trunc(data[i].rating)

        var review_time = moment(data[i].date);
        var current_time = moment();
        var diff = moment.preciseDiff(review_time, current_time, true);
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

        /*<div class="reviews-column">*/
        let review = `<div class="reviews-column" id="review-${data[i].id}">
                <div class="${(content_rows.length > 1 ? "review-grid": "review-compact")}">
                    <div class="review-rating" title="${data[i].rating} Stars Rated" >
                        ${"<div></div>".repeat(Math.trunc(data[i].rating))}
                        ${ (rating_decimal > 0 ? `<div style="width: ${16*rating_decimal}px;"></div>` : "") }
                    </div>
                    <div class="review-content-container">
                        <span class="review-project-name" dir="auto">${data[i].title}</span>
                        <img class="review-category-img" title="${data[i].website}" src="${data[i].icon}">
                    </div>
                    <div class="review-content-container">
                        <div class="review-project-owner">
                            <img class="review-project-owner-pfp" src="${data[i].pfp}">
                            <span class="review-project-owner-name" dir="auto">${data[i].owner}</span>
                        </div>
                    </div>
                    <div class="review-content-details" dir="auto">
                        ${data[i].details}
                    </div>
                    <div class="review-content-timestamp">
                        <img src="/images/clock.png">
                        <span  title="${new Date(data[i].date).toLocaleString()}"> ${duration} </span>
                    </div>
                </div>
        </div>`

        content[row].push(review);
        content_length[row] += review.length;
    }

    content_rows.forEach((row, index) => {
        row.innerHTML = content[index].join("")
    });

    let average = ratings_sum / window.reviews.length;
    let average_decimal = average - Math.trunc(average);

    document.querySelector(".reviews-top > div").innerHTML = `
    <div class="reviews-top-text">Average rating of</div>
            <div class="review-rating" style="position: unset;">
            ${"<div></div>".repeat(Math.trunc(average))}
            ${ (average_decimal > 0 ? `<div style="width: ${16*average_decimal}px;"></div>` : "") }
            </div>
            <div class="reviews-top-text">According to ${window.reviews.length} reviews on various platforms</div>
            `

    let params = new URLSearchParams(window.location.search);
    let target_element = ( params.has("target") ? document.querySelector(`#review-${params.get("target")} > div`) : null );
    console.log( params.has("target"), params.get("target"), document.querySelector(`#review-${params.get("target")}`) )
    if( target_element != null ){
        target_element.classList.toggle("review-hover");
        setTimeout(()=>{target_element.classList.toggle("review-hover");},1000 );
        target_element.scrollIntoView();
    }
}

load_reviews();
addEventListener("resize", (event) => {
    let current = document.getElementsByClassName("reviews-row").length,
        required = (window.matchMedia("(max-width: 900px)").matches ? 1 : (window.matchMedia("(max-width: 1400px)").matches ? 2 : 4));
    if (current != required) {
        show_reviews();
    }
});
