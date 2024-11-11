import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, setCartItemQuanity } from 'reduxStore/actions/cart';
import { formatFloat } from 'utils/utils';
import 'pages/cart/cart.scss';

export default function Cart() {
  const { cart, total } = useSelector((state: any) => state.root.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems: JSX.Element[] = [];

  Object.entries(cart).forEach(([key, cartItem]: any) => {
    cartItems.push(
      <tr className='row' key={cartItem.name}>
        <td className='image'>
          <img src={cartItem.image} alt='cartItem thumbnail' />
        </td>
        <td className='name'>{cartItem.name}</td>
        <td className='price'>Rs. {formatFloat(cartItem.price, 1)}</td>
        <td className='quantity'>
          <input
            type='number'
            min={0}
            max={cartItem.available}
            defaultValue={cartItem.quantity}
            onChange={(e) =>
              dispatch(setCartItemQuanity({ productId: key, newQuantity: Number(e.target.value) }))
            }
          />
        </td>
        <td className='total'>
          Rs. {formatFloat(Number(cartItem.price) * Number(cartItem.quantity), 1)}
        </td>
        <td
          className='remove-from-cart'
          onClick={() => dispatch(removeFromCart(key))}
          title='Remove from Cart'
        >
          x
        </td>
      </tr>,
    );
  });

  return (
    <div className='cart'>
      <table className='table'>
        <thead>
          <tr>
            <th className='image'></th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{cartItems}</tbody>
      </table>
      <div className='checkout'>
        <div className='option'>
          <div>
            Total <span>Rs. {formatFloat(total, 2)}</span>
          </div>
          <div className='buttons'>
            <button className='black-button' onClick={() => navigate('/')}>
              Return to Shopping
            </button>
            <button disabled={Object.keys(cart).length === 0} onClick={() => navigate('/checkout')}>
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
