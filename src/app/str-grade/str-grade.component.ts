import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { STRGradeDialogComponent } from '../str-grade-dialog/str-grade-dialog.component';
import { ApiService } from '../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
// import { publishFacade } from '@angular/compiler';
// import { STRGradeComponent } from '../str-grade/str-grade.component';



export class commodities {
  constructor(public name: string, public code: string) {}
}
@Component({
  selector: 'app-str-grade',
  templateUrl: './str-grade.component.html',
  styleUrls: ['./str-grade.component.css']
})
export class STRGradeComponent {
  commodityCtrl: FormControl;
  filteredcommodities: Observable<any[]>;
  commodity_list: commodities[] = [];
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'code','name', 'commodityName','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  commidityDt:any={
    id:0,
  
  }
  formcontrol = new FormControl(''); 
  gradeForm !:FormGroup;

  commidityList:any=[];
  selectedOption: any;
  constructor(private dialog: MatDialog, private api: ApiService) {
    this.commodityCtrl = new FormControl();
    this.filteredcommodities = this.commodityCtrl.valueChanges.pipe(
      startWith(''),
      map((gradd) =>
        gradd ? this.filtercommod(gradd) : this.commodity_list.slice()
      )
    );
     
  }
  ngOnInit(): void {

    // console.log(productForm)

    this.getAllGrades();

    this.api.getAllCommodity().subscribe((tododata) =>{
      this.commodity_list = tododata;
    });

  }
  openDialog() {
    this.dialog.open(STRGradeDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllGrades();
      }
    });
  }

  getAllGrades() {
    this.api.getGrade()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert("Error")
        }
      })
  }

  editGrade(row: any) {
    this.dialog.open(STRGradeDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllGrades();
      }
    })
  }

deleteGrade(id:number){
  if(confirm("Are you sure to delete ")) {
    console.log("Implement delete functionality here");
  }
this.api.deleteGrade(id)
.subscribe({
next:(res)=>{
alert("تم الحذف بنجاح");
this.getAllGrades();
},
error:()=>{
  alert("خطأ فى حذف العنصر")
}
})
}



async getSearchGrades(name:any) {
  let commidityID :any
      commidityID = this.selectedOption.id;
      
      console.log("com id : "+commidityID,"name : "+name);
      
      this.api.getGrade()
        .subscribe({
          next: (res) => {
            // 1-
            if (commidityID != '' && name == '' ){
              this.dataSource = res.filter((res: any)=> res.commodityId==commidityID!) 
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
            else if (commidityID != '' && name != ''){
              // this.dataSource = res.filter((res: any)=> res.name==name!)
              this.dataSource = res.filter((res: any)=> res.commodityId==commidityID! && res.name.toLowerCase().includes(name.toLowerCase()))
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
            else if(commidityID == '' && name != '' ){
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
        // this.getAllGrades()
      }

      displayCommodity (option:any):string {
        return option && option.name ? option.name:'';
    
      }
      
        optionSelected(event: MatAutocompleteSelectedEvent) {
          this.selectedOption = event.option.value;
          this.gradeForm.patchValue({ commodityId: this.selectedOption.id });
        }
      
        filtercommod(value: string) {
          const searchvalue = value.toLocaleLowerCase();
          let arr = this.commodity_list.filter(option => option.name.toLocaleLowerCase().includes(searchvalue) || 
          option.code.toLocaleLowerCase().includes(searchvalue));
          return arr.length ? arr : [{ name: 'No Item found', code: 'null' }];
        }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

