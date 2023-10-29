import { datas } from "./datas.js";

// Function to preload images
function preloadLargeImages(images) {
    images.forEach(image => {
        const img = new Image();
        img.src = `./images/large/${image.image}`;
    });
}

// Call preload function after the page has loaded
window.addEventListener("load", () => preloadLargeImages(datas));
    
//Display Datas
const displayDatas = () => {
    const gallery = document.querySelector(".gallery_container");
    const galleryDatas = datas
        .map(data => {
            return `
            <article data-id="${data.id}">
                <h3>${data.title}</h3>
                <img src="./images/small/${data.image}" alt="${data.title}"> 
            </article>
        `;
        })
        .join("");
    gallery.innerHTML = galleryDatas;
};
displayDatas();


//Show Hide menu
const btnDrop = document.querySelector(".btn_drop");
const showHideMenu = () => {
    const menu = document.querySelector(".dropdown_content");
    menu.classList.toggle("active");
    document.querySelector(".arrow").classList.toggle("rotate");
};
btnDrop.addEventListener("click", showHideMenu);

//Filter Datas
const allFilter = Array.from(
    document.querySelectorAll(".dropdown_content li button")
);
const currentSort = document.querySelector("#currentSort");

//Hide option already selected
let optionAlreadySelected = allFilter.find(
    (filter) => filter.textContent == currentSort.textContent
);
optionAlreadySelected.style.display = "none";

const sortDatas = (sortType) => {
    switch (sortType) {
        case "Popularity":
            datas.sort((a, b) => b.likes - a.likes);
            break;
        case "Title":
            datas.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "Date":
            datas.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }
};

allFilter.forEach((filter) => {
    filter.addEventListener("click", () => {
        const filterValue = filter.textContent;
        currentSort.textContent = filterValue;

        if (optionAlreadySelected)
            optionAlreadySelected.style.display = "block";

        filter.style.display = "none";
        optionAlreadySelected = filter;

        sortDatas(filterValue);
        displayDatas();
        displayLightbox(datas);
        showHideMenu();

        const medias = document.querySelectorAll(".gallery_container article");
        medias.forEach((media, index) => {
            setTimeout(() => {
                media.classList.add("animate");
            }, 100 * index);
        });
    });
});

//Lightbox
function displayLightbox(datas) {
    const allMedias = document.querySelectorAll(".gallery_container article");
    const lightboxWrapper = document.querySelector(".lightbox_wrapper");
    const imageProvider = document.querySelector(".lightbox_media");
    let currentIndex = 0;

    allMedias.forEach((media) => {
        media.addEventListener("click", () => {
            lightboxWrapper.style.display = "flex";
            currentIndex = datas.findIndex(image => image.id == media.dataset.id);
            lightboxTemplate();
        });
    });

    function lightboxTemplate() {
        const currentImage = datas[currentIndex];
        imageProvider.innerHTML = `
            <img src="./images/large/${currentImage.image}" alt="${currentImage.title}"></img>
        `;
    };

    function navigateToIndex(newIndex) {
        currentIndex = newIndex;
        if (currentIndex < 0) currentIndex = datas.length - 1;
        if (currentIndex > datas.length - 1) currentIndex = 0;
        lightboxTemplate();
    };

    const btnNext = document.querySelector(".next");
    btnNext.addEventListener("click", () => navigateToIndex(currentIndex + 1));

    const btnPrev = document.querySelector(".prev");
    btnPrev.addEventListener("click", () => navigateToIndex(currentIndex - 1));

    const btnClose = document.querySelector(".close");
    btnClose.addEventListener("click", () => {
        lightboxWrapper.style.display = "none";
        imageProvider.innerHTML = "";
    });
};
displayLightbox(datas);