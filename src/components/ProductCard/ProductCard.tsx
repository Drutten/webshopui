import React from 'react';
import './ProductCard.scss';
import IProduct from '../../interfaces/IProduct';
import ICartItem from '../../interfaces/ICartItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faNotEqual } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';

interface IProductCardProps {
  product: IProduct;
  favorites: IProduct[];
  basicCart: ICartItem[];
  onAddFavorite(product: number): void;
  onDeleteFavorite(product: number): void;
  onAddCartItem(product: number): void;
  onDeleteCartItem(product: number): void;
}

class ProductCard extends React.Component<IProductCardProps, {}> {



  getPrice(): string{
    let priceString = `$${this.props.product.Price.toFixed(2)}`;
    let total = this.props.product.Price;
    let percentOff = this.props.product.PercentOff;
    if(percentOff){
      percentOff = 100 - percentOff;
      total *= (percentOff * 0.01);
      priceString += ` x ${percentOff}% = $${total.toFixed(2)}`;
    }
    return priceString;
  }


  getDiscountClass(): string{
    if(this.props.product.PercentOff){
      return 'discount';
    }
    return '';
  }



  isInFavorites(product: IProduct): boolean{
    let isFavorite = false;
    this.props.favorites.forEach(item=>{
      if(item.Id === product.Id){
        isFavorite = true;
      }
    });
    return isFavorite;
  }



  isInCart(product: IProduct): boolean{
    let isCartProduct = false;
    this.props.basicCart.forEach(item =>{
      if(item.Id === product.Id){
        isCartProduct = true;
      }
    });
    return isCartProduct;
  }





  render(){

    const solidHeart =<FontAwesomeIcon icon={fasHeart}/>
    const regularHeart =<FontAwesomeIcon icon={farHeart}/>
    const cartPlus =<FontAwesomeIcon icon={faCartPlus}/>
    const notEqual =<FontAwesomeIcon icon={faNotEqual}/>
    const regularStar =<FontAwesomeIcon icon={faStar} className="far"/>
    return(
      <div className="product-card">
        {(this.props.product.PercentOff)? <div className="percent-off">{this.props.product.PercentOff}% Off</div> : ''}
        <div className="image-container"><img src={this.props.product.ImageUrl} alt={this.props.product.Product}/></div>
        <div className="text-container">
          <div className="header-field"><h4>{this.props.product.Product}</h4>
            {(this.isInFavorites(this.props.product))
            ? <span onClick={()=>this.props.onDeleteFavorite(this.props.product.Id)}>{solidHeart}</span>
            : <span onClick={()=>this.props.onAddFavorite(this.props.product.Id)}>{regularHeart}</span>}
          </div>
          
          <div className="text">
            <p>{this.props.product.Category}</p>
            <p className={this.getDiscountClass()}>{this.getPrice()}</p>
            <p>{this.props.product.Description}</p>
          </div>
          
          <div className="footer-field">
            <div className="cart-icons">
              {(this.isInCart(this.props.product))
                ? <span onClick={()=>this.props.onDeleteCartItem(this.props.product.Id)}>{notEqual}</span>
                : <span onClick={()=>this.props.onAddCartItem(this.props.product.Id)}>{cartPlus}</span>
              }
              
              
            </div>
            <div><span>{this.props.product.AvgStars} </span><span>{regularStar}</span></div>
          </div>
        </div>
      </div>
    );
  }
}
export default ProductCard;