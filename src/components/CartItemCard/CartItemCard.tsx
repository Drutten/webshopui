import React from 'react';
import './CartItemCard.scss';
import ICartItem from '../../interfaces/ICartItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface ICartItemCardProps {
  cartItem: ICartItem;
  onUpdateCart(product: number, quantity: number): void;
  onDeleteCartItem(product: number): void;
}

interface ICartItemState {
  quantity: number;
}

class CartItemCard extends React.Component<ICartItemCardProps, ICartItemState> {
  constructor(props:ICartItemCardProps){
    super(props);

    this.state = {
      quantity: 0 
    }
  }


  handleChangeQuantity(e: React.ChangeEvent<HTMLInputElement>){
    let value = Number(e.target.value);
    if(value < 1){
      value = 1;
    }
    this.setState({
      quantity: value
    });
  }


  updateCart(){
    let value = this.state.quantity;
    this.props.onUpdateCart(this.props.cartItem.Id, value);
    this.setState({
      quantity: 0
    });
  }


  //flytta till app
  calculateTotal(): number {
    let total = this.props.cartItem.Price;
    let percentOff = this.props.cartItem.PercentOff;
    let count = this.props.cartItem.Count;
    if(count > 1){
      total *= count;
    }
    if(percentOff){
      total *= percentOff;
    }
    return total;  
  }


  getPrice(): string{
    let priceString = `$${this.props.cartItem.Price.toFixed(2)}`;
    let total = this.props.cartItem.Price;
    let percentOff = this.props.cartItem.PercentOff;
    let count = this.props.cartItem.Count;
    if(count > 1){
      total *= count;
      priceString += ` x ${count}`;
      if(!percentOff){
        priceString += ` = $${total.toFixed(2)}`;
      } 
    }
    if(percentOff){
      percentOff = 100 - percentOff;
      total *= (percentOff * 0.01);
      priceString += ` x ${percentOff}% = $${total.toFixed(2)}`;
    }
    return priceString;
  }



  getDiscountClass(): string{
    if(this.props.cartItem.PercentOff){
      return 'discount';
    }
    return '';
  }




  render(){

    const trash =<FontAwesomeIcon icon={faTrashAlt}/>
    const sync =<FontAwesomeIcon icon={faSync}/>
    
    return(
      <div className="cart-item-card">
        {(this.props.cartItem.PercentOff)? <div className="percent-off">{this.props.cartItem.PercentOff}% Off</div> : ''}
        <div className="image-container"><img src={this.props.cartItem.ImageUrl} alt={this.props.cartItem.Product}/></div>
        <div className="text-container">
          
          <div className="text-field">
            <h4>{this.props.cartItem.Product}</h4>
            <p>{this.props.cartItem.Category}</p>
            <p className={this.getDiscountClass()}>{this.getPrice()}</p>
          </div>
          
          <div className="button-field">
            <div className="quantity"><span>Quantity</span><input type="number" onChange={(e)=>this.handleChangeQuantity(e)} value={this.state.quantity || this.props.cartItem.Count}/></div>
            <span className="sync-button" onClick={()=>this.updateCart()}>{sync} Update Cart</span>
            <span className="trash-button" onClick={()=>this.props.onDeleteCartItem(this.props.cartItem.Id)}>{trash} Remove</span>
          </div>
        </div>
      </div>
    );
  }
}
export default CartItemCard;