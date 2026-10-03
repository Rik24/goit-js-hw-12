import axios from 'axios';

const API_KEY = '57834009-e331d273ed5c63387cc2a8569';

export function getImagesByQuery(query) {
  return axios('https://pixabay.com/api/', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  }).then(({ data }) => data);
}
