import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CircleLoader from 'react-spinners/ClipLoader';
import { Review } from 'components';
import { fetchProduct } from 'reduxStore/actions/products';
import { addToCart } from 'reduxStore/actions/cart';
import sadFace from 'assets/sad-face.svg';
import { formatFloat } from 'utils/utils';
import 'pages/product/product.scss';

export default function Product() {
  const dispatch = useDispatch();
  const { isLoading, product, error } = useSelector((state: any) => state.root.product);
  const [currentSelectedImage, setCurrentSelectedImage] = useState<string>('');
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProduct(id!) as any);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (product.images) {
      setCurrentSelectedImage(product.images[0]);
    }
  }, [product]);

  return (
    <>
      <div className='product'>
        {error ? (
          <div className='error'>
            <img src={sadFace} alt='Sad Face Icon' />
            Unable to fetch Product!
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
          <>
            <div className='images'>
              <div className='image'>
                <img src={currentSelectedImage} alt='product-image' />
              </div>
              <div className='image-list'>
                {product.images &&
                  product.images.map((imgSrc: any) => {
                    return (
                      <div
                        className={`thumbnail ${imgSrc === currentSelectedImage ? 'selected' : ''}`}
                        onClick={() => setCurrentSelectedImage(imgSrc)}
                        key={imgSrc}
                      >
                        <img src={imgSrc} alt='product-image' />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className='description'>
              <div className='title'>{product.name}</div>
              <div className='price'>{`Rs. ${formatFloat(product.price, 0)}`}</div>
              <div className='detail'>
                <p>{'Details: '}</p>
                <pre>{product.description}</pre>
              </div>
              <div className='available'>
                {`Quantity Available: `}
                <span>{product.quantity}</span>
              </div>
              <div className='add-cart'>
                <button
                  onClick={() =>
                    dispatch(
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: product.quantity,
                        image: product.images[0],
                      }),
                    )
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {error || isLoading ? null : (
        <div className='product-review'>
          <Review productId={product.id} />
        </div>
      )}
    </>
  );
}
