import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImgApiService from './js/search-service';
import LoadMoreBtn from './js/load-more-btn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
};

const imgApiService = new ImgApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', addImages);

const lightbox = new SimpleLightbox('.photo-card__item');

function onSearch(event) {
  event.preventDefault();

  imgApiService.query = event.currentTarget.elements.searchQuery.value.trim();

  if (imgApiService.query === '') {
    clearGalleryContainer();
    Notify.info('Please enter search query');
    return;
  }

  if (!loadMoreBtn.refs.button.hidden) {
    loadMoreBtn.hide();
  }
  // loadMoreBtn.show();
  imgApiService.resetPage();
  clearGalleryContainer();
  getImages();
}

// function getImages() {
//   imgApiService.getImg().then(({ hits }) => {
//     if (hits.length > 0) {
//       loadMoreBtn.show();
//       loadMoreBtn.disable();
//       appendGalleryMarkup({ hits });
//       loadMoreBtn.enable();
//     } else {
//       loadMoreBtn.hide();
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     }
//   });
// }

function getImages() {
  imgApiService.getImg().then(({ hits, totalHits }) => {
    if (hits.length > 0) {
      loadMoreBtn.show();
      loadMoreBtn.disable();
      appendGalleryMarkup({ hits });
      Notify.success(`Hooray! We found ${totalHits} images.`);
      loadMoreBtn.enable();
      if (hits.length === totalHits) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.hide();
      }
    } else {
      loadMoreBtn.hide();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });
}

function addImages() {
  loadMoreBtn.disable();
  imgApiService.getImg().then(({ hits, totalHits }) => {
    appendGalleryMarkup({ hits });
    loadMoreBtn.enable();
    if (imgApiService.imgQty >= totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.hide();
    }
  });
}

function appendGalleryMarkup({ hits }) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
      <a class="photo-card__item" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" /> </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>${likes}
        </p>
        <p class="info-item">
          <b>Views</b>${views}
        </p>
        <p class="info-item">
          <b>Comments</b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>${downloads}
        </p>
      </div>
    </div>`;
      }
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
