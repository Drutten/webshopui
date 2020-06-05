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
import IFavorite from './interfaces/IFavorite';
import ICartProduct from './interfaces/ICartProduct';
import ICartUpdateProduct from './interfaces/ICartUpdateProduct';



interface IAppState{
  currentCustomer: ICustomer | null;
  customers: ICustomer[];
  favorites: IProduct[];
  //basicCart: IBasicCart | null;
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
      customers: [],
      favorites: [],
      //basicCart: null,
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
    this.handleFetchByCategory = this.handleFetchByCategory.bind(this);
    this.handleFetchAllProducts = this.handleFetchAllProducts.bind(this);
    this.handleFetchCartItems = this.handleFetchCartItems.bind(this);
    this.handleAddToFavorites = this.handleAddToFavorites.bind(this);
    this.handleDeleteFromFavorites = this.handleDeleteFromFavorites.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleDeleteFromCart = this.handleDeleteFromCart.bind(this);
    this.handleUpdateCart = this.handleUpdateCart.bind(this);
  }


  private service: IService = new Service();



  componentDidMount(){
    this.fetchCustomers('https://rdshop.azurewebsites.net/api/customers');
    this.fetchProducts('https://rdshop.azurewebsites.net/api/products');
  }


  componentDidUpdate(prevProps: any, prevState: IAppState) {
    //om currentCustomer har ändrats, hämtar alla produkter
    if(this.state.currentCustomer !== prevState.currentCustomer){  
      this.fetchProducts('https://rdshop.azurewebsites.net/api/products'); 
    } 
  }


  async fetchCustomers(url: string){
    this.setState({
      isLoadingCustomers: true,
      hasErrorUsers: false
    });
    const resultTuple = await this.service.getItems<ICustomer>(url);
    const fetchedCustomers = resultTuple[0];
    const message = resultTuple[1];
    let filteredCustomers: ICustomer[] = [];
    let customer: ICustomer | null = null;
    //console.log(fetchedCustomers);
    if(fetchedCustomers.length){
      customer = fetchedCustomers[0];
      filteredCustomers = fetchedCustomers.filter(item=>{
        return item.Id !== fetchedCustomers[0].Id;
      })
      this.fetchFavorites(`https://rdshop.azurewebsites.net/api/favorites?customerId=${fetchedCustomers[0].Id}`);
      this.fetchBasicCart(`https://rdshop.azurewebsites.net/api/cartproducts?customerId=${fetchedCustomers[0].Id}`);
      this.fetchOrders(`https://rdshop.azurewebsites.net/api/orders?customerId=${fetchedCustomers[0].Id}`);  
    }
    this.setState({
      customers : filteredCustomers,
      currentCustomer : customer,
      isLoadingCustomers: false,
      hasErrorUsers: message.length > 0
    });  
  }


  async fetchFavorites(url: string){
    this.setState({
      isLoadingFavorites: true,
      hasErrorFavorites: false
    });
    const resultTuple = await this.service.getItems<IProduct>(url);
    const fetchedFavorites = resultTuple[0];
    let message = resultTuple[1];
    let displayedProducts = [...this.state.products];
    if(this.state.areDisplayedFavorites){
      displayedProducts = fetchedFavorites;
    }
    //console.log(fetchedFavorites);
    this.setState({
      favorites: fetchedFavorites,
      products: displayedProducts,
      isLoadingFavorites: false,
      hasErrorFavorites: message.length > 0
    });
  }



  async fetchBasicCart(url: string){
    this.setState({
      isLoadingBasicCart: true,
      hasErrorBasicCart: false
    });
    const resultTuple = await this.service.getItems<ICartItem>(url);
    const fetchedBasicCart = resultTuple[0];
    let message = resultTuple[1];
    //console.log(fetchedBasicCart);
    this.setState({
      basicCart: fetchedBasicCart,
      isLoadingBasicCart: false,
      hasErrorBasicCart: message.length > 0
    });
  }



  async fetchOrders(url: string){
    this.setState({
      isLoadingOrders: true,
      hasErrorOrders: false
    });
    const resultTuple = await this.service.getItems<IOrder>(url);
    const fetchedOrders = resultTuple[0];
    let message = resultTuple[1];
    //console.log(fetchedOrders);
    this.setState({
      orders: fetchedOrders,
      isLoadingOrders: false,
      hasErrorOrders: message.length > 0
    });
  }


  async fetchProducts(url: string){
    //Loading products
    this.setState({
      isLoadingProducts: true,
      areCartItems: false,
      infoMessage: ''
    });
    const resultTuple = await this.service.getItems<IProduct>(url);
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



  async fetchCartItems(url: string){
    this.setState({
      isLoadingProducts: true,
      areCartItems: true,
      infoMessage: ''
    });
    const resultTuple = await this.service.getItems<ICartItem>(url);
    const fetchedCartItems = resultTuple[0];
    let message = resultTuple[1];
    let info = '';
    if(fetchedCartItems.length === 0 && message.length === 0){
      info = 'Cart is empty';
    }
    if(message.indexOf('404') !== -1){message = '404 Not Found';}
    this.setState({
      cartItems: fetchedCartItems,
      basicCart: fetchedCartItems,
      isLoadingProducts: false,
      areDisplayedFavorites: false,
      errorMessage: message,
      infoMessage: info  
    });
  }



  async addFavorite(url: string, data: IFavorite){
    
    await this.service.addItem<IFavorite>(url, data);
    if(this.state.currentCustomer){
      this.fetchFavorites(`https://rdshop.azurewebsites.net/api/favorites?customerId=${this.state.currentCustomer.Id}`);
    }
  }


  async deleteFavorite(url: string){
    await this.service.deleteItem(url);
    if(this.state.currentCustomer){
      this.fetchFavorites(`https://rdshop.azurewebsites.net/api/favorites?customerId=${this.state.currentCustomer.Id}`);
    }
  }



  async addCartProduct(url: string, data: ICartProduct){
    await this.service.addItem<ICartProduct>(url, data);
    if(this.state.currentCustomer){ 
      this.fetchBasicCart(`https://rdshop.azurewebsites.net/api/cartproducts?customerId=${this.state.currentCustomer.Id}`); 
    }   
  }


  async updateCartProduct(url: string, data: ICartUpdateProduct){
    await this.service.updateItem<ICartUpdateProduct>(url, data);
    //Anropas endast i cart
    this.handleFetchCartItems();
  }


  async deleteCartProduct(url: string){
    await this.service.deleteItem(url);
    
    if(this.state.areCartItems){
      this.handleFetchCartItems();
    }
    else if(this.state.currentCustomer){
      this.fetchBasicCart(`https://rdshop.azurewebsites.net/api/cartproducts?customerId=${this.state.currentCustomer.Id}`);
    }
  }




  handleChangeCurrentCustomer(customer: ICustomer){
    const allCustomers = (this.state.currentCustomer) ?
    [...this.state.customers, this.state.currentCustomer] : [...this.state.customers];
    
    const filteredCustomers = allCustomers.filter(item=>{
      return item.Id !== customer.Id;
    });
    this.fetchFavorites(`https://rdshop.azurewebsites.net/api/favorites?customerId=${customer.Id}`);
    this.fetchBasicCart(`https://rdshop.azurewebsites.net/api/cartproducts?customerId=${customer.Id}`);
    this.fetchOrders(`https://rdshop.azurewebsites.net/api/orders?customerId=${customer.Id}`);
  
    this.setState({
      customers: filteredCustomers,
      currentCustomer: customer
    });  
  }


  handleFetchByCategory(categoryId: number){
    this.fetchProducts(`https://rdshop.azurewebsites.net/api/products?categoryId=${categoryId}`);
  }


  handleFetchCartItems(){
    if(this.state.currentCustomer && !this.state.hasErrorBasicCart){
      this.fetchCartItems(`https://rdshop.azurewebsites.net/api/cartproducts?customerId=${this.state.currentCustomer.Id}`);
    }
    else{
      this.setState({errorMessage: 'Cart can not be displayed'});
    }    
  }


  handleFetchAllProducts(){
    this.fetchProducts(`https://rdshop.azurewebsites.net/api/products`);
  }



  handleSearch(searchText: string) {
    this.fetchProducts(`https://rdshop.azurewebsites.net/api/search?s=${searchText}`);    
  }



  handleAddToFavorites(product: number){
    if(this.state.currentCustomer){
      const data = {
        customerId: this.state.currentCustomer.Id,
        productId: product
      }
      this.addFavorite('https://rdshop.azurewebsites.net/api/favorites', data);
    }
  }


  handleDeleteFromFavorites(product: number){
    if(this.state.currentCustomer){
      this.deleteFavorite(`https://rdshop.azurewebsites.net/api/favorites?customerId=${this.state.currentCustomer.Id}&productId=${product}`);
    }  
  }


  handleAddToCart(product: number){
    if(this.state.currentCustomer){
      const data = {
        customerId: this.state.currentCustomer.Id,
        productId: product,
        count: 1
      }
      this.addCartProduct('https://rdshop.azurewebsites.net/api/cartproducts', data);
    } 
  }



  handleUpdateCart(product: number, quantity: number){
    if(this.state.currentCustomer){
      const data = {
        count: quantity
      }
      this.updateCartProduct(`https://rdshop.azurewebsites.net/api/cartproducts?customerId=${this.state.currentCustomer.Id}&productId=${product}`, data);
    }
  }


  
  handleDeleteFromCart(product: number){
    if(this.state.currentCustomer){
      this.deleteCartProduct(`https://rdshop.azurewebsites.net/api/cartproducts?customerId=${this.state.currentCustomer.Id}&productId=${product}`);
    }
  }


  



  displayFavorites(){
    if(!this.state.hasErrorFavorites){
      let displayedProducts: IProduct[] = [];
      let info = '';
      if(this.state.favorites.length){
        displayedProducts = [...this.state.favorites];
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
    else{
      this.setState({errorMessage: 'Favorites can not be displayed'})
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
          favorites={this.state.favorites}
          basicCart={this.state.basicCart}
          orders={this.state.orders}
          isLoadingCustomers={this.state.isLoadingCustomers}
          isLoadingFavorites={this.state.isLoadingFavorites}
          isLoadingBasicCart={this.state.isLoadingBasicCart}
          isLoadingOrders={this.state.isLoadingOrders}
          hasErrorFavorites={this.state.hasErrorFavorites}
          hasErrorBasicCart={this.state.hasErrorBasicCart}
          hasErrorOrders={this.state.hasErrorOrders}
          hasErrorUsers={this.state.hasErrorUsers}
          onFetchByCategory={this.handleFetchByCategory}
          onChangeCurrentCustomer={this.handleChangeCurrentCustomer}
          onSearch={this.handleSearch}
          onDisplayFavorites={this.displayFavorites}
          onGetCart={this.handleFetchCartItems}
          onGetProducts={this.handleFetchAllProducts}
        />

        <div className="app-container">
          <div className="app-row">


            <div className="side-bar-col">
              <SideMenu onFetchByCategory={this.handleFetchByCategory}/>
            </div>

            <div className="main-col">
              {this.state.errorMessage && <h3 className="error">{this.state.errorMessage}</h3>}
              {this.state.infoMessage && <h3 className="info">{this.state.infoMessage}</h3>}

              
              {(this.state.isLoadingProducts)
              ? <div className="wait">{spinner}</div>
              :  ((this.state.areCartItems)
                  ? (<div className="product-container">
                    {this.state.cartItems.map(item =>{
                      return(<CartItemCard 
                        key={item.Id} 
                        cartItem={item}
                        onUpdateCart={this.handleUpdateCart}
                        onDeleteCartItem={this.handleDeleteFromCart}
                        />)
                    })}
                  </div>) 
                  : (<div className="product-container">
                    {this.state.products.map(item =>{
                      return(<ProductCard 
                        key={item.Id} 
                        product={item}
                        favorites={this.state.favorites}
                        basicCart={this.state.basicCart} 
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
