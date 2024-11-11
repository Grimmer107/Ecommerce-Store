import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { setCategory, setFilter } from 'reduxStore/reducers/productsSlice';
import { logout } from 'reduxStore/actions/logout';
import 'components/header/header.scss';
import logo from 'assets/logo.png';

export default function Header() {
  const { credentialDetails } = useSelector((state: any) => state.root.user);
  const { cart } = useSelector((state: any) => state.root.cart);
  const [categories, setCategories] = useState<Array<string>>([]);
  const dispatch = useDispatch();
  const burgerMenuOptionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function getProductCategories() {
      try {
        let response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/store/api/v1/product_categories/`,
        );
        response = response.data.map((category: any) => category.name);
        setCategories(['New Arrivals', ...(response as any)]);
      } catch (err: any) {
        console.log('Error fetching product categories!', err);
      }
    }

    getProductCategories();
  }, []);

  function setProductCategory(category: string) {
    if (category === categories[0]) {
      dispatch(setCategory(''));
      dispatch(setFilter('new'));
    } else {
      dispatch(setCategory(category));
    }
  }

  return (
    <div className='header'>
      <div className='menubar'>
        <div className='left-section'>
          <span>Store Pakistan</span>
          <span>Support</span>
          <Link to={'/orders'} className='link'>
            <span>Track My Orders</span>
          </Link>
        </div>
        <div className='center-section'></div>
        <div className='right-section'>
          <span className='username'>{credentialDetails?.user?.first_name}</span>
          <Link to={'/login'}>
            <span className='icon' title={'Login'}>
              <i className='fa-solid fa-user'></i>
            </span>
          </Link>
          <Link to={'/cart'}>
            <span className='icon' title={'View Cart'}>
              <i className='fa-solid fa-cart-shopping'></i>
              <span className='cart-count'>{Object.keys(cart).length}</span>
            </span>
          </Link>
          {credentialDetails?.user ? (
            <span title={'Logout'} className='logout' onClick={() => dispatch(logout())}>
              <i className='fa fa-sign-out' aria-hidden='true'></i>
            </span>
          ) : null}
        </div>
      </div>
      <div className='navbar'>
        <div className='nav-items'>
          <Link className='link' to={'/'}>
            <span className='logo'>
              <img src={logo} alt='Logo' />
            </span>
          </Link>
          {categories.map((category) => {
            return (
              <Link
                className='link'
                to={'/'}
                key={category}
                onClick={() => setProductCategory(category)}
              >
                <span>{category}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className='burger-menu'>
        <div
          className='burger-menu-button'
          onClick={() => {
            burgerMenuOptionsRef.current?.classList.toggle('hidden');
          }}
        >
          <i className='fa-solid fa-bars'></i>
        </div>
        <div ref={burgerMenuOptionsRef} className='burger-options hidden'>
          {categories.map((category) => {
            return (
              <Link
                className='link'
                to={'/'}
                key={category}
                onClick={() => {
                  setProductCategory(category);
                  burgerMenuOptionsRef.current?.classList.toggle('hidden');
                }}
              >
                <span>{category}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
