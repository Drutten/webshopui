import axios, { AxiosResponse } from 'axios';
import IProduct from '../interfaces/IProduct';

const baseUrl = 'https://students-7363.restdb.io/rest/';
const key = '5e15b638b68f0802dd3e6117';

export interface IService {
  getItems(): Promise<[IProduct[], string]>;
}



export class Service implements IService {
    
    
  async getItems(): Promise<[IProduct[], string]> {
    let items: IProduct[] = [];
    let errorText: string = '';
    
    try{
      let data: AxiosResponse<any> = await axios.get(`${baseUrl}items?apikey=${key}`);
      if(data.data){
        console.log(data.data);
        items = data.data;
      }      
    }catch(e){
      console.log("message: "+e.message);
      errorText = e.message;
      if(e.response){
        console.log("status: "+e.response.status);
      }        
    }
    let resultTuple: [IProduct[], string] = [items, errorText];    
    return resultTuple;
  }

}


