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
  cart: ICartItem[];
  onAddFavorite(product: number): void;
  onDeleteFavorite(product: number): void;
  onAddCartItem(product: number): void;
  onDeleteCartItem(product: number): void;
}

class ProductCard extends React.Component<IProductCardProps, {}> {



  getPrice(): string{
    let priceString = `$${this.props.product.price.toFixed(2)}`;
    let total = this.props.product.price;
    let percentOff = this.props.product.percentoff;
    if(percentOff){
      percentOff = 100 - percentOff;
      total *= (percentOff * 0.01);
      priceString += ` x ${percentOff}% = $${total.toFixed(2)}`;
    }
    return priceString;
  }


  getDiscountClass(): string{
    if(this.props.product.percentoff){
      return 'discount';
    }
    return '';
  }



  isInFavorites(product: IProduct): boolean{
    let isFavorite = false;
    this.props.favorites.forEach(item=>{
      if(item.id === product.id){
        isFavorite = true;
      }
    });
    return isFavorite;
  }



  isInCart(product: IProduct): boolean{
    let isCartProduct = false;
    this.props.cart.forEach(item =>{
      if(item.id === product.id){
        isCartProduct = true;
      }
    });
    return isCartProduct;
  }

  getCategory(category: number): string {
    let categoryName: string = '';
    switch (category) {
      case 1: categoryName = 'Computers & Accessories';
      break;
      case 2: categoryName = 'TV, Video & Audio';
      break;
      case 3: categoryName = 'Smartphones & Tablets';
      break;
      case 4: categoryName = 'Photo Cameras';
      break;
      case 5: categoryName = 'Video Cameras';
      break;
      case 6: categoryName = 'Headphones';
      break;
      case 7: categoryName = 'Wearable Electronics';
      break;
      case 8: categoryName = 'Printers & Ink';
      break;
      case 9: categoryName = 'Video Games';
      break;
      case 10: categoryName = 'Speakers & Home Music';
      break;
      case 11: categoryName = 'HDD/SSD Data Storage';
      break;
    }
    return categoryName;
  }





  render(){

    const solidHeart =<FontAwesomeIcon icon={fasHeart}/>
    const regularHeart =<FontAwesomeIcon icon={farHeart}/>
    const cartPlus =<FontAwesomeIcon icon={faCartPlus}/>
    const notEqual =<FontAwesomeIcon icon={faNotEqual}/>
    const regularStar =<FontAwesomeIcon icon={faStar} className="far"/>
    return(
      <div className="product-card">
        {(this.props.product.percentoff)? <div className="percent-off">{this.props.product.percentoff}% Off</div> : ''}
        <div className="image-container"><img src={this.props.product.imageurl} alt={this.props.product.name}/></div>
        <div className="text-container">
          <div className="header-field"><h4>{this.props.product.name}</h4>
            {(this.isInFavorites(this.props.product))
            ? <span onClick={()=>this.props.onDeleteFavorite(this.props.product.id)}>{solidHeart}</span>
            : <span onClick={()=>this.props.onAddFavorite(this.props.product.id)}>{regularHeart}</span>}
          </div>
          
          <div className="text">
            <p>{this.getCategory(this.props.product.category)}</p>
            <p className={this.getDiscountClass()}>{this.getPrice()}</p>
            <p>{this.props.product.description}</p>
          </div>
          
          <div className="footer-field">
            <div className="cart-icons">
              {(this.isInCart(this.props.product))
                ? <span onClick={()=>this.props.onDeleteCartItem(this.props.product.id)}>{notEqual}</span>
                : <span onClick={()=>this.props.onAddCartItem(this.props.product.id)}>{cartPlus}</span>
              }
              
              
            </div>
            <div><span>{this.props.product.avgstars} </span><span>{regularStar}</span></div>
          </div>
        </div>
      </div>
    );
  }
}
export default ProductCard;