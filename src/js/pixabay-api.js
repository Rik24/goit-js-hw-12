import axios from 'axios';

const API_KEY = '57834009-e331d273ed5c63387cc2a8569';

export const PER_PAGE = 15;

export async function getImagesByQuery(query, currentPage) {
  return await axios('https://pixabay.com/api/', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: PER_PAGE,
      page: currentPage,
    },
  }).then(({ data }) => data);
}
