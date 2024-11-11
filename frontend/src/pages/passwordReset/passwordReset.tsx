import { useForm } from 'react-hook-form';
import { passwordResetFormValidation } from 'utils/validations';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toasterSettingsOptions } from 'utils/constants';
import 'react-toastify/dist/ReactToastify.css';
import 'pages/passwordReset/passwordReset.scss';

export default function PasswordReset() {
  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordResetConfirmNotify = () =>
    toast.success('Password has been reset', toasterSettingsOptions);
  const passwordResetErrorNotify = () =>
    toast.error('Unknown Error Encountered', toasterSettingsOptions);

  async function onSubmitHandler(data: any) {
    if (data.password1 !== data.password2) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/authentication/api/v1/password/reset/confirm/${uidb64}/${token}/`,
        {
          uid: uidb64,
          token: token,
          new_password1: data.password,
          new_password2: data.confirmPassword,
        },
      );
      if (response.data) {
        passwordResetConfirmNotify();
        setTimeout(() => {
          navigate('/login');
        }, 4000);
      }
    } catch (err: any) {
      passwordResetErrorNotify();
    }
  }

  return (
    <div className='password-reset-form'>
      <h4>Reset Your Password</h4>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div>
          <input
            type='email'
            placeholder='E-mail'
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email', passwordResetFormValidation.email)}
          />
          <span className='error'>{errors.email?.message}</span>
        </div>
        <div>
          <input
            type='password'
            placeholder='Password'
            aria-invalid={errors.password ? 'true' : 'false'}
            {...register('password', passwordResetFormValidation.password1)}
          />
          <span className='error'>{errors.password?.message}</span>
        </div>
        <div>
          <input
            type='password'
            placeholder='Confirm Password'
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            {...register('confirmPassword', passwordResetFormValidation.password2)}
          />
          <span className='error'>{errors.confirmPassword?.message}</span>
        </div>
        <input type='submit' value='Submit' />
      </form>
    </div>
  );
}
