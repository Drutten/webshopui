import React from 'react';
import './Hamburger.scss';

interface IHamburgerProps{
  onToggleHamburger(): void;
  isOpen: boolean;
}


class Hamburger extends React.Component <IHamburgerProps, {}>{
  

  setClassName():string{
    const isOpenClass = this.props.isOpen ? 'open' : 'notOpen';
    return isOpenClass;
  }

  render(){
    return(
      <React.Fragment>
        <div className={`hamburger ${this.setClassName()}`} onClick={this.props.onToggleHamburger}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      
      </React.Fragment>
      
    );
  }
}
export default Hamburger;