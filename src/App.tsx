import React from 'react';

import './App.scss';
import Nav from './components/Nav/Nav';
import SideMenu from './components/SideMenu/SideMenu';
import { IService, Service } from './services/Service';
import ICustomer from './interfaces/ICustomer';
import IProduct from './interfaces/IProduct';
import IOrder from './interfaces/IOrder';
import ICartItem from './interfaces/ICartItem';
import ProductCard from './components/ProductCard/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import CartItemCard from './components/CartItemCard/CartItemCard';


interface IAppState{
  currentCustomer: ICustomer | null;
  switchCustomerToggler: boolean;
  customers: ICustomer[];
  favorites: IProduct[];
  basicCart: ICartItem[];
  orders: IOrder[];
  cartItems: ICartItem[];
  products: IProduct[];
  isLoadingCustomers: boolean;
  isLoadingFavorites: boolean;
  isLoadingBasicCart: boolean;
  isLoadingOrders: boolean;
  isLoadingProducts: boolean;
  hasErrorUsers: boolean;
  hasErrorFavorites: boolean;
  hasErrorBasicCart: boolean;
  hasErrorOrders: boolean;
  areCartItems: boolean;
  areDisplayedFavorites: boolean;
  errorMessage: string;
  infoMessage: string; 
}


class App extends React.Component<{}, IAppState> {
  constructor(props:any){
    super(props);

    this.state = {
      currentCustomer: null,
      switchCustomerToggler: false,
      customers: [],
      favorites: [],
      basicCart: [],
      orders: [],
      cartItems: [],
      products: [],
      isLoadingCustomers: false,
      isLoadingFavorites: false,
      isLoadingBasicCart: false,
      isLoadingOrders: false,
      isLoadingProducts: false,
      hasErrorUsers: false,
      hasErrorFavorites: false,
      hasErrorBasicCart: false,
      hasErrorOrders: false,
      areCartItems: false,
      areDisplayedFavorites: false,
      errorMessage: '',
      infoMessage: ''
    }

    this.handleChangeCurrentCustomer = this.handleChangeCurrentCustomer.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.displayFavorites = this.displayFavorites.bind(this);
    this.handleFilterByCategory = this.handleFilterByCategory.bind(this);
    this.handleFetchAllProducts = this.handleFetchAllProducts.bind(this);
    this.displayCartItems = this.displayCartItems.bind(this);
    this.handleAddToFavorites = this.handleAddToFavorites.bind(this);
    this.handleDeleteFromFavorites = this.handleDeleteFromFavorites.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleDeleteFromCart = this.handleDeleteFromCart.bind(this);
    this.handleUpdateCart = this.handleUpdateCart.bind(this);
  }


  private service: IService = new Service();



  componentDidMount(){
    this.mockCustomers();
    this.fetchProducts();
  }


  componentDidUpdate(prevProps: any, prevState: IAppState) {
    //om currentCustomer har ändrats till annan customer, hämtar alla produkter
    if (this.state.switchCustomerToggler !== prevState.switchCustomerToggler) {
      this.fetchProducts(); 
    } 
  }

  mockCustomers() {
    const mockedCustomers: ICustomer[] = [
      {
        id: 1,
        email: 'anna@netmail.se',
        firstName: 'Anna',
        lastName: 'Hansson',
        favorites: [],
        cartItems: [],
        orders: []
      },
      {
        id: 2,
        email: 'kalle@bmail.se',
        firstName: 'Kalle',
        lastName: 'Svan',
        favorites: [],
        cartItems: [],
        orders: []
      },
      { 
        id: 3,
        email: 'pia@bmail.se',
        firstName: 'Pia',
        lastName: 'Larsson',
        favorites: [],
        cartItems: [],
        orders: []
      }
    ];
    let filteredCustomers: ICustomer[] = [];
    let customer: ICustomer | null = null;
    if(mockedCustomers.length){
      customer = mockedCustomers[0];
      filteredCustomers = mockedCustomers.filter(item=>{
        return item.id !== mockedCustomers[0].id;
      })
    }
    this.setState({
      customers: filteredCustomers,
      currentCustomer: customer
    });
  }



  
  async fetchProducts(){
    this.setState({
      isLoadingProducts: true,
      areCartItems: false,
      infoMessage: ''
    });
    const resultTuple = await this.service.getItems();
    const fetchedProducts = resultTuple[0];
    let message = resultTuple[1];
    let info = '';
    if(fetchedProducts.length === 0 && message.length === 0){
      info = 'Not found';
    }
    if(message.indexOf('404') !== -1){message = '404 Not Found';}
    this.setState({
      products: fetchedProducts,
      isLoadingProducts: false,
      areDisplayedFavorites: false,
      errorMessage: message,
      infoMessage: info  
    });
  }




