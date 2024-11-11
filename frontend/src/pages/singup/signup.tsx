import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import CircleLoader from 'react-spinners/ClipLoader';
import { toasterSettingsOptions } from 'utils/constants';
import { signupFormValidation } from 'utils/validations';
import { SignupFormData } from 'utils/types';
import { errorHandler } from 'utils/utils';
import 'pages/singup/signup.scss';

export default function Signup() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const verificationEmailSentNotify = () =>
    toast.success('Verification Email Sent.', toasterSettingsOptions);

  async function onSubmitHandler(data: any) {
    setLoading(true);
    const formData: SignupFormData = {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
    };

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/authentication/api/v1/signup/`, {
        ...formData,
      });
      setLoading(false);
      verificationEmailSentNotify();
      setTimeout(() => navigate('/login'), 5000);
    } catch (err: any) {
      setLoading(false);
      if (err.status === 400) {
        const errorBody = err.response.data;
        const errorField = Object.keys(errorBody)[0];
        if (Object.keys(formData).includes(errorField)) {
          setError(errorBody[errorField]);
        }
      } else {
        setError(errorHandler(err));
      }
    }
  }

  return (
    <div className='signup'>
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
          <h4>Create Store Account</h4>
          <div className='form'>
            {error ? <p className='form-top-error'>{error}</p> : ''}
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div>
                <input
                  type='text'
                  placeholder='First Name'
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                  {...register('firstName', signupFormValidation.firstName)}
                />
                <span className='error'>{errors.firstName?.message}</span>
              </div>
              <div>
                <input
                  type='text'
                  placeholder='Last Name'
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  {...register('lastName', signupFormValidation.lastName)}
                />
                <span className='error'>{errors.lastName?.message}</span>
              </div>
              <div>
                <input
                  type='email'
                  placeholder='E-mail'
                  aria-invalid={errors.email ? 'true' : 'false'}
                  {...register('email', signupFormValidation.email)}
                />
                <span className='error'>{errors.email?.message}</span>
              </div>
              <div>
                <input
                  type='password'
                  placeholder='Password'
                  aria-invalid={errors.password ? 'true' : 'false'}
                  {...register('password', signupFormValidation.password)}
                />
                <span className='error'>{errors.password?.message}</span>
              </div>
              <input type='submit' value='Create An Account' />
            </form>
            <div className='signin'>
              <Link className='signin-link' to='/login'>
                Sign In
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
