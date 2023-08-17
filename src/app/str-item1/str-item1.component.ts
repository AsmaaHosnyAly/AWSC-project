import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { STRItem1DialogComponent } from '../str-item1-dialog/str-item1-dialog.component';
import { ApiService } from '../services/api.service';
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

export class Group {
  constructor(public id: number, public name: string, public code: string,public commodityId: number, public gradeId: number, public platoonId: number) {}
}

export class Unit {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-str-item1',
  templateUrl: './str-item1.component.html',
  styleUrls: ['./str-item1.component.css']
})
export class STRItem1Component implements OnInit{
  transactionUserId=localStorage.getItem('transactionUserId')
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  gradeCtrl: FormControl;
  filteredGrades: Observable<Grade[]>;
  grades: Grade[] = [];
  platoonCtrl: FormControl;
  filteredPlatoons: Observable<Platoon[]>;
  platoons: Platoon[] = [];
  groupCtrl: FormControl;
  filteredGroups: Observable<Group[]>;
  groups: Group[] = [];
  unitCtrl: FormControl;
  filteredUnits: Observable<Unit[]>;
  units: Unit[] = [];
  selectedCommodity!: Commodity;
  selectedGrade!: Grade;
  selectedPlatoon!: Platoon;
  selectedGroup!: Group;
  selectedUnit!: Unit;
  itemForm !:FormGroup;
  title = 'angular13crud';
  displayedColumns: string[] = ['fullCode', 'name', 'no', 'type', 'isActive', 'commodityName', 'gradeName', 'platoonName','groupName','unitName', 'action'];
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

