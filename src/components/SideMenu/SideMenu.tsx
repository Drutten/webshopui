import React from 'react';
import './SideMenu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop } from '@fortawesome/free-solid-svg-icons';
import { faHdd } from '@fortawesome/free-solid-svg-icons';
import { faTv } from '@fortawesome/free-solid-svg-icons';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faHeadphones } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { faVolumeDown } from '@fortawesome/free-solid-svg-icons';


interface ISideMenuProps {
  onFilterByCategory(categoryId: number): void;
}

class SideMenu extends React.Component<ISideMenuProps, {}> {



  render(){

    const laptop = <FontAwesomeIcon icon={faLaptop}/>;
    const hdd = <FontAwesomeIcon icon={faHdd}/>;
    const tv = <FontAwesomeIcon icon={faTv}/>;
    const mobile = <FontAwesomeIcon icon={faMobileAlt}/>;
    const camera = <FontAwesomeIcon icon={faCameraRetro}/>;
    const video = <FontAwesomeIcon icon={faVideo}/>;
    const headphones = <FontAwesomeIcon icon={faHeadphones}/>;
    const clock = <FontAwesomeIcon icon={faClock}/>;
    const images = <FontAwesomeIcon icon={faImages}/>;
    const gamepad = <FontAwesomeIcon icon={faGamepad}/>;
    const speaker = <FontAwesomeIcon icon={faVolumeDown}/>;


    return(
      <ul className='side-menu'>
        <li onClick={()=>this.props.onFilterByCategory(1)}><span>{laptop}</span>Computers & Accessories</li>
        <li onClick={()=>this.props.onFilterByCategory(2)}><span>{tv}</span>TV, Video & Audio</li>
        <li onClick={()=>this.props.onFilterByCategory(3)}><span>{mobile}</span> Smartphones & Tablets</li>
        <li onClick={()=>this.props.onFilterByCategory(4)}><span>{camera}</span>Photo Cameras</li>
        <li onClick={()=>this.props.onFilterByCategory(5)}><span>{video}</span>Video Cameras</li>
        <li onClick={()=>this.props.onFilterByCategory(6)}><span>{headphones}</span>Headphones</li>
        <li onClick={()=>this.props.onFilterByCategory(7)}><span>{clock}</span>Wearable Electronics</li>
        <li onClick={()=>this.props.onFilterByCategory(8)}><span>{images}</span>Printers & Ink</li>
        <li onClick={()=>this.props.onFilterByCategory(9)}><span>{gamepad}</span>Video Games</li>
        <li onClick={()=>this.props.onFilterByCategory(10)}><span>{speaker}</span>Speakers & Home Music</li>
        <li onClick={()=>this.props.onFilterByCategory(11)}><span>{hdd}</span>HDD/SSD Data Storage</li>
      </ul>
    );
  }
}
export default SideMenu;