import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { STRPlatoon1DialogComponent } from '../str-platoon1-dialog/str-platoon1-dialog.component';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export class Grades {
  constructor(public name: string, public code: string) {}
}

@Component({
  selector: 'app-str-platoon1',
  templateUrl: './str-platoon1.component.html',
  styleUrls: ['./str-platoon1.component.css']
})
export class STRPlatoon1Component {
  transactionUserId=localStorage.getItem('transactionUserId')
  gradeCtrl: FormControl;
  filteredgrades: Observable<any[]>;
  grade_list: Grades[] = [];
  formcontrol = new FormControl('');  
  platoonForm !:FormGroup;
  title = 'angular13crud';
  displayedColumns: string[] = ['code', 'name', 'commodityName', 'gradeName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedOption: any;
  constructor(private dialog : MatDialog, private api : ApiService){
    this.gradeCtrl = new FormControl();
    this.filteredgrades = this.gradeCtrl.valueChanges.pipe(
      startWith(''),
      map((grade) =>
      grade ? this._filtergrade(grade) : this.grade_list.slice()
      )
    );
  }
  ngOnInit(): void {
    this.getAllPlatoons();
    this.api.getAllGrades().subscribe((gradeData)=>{
      this.grade_list = gradeData;
    });
  }
  openDialog() {
    this.dialog.open(STRPlatoon1DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllPlatoons();
      }
    })
  }

  displayGradeName(grade: any): string {
    return grade && grade.name ? grade.name : '';
  }

  // displayGradeId(grade: any): number {
  //   return grade && grade.id ? grade.id: '';
  // }
  
  gradeSelected(event: MatAutocompleteSelectedEvent) {
       this.selectedOption = event.option.value;
      this.platoonForm.patchValue({ gradeId: this.selectedOption.id });
    }

    _filtergrade(value: string) {
      const searchvalue = value.toLocaleLowerCase();
      let arr = this.grade_list.filter(option => option.name.toLocaleLowerCase().includes(searchvalue) || 
      option.code.toLocaleLowerCase().includes(searchvalue));
      return arr.length ? arr : [{ name: 'No Item found', code: 'null' }];
    }


  getAllPlatoons(){
    this.api.getPlatoon()
    .subscribe({
      next:(res)=>{
        console.log("res table: ", res);
        
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("error while fetching the records!!");
      }
      
    })
  }
  editPlatoon(row : any){
    console.log("data : " , row)
    this.dialog.open(STRPlatoon1DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllPlatoons();
      }
    })
  }
  daletePlatoon(id:number){
    var result = confirm("هل ترغب بتاكيد مسح الفصيلة ؟ ");
    if (result) {
    this.api.deletePlatoon(id)
    .subscribe({
      next:(res)=>{
        alert("Product deleted successfully");
        this.getAllPlatoons();
      },
      error:()=>{
        alert("error while deleting the product!!")
      }
    })
  }
}
  async getSearchPlatoons(name:any) {
  
    this.api.getPlatoon()
          .subscribe({
            next: (res) => {
              console.log("platoon res: ", res)
            
              //enter id
              if (this.selectedOption  && name == '' ){
                console.log("filter ID id: ", this.selectedOption , "name: ", name)

                this.dataSource = res.filter((res: any)=> res.gradeId==this.selectedOption.id!) 
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              //enter both
              else if (this.selectedOption && name != ''){
                console.log("filter both id: ", this.selectedOption , "name: ", name)

                // this.dataSource = res.filter((res: any)=> res.name==name!)
                this.dataSource = res.filter((res: any)=> res.gradeId==this.selectedOption.id! && res.name.toLowerCase().includes(name.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              //enter name
              else{
                console.log("filter name id: ", this.selectedOption , "name: ", name)
                // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
                this.dataSource = res.filter((res: any)=> res.name.toLowerCase().includes(name.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            
              
            },
            error: (err) => {
              alert("Error")
            }
          })
          // this.getAllProducts()
        }

        

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

