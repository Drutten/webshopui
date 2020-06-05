import React from 'react';
import './Menu.scss';

interface IMenuProps {
  onFetchByCategory(categoryId: number): void;
}

class Menu extends React.Component<IMenuProps, {}> {
  render(){
    return(
      <ul className='menu'>
        <li onClick={()=>this.props.onFetchByCategory(1)}>Computers & Accessories</li>
        <li onClick={()=>this.props.onFetchByCategory(2)}>TV, Video & Audio</li>
        <li onClick={()=>this.props.onFetchByCategory(3)}>Smartphones & Tablets</li>
        <li onClick={()=>this.props.onFetchByCategory(4)}>Photo Cameras</li>
        <li onClick={()=>this.props.onFetchByCategory(5)}>Video Cameras</li>
        <li onClick={()=>this.props.onFetchByCategory(6)}>Headphones</li>
        <li onClick={()=>this.props.onFetchByCategory(7)}>Wearable Electronics</li>
        <li onClick={()=>this.props.onFetchByCategory(8)}>Printers & Ink</li>
        <li onClick={()=>this.props.onFetchByCategory(9)}>Video Games</li>
        <li onClick={()=>this.props.onFetchByCategory(10)}>Speakers & Home Music</li>
        <li onClick={()=>this.props.onFetchByCategory(11)}>HDD/SSD Data Storage</li>
      </ul>
    );
  }
}
export default Menu;