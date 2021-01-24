import React from 'react';
import './Nav.scss';
import Hamburger from '../Hamburger/Hamburger';
import Menu from '../Menu/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ICustomer from '../../interfaces/ICustomer';
import IProduct from '../../interfaces/IProduct';
import ICartItem from '../../interfaces/ICartItem';
import IOrder from '../../interfaces/IOrder';


interface INavProps{
  customers: ICustomer[];
  currentCustomer: ICustomer | null;
  favorites: IProduct[];
  cart: ICartItem[];
  orders: IOrder[];
  isLoadingCustomers: boolean;
  isLoadingFavorites: boolean;
  isLoadingBasicCart: boolean;
  isLoadingOrders: boolean;
  hasErrorFavorites: boolean;
  hasErrorBasicCart: boolean;
  hasErrorOrders: boolean;
  hasErrorUsers: boolean;
  onFetchByCategory(categoryId: number): void;
  onChangeCurrentCustomer(customer: ICustomer): void;
  onSearch(searchText: string): void;
  onDisplayFavorites(): void;
  onGetCart(): void;
  onGetProducts(): void;
}


interface INavState{
  isOpen: boolean;
  areDisplayedUsers: boolean;
  search: string;
}

class Nav extends React.Component <INavProps, INavState>{
  constructor(props:INavProps){
    super(props);

    this.state = {
      isOpen : false,
      areDisplayedUsers : false,
      search : ''
    }

    this.handleToggleHamburger = this.handleToggleHamburger.bind(this);
    this.handleDisplayUsers = this.handleDisplayUsers.bind(this);
  }

  
  



  handleToggleHamburger(){
    const toggler = !this.state.isOpen;
    this.setState({
      isOpen: toggler
    });
  }


  handleDisplayUsers(){
    const toggler = !this.state.areDisplayedUsers;
    this.setState({
      areDisplayedUsers: toggler
    });
  }


  handleChangeSearch(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      search: e.target.value 
    });
  }


  handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let searchText = this.state.search;
    this.setState({search : ''});
    this.props.onSearch(searchText);    
}

  // ordrar hanteras inte för närvarande, resulterar i 0
  getLengthOfNotDeliveredOrders():number{
    //Räkna bort delivered och canceled
    const filteredOrders = this.props.orders.filter(item=>{
      return item.StatusId !== 4 && item.StatusId !== 2;
    });
    return filteredOrders.length;
  }

  // ordrar hanteras inte för närvarande, resulterar i 0
  getTotalOfNotDeliveredOrders():string{
    let total = 0;
    const filteredOrders = this.props.orders.filter(item=>{
      return item.StatusId !== 4 && item.StatusId !== 2;
    });
    filteredOrders.forEach(item =>{
      total += item.Total;
    });
    return total.toFixed(2);
  }


  getCartCount():number{
    let count = 0;
    this.props.cart.forEach(item =>{
      if (item.count !== undefined) {
        count += item.count;
      }
    })
    return count;
  }


  calculateTotal():string{
    let total = 0;
    let totalString = '';

    this.props.cart.forEach(item =>{
      let itemTotal = item.price;
      if(item.count && item.count > 1){
        itemTotal *= item.count;
      }
      if(item.percentoff){
        let discount = 100 - item.percentoff;
        itemTotal *= (discount * 0.01);
      }
      total += itemTotal;
    });
    totalString = total.toFixed(2);
    return totalString; 
  }



  getCurrentCustomer(): string{
    return (this.props.currentCustomer)? ((this.props.currentCustomer.firstName)? this.props.currentCustomer.firstName : this.props.currentCustomer.email) : ''; 
  }


  render(){


    const searchIcon = <FontAwesomeIcon icon={faSearch}/>;
    const userIcon = <FontAwesomeIcon icon={faUser}/>;
    const arrowDown =<FontAwesomeIcon icon={faCaretDown}/>;
    const heart =<FontAwesomeIcon icon={faHeart}/>
    const shoppingCart =<FontAwesomeIcon icon={faShoppingCart}/>
    const fileInvoiceDollar =<FontAwesomeIcon icon={faFileInvoiceDollar}/>
    const envelope =<FontAwesomeIcon icon={faEnvelope}/>
    const phone =<FontAwesomeIcon icon={faPhoneAlt}/>
    const spinner =<FontAwesomeIcon icon={faSpinner} className="fa-spin"/>

    
    return(
      <div className='nav'>

        <div className='top-bar'>
          <div className='user-container'>
            <div className='dropdown'>
            <div className='user'><div>{userIcon}&nbsp;{(this.props.isLoadingCustomers)? spinner : ((this.props.hasErrorUsers)? 'ERROR' : this.getCurrentCustomer())}</div><span onClick={this.handleDisplayUsers}>{arrowDown}</span></div>
              <ul className={(this.state.areDisplayedUsers)? 'displayed' : 'hidden'}>
                {this.props.customers.map(item =>{
                  return <li onClick={()=>this.props.onChangeCurrentCustomer(item)} key={item.id}>{(item.firstName)? item.firstName : item.email}</li>      
                })}
              </ul>
            </div>
          </div>
          
          <h4 onClick={this.props.onGetProducts}>My Store</h4>
          <div className="top-bar-contact">
            <span>{phone} 11 22 334 55</span>
            <span>{envelope} info@myshop.com</span>
          </div>
        </div>

        <div className='nav-bar'>
          <h4 onClick={this.props.onGetProducts}>My Store</h4>
          <div className='search-field'>
            
            <Hamburger onToggleHamburger={this.handleToggleHamburger} isOpen={this.state.isOpen}/>
            <form onSubmit={(e)=>this.handleSearchSubmit(e)}>
              <button type='submit'>{searchIcon}</button>
              <input type='text' placeholder='Search products' name='search' value={this.state.search} onChange={(e)=>this.handleChangeSearch(e)} required></input>
            </form>
          </div>

          

          <div className='icon-field'>

            <div className="icon" onClick={this.props.onDisplayFavorites}>
              <div className="icon-display">
                <div>{heart}</div>
              <div className="badge-container"><span className="badge">{(this.props.isLoadingFavorites)? spinner : ((this.props.hasErrorFavorites)? '-' : this.props.favorites.length)}</span></div>
              </div>
              <div className="icon-info">FAVORITES</div>
              
            </div>

            <div className="icon" onClick={this.props.onGetCart}>
            <div className="icon-display">
                <div>{shoppingCart}</div>
              <div className="badge-container"><span className="badge">{(this.props.isLoadingBasicCart)? spinner : ((this.props.hasErrorBasicCart)? '-' : this.getCartCount())}</span></div>
            </div>
              <div className="icon-info">{(this.props.isLoadingBasicCart)? spinner : ((this.props.hasErrorBasicCart)? 'Error' : `$${this.calculateTotal()}`)}</div>
              
            </div>

            <div className="icon">
              <div className="icon-display">
                  <div>{fileInvoiceDollar}</div>
              <div className="badge-container"><span className="badge">{(this.props.isLoadingOrders)? spinner : ((this.props.hasErrorOrders)? '-' : this.getLengthOfNotDeliveredOrders())}</span></div>
              </div>
              <div className="icon-info">{(this.props.isLoadingOrders)? spinner : ((this.props.hasErrorOrders)? 'Error' : `$${this.getTotalOfNotDeliveredOrders()}`)}</div>
            </div>

          </div>
        </div>
        {(this.state.isOpen) ? <Menu onFetchByCategory={this.props.onFetchByCategory}/> : ''}
        
      </div>
    );
  }
}
export default Nav;