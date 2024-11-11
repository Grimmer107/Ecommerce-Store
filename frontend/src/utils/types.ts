export type User = {
  email: string;
  first_name: string;
  last_name: string;
};

export type CredentialDetails = {
  access: string;
  refresh: string;
  user: User | null;
};

export type CredentialResponse = {
  credentialDetails?: CredentialDetails | null;
  isLoading: boolean;
  error: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type SignupFormData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type Cart = {
  [id: string]: CartItem;
};

export type CartItem = {
  name: string;
  price: number;
  quantity: number;
  image: string;
  available: number;
};

export type OrderItem = {
  product: string;
  quantity: string;
};

export type OrderItems = Array<OrderItem>;
