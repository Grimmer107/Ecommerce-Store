import { useState } from 'react';
import { useSelector } from 'react-redux';
import CircleLoader from 'react-spinners/ClipLoader';
import { CheckoutForm } from 'components';
import { formatFloat } from 'utils/utils';
import 'pages/checkout/checkout.scss';

export default function Checkout() {
  const [loading, setLoading] = useState<boolean>(false);
  const { cart, total } = useSelector((state: any) => state.root.cart);

  const cartItems: JSX.Element[] = [];

  Object.values(cart).forEach((cartItem: any) => {
    cartItems.push(
      <div className='cart-item' key={cartItem.name}>
        <div className='image'>
          <img src={cartItem.image} alt={'Product thumbnail'} />
          <span>{cartItem.quantity}</span>
        </div>
        <div className='name'>{cartItem.name}</div>
        <div className='price'>Rs. {formatFloat(cartItem.price, 2)}</div>
      </div>,
    );
  });

  return (
    <div className='checkout'>
      {loading ? (
        <div className='loader'>
          <CircleLoader
            color={'#000000'}
            loading={loading}
            size={150}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      ) : (
        <>
          <div className='checkout-form-section'>
            <CheckoutForm setLoading={setLoading} />
          </div>
          <div className='order-detail-section'>
            <div className='cart-item-list'>{cartItems}</div>
            <div className='billing'>
              <div className='sub-total'>
                <span className='heading'>Subtotal</span>
                <div className='amount'>Rs. {formatFloat(total, 2)}</div>
              </div>
              <div className='shipping'>
                <span className='heading'>Shipping</span>
                <div className='amount'>Rs. {formatFloat(200, 2)}</div>
              </div>
              <div className='total'>
                <span className='heading'>Total</span>
                <div className='amount'>
                  <span>PKR</span>
                  Rs. {formatFloat(total + 200, 2)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
