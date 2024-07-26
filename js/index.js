function switch_tab(e, tab) {
    let target = (e.target || e.srcElement || e).parentElement.parentElement;
    main_container.src = tab;
}

let main_container = document.getElementById("main-container");

window.addEventListener("resize", main_container_idcard);

function navmenu_action(tab) {
    document.querySelector(".navmenu-current").classList.remove("navmenu-current");
    document.querySelector(`.navmenu-element[tab="${tab}"]`).classList.add("navmenu-current");
    if (tab != "/html/home.html") {
        main_container.classList.add("main-container-expand")
    } else {
        main_container.classList.remove("main-container-expand")
        main_container_idcard()
    }
}

function main_container_idcard(){

    if( window.innerWidth <= 900 ){
        main_container.classList.add("main-container-expand");
        main_container.contentDocument.querySelector("iframe.idcard-iframe").style.display = "flex";
        main_container.contentDocument.querySelector("iframe.idcard-iframe").style.height = `${main_container.contentDocument.querySelector("iframe.idcard-iframe").contentDocument.querySelector(".home-top").getBoundingClientRect().height }px`;
    }else{
        main_container.classList.remove("main-container-expand");
        main_container.contentDocument.querySelector("iframe.idcard-iframe").style.display = "none";
    }
}
