import { Link } from 'react-router-dom';
import { formatFloat } from 'utils/utils';
import 'components/productCard/productCard.scss';

export default function ProductCard({ id, productImage, name, price, available }: any) {
  return (
    <div className='card'>
      <Link to={`/products/${id}`} className='link'>
        <div className='available'>{available ? '' : 'Sold Out'}</div>
        <div className='image'>
          <img src={productImage} alt={'Product'} />
        </div>
        <div className='title'>{name}</div>
        <div className='price'>{formatFloat(price, 0)}</div>
      </Link>
    </div>
  );
}
