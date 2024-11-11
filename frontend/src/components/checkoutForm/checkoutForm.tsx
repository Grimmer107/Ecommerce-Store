import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { checkoutFormValidation } from 'utils/validations';
import { logout } from 'reduxStore/actions/logout';
import 'react-toastify/dist/ReactToastify.css';
import { clearCart } from 'reduxStore/actions/cart';
import { OrderItems } from 'utils/types';
import { toasterSettingsOptions } from 'utils/constants';
import { errorHandler } from 'utils/utils';
import 'components/checkoutForm/checkoutForm.scss';
import card from 'assets/card.svg';

export default function CheckoutForm({ setLoading }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [countries, setCountries] = useState<Array<string>>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const { credentialDetails } = useSelector((state: any) => state.root.user);
  const { cart } = useSelector((state: any) => state.root.cart);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      country: '',
      address: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
      paymentMethod: '',
    },
  });

  useEffect(() => {
    async function getAvailableCountries() {
      try {
        let response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/store/api/v1/countries/`,
        );
        response = response.data.map((country: any) => country.name);
        setCountries(response as any);
      } catch (err: any) {
        console.log('Error fetching countries!');
      }
    }

    async function getAvailableCities() {
      try {
        let response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/store/api/v1/cities/?country=${selectedCountry}`,
        );
        response = response.data.map((city: any) => {
          return { name: city.name, id: city.id };
        });
        setCities(response as any);
      } catch (err: any) {
        console.log('Error fetching cities!');
      }
    }

    getAvailableCountries();
    getAvailableCities();
  }, [selectedCountry]);

  const redirectToLogin = () => {
    navigate('/login', { state: { from: '/checkout' } });
  };

  const orderCreateErrorNotify = (err: string) => toast.error(err, toasterSettingsOptions);
  const orderCreateSuccessNotify = () =>
    toast.success('Order placed successfully.', toasterSettingsOptions);

  async function onSubmitHandler(data: any) {
    setLoading(true);
    const orderItems: OrderItems = [];
    Object.entries(cart).forEach(([key, cartItem]: any) => {
      orderItems.push({ product: key, quantity: cartItem.quantity });
    });
    try {
      const {
        firstName,
        lastName,
        email,
        country,
        address,
        city,
        phoneNumber,
        postalCode,
        paymentMethod,
      } = data;
      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/store/api/v1/orders/`, {
        email: credentialDetails?.user?.email ?? email,
        first_name: firstName,
        last_name: lastName,
        products: orderItems,
        country: country,
        address: address,
        city: city,
        phone_number: phoneNumber,
        postalCode: postalCode,
        payment_method: paymentMethod,
      });
      setLoading(false);
      orderCreateSuccessNotify();
      setTimeout(() => {
        navigate('/');
        setTimeout(() => {
          dispatch(clearCart());
        }, 1000);
      }, 4000);
    } catch (err: any) {
      setLoading(false);
      if (err.status === 400 || err.status === 401) {
        const errorBody = err.response.data;
        if (errorBody['detail'] === 'Given token not valid for any token type') {
          dispatch(logout());
          navigate('/login', { state: { from: window.location.pathname } });
          return;
        } else {
          orderCreateErrorNotify(errorHandler(err));
        }
      }
      orderCreateErrorNotify(errorHandler(err));
    }
  }

  return (
    <div className='checkout-form'>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div>
          {credentialDetails && credentialDetails.user ? (
            <>
              <h5 className='account'>Account</h5>
              <p className='login-user'>{credentialDetails.user?.email}</p>
              <p onClick={() => dispatch(logout())} className='logout-link'>
                Logout
              </p>
            </>
          ) : (
            <>
              <h5 className='contact'>
                Contact{' '}
                <span className='login-link' onClick={() => redirectToLogin()}>
                  Login
                </span>
              </h5>
              <input
                type='email'
                placeholder='Email'
                aria-invalid={errors.email ? 'true' : 'false'}
                {...register('email', checkoutFormValidation.email)}
              />
              <span className='error'>{errors.email?.message}</span>
            </>
          )}
        </div>
        <h5>
          Delivery <span className='note'>(Delivery currently restricted to Pakistan)</span>
        </h5>
        <select
          defaultValue={'Select a country'}
          {...register('country', checkoutFormValidation.country)}
          aria-invalid={errors.country ? 'true' : 'false'}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value='' hidden disabled>
            Select a country
          </option>
          {countries.map((country: string) => {
            return (
              <option key={country} value={country}>
                {country}
              </option>
            );
          })}
        </select>
        <span className='error'>{errors.country?.message}</span>
        <div className='double'>
          <div className='first'>
            <input
              type='text'
              placeholder='First Name'
              aria-invalid={errors.firstName ? 'true' : 'false'}
              {...register('firstName', checkoutFormValidation.firstName)}
            />
            <span className='error'>{errors.firstName?.message}</span>
          </div>
          <div className='second'>
            <input
              type='text'
              placeholder='Last Name'
              aria-invalid={errors.lastName ? 'true' : 'false'}
              {...register('lastName', checkoutFormValidation.lastName)}
            />
            <span className='error'>{errors.lastName?.message}</span>
          </div>
        </div>
        <input
          type='text'
          placeholder='Address'
          aria-invalid={errors.address ? 'true' : 'false'}
          {...register('address', checkoutFormValidation.address)}
        />
        <span className='error'>{errors.address?.message}</span>
        <div className='double'>
          <div className='first'>
            <select
              disabled={selectedCountry === ''}
              defaultValue={'Select a city'}
              aria-invalid={errors.city ? 'true' : 'false'}
              {...register('city', checkoutFormValidation.city)}
            >
              <option value='' hidden disabled>
                Select a city
              </option>
              {cities.map(({ id, name }: { id: string; name: string }) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
            <span className='error'>{errors.city?.message}</span>
          </div>
          <div className='second'>
            <input type='text' placeholder='Postal Code (Optional)' {...register('postalCode')} />
          </div>
        </div>
        <input
          type='text'
          placeholder='Phone Number'
          aria-invalid={errors.phoneNumber ? 'true' : 'false'}
          {...register('phoneNumber', checkoutFormValidation.phoneNumber)}
        />
        <span className='error'>{errors.phoneNumber?.message}</span>

        <h6>Shipping method</h6>
        <div className='shipping-method'>
          <span>Standard Delivery Time is 2 to 3 Working Days</span>
          <span className='amount'>Rs. 200.00</span>
        </div>
        <h5>Payment</h5>
        <p className='transaction-security'>All transactions are secure and encrypted.</p>
        <div className='payment-methods'>
          <div
            className={`pay-card ${
              paymentMethod === 'payfast' ? 'selected' : 'remove-bottom-border'
            }`}
          >
            <input
              type='radio'
              {...register('paymentMethod', checkoutFormValidation.paymentMethod)}
              value='PAYFAST'
              onClick={() => setPaymentMethod('payfast')}
            />
            <span>PAYFAST(Pay via Debit/Credit)</span>
          </div>
          <div className={`payfast-detail ${paymentMethod === 'payfast' ? 'display' : ''}`}>
            <div className='image'>
              <img src={card} alt={'Card Logo'} />
            </div>
            <div className='description'>
              After clicking "Pay now", you will be redirected to Stripe to complete your purchase
              securely. Online payments confirmation can take one business day. All Debit / Credit
              cards are accepted.
            </div>
          </div>
          <div
            className={`cash-on-delivery ${
              paymentMethod === 'cod' ? 'selected' : 'remove-top-border'
            }`}
          >
            <input
              type='radio'
              {...register('paymentMethod', checkoutFormValidation.paymentMethod)}
              value='Cash On Delivery'
              onClick={() => setPaymentMethod('cod')}
            />
            <span>Cash on Delivery (COD)</span>
          </div>
        </div>
        <span className='error'>{errors.paymentMethod?.message}</span>
        <input type='submit' value='Pay Now' />
      </form>
    </div>
  );
}
