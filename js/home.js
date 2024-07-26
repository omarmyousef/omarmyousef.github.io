/*window.onscroll = () => {
    (() => {
        console.log(document.querySelector("div.home-top").scrollTop  );
        document.querySelector("div.home-top").style.filter = `blur(${document.querySelector("div.home-top").scrollTop  }px)`;
    })()
}*/

let ht = document.querySelector("div.home-top")
let bg = document.querySelector("div.page-bg")

let header = document.querySelector(`header.header-top`);

window.addEventListener("scroll", (event) => {
    let b = ht.getBoundingClientRect();
    bg.style.filter = `opacity(${((b.bottom)/(b.height))})`;
    //ht.querySelector(`div.home-intro-container`).style.scale = `${0.5+(((b.bottom)/(b.height))*0.5)}`;
});

async function show_reviews() {
    let reviews = await (await fetch("/content/reviews.json")).json();
    
    reviews.sort((a, b) => {
        if (b.rating < a.rating) {
            return -1;
        }
        if (a.rating < b.rating) {
            return 1;
        }
        return (new Date(b.date)) - (new Date(a.date));
    });

    let gallery_html = reviews.map( (r,i) => {
        let rating_decimal = r.rating - Math.trunc(r.rating)
        return `<div class="gallery-item">
                <a class="review" id="review-${r.id}" href="/html/reviews.html?target=${r.id}">
                    
                    <div class="review-content-container">
                        <span class="review-project-name" dir="auto" style="height: 32px;">${r.title}</span>
                        <img class="review-category-img" title="${r.website}" src="${r.icon}">
                    </div>
                    <div class="review-content-container">
                        <div class="review-project-owner">
                            <img class="review-project-owner-pfp" src="${r.pfp}">
                            <span class="review-project-owner-name" dir="auto">${r.owner}</span>
                        </div>
                    </div>
                    <div class="review-content-details" dir="auto">
                        ${r.details}
                    </div>
                    <div class="review-content-container" style="justify-content: center;">
                    <div class="review-rating" title="${r.rating} Stars Rated" style="position: unset; margin: 0px" >
                        ${"<div></div>".repeat(Math.trunc(r.rating))}
                        ${ (rating_decimal > 0 ? `<div style="width: ${16*rating_decimal}px;"></div>` : "") }
                    </div>
                    </div>
                </a>
                </div>`
    }).join("")

    document.querySelector("#reviews-gallery > .gallery").innerHTML = gallery_html;
}

show_reviews()

let reviews_gallery = document.querySelector(`#reviews-gallery > .gallery`)

let reviews_index = 0;

function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    
    }

function scroll_reviews(){
    reviews_gallery.firstChild.classList.add("gallery-item-animate");
    reviews_gallery.firstChild.classList.add("gallery-item-move");
    current = 0;
    setTimeout(()=>{
        reviews_gallery.firstChild.classList.remove("gallery-item-animate");
        reviews_gallery.firstChild.classList.remove("gallery-item-move");
        reviews_gallery.append( reviews_gallery.firstChild );
    }, 500 );
}

setInterval(()=>{
    if( /*document.querySelector(`.review:hover`) == null && document.hasFocus()*/ true ){
        scroll_reviews();
    }
},5000/1 )