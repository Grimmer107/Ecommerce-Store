import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircleLoader from 'react-spinners/ClipLoader';
import { logout } from 'reduxStore/actions/logout';
import { errorHandler } from 'utils/utils';
import { formatFloat } from 'utils/utils';
import 'pages/orders/orders.scss';

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [orders, setOrders] = useState<JSX.Element[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [deletedOrderId, setDeletedOrderId] = useState<string>('');
  const { credentialDetails } = useSelector((state: any) => state.root.user);

  function getStatusStyleClass(status: string) {
    if (['Pending', 'Processing'].includes(status)) {
      return 'pending';
    } else if (['Shipped', 'Delivered'].includes(status)) {
      return 'delivering';
    } else if (status === 'Completed') {
      return 'completed';
    } else if (['Returned', 'Refunded'].includes(status)) {
      return 'stale';
    } else if (status === 'Cancelled') {
      return 'cancelled';
    }
  }

  async function onOrderDeleteHandler(orderId: string) {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_API_URL}/store/api/v1/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${credentialDetails.access}`,
          },
        },
      );
      if (response) {
        setDeletedOrderId(orderId);
      }
    } catch (err: any) {
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function getOrders() {
      setLoading(true);
      try {
        let response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/store/api/v1/orders/`,
          {
            headers: {
              Authorization: `Bearer ${credentialDetails.access}`,
            },
          },
        );
        response = response.data.results.map((order: any) => {
          const { id, status, total_price, payment_method } = order;
          return (
            <tr className='row' key={id}>
              <td className='id'>{id}</td>
              <td className='total'>Rs. {formatFloat(total_price, 2)}</td>
              <td className='payment-method'>{payment_method}</td>
              <td className='status'>
                <span className={getStatusStyleClass(status)}>{status}</span>
              </td>
              <td className='delete-order'>
                {['Pending', 'Processing'].includes(status) ? (
                  <span
                    className='delete'
                    title='Delete Order'
                    onClick={() => onOrderDeleteHandler(id)}
                  >
                    <i className='fa fa-trash' aria-hidden='true'></i>
                  </span>
                ) : null}
              </td>
            </tr>
          );
        });
        setOrders(response as any);
      } catch (err: any) {
        if (err.status === 400 || err.status === 401) {
          const errorBody = err.response.data;
          if (errorBody['detail'] === 'Given token not valid for any token type') {
            dispatch(logout());
            navigate('/login', { state: { from: window.location.pathname } });
            return;
          } else {
            setError(errorHandler(err));
          }
        }
        setError(errorHandler(err));
      }
      setLoading(false);
    }

    if (credentialDetails && credentialDetails.user) {
      getOrders();
    }
    // eslint-disable-next-line
  }, [deletedOrderId]);

  return (
    <div className='orders'>
      {!(credentialDetails && credentialDetails.user) ? (
        <div className='not-logged'>
          <p>You have to login to view Orders</p>
          <Link className='link' to={'/login'} state={{ from: window.location.pathname }}>
            <p>Login</p>
          </Link>
        </div>
      ) : loading ? (
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
          {error ? (
            <p className='error'>{error}</p>
          ) : (
            <table className='table'>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{orders}</tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
