export const signupFormValidation = {
  firstName: {
    required: { value: true, message: 'First Name is required.' },
  },
  lastName: {
    required: { value: true, message: 'Last Name is required.' },
  },
  email: {
    required: { value: true, message: 'Email is required.' },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Enter a valid email address.',
    },
  },
  password: {
    required: { value: true, message: 'Password is required.' },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      message: `Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.`,
    },
  },
};

export const loginFormValidation = {
  email: {
    required: { value: true, message: 'Email is required.' },
  },
  password: {
    required: { value: true, message: 'Password is required.' },
  },
};

export const passwordResetFormValidation = {
  email: {
    required: { value: true, message: 'Email is required.' },
  },
  password1: {
    required: { value: true, message: 'Password is required.' },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      message: `Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.`,
    },
  },
  password2: {
    required: { value: true, message: 'Confirm Password is required.' },
  },
};

export const reviewFormValidation = {
  reviewTitle: {
    required: { value: true, message: 'Review Title is required.' },
  },
  review: {
    required: { value: true, message: 'Review is required.' },
  },
};

export const checkoutFormValidation = {
  firstName: {
    required: { value: true, message: 'First Name is required' },
  },
  lastName: {
    required: { value: true, message: 'Last Name is required' },
  },
  address: {
    required: { value: true, message: 'Address is required' },
  },
  city: {
    required: { value: true, message: 'City is required' },
  },
  country: {
    required: { value: true, message: 'Country is required' },
  },
  phoneNumber: {
    required: { value: true, message: 'Phone Number is required' },
    pattern: {
      value: /^(\+92|03|92)[0-9]{9,10}$/,
      message: 'Phone Number must be a valid Pakistani number',
    },
  },
  paymentMethod: {
    required: { value: true, message: 'Payment Method is required' },
  },
  email: {
    required: { value: true, message: 'Email is required' },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Enter a valid email address',
    },
  },
};
