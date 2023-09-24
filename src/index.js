import Notiflix from "notiflix";
const API_KEY = "39589884-40cfc9e6470c89d61febbc7ff";

const searchFormEl = document.querySelector(".search-form");
const galleryEl = document.querySelector(".gallery");
const loadMoreBtnEl = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
const perPage = 40;

searchFormEl.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value.trim();
  galleryEl.innerHTML = '';
  loadMoreBtnEl.style.display = 'none';
  searchImages();
});

loadMoreBtnEl.addEventListener('click', () => {
  page += 1;
  searchImages();
});

async function searchImages() {
  const apiUrl = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

      if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    data.hits.forEach(image => {
      const photoCard = document.createElement('div');
      photoCard.classList.add('photo-card');
      photoCard.innerHTML = `
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item"><b>Likes</b> ${image.likes}</p>
                    <p class="info-item"><b>Views</b> ${image.views}</p>
                    <p class="info-item"><b>Comments</b> ${image.comments}</p>
                    <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
                </div>
            `;
      galleryEl.appendChild(photoCard);
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
