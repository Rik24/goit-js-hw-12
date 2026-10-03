import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api';

import {
  refs,
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions';

refs.form.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtn);

let currentPage = 1;
let query = '';

async function handleFormSubmit(event) {
  event.preventDefault();

  query = event.currentTarget.elements['search-text'].value.trim();

  if (!query) {
    return;
  }

  hideLoadMoreBtn();
  clearGallery();
  showLoader();

  currentPage = 1;
  await getImagesByQuery(query, currentPage)
    .then(({ hits: images, totalHits: total }) => {
      const totalPages = Math.ceil(total / PER_PAGE);
      if (images.length > 0) {
        createGallery(images);
        showLoadMoreBtn();

        if (currentPage === totalPages) {
          showTost(
            `We're sorry, but you've reached the end of search results.`,
            'info'
          );
          hideLoadMoreBtn();
        }
      } else {
        showTost(
          `Sorry, there are no images matching your ${query}. Please try again!`,
          'error'
        );
      }
    })
    .catch(error => showTost(error, 'error'))
    .finally(() => hideLoader());
}

async function handleLoadMoreBtn() {
  if (query === '') {
    return;
  }
  currentPage += 1;

  // hideLoadMoreBtn();
  showLoader();

  await getImagesByQuery(query, currentPage)
    .then(({ hits: images, totalHits: total }) => {
      const totalPages = Math.ceil(total / PER_PAGE);

      if (images.length > 0) {
        createGallery(images);
        showLoadMoreBtn();

        console.log('window.scrollY before:', window.scrollY);
        console.log('doc scrollHeight:', document.documentElement.scrollHeight);
        console.log('win innerHeight:', window.innerHeight);
        console.log(
          'max scroll:',
          document.documentElement.scrollHeight - window.innerHeight
        );

        const cardHeight = document
          .querySelector('.gallery-item')
          .getBoundingClientRect().height;
        console.log('cardHeight:', cardHeight);

        window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

        setTimeout(() => {
          console.log('window.scrollY after:', window.scrollY);
        }, 700);

        if (currentPage === totalPages) {
          showTost(
            `We're sorry, but you've reached the end of search results.`,
            'info'
          );
          hideLoadMoreBtn();
        }
      } else {
        showTost(
          `Sorry, there are no images matching your ${query}. Please try again!`,
          'error'
        );
      }
    })
    .catch(error => showTost(error, 'error'))
    .finally(() => hideLoader());
}
function showTost(message, type = 'success') {
  const options = {
    message,
    position: 'topRight',
    timeout: 5000,
  };
  switch (type) {
    case 'success':
      iziToast.success(options);
      break;
    case 'error':
      iziToast.error(options);
      break;
    case 'warning':
      iziToast.warning(options);
      break;
    case 'info':
      iziToast.info(options);
      break;

    default:
      iziToast.error({
        message: 'Invalid Type Of toast',
        position: 'topRight',
        timeout: 5000,
      });
  }
}

// function ifScroll(){}