  handleChangeCurrentCustomer(customer: ICustomer){
    const allCustomers = (this.state.currentCustomer) ?
    [...this.state.customers, this.state.currentCustomer] : [...this.state.customers];
    
    const filteredCustomers = allCustomers.filter(item=>{
      return item.id !== customer.id;
    });
    this.setState({
      customers: filteredCustomers,
      currentCustomer: customer,
      switchCustomerToggler: !this.state.switchCustomerToggler
    });  
  }


  async handleFilterByCategory(categoryId: number){
    this.setState({
      isLoadingProducts: true,
      areCartItems: false,
      infoMessage: ''
    });
    const resultTuple = await this.service.getItems();
    const fetchedProducts = resultTuple[0];
    let message = resultTuple[1];
    let info = '';
    let filteredProducts: IProduct[] = [];
    if (fetchedProducts.length > 0) {
      filteredProducts = fetchedProducts.filter(item => item.category === categoryId);
    }
    if(fetchedProducts.length === 0 || filteredProducts.length === 0 && message.length === 0){
      info = 'Not found';
    }
    if(message.indexOf('404') !== -1){message = '404 Not Found';}
    this.setState({
      products: filteredProducts,
      isLoadingProducts: false,
      areDisplayedFavorites: false,
      errorMessage: message,
      infoMessage: info  
    });
  }


  

  handleFetchAllProducts(){
    this.fetchProducts();
  }



