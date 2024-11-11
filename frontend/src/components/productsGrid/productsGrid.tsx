import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as JsSearch from 'js-search';
import { fetchProducts } from 'reduxStore/actions/products';
import { ProductCard } from 'components';
import CircleLoader from 'react-spinners/ClipLoader';
import 'components/productsGrid/productsGrid.scss';
import sadFace from 'assets/sad-face.svg';

export default function ProductsGrid() {
  const { isLoading, products, error, filter, category } = useSelector(
    (state: any) => state.root.products,
  );
  const { searchString } = useSelector((state: any) => state.root.search);

  const dispatch = useDispatch();

  const search = new JsSearch.Search('id');
  search.addIndex('name');
  search.addDocuments(products);

  useEffect(() => {
    dispatch(fetchProducts({ category, filter }) as any);
    // eslint-disable-next-line
  }, [filter, category, searchString]);

  return (
    <div className='grid'>
      {error ? (
        <div className='error'>
          <img src={sadFace} alt='Sad Face Icon' />
          Unable to fetch Products!
        </div>
      ) : isLoading ? (
        <div className='loader'>
          <CircleLoader
            color={'#000000'}
            loading={isLoading}
            size={150}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      ) : (
        (searchString !== '' ? search.search(searchString) : products).map((product: any) => (
          <ProductCard
            id={product.id}
            key={product.id}
            productImage={product.image}
            name={product.name}
            price={product.price}
            available={product.available}
          />
        ))
      )}
    </div>
  );
}