    this.groupCtrl = new FormControl();
    this.filteredGroups = this.groupCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroups(value))
    );    

    this.unitCtrl = new FormControl();
    this.filteredUnits = this.unitCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUnits(value))
    );
  }
  ngOnInit(): void {
    this.getAllItems();
    this.api.getAllCommoditiesi().subscribe((commodities)=>{
      this.commodities = commodities;
    });

    this.api.getAllGradesi().subscribe((grades)=>{
      this.grades = grades;
    });

    this.api.getAllPlatoonsi().subscribe((platoons)=>{
      this.platoons = platoons;
    });

    this.api.getAllGroupsi().subscribe((groups)=>{
      this.groups = groups;
    });

    this.api.getAllUnitsi().subscribe((units)=>{
      this.units = units;
    });
  }
  openDialog() {
    this.dialog.open(STRItem1DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllItems();
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

  displayGroupName(group: any): string {
    return group && group.name ? group.name : '';
  }

  displayUnitName(unit: any): string {
    return unit && unit.name ? unit.name : '';
  }
  
  commoditySelected(event: MatAutocompleteSelectedEvent): void {
    const commodity = event.option.value as Commodity;
    this.selectedCommodity = commodity;
    this.itemForm.patchValue({ commodityId: commodity.id });
    this.itemForm.patchValue({ commodityName: commodity.name });
    this.gradeCtrl.setValue('');
  }
  
  gradeSelected(event: MatAutocompleteSelectedEvent): void {
    const grade = event.option.value as Grade;
    this.selectedGrade = grade;
    this.itemForm.patchValue({ gradeId: grade.id });
    this.itemForm.patchValue({ gradeName: grade.name });
    this.platoonCtrl.setValue('');
  }
  
  platoonSelected(event: MatAutocompleteSelectedEvent): void {
    const platoon = event.option.value as Platoon;
    this.selectedPlatoon = platoon;
    this.itemForm.patchValue({ platoonId: platoon.id });
    this.itemForm.patchValue({ platoonName: platoon.name });
    this.groupCtrl.setValue('');
  }

  groupSelected(event: MatAutocompleteSelectedEvent): void {
    const group = event.option.value as Group;
    this.selectedGroup = group;
    this.itemForm.patchValue({ groupId: group.id });
    this.itemForm.patchValue({ groupName: group.name });
  }

  unitSelected(event: MatAutocompleteSelectedEvent): void {
    const unit = event.option.value as Unit;
    this.selectedUnit = unit;
    this.itemForm.patchValue({ unitName: unit.name });
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

  private _filterGroups(value: string): Group[] {
    const filterValue = value.toLowerCase();
    return this.groups.filter(
      group =>
        (group.name.toLowerCase().includes(filterValue) || group.code.toLowerCase().includes(filterValue)) &&
        group.platoonId === this.selectedPlatoon?.id
    );
  }

  private _filterUnits(value: string): Unit[] {
    const filterValue = value.toLowerCase();
    return this.units.filter(unit =>
      unit.name.toLowerCase().includes(filterValue)
    );
  }


  getAllItems(){
    this.api.getItem()
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
  editItem(row : any){
    console.log("data : " , row)
    this.dialog.open(STRItem1DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllItems();
      }
    })
  }
  deleteItem(id:number){
    var result = confirm("هل ترغب بتاكيد مسح الصنف ؟ ");
    if (result) {
    this.api.deleteItems(id)
    .subscribe({
      next:(res)=>{
        alert("Product deleted successfully");
        this.getAllItems();
      },
      error:()=>{
        alert("error while deleting the product!!")
      }
    })
  }
}
  async getSearchItems(name:any) {
  
    this.api.getItem()
          .subscribe({
            next: (res) => {   
              //enter itemName
              if(!this.selectedGroup  && name && !this.selectedUnit){
                console.log("filter name id: ", this.selectedGroup , "name: ", name)
                // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
                this.dataSource = res.filter((res: any)=> res.name.toLowerCase().includes(name.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }

              //enter selectedGroup               
              if (this.selectedGroup  && name == '' && !this.selectedUnit){
                console.log("selectedGroup:",this.selectedGroup);

                this.dataSource = res.filter((res: any)=> res.groupId==this.selectedGroup.id) 
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }

              //enter selectedUnit
              if (!this.selectedGroup  && name == '' && this.selectedUnit){
                console.log("selectedUnit: ", this.selectedUnit , "name: ", name)

                this.dataSource = res.filter((res: any)=> res.unitId==this.selectedUnit.id) 
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }

              //enter selectedUnit+selectedGroup
              if (this.selectedUnit   && name == '' && this.selectedGroup ){
                console.log("filter Unit, Group: ", this.selectedUnit , this.selectedGroup)

                this.dataSource = res.filter((res: any)=> res.unitId==this.selectedUnit.id && res.groupId==this.selectedGroup.id) 
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }

              //enter selectedGroup+item
              else if (this.selectedGroup && name && !this.selectedUnit){
                console.log("selectedGroup ,name: ", this.selectedGroup , "name: ", name)

                // this.dataSource = res.filter((res: any)=> res.name==name!)
                this.dataSource = res.filter((res: any)=> res.groupId==this.selectedGroup.id && res.name.toLowerCase().includes(name.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }

              //enter selectedUnit+item
              else if (!this.selectedUnit && name && this.selectedUnit){
                console.log("selectedUnit, name: ", this.selectedUnit , "name: ", name)

                // this.dataSource = res.filter((res: any)=> res.name==name!)
                this.dataSource = res.filter((res: any)=> res.unitId==this.selectedUnit.id && res.name.toLowerCase().includes(name.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }

              //enter all
              else if (this.selectedUnit && this.selectedGroup && name){
                console.log("all: ", this.selectedUnit ,this.selectedGroup, "name: ", name)

                // this.dataSource = res.filter((res: any)=> res.name==name!)
                // this.dataSource = res.filter((res: any)=> res.unitId==this.selectedUnit.id &&  res.groupId==this.selectedGroup.id! && res.name.toLowerCase().includes(name.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }

              //enter itemName
              else{
                console.log("filter name id: ", this.selectedGroup , "name: ", name)
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


