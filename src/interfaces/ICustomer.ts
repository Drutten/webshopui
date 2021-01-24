import ICartItem from "./ICartItem";
import IOrder from "./IOrder";
import IProduct from "./IProduct";

export default interface ICustomer {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  favorites: IProduct[];
  cartItems: ICartItem[];
  orders: IOrder[];
}