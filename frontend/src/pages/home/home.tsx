import { Filters, SearchBar, ProductsGrid } from 'components';
import 'pages/home/home.scss';

export default function Home() {
  return (
    <div className='home'>
      <div className='top-section'>
        <h4>New Arrivals</h4>
        <div className='filters'>
          <Filters />
        </div>
      </div>
      <div className='search-bar'>
        <SearchBar />
      </div>
      <div className='products-grid'>
        <ProductsGrid />
      </div>
    </div>
  );
}
