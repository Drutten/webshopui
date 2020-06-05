import axios, { AxiosResponse } from 'axios';



export interface IService {
    getItems<T>(url: string): Promise<[T[], string]>;
    getItem<T>(url: string): Promise<[T | null, string]>;
    addItem<T>(url: string, data: T): Promise<string>;
    updateItem<T>(url: string, data: T): Promise<string>;
    deleteItem(url: string): Promise<string>;
}



export class Service implements IService {
    
    

  async getItems<T>(url: string): Promise<[T[], string]> {
    let items: T[] = [];
    let errorText: string = '';
    
    try{
      let data: AxiosResponse<any> = await axios.get(url);
      if(data.data){
        items = data.data;
      }      
    }catch(e){
      console.log("message: "+e.message);
      errorText = e.message;
      if(e.response){
        console.log("status: "+e.response.status);
      }        
    }
    let resultTuple: [T[], string] = [items, errorText];    
    return resultTuple;
  }



    



    async getItem<T>(url: string): Promise<[T | null, string]> {

        let item: T | null = null;
        let errorText: string = '';
        try{
            let response: AxiosResponse<any> = await axios.get(url);
            if(response.data){
                item = response.data;
            }
        }catch(e){
            console.log("message: "+e.message);
            errorText = e.message;
            if(e.response){
                console.log("status: "+e.response.status);
            } 
        }
        let resultTuple: [T | null, string] = [item, errorText];   
        return resultTuple;

    }



    
    async addItem<T>(url: string, data: T): Promise<string> {
      let errorText = '';
      try{
        let response: AxiosResponse<any> = await axios.post(url, JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'   
            }
        });
        //console.log(response.data);
      }catch(e){
        console.log("message: "+e.message);
        errorText = e.message;
        if(e.response){
            console.log("status: "+e.response.status);
        }      
      }
      return errorText;
    }



    
    async updateItem<T>(url: string, data: T): Promise<string> {
      let errorText = '';
      try{
        let response: AxiosResponse<any> = await axios.put(url, JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'   
            }
        });
        console.log(response.data);
      }catch(e){
        console.log("message: "+e.message);
        errorText = e.message;
        if(e.response){
            console.log("status: "+e.response.status);
        }      
      }
      return errorText;
    }





    async deleteItem(url: string): Promise<string>{
      let errorText = '';
      try{
        let response: AxiosResponse<any> = await axios.delete(url);
        console.log(response.data);     
      }catch(e){
        console.log("message: "+e.message);
        errorText = e.message;
        if(e.response){
            console.log("status: "+e.response.status);
        }     
      }
      return errorText;
  }
}


