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
  try {
    const { hits: images, totalHits: total } = await getImagesByQuery(
      query,
      currentPage
    );
    const totalPages = Math.ceil(total / PER_PAGE);

    if (images.length > 0) {
      createGallery(images);

      if (currentPage === totalPages) {
        showTost(
          `We're sorry, but you've reached the end of search results.`,
          'info'
        );
        hideLoadMoreBtn();
      } else {
        showLoadMoreBtn();
      }
    } else {
      showTost(
        `Sorry, there are no images matching your ${query}. Please try again!`,
        'error'
      );
    }
  } catch (error) {
    showTost(error, 'error');
  } finally {
    hideLoader();
  }
}

async function handleLoadMoreBtn() {
  if (query === '') {
    return;
  }
  currentPage += 1;

  hideLoadMoreBtn();
  showLoader();

  try {
    const { hits: images, totalHits: total } = await getImagesByQuery(
      query,
      currentPage
    );

    const totalPages = Math.ceil(total / PER_PAGE);

    if (images.length > 0) {
      createGallery(images);

      const cardHeight = document
        .querySelector('.gallery-item')
        .getBoundingClientRect().height;

      window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

      if (currentPage === totalPages) {
        showTost(
          `We're sorry, but you've reached the end of search results.`,
          'info'
        );
        hideLoadMoreBtn();
      } else {
        showLoadMoreBtn();
      }
    } else {
      showTost(
        `Sorry, there are no images matching your ${query}. Please try again!`,
        'error'
      );
    }
  } catch (error) {
    showTost(error, 'error');
    showLoadMoreBtn();
  } finally {
    hideLoader();
  }
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
