import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const API_KEY = "39589884-40cfc9e6470c89d61febbc7ff";

const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
});

const searchFormEl = document.querySelector(".search-form");
const galleryEl = document.querySelector(".gallery");
const loadMoreBtnEl = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
const perPage = 40;

searchFormEl.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value.trim();
  page = 1;
  galleryEl.innerHTML = '';
  loadMoreBtnEl.style.display = 'none';
  searchImages();
});

loadMoreBtnEl.addEventListener('click', () => {
  page += 1;
  searchImages();
  setTimeout(() => {
    smoothScrollGallery();
  }, 1000);
});

async function searchImages() {
  const apiUrl = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

      if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    data.hits.forEach(image => {
      const photoCard = document.createElement('div');
      photoCard.classList.add('photo-card');
      photoCard.innerHTML = `
                <a href="${image.largeImageURL}" data-lightbox="image">
                  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                </a>
                <div class="info">
                    <p class="info-item"><b>Likes</b> ${image.likes}</p>
                    <p class="info-item"><b>Views</b> ${image.views}</p>
                    <p class="info-item"><b>Comments</b> ${image.comments}</p>
                    <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
                </div>
            `;
      galleryEl.appendChild(photoCard);

      lightbox.refresh();
    });

    if (data.totalHits > page * perPage) {
      loadMoreBtnEl.style.display = 'block';
    } else {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        loadMoreBtnEl.style.display = 'none';
    }
  } catch (error) {
      Notiflix.Notify.failure("An error occurred while fetching data. Please try again later.");
  }
};

function smoothScrollGallery() {
  const { height } = galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
};