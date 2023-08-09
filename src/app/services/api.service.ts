import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  /******************************** crud Group **********************************/
  url="http://ims.aswan.gov.eg/api"

  getSubGrads(selectedOption: any) {
    throw new Error('Method not implemented.');
  }
  get(arg0: string) {
    throw new Error('Method not implemented.');
  }


   /********************************  unit crud  **********************************/


   postunit(data : any){
    return this.http.post<any>("https://ims.aswan.gov.eg/api/STR_Unit/Add-Unit",data);
  }
  getunit(){
    return this.http.get<any>("https://ims.aswan.gov.eg/api/STR_Unit/get-all-Unit");
  }
  putunit(data:any ){
    
    return this.http.put<any>("https://ims.aswan.gov.eg/api/STR_Unit/update-Unit/",data);
  }
  deleteunit(id:number){
    return this.http.delete<any>(`http://ims.aswan.gov.eg/api/STR_Unit/delete-Unit-by-id/${id}`);
  }


  //Grades

  postGrade(data : any){
    return this.http.post<any>("http://ims.aswan.gov.eg/api/STR_Grade/Add-grade",data);
  }
  getGrade(){
    return this.http.get<any>("http://ims.aswan.gov.eg/api/STR_Grade/get-all-grades");
  }
  putGrade(data:any){
    console.log("edit: ", data)
    return this.http.put<any>("http://ims.aswan.gov.eg/api/STR_Grade/update-grade-by-id/", data);
  }
  deleteGrade(id:number){
    return this.http.delete<any>(`https://ims.aswan.gov.eg/api/STR_Grade/delete-grade/${id}`);
  }
  getAllCommodity():Observable<any> {
    return this.http.get<any>("https://ims.aswan.gov.eg/api/STR_Commodity/get-all-commodity");
  }




  postGroup(data: any) {
    return this.http.post<any>("http://localhost:3000/StrOpen/", data);
  }
  getGroup() {
    return this.http.get<any>("http://localhost:3000/GroupList/");
  }
  putGroup(data: any, id: number) {
    return this.http.put<any>("http://localhost:3000/GroupList/" + id, data);
  }
  deleteGroup(id: number) {
    return this.http.delete<any>("http://localhost:3000/GroupList/" + id);
  }

  postStrOpen(data: any) {
    return this.http.post<any>("http://localhost:3000/StrOpen/", data);
  }
  getStrOpen() {
    return this.http.get<any>("http://localhost:3000/StrOpen/");
  }
  putStrOpen(data: any, id: number) {
    return this.http.put<any>("http://localhost:3000/StrOpen/" + id, data);
  }
  deleteStrOpen(id: number) {
    return this.http.delete<any>("http://localhost:3000/StrOpen/" + id);
  }

  postStrOpenDetails(data: any) {
    return this.http.post<any>("http://localhost:3000/StrOpenDetails/", data);
  }
  getStrOpenDetails() {
    return this.http.get<any>("http://localhost:3000/StrOpenDetails/");
  }
  putStrOpenDetails(data: any, id: number) {
    // console.log("strOpenDetails id: ", id, "stropenedDetails data: ", data);
    return this.http.put<any>("http://localhost:3000/StrOpenDetails/" + id, data);
  }
  deleteStrOpenDetails(HeaderId: number) {
    // console.log("deleted row id: ", HeaderId)
    return this.http.delete<any>("http://localhost:3000/StrOpenDetails/" + HeaderId);
  }

  getStoreList() {
    return this.http.get<any>("http://localhost:3000/StoreList/");
  }
  getStoreByID(id: number) {
    return this.http.get<any>("http://localhost:3000/StoreList/" + id);
  }







 //Grades

 



    //Platoon

    postPlatoon(data : any){
      return this.http.post<any>("https://ims.aswan.gov.eg/api/STR_Platoon/Add-platoon",data);
    }
    getPlatoon(){
      return this.http.get<any>("https://ims.aswan.gov.eg/api/STR_Platoon/get-all-Platoons");
    }
    putPlatoon(data:any){
      return this.http.put<any>("https://ims.aswan.gov.eg/api/STR_Platoon/update-Platoon",data);
    }
    deletePlatoon(id:number){
      return this.http.delete<any>(`https://ims.aswan.gov.eg/api/STR_Platoon/delete-Platoon/${id}`);
    }
    getAllCommodities():Observable<any> {
      return this.http.get<any>("https://ims.aswan.gov.eg/api/STR_Commodity/get-all-commodity");
    }
    getAllGrades():Observable<any> {
      return this.http.get<any>("https://ims.aswan.gov.eg/api/STR_Grade/get-all-grades");
    }
/**crud group */

  postStores(data: any,id:number){
    return this.http.post<any>("http://localhost:3000/storeList/"+id,data);
  }

  
  
  getstores(){
    return this.http.get<any>("http://localhost:3000/storeList/");
  }
 
 
  putstores(data:any,id:number){
    return this.http.put<any>("http://localhost:3000/storeList/"+id,data);
  }
 

  

  deletestores(id:number){
    return this.http.delete<any>("http://localhost:3000/storeList/"+id);
  }
  getAllTodos() :Observable<any>{
    return this.http.get<any>("http://localhost:3000/commidity/");
  }
  

  getAllstores() :Observable<any>{
    return this.http.get<any>("http://localhost:3000/store/");
  }


  


  // crud role

  postRole(data : any){
    return this.http.post<any>(`${this.url}/PR_Role/add-Role`,data);
  }
  getAllRole(){
    return this.http.get<any>(`${this.url}/PR_Role/get-all-roles`);
  }
  putRole(data : any,id :number){
    return this.http.put<any>("http://localhost:3000/rolelist/"+id,data);
  }
  deleteRole(id:number){
    return this.http.delete<any>("http://localhost:3000/rolelist/"+id);
  }


  // salvana
  postProduct(data: any){
    return this.http.post<any>("http://localhost:3000/productList/",data);
  }
  putProduct(data:any,id:number){
    return this.http.put<any>("http://localhost:3000/productList/"+id,data);
  }
 
  getProduct(){
    return this.http.get<any>("http://localhost:3000/productList/");
  }
 

  deleteProduct(id:number){
    return this.http.delete<any>("http://localhost:3000/productList/"+id);
  }

  
  // Crud CostCenter

  
  postCostCenter(data: any){
    return this.http.post<any>(`${this.url}/FI_CostCenter/Add-CostCenter`,data);
  }

  getCostCenter(){
    return this.http.get<any>(`${this.url}/FI_CostCenter/get-all-CostCenter`);
  }


  putCostCenter(data:any){
    return this.http.put<any>(`${this.url}/FI_CostCenter/update-CostCenter`,data);
  }

  deleteCostCenter(id:number){
    return this.http.delete<any>(`${this.url}/FI_CostCenter/delete-CostCenter-by-id/`+id);
  }

// crud items
  
postItem(data: any){
  console.log('post data:',data)
  return this.http.post<any>("http://ims.aswan.gov.eg/api/STR_Item/Add-item",data);
}

getItems(){
  return this.http.get<any>("http://ims.aswan.gov.eg/api/STR_Item/get-all-Items");
}
getcommodity(){
  return this.http.get<any>("http://ims.aswan.gov.eg/api/STR_Commodity/get-all-commodity");
}
postStrOpenItems(data: any) {
  return this.http.post<any>("http://ims.aswan.gov.eg/api/STR_Item/Add-item", data);
}

putItems(data:any){
  console.log('put data:',data)
  return this.http.put<any>("http://ims.aswan.gov.eg/api/STR_Item/update-Item",data);
}

deleteItem(id:number){
  return this.http.delete<any>("http://ims.aswan.gov.eg/api/STR_Item/delete-Item-by-id/"+id);
}

getAllcommodity():any{
  return this.http.get<any>("http://ims.aswan.gov.eg/api/STR_Commodity/get-all-commodity")
} 
getAllplatoon(): any{
  return this.http.get<any>("http://ims.aswan.gov.eg/api/STR_Platoon/get-all-Platoons")
}
getAllgroup(): any{
  return this.http.get<any>("http://ims.aswan.gov.eg/api/STR_Group/get-all-Groups")
}

getAllgrade(): any{
return this.http.get<any>("http://ims.aswan.gov.eg/api/STR_Grade/get-all-grades")
}
getAllunit(): Observable<any>{
return this.http.get<any>("http://ims.aswan.gov.eg/api/STR_Unit/get-all-Unit")
}

// CRUD STORE

postStore(data: any){
  return this.http.post<any>(`${this.url}/STR_Store/Add-Store`,data);
}

getStore(){
  return this.http.get<any>(`${this.url}/STR_Store/get-all-Store`);
}


putStore(data:any){
  return this.http.put<any>(`${this.url}/STR_Store/update-Store`,data);
}

deleteStore(id:number){
  return this.http.delete<any>(`${this.url}/STR_Store/delete-Store-by-id/`+id);
}
//  commodity
postCommodity(data: any){
  console.log("add product data: ", data)

  return this.http.post<any>("http://ims.aswan.gov.eg/api/STR_Commodity/Add-Commodity",data);
}

getCommodity(){
  return this.http.get<any>("http://ims.aswan.gov.eg/api/STR_Commodity/get-all-commodity");
}


putCommodity(data:any){
  console.log("edit data by id: ", data)

  return this.http.put<any>("http://ims.aswan.gov.eg/api/STR_Commodity/update-commodity",data);
}

deleteCommodity(id:number){
  console.log("delete by id: ", id)
  return this.http.delete<any>("http://ims.aswan.gov.eg/api/STR_Commodity/delete-commodity-by-id/"+id);
}

}