  async handleSearch(searchText: string) {
    this.setState({
      isLoadingProducts: true,
      areCartItems: false,
      infoMessage: ''
    });
    const resultTuple = await this.service.getItems();
    const fetchedProducts = resultTuple[0];
    let message = resultTuple[1];
    let info = '';
    let filteredProducts: IProduct[] = [];
    if (fetchedProducts.length > 0) {
      filteredProducts = fetchedProducts.filter(item => item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    if(fetchedProducts.length === 0 || filteredProducts.length === 0 && message.length === 0){
      info = 'Not found';
    }
    if(message.indexOf('404') !== -1){message = '404 Not Found';}
    this.setState({
      products: filteredProducts,
      isLoadingProducts: false,
      areDisplayedFavorites: false,
      errorMessage: message,
      infoMessage: info  
    });    
  }



  handleAddToFavorites(product: number){
    if(this.state.currentCustomer){
      let addedProduct = this.state.products.find(item => item.id === product);
      let updatedCustomer = {...this.state.currentCustomer};
      if (addedProduct) {
        updatedCustomer.favorites.push(addedProduct);
        this.setState({
          currentCustomer: updatedCustomer
        });
      }
    }
  }


  handleDeleteFromFavorites(product: number){
    if(this.state.currentCustomer){
      let updatedCustomer = {...this.state.currentCustomer};
      updatedCustomer.favorites.forEach((item, idx) => {
        if (item.id === product) {
          updatedCustomer.favorites.splice(idx, 1);
        }
      });
      this.setState({
        currentCustomer: updatedCustomer
      });
      if (this.state.areDisplayedFavorites) {
        this.displayFavorites();
      } 
    }
  }


  handleAddToCart(product: number){
    if(this.state.currentCustomer && !this.isInCart(product)){
      let addedProduct = this.state.products.find(item => item.id === product);
      let cartItem = ({...addedProduct, count: 1} as ICartItem);
      let updatedCustomer = {...this.state.currentCustomer};
      if (cartItem) {
        updatedCustomer.cartItems.push(cartItem);
        this.setState({
          currentCustomer: updatedCustomer
        });
      }
    }
  }



  handleUpdateCart(product: number, quantity: number){
    if(this.state.currentCustomer && this.isInCart(product)){
      let updatedCartItem = this.state.currentCustomer.cartItems.find(item => item.id === product);
      let cartItem = ({...updatedCartItem} as ICartItem);
      let updatedCustomer = {...this.state.currentCustomer};
      if (cartItem) {
        cartItem.count = quantity;
        updatedCustomer.cartItems.forEach((item, idx) => {
          if (item.id === product) {
            updatedCustomer.cartItems.splice(idx, 1, cartItem);
          }
        });
        this.setState({
          currentCustomer: updatedCustomer
        });
      }
    }
  }


  
  handleDeleteFromCart(product: number){
    if(this.state.currentCustomer && this.isInCart(product)){
      let updatedCustomer = {...this.state.currentCustomer};
      updatedCustomer.cartItems.forEach((item, idx) => {
        if (item.id === product) {
          updatedCustomer.cartItems.splice(idx, 1);
        }
      });
      this.setState({
        currentCustomer: updatedCustomer
      });
      if (this.state.areCartItems) {
        this.displayCartItems();
      }
    }
  }


  private isInCart(id: number): boolean {
    let inCart = false;
    this.state.currentCustomer?.cartItems.forEach(item => {
      if (item.id === id) {
        inCart = true;
      }
    });
    return inCart;
  }


  

  displayFavorites(){
    if (this.state.currentCustomer) {
      let displayedProducts: IProduct[] = [];
      let info = '';
      if (this.state.currentCustomer.favorites.length) {
        displayedProducts = [...this.state.currentCustomer.favorites];
      }
      else{
        info = 'No favorites yet';
      }
      this.setState({
        products: displayedProducts,
        infoMessage: info,
        errorMessage: '',
        areCartItems: false,
        areDisplayedFavorites: true
      });
    }
  }


  displayCartItems(){
    if (this.state.currentCustomer) {
      let displayedProducts: IProduct[] = [];
      let info = '';
      if (this.state.currentCustomer.cartItems.length) {
        displayedProducts = [...this.state.currentCustomer.cartItems];
      }
      else{
        info = 'Cart is empty';
      }
      this.setState({
        products: displayedProducts,
        infoMessage: info,
        errorMessage: '',
        areCartItems: true,
        areDisplayedFavorites: false
      });
    }   
  }




  render(){

    const spinner =<FontAwesomeIcon icon={faSpinner} className="fa-spin"/>
    const envelope =<FontAwesomeIcon icon={faEnvelope}/>
    const phone =<FontAwesomeIcon icon={faPhoneAlt}/>

  return (
    <div className="App">
      <div>

        <Nav 
          customers={this.state.customers} 
          currentCustomer={this.state.currentCustomer}
          favorites={(this.state.currentCustomer)? this.state.currentCustomer.favorites: []}
          cart={(this.state.currentCustomer)? this.state.currentCustomer.cartItems: []}
          orders={(this.state.currentCustomer)? this.state.currentCustomer.orders: []}
          isLoadingCustomers={this.state.isLoadingCustomers}
          isLoadingFavorites={this.state.isLoadingFavorites}
          isLoadingBasicCart={this.state.isLoadingBasicCart}
          isLoadingOrders={this.state.isLoadingOrders}
          hasErrorFavorites={this.state.hasErrorFavorites}
          hasErrorBasicCart={this.state.hasErrorBasicCart}
          hasErrorOrders={this.state.hasErrorOrders}
          hasErrorUsers={this.state.hasErrorUsers}
          onFetchByCategory={this.handleFilterByCategory}
          onChangeCurrentCustomer={this.handleChangeCurrentCustomer}
          onSearch={this.handleSearch}
          onDisplayFavorites={this.displayFavorites}
          onGetCart={this.displayCartItems}
          onGetProducts={this.handleFetchAllProducts}
        />

        <div className="app-container">
          <div className="app-row">


            <div className="side-bar-col">
              <SideMenu onFilterByCategory={this.handleFilterByCategory}/>
            </div>

            <div className="main-col">
              {this.state.errorMessage && <div><h3 className="error">{this.state.errorMessage}</h3><button onClick={this.handleFetchAllProducts} className="back-btn">Products</button></div>}
              {this.state.infoMessage && <div><h3 className="info">{this.state.infoMessage}</h3><button onClick={this.handleFetchAllProducts} className="back-btn">Products</button></div>}

              
              {(this.state.isLoadingProducts)
              ? <div className="wait">{spinner}</div>
              :  ((this.state.areCartItems)
                  ? (<div className="product-container">
                    {this.state.currentCustomer?.cartItems.map(item =>{
                      return(<CartItemCard 
                        key={item.id} 
                        cartItem={item}
                        onUpdateCart={this.handleUpdateCart}
                        onDeleteCartItem={this.handleDeleteFromCart}
                        />)
                    })}
                  </div>) 
                  : (<div className="product-container">
                    {this.state.products.map(item =>{
                      return(<ProductCard 
                        key={item.id} 
                        product={item}
                        favorites={(this.state.currentCustomer)? this.state.currentCustomer.favorites: []}
                        cart={(this.state.currentCustomer)? this.state.currentCustomer.cartItems: []}
                        onAddFavorite={this.handleAddToFavorites}
                        onDeleteFavorite={this.handleDeleteFromFavorites}
                        onAddCartItem={this.handleAddToCart}
                        onDeleteCartItem={this.handleDeleteFromCart}
                        />)
                    })}
                    </div>)
                  )
              }
            </div>


          </div>

          <footer>
            <div>
              <span>{phone} 11 22 334 55</span>
              <span>{envelope} info@myshop.com</span>
            </div>
            <span>&copy; 2020 Rosi Drott Kohmareh</span>  
          </footer>
        </div>

        

        

      </div>
    </div>
  );
  }
}

export default App;
