interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  role: 'restaurant' | 'admin' | 'customer';
  address: Address;
  validated: boolean;
  createdAt: string;
  updatedAt: string;
}