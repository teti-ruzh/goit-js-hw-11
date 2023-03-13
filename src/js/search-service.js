const API_KEY = '34284837-29260c72d5bbc46b76d9e1104'
const BASE_URL = 'https://pixabay.com/api/'
import axios from 'axios';


export default class ImgApiService {
    constructor () {
this.searchQuery = '';
this.page = 1;
this.perPage = 40;
    }
     

    async getImg() {
  try {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;
    const response = await axios.get(url);
    const images = response.data;
    this.incrementPage();
    return images;
  } catch (error) {
    console.error(error);
  }
}

incrementPage() {
  this.page += 1;
}

resetPage() {
  this.page = 1;  
}

get query() {
    return this.searchQuery;
}

set query(newQuery) {
    this.searchQuery = newQuery;
}

get imgQty() {
  return ((this.page-1) * this.perPage);
}
}