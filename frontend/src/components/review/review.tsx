import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import axios from 'axios';
import { reviewFormValidation } from 'utils/validations';
import { toasterSettingsOptions } from 'utils/constants';
import { logout } from 'reduxStore/actions/logout';
import { toast } from 'react-toastify';
import 'components/review/review.scss';

export default function Review({ productId }: { productId: string }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const { credentialDetails } = useSelector((state: any) => state.root.user);

  const reviewPostSuccessNotify = () =>
    toast.success('Review posted successfully', toasterSettingsOptions);
  const reviewPostErrorNotify = () => toast.error('Error encountered', toasterSettingsOptions);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      reviewTitle: '',
      review: '',
    },
  });

  async function onSubmitHandler(data: any) {
    const { review, reviewTitle } = data;
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/store/api/v1/reviews/`,
        { review_title: reviewTitle, review: review, rating: rating, product: productId },
        {
          headers: {
            Authorization: `Bearer ${credentialDetails.access}`,
          },
        },
      );
      reviewPostSuccessNotify();
    } catch (err: any) {
      if (err.status === 400 || err.status === 401) {
        const errorBody = err.response.data;
        if (errorBody['detail'] === 'Given token not valid for any token type') {
          dispatch(logout());
          navigate('/login', { state: { from: window.location.pathname } });
          return;
        } else {
          reviewPostErrorNotify();
        }
      }
      reviewPostErrorNotify();
    }
    setRating(0);
    reset();
  }

  const redirectToLogin = () => {
    navigate('/login', { state: { from: window.location.pathname } });
  };

  return (
    <div className='review'>
      <button onClick={() => setShowReviewForm(true)}>Write a Review</button>
      {showReviewForm ? (
        <>
          {credentialDetails?.user ? (
            <div className={`review-form ${showReviewForm ? 'display' : ''}`}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <h6>Rating</h6>
                <div className='rating'>
                  <Rating
                    onClick={(rate) => setRating(rate)}
                    initialValue={rating}
                    fillColor='#ff6b08'
                  />
                </div>
                <h6>Review Title</h6>
                <div className='field'>
                  <input
                    type='text'
                    placeholder='Review Title'
                    aria-invalid={errors.reviewTitle ? 'true' : 'false'}
                    {...register('reviewTitle', reviewFormValidation.reviewTitle)}
                  />
                  <span className='error'>{errors.reviewTitle?.message}</span>
                </div>
                <h6>Review</h6>
                <div className='field'>
                  <textarea
                    placeholder='Review'
                    aria-invalid={errors.review ? 'true' : 'false'}
                    {...register('review', reviewFormValidation.review)}
                  />
                  <span className='error'>{errors.review?.message}</span>
                </div>
                <input type='submit' value='Submit' />
              </form>
            </div>
          ) : (
            <>
              <p>You have to be logged in to submit a review</p>
              <p className='link' onClick={() => redirectToLogin()}>
                Login
              </p>
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
