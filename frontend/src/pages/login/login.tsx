import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CircleLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { login, googleLogin, passwordReset } from 'reduxStore/actions/user';
import { clearLoginErrors } from 'reduxStore/reducers/userSlice';
import 'react-toastify/dist/ReactToastify.css';
import { toasterSettingsOptions } from 'utils/constants';
import { loginFormValidation } from 'utils/validations';
import 'pages/login/login.scss';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectFrom = location.state?.from ?? '/';
  const [loading, setLoading] = useState<boolean>(false);

  const { isLoading, credentialDetails, error } = useSelector((state: any) => state.root.user);

  useEffect(() => {
    if (credentialDetails?.user) {
      navigate(redirectFrom);
    }
    // eslint-disable-next-line
  }, []);

  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordResetNotify = () =>
    toast.success('Password Reset Email Sent', toasterSettingsOptions);
  const confirmationEmailSendNotify = () =>
    toast.success('Confirmation Email Sent', toasterSettingsOptions);
  const googleAuthErrorNotify = () =>
    toast.error('Google Authentication Error', toasterSettingsOptions);
  const confirmationEmailErrorNotify = () =>
    toast.error('Confirmation Email Send Error', toasterSettingsOptions);

  const emailValue = watch('email');

  async function onSubmitHandler(data: any) {
    const formData = {
      email: data.email,
      password: data.password,
    };
    const result = await dispatch(login(formData) as any);
    if (!result.error) {
      navigate(location.state?.from ?? '/');
    }
  }

  async function onSuccessHandler(response: CodeResponse) {
    const result = await dispatch(googleLogin(response.code) as any);
    if (!result.error) {
      navigate(location.state?.from ?? '/');
    }
  }

  async function onVerificationEmailHandler() {
    if (emailValue === '') {
      setError('email', loginFormValidation.email.required);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/authentication/api/v1/email/verify/`,
        {
          email: emailValue,
        },
      );
      if (response.data['detail'] === 'Confirmation email sent.') {
        confirmationEmailSendNotify();
      }
    } catch (err: any) {
      confirmationEmailErrorNotify();
    }
    clearErrors('email');
    dispatch(clearLoginErrors());
    setLoading(false);
  }

  function onErrorHandler() {
    googleAuthErrorNotify();
  }

  async function onForgotPasswordHandler() {
    setLoading(true);
    await dispatch(passwordReset({ email: emailValue, passwordResetNotify }) as any);
    setLoading(false);
  }

  const onGoogleLoginHandler = useGoogleLogin({
    onSuccess: onSuccessHandler,
    onError: onErrorHandler,
    flow: 'auth-code',
  });

  return (
    <div className='login'>
      {loading || isLoading ? (
        <div className='loader'>
          <CircleLoader
            color={'#000000'}
            loading={isLoading || loading}
            size={150}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      ) : (
        <>
          <h4>Sign In To Your Store Account</h4>
          <div className='form'>
            {error ? <p className='form-top-error'>{error}</p> : ''}
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div>
                <input
                  type='email'
                  placeholder='E-mail'
                  aria-invalid={errors.email ? 'true' : 'false'}
                  {...register('email', loginFormValidation.email)}
                />
                <span className='error'>{errors.email?.message}</span>
              </div>
              <div>
                <input
                  type='password'
                  placeholder='Password'
                  aria-invalid={errors.password ? 'true' : 'false'}
                  {...register('password', loginFormValidation.password)}
                />
                <span className='error'>{errors.password?.message}</span>
              </div>
              <input type='submit' value='Sign In' />
            </form>
          </div>
          {error === 'User email not verified!' ? (
            <button className='verify-email' onClick={() => onVerificationEmailHandler()}>
              Verify Email
            </button>
          ) : null}
          <div className='signin-option'>
            <Link className='link' to='/signup'>
              <span>CREATE ACCOUNT</span>
            </Link>
            <span className='separater'>|</span>
            <span className='link' onClick={() => onForgotPasswordHandler()}>
              FORGOT PASSWORD?
            </span>
          </div>
          <button className='google-login' onClick={() => onGoogleLoginHandler()}>
            <i className='fa-brands fa-google'></i>
            <span>Sign in with Google</span>
          </button>
          <p>
            By clicking on the social login button you agree to the terms of privacy policy
            described{' '}
            <Link to='https://oneclicksociallogin.devcloudsoftware.com/privacy/policy/?lang=en'>
              here
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
