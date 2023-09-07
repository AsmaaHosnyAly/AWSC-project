import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { STRGroup1DialogComponent } from '../str-group1-dialog/str-group1-dialog.component';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export class Commodity {
  constructor(public id: number, public name: string, public code: string) {}
}

export class Grade {
  constructor(public id: number, public name: string, public code: string,public commodityId: number) {}
}

export class Platoon {
  constructor(public id: number, public name: string, public code: string,public commodityId: number, public gradeId: number) {}
}


@Component({
  selector: 'app-str-group1',
  templateUrl: './str-group1.component.html',
  styleUrls: ['./str-group1.component.css']
})
export class STRGroup1Component implements OnInit{
  transactionUserId=localStorage.getItem('transactionUserId')
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  gradeCtrl: FormControl;
  filteredGrades: Observable<Grade[]>;
  grades: Grade[] = [];
  platoonCtrl: FormControl;
  filteredPlatoons: Observable<Commodity[]>;
  platoons: Platoon[] = [];
  selectedCommodity!: Commodity;
  selectedGrade!: Grade;
  selectedPlatoon!: Platoon;
  groupForm !:FormGroup;
  title = 'angular13crud';
  displayedColumns: string[] = ['code', 'name', 'commodityName', 'gradeName', 'platoonName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog, private api : ApiService){
    this.commodityCtrl = new FormControl();
    this.filteredCommodities = this.commodityCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCommodities(value))
    );

    this.gradeCtrl = new FormControl();
    this.filteredGrades = this.gradeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGrades(value))
    );

    this.platoonCtrl = new FormControl();
    this.filteredPlatoons = this.platoonCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPlatoons(value))
    );
  }
  ngOnInit(): void {
    this.getAllGroups();
    this.api.getAllCommodities().subscribe((commodities)=>{
      this.commodities = commodities;
    });

    this.api.getAllGrades().subscribe((grades)=>{
      this.grades = grades;
    });

    this.api.getAllPlatoonsg().subscribe((platoons)=>{
      this.platoons = platoons;
    });
  }
  openDialog() {
    this.dialog.open(STRGroup1DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllGroups();
      }
    })
  }

  displayCommodityName(commodity: any): string {
    return commodity && commodity.name ? commodity.name : '';
  }
  
  displayGradeName(grade: any): string {
    return grade && grade.name ? grade.name : '';
  }
  
  displayPlatoonName(platoon: any): string {
    return platoon && platoon.name ? platoon.name : '';
  }
  
  commoditySelected(event: MatAutocompleteSelectedEvent): void {
    const commodity = event.option.value as Commodity;
    this.selectedCommodity = commodity;
    this.groupForm.patchValue({ commodityId: commodity.id });
    this.groupForm.patchValue({ commodityName: commodity.name });
    this.gradeCtrl.setValue('');
  }
  
  gradeSelected(event: MatAutocompleteSelectedEvent): void {
    const grade = event.option.value as Grade;
    this.selectedGrade = grade;
    this.groupForm.patchValue({ gradeId: grade.id });
    this.groupForm.patchValue({ gradeName: grade.name });
    this.platoonCtrl.setValue('');
  }
  
  platoonSelected(event: MatAutocompleteSelectedEvent): void {
    const platoon = event.option.value as Platoon;
    this.selectedPlatoon = platoon;
    this.groupForm.patchValue({ platoonId: platoon.id });
    this.groupForm.patchValue({ platoonName: platoon.name });
  }
  
  private _filterCommodities(value: string): Commodity[] {
    const filterValue = value.toLowerCase();
    return this.commodities.filter(commodity =>
      commodity.name.toLowerCase().includes(filterValue) || commodity.code.toLowerCase().includes(filterValue)
    );
  }
  
  private _filterGrades(value: string): Grade[] {
    const filterValue = value.toLowerCase();
    return this.grades.filter(
      grade =>
        (grade.name.toLowerCase().includes(filterValue) || grade.code.toLowerCase().includes(filterValue)) &&
        grade.commodityId === this.selectedCommodity?.id
    );
  }
  
  private _filterPlatoons(value: string): Platoon[] {
    const filterValue = value.toLowerCase();
    return this.platoons.filter(
      platoon =>
        (platoon.name.toLowerCase().includes(filterValue) || platoon.code.toLowerCase().includes(filterValue)) &&
        platoon.gradeId === this.selectedGrade?.id
    );
  }


    getAllGroups(){
    this.api.getGroups()
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
    this.dialog.open(STRGroup1DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllGroups();
      }
    })
  }
  daletePlatoon(id:number){
    var result = confirm("هل ترغب بتاكيد مسح المجموعة ؟ ");
    if (result) {
    this.api.deleteGroups(id)
    .subscribe({
      next:(res)=>{
        alert("Product deleted successfully");
        this.getAllGroups();
      },
      error:()=>{
        alert("error while deleting the product!!")
      }
    })
  }
}

openAutoCommodity() {
  this.commodityCtrl.setValue(''); // Clear the input field value

  // Open the autocomplete dropdown by triggering the value change event
  this.commodityCtrl.updateValueAndValidity();
}
openAutoGrade() {
  this.gradeCtrl.setValue(''); // Clear the input field value

  // Open the autocomplete dropdown by triggering the value change event
  this.gradeCtrl.updateValueAndValidity();
}
openAutoPlatoon() {
  this.platoonCtrl.setValue(''); // Clear the input field value

  // Open the autocomplete dropdown by triggering the value change event
  this.platoonCtrl.updateValueAndValidity();
}
  async getSearchGroups(name:any) {
  
    this.api.getGroups()
          .subscribe({
            next: (res) => {        
              //enter id
              if (this.selectedPlatoon  && name == '' ){
                console.log("filter ID id: ", this.selectedPlatoon , "name: ", name)

                this.dataSource = res.filter((res: any)=> res.platoonId==this.selectedPlatoon.id!) 
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              //enter both
              else if (this.selectedPlatoon && name != ''){
                console.log("filter both id: ", this.selectedPlatoon , "name: ", name)

                // this.dataSource = res.filter((res: any)=> res.name==name!)
                this.dataSource = res.filter((res: any)=> res.platoonId==this.selectedPlatoon.id! && res.name.toLowerCase().includes(name.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              //enter name
              else{
                console.log("filter name id: ", this.selectedPlatoon , "name: ", name)
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

