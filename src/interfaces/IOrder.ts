export default interface IOrder {
  Id: number,
  CustomerId: number,
  OrderNumber: string,
  PurchaseDate: string,
  StatusId: number,
  Total: number,
  Discount: number,
  Tax: number  
}