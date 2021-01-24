export default interface IProduct {
  id: number;
  name: string;
  price: number;
  percentoff: number;
  description: string;
  avgstars: number;
  category: number;
  imageurl: string;
  count?: number;
}