import { Component, OnInit, LOCALE_ID, ViewChild, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { FIAccountHierarchyDialogComponent } from '../fi-account-hierarchy-dialog/fi-account-hierarchy-dialog.component';
import { FIJournalDialogComponent } from '../fi-journal-dialog/fi-journal-dialog.component';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-fi-journal',
  templateUrl: './fi-journal.component.html',
  styleUrls: ['./fi-journal.component.css']
})
export class FIJournalComponent {
  title = 'angular13crud';
  displayedColumns: string[] = [ 'no','description','startDate','endDate', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog,
     private api : ApiService,private toastr: ToastrService,
     @Inject(LOCALE_ID) private locale: string){}
  ngOnInit(): void {
    this.getFIJournals();
  }
  openDialog() {
    this.dialog.open(FIJournalDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'حفظ'){
        this.getFIJournals();
      }
    })
  }
  getFIJournals(){
    this.api.getFIJournal()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        // alert("خطأ عند استدعاء البيانات");
      }
      
    })
  }
  editFIJournals(row : any){
    this.dialog.open(FIJournalDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'تحديث'){
        this.getFIJournals();
      }
    })
  }
  daleteFIJournals(id:number){
    if(confirm("هل انت متأكد من الحذف؟ ")) {
      console.log("Implement delete functionality here");
    }
    
    this.api.deleteFIJournal(id)
    .subscribe({
     
      next:(res)=>{
      this.toastrDeleteSuccess();
        this.getFIJournals();
      },
      error:()=>{
        alert("خطأ عند الحذف")
      }
    })
  }

  async getSearchFIJournal(no :any,description:any,startDate:any,endDate:any) {
    
  console.log("description: "+description,"no: "+no);
  
        this.api.getFIJournal()
          .subscribe({
            next: (res) => {
              // 1-
              if (no != '' && description == '' && startDate == ''  ){
            console.log("enter id only: ", "res : ", res, "input id: ", no)
  
                this.dataSource = res.filter((res: any)=> res.no==no!) 
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              else if (no != '' && description != ''&& startDate != ''){
            console.log("enter name & id: ", "res : ", res, "input name: ", description, "id: ", no)
  
                // this.dataSource = res.filter((res: any)=> res.name==name!)
                this.dataSource = res.filter((res: any)=> res.no==no! && res.description.toLowerCase().includes(description.toLowerCase()) && formatDate(res.startDate, 'M/d/yyyy', this.locale) == startDate)
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            
              else if (no == '' && description == ''&& startDate != ''){
                    console.log("enter name & id: ", "res : ", res, "input name: ", description, "id: ", no)
          
                        // this.dataSource = res.filter((res: any)=> res.name==name!)
                        this.dataSource = res.filter((res: any)=>  formatDate(res.date, 'M/d/yyyy', this.locale) == startDate)
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
              }
              else if (no == '' && description != ''&& startDate != ''){
                        console.log("enter name & id: ", "res : ", res, "input name: ", description, "id: ", no)
              
                            // this.dataSource = res.filter((res: any)=> res.name==name!)
                            this.dataSource = res.filter((res: any)=>  res.description.toLowerCase().includes(description.toLowerCase()) && formatDate(res.date, 'M/d/yyyy', this.locale) == startDate)
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
              }
              else if (no != '' && description == ''&& startDate != ''){
                console.log("enter name & id: ", "res : ", res, "input name: ", description, "id: ", no)
      
                    // this.dataSource = res.filter((res: any)=> res.name==name!)
                    this.dataSource = res.filter((res: any)=> res.no==no!  && formatDate(res.date, 'M/d/yyyy', this.locale) == startDate)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
              }
              else if (no != '' && description != ''&& startDate == ''){
                console.log("enter name & id: ", "res : ", res, "input name: ", description, "id: ", no)

            // this.dataSource = res.filter((res: any)=> res.name==name!)
            this.dataSource = res.filter((res: any)=> res.no==no! && res.description.toLowerCase().includes(description.toLowerCase()))
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
              }
              else if (no == '' && description != ''&& startDate == ''){
                console.log("enter name & id: ", "res : ", res, "input name: ", description, "id: ", no)
           
                this.dataSource = res.filter((res: any)=> res.description.toLowerCase().includes(description.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              else{
           
                this.dataSource = res
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            
              
            },
            error: (err) => {
              alert("Error")
            }
          })
          // this.getAllGrades()
        }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }


}
