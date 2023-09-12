import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { STRItem1DialogComponent } from '../str-item1-dialog/str-item1-dialog.component';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  FormGroup,
  FormBuilder,
  Validator,
  Validators,
  FormControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';

export class Commodity {
  constructor(public id: number, public name: string, public code: string) {
    
  }
}

export class Grade {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public commodityId: number
  ) {}
}

export class Platoon {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public commodityId: number,
    public gradeId: number
  ) {}
}

export class Group {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public commodityId: number,
    public gradeId: number,
    public platoonId: number
  ) {}
}

export class Unit {
  constructor(public id: number, public name: string,private global:GlobalService) {

  }
}

@Component({
  selector: 'app-str-item1',
  templateUrl: './str-item1.component.html',
  styleUrls: ['./str-item1.component.css'],
  providers: [DatePipe],
})
export class STRItem1Component implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  unitCtrl: FormControl;
  filteredUnits: Observable<Unit[]>;
  units: Unit[] = [];
  selectedUnit!: Unit;
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  selectedCommodity!: Commodity;
  commodities: Commodity[] = [];
  gradeCtrl: FormControl;
  filteredGrades: Observable<Grade[]>;
  selectedGrade!: Grade;
  grades: Grade[] = [];
  platoonCtrl: FormControl;
  filteredPlatoons: Observable<Platoon[]>;
  platoons: Platoon[] = [];
  selectedPlatoon!: Platoon;
  groupCtrl: FormControl;
  filteredGroups: Observable<Group[]>;
  groups: Group[] = [];
  selectedGroup!: Group;
  formcontrol = new FormControl('');
  itemForm !: FormGroup;
  title = 'angular13crud';
  displayedColumns: string[] = [
    'fullCode',
    'name',
    'type',
    'commodityName',
    'gradeName',
    'platoonName',
    'groupName',
    'unitName',
    'action',
  ];

  myDate: any = new Date();

  reportName: string = 'str-item1';
  reportData: any;
  dataSource2!: MatTableDataSource<any>;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private api: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private global:GlobalService
  ) {

    global.getPermissionUserRoles(1, 'stores', 'إدارة المخازن وحسابات المخازن-الاصناف', '')
    this.unitCtrl = new FormControl();
    this.filteredUnits = this.unitCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUnits(value))
    );

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

    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');

    
  }
  ngOnInit(): void {
  
    this.getAllItems();
    this.api.getAllUnitsi().subscribe((units) => {
      this.units = units;
    });

    this.api.getAllCommoditiesi().subscribe((commodities) => {
      this.commodities = commodities;
    });

    this.api.getAllGradesi().subscribe((grades) => {
      this.grades = grades;
    });

    this.api.getAllPlatoonsi().subscribe((platoons) => {
      this.platoons = platoons;
    });

    this.api.getAllGroupsi().subscribe((groups) => {
      this.groups = groups;
    });

    this.itemForm = this.formBuilder.group({
      itemName: [''],
      fullCode: [''],
      type: [''],
      unitN: [''],
      commodityN: [''],
      gradeN: [''],
      platoonN: [''],
      groupN: [''],
      unitId: [''],
      commodityId: [''],
      gradeId: [''],
      platoonId: [''],
      groupId: [''],
    });
  }
  openDialog() {
    this.dialog
      .open(STRItem1DialogComponent, {
        width: '50%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllItems();
        }
      });
  }

  displayUnitName(unit: any): string {
    return unit && unit.name ? unit.name : '';
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

  unitSelected(event: MatAutocompleteSelectedEvent): void {
    const unit = event.option.value as Unit;
    this.selectedUnit = unit;
    this.itemForm.patchValue({ unitId: unit.id });
    this.itemForm.patchValue({ unitName: unit.name });
  }

  commoditySelected(event: MatAutocompleteSelectedEvent): void {
    const commodity = event.option.value as Commodity;
    this.selectedCommodity = commodity;
    this.itemForm.patchValue({ commodityId: commodity.id });
    this.itemForm.patchValue({ commodityName: commodity.name });
    this.itemForm.patchValue({ commoditycode: commodity.code });
  }

  gradeSelected(event: MatAutocompleteSelectedEvent): void {
    const grade = event.option.value as Grade;
    this.selectedGrade = grade;
    this.itemForm.patchValue({ gradeId: grade.id });
    this.itemForm.patchValue({ gradeName: grade.name });
    this.itemForm.patchValue({ gradecode: grade.code });
  }

  platoonSelected(event: MatAutocompleteSelectedEvent): void {
    const platoon = event.option.value as Platoon;
    this.selectedPlatoon = platoon;
    this.itemForm.patchValue({ platoonId: platoon.id });
    this.itemForm.patchValue({ platoonName: platoon.name });
    this.itemForm.patchValue({ platooncode: platoon.code });
  }

  groupSelected(event: MatAutocompleteSelectedEvent): void {
    const group = event.option.value as Group;
    this.selectedGroup = group;
    this.itemForm.patchValue({ groupId: group.id });
    this.itemForm.patchValue({ groupName: group.name });
    this.itemForm.patchValue({ groupcode: group.code });
  }

  private _filterUnits(value: string): Unit[] {
    const filterValue = value
    return this.units.filter(unit =>
      unit.name.toLowerCase().includes(filterValue) 
    );
  }

  private _filterCommodities(value: string): Commodity[] {
    const filterValue = value
    return this.commodities.filter(commodity =>
      commodity.name.toLowerCase().includes(filterValue) || commodity.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterGrades(value: string): Grade[] {
    const filterValue = value
    return this.grades.filter(
      grade =>
        (grade.name.toLowerCase().includes(filterValue) || grade.code.toLowerCase().includes(filterValue))
    );
  }

  private _filterPlatoons(value: string): Platoon[] {
    const filterValue = value
    return this.platoons.filter(
      platoon =>
        (platoon.name.toLowerCase().includes(filterValue) || platoon.code.toLowerCase().includes(filterValue))
    );
  }

  private _filterGroups(value: string): Group[] {
    const filterValue = value
    return this.groups.filter(
      group =>
        (group.name.toLowerCase().includes(filterValue) || group.code.toLowerCase().includes(filterValue))
    );
  }
  openAutoUnit() {
    this.unitCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.unitCtrl.updateValueAndValidity();
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

  openAutoGroup() {
    this.groupCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.groupCtrl.updateValueAndValidity();
  }

  getAllItems() {
    this.api.getItem().subscribe({
      next: (res) => {
        console.log('res table: ', res);
        this.reportData = res;
        // let data: any = this.api.reportData;
        window.localStorage.setItem(
          'reportData',
          JSON.stringify(this.reportData)
        );
        window.localStorage.setItem(
          'reportName',
          JSON.stringify(this.reportName)
        );
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.itemForm.reset();
      },
      error: (err) => {
        alert('error while fetching the records!!');
      },
    });
  }
  editItem(row: any) {
    console.log('data : ', row);
    this.dialog
      .open(STRItem1DialogComponent, {
        width: '50%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllItems();
        }
      });
  }
  deleteItem(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح الصنف ؟ ');
    if (result) {
      this.api.deleteItems(id).subscribe({
        next: (res) => {
          alert('Product deleted successfully');
          this.getAllItems();
        },
        error: () => {
          alert('error while deleting the product!!');
        },
      });
    }
  }
  // async getSearchItems(name: any) {
  //   this.api.getItem().subscribe({
  //     next: (res) => {
  //       //1 enter itemName
  //       if (!this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name ) {

  //         this.dataSource = res.filter((res: any) =>
  //           res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //       //2 enter selectedUnit
  //       else if (this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name == '' ) {

  //         this.dataSource = res.filter(
  //           (res: any) => res.unitId == this.selectedUnit.id
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //       //3 enter selectedCommodity
  //       else if (!this.selectedUnit && this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name == '' ) {

  //         this.dataSource = res.filter(
  //           (res: any) => res.commodityId == this.selectedCommodity.id!
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //       //4 enter selectedGrade
  //       else if (!this.selectedUnit && !this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name == '' ) {

  //         this.dataSource = res.filter(
  //           (res: any) => res.gradeId == this.selectedGrade.id
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //       //5 enter selectedPlatoon
  //       else if (!this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name == '' ) {

  //         this.dataSource = res.filter(
  //           (res: any) => res.platoonId == this.selectedPlatoon.id
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
        
  //       //6 enter selectedGroup
  //       else if (!this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name == '' ) {

  //         this.dataSource = res.filter(
  //           (res: any) => res.groupId == this.selectedGroup.id
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //       // 7 enter itemName+selectedUnit
  //       else if (this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name ) {

  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.unitId == this.selectedUnit.id &&
  //             res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }  
        
  //       //8 enter itemName+selectedCommodity
  //       else if (!this.selectedUnit && this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name ) {

  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.commodityId == this.selectedCommodity.id &&
  //             res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }    

  //       //9 enter itemName+selectedGrade
  //       else if (!this.selectedUnit && !this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name ) {

  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.gradeId == this.selectedGrade.id &&
  //             res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }    

  //       //10 enter itemName+selectedPlatoon
  //       else if (!this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name ) {

  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.platoonId == this.selectedPlatoon.id &&
  //             res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }    

  //       //11 enter itemName+selectedGroup
  //       else if (!this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name ) {

  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.groupId == this.selectedGroup.id &&
  //             res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }    

  //       //12 enter selectedUnit+selectedCommodity
  //       else if (this.selectedUnit && this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name == '' ) {
  //         console.log(
  //           'filter Unit, Group: ',
  //           this.selectedUnit,
  //           this.selectedGroup
  //         );

  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.unitId == this.selectedUnit.id &&
  //             res.commodityId == this.selectedCommodity.id
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //       //13 enter selectedUnit+selectedGrade
  //       else if (this.selectedUnit && !this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name == '' ) {
          
  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.unitId == this.selectedUnit.id &&
  //             res.gradeId == this.selectedGrade.id
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //       //14 enter selectedUnit+selectedPlatoon
  //       else if (this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name == '' ) {
          
  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.unitId == this.selectedUnit.id &&
  //             res.platoonId == this.selectedPlatoon.id
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //       //15 enter selectedUnit+selectedGroup
  //       else if (this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name == '' ) {
        
  //         // this.dataSource = res.filter((res: any)=> res.name==name!)
  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.unitId == this.selectedUnit.id &&
  //             res.groupId == this.selectedGroup.id
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //         //16 enter selectedCommodity+selectedGrade
  //         else if (!this.selectedUnit && this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name == '' ) {
        
  //           // this.dataSource = res.filter((res: any)=> res.name==name!)
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.commodityId == this.selectedCommodity.id &&
  //               res.gradeId == this.selectedGrade.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //17 enter selectedCommodity+selectedPlatoon
  //         else if (!this.selectedUnit && this.selectedCommodity && !this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name == '' ) {
        
  //           // this.dataSource = res.filter((res: any)=> res.name==name!)
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.commodityId == this.selectedCommodity.id &&
  //               res.platoonId == this.selectedPlatoon.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //18 enter selectedCommodity+selectedGroup
  //         else if (!this.selectedUnit && this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name == '' ) {
        
  //           // this.dataSource = res.filter((res: any)=> res.name==name!)
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.commodityId == this.selectedCommodity.id &&
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //19 enter selectedGrade+selectedPlatoon
  //         else if (!this.selectedUnit && !this.selectedCommodity && this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name == '' ) {
        
  //           // this.dataSource = res.filter((res: any)=> res.name==name!)
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.gradeId == this.selectedGrade.id &&
  //               res.platoonId == this.selectedPlatoon.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //20 enter selectedGrade+selectedGroup
  //         else if (!this.selectedUnit && !this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name == '' ) {
        
  //           // this.dataSource = res.filter((res: any)=> res.name==name!)
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.gradeId == this.selectedGrade.id &&
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //21 enter selectedPlatoon+selectedGroup
  //         else if (!this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && this.selectedPlatoon && this.selectedGroup && name == '' ) {
        
  //           // this.dataSource = res.filter((res: any)=> res.name==name!)
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.platoonId == this.selectedPlatoon.id &&
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //22 enter itemName+selectedUnit+selectedCommodity
  //         else if (this.selectedUnit && this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //             res.name.toLowerCase().includes(name.toLowerCase()) &&
  //               res.unitId == this.selectedUnit.id &&
  //               res.commodityId == this.selectedCommodity.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //23 enter itemName+selectedUnit+selectedGrade
  //         else if (this.selectedUnit && !this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //             res.name.toLowerCase().includes(name.toLowerCase()) &&
  //               res.unitId == this.selectedUnit.id &&
  //               res.gradeId == this.selectedGrade.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //24 enter itemName+selectedUnit+selectedPlatoon
  //         else if (this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //             res.name.toLowerCase().includes(name.toLowerCase()) &&
  //               res.unitId == this.selectedUnit.id &&
  //               res.platoonId == this.selectedPlatoon.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //25 enter itemName+selectedUnit+selectedGroup
  //         else if (this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //             res.name.toLowerCase().includes(name.toLowerCase()) &&
  //               res.unitId == this.selectedUnit.id &&
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //26 enter selectedUnit+selectedCommodity+selectedGrade
  //         else if (this.selectedUnit && this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>              
  //               res.unitId == this.selectedUnit.id &&
  //               res.commodityId == this.selectedCommodity.id &&
  //               res.gradeId == this.selectedGrade.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //27 enter selectedUnit+selectedCommodity+selectedPlatoon
  //         else if (this.selectedUnit && this.selectedCommodity && !this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>              
  //               res.unitId == this.selectedUnit.id &&
  //               res.commodityId == this.selectedCommodity.id &&
  //               res.platoonId == this.selectedPlatoon.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //28 enter selectedUnit+selectedCommodity+selectedGroup
  //         else if (this.selectedUnit && this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>              
  //               res.unitId == this.selectedUnit.id &&
  //               res.commodityId == this.selectedCommodity.id &&
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //29 enter selectedCommodity+selectedGrade+selectedPlatoon
  //         else if (!this.selectedUnit && this.selectedCommodity && this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>              
  //               res.commodityId == this.selectedCommodity.id &&
  //               res.gradeId == this.selectedGrade.id &&
  //               res.platoonId == this.selectedPlatoon.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //30 enter selectedCommodity+selectedGrade+selectedGroup
  //         else if (!this.selectedUnit && this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>              
  //               res.commodityId == this.selectedCommodity.id &&
  //               res.gradeId == this.selectedGrade.id &&
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //31 enter selectedGrade+selectedPlatoon+selectedGroup
  //         else if (!this.selectedUnit && !this.selectedCommodity && this.selectedGrade && this.selectedPlatoon && this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>              
  //               res.gradeId == this.selectedGrade.id &&
  //               res.platoonId == this.selectedPlatoon.id &&
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //32 enter itemName+selectedUnit+selectedCommodity+selectedGrade
  //         else if (this.selectedUnit && this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //             res.name.toLowerCase().includes(name.toLowerCase()) &&
  //               res.unitId == this.selectedUnit.id &&
  //               res.commodityId == this.selectedCommodity.id&&
  //               res.gradeId == this.selectedGrade.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //33 enter itemName+selectedUnit+selectedCommodity+selectedPlatoon
  //         else if (this.selectedUnit && this.selectedCommodity && !this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //             res.name.toLowerCase().includes(name.toLowerCase()) &&
  //               res.unitId == this.selectedUnit.id &&
  //               res.commodityId == this.selectedCommodity.id&&
  //               res.platoonId == this.selectedPlatoon.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //34 enter itemName+selectedUnit+selectedCommodity+selectedGroup
  //         else if (this.selectedUnit && this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //             res.name.toLowerCase().includes(name.toLowerCase()) &&
  //               res.unitId == this.selectedUnit.id &&
  //               res.commodityId == this.selectedCommodity.id&&
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //35 enter selectedUnit+selectedCommodity+selectedGrade+selectedPlatoon
  //         else if (this.selectedUnit && this.selectedCommodity && this.selectedGrade && this.selectedPlatoon && !this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.unitId == this.selectedUnit.id &&
  //               res.commodityId == this.selectedCommodity.id&&
  //               res.gradeId == this.selectedGrade.id&&
  //               res.platoonId == this.selectedPlatoon.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //36 enter selectedUnit+selectedCommodity+selectedGrade+selectedGroup
  //         else if (this.selectedUnit && this.selectedCommodity && this.selectedGrade && !this.selectedPlatoon && this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.unitId == this.selectedUnit.id &&
  //               res.commodityId == this.selectedCommodity.id&&
  //               res.gradeId == this.selectedGrade.id&&
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //37 enter selectedCommodity+selectedGrade+selectedPlatoon+selectedGroup
  //         else if (!this.selectedUnit && this.selectedCommodity && this.selectedGrade && this.selectedPlatoon && this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.commodityId == this.selectedCommodity.id&&
  //               res.gradeId == this.selectedGrade.id&&
  //               res.platoonId == this.selectedPlatoon.id&&                
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         //38 enter selectedCommodity+selectedGrade+selectedPlatoon+selectedGroup
  //         else if (!this.selectedUnit && this.selectedCommodity && this.selectedGrade && this.selectedPlatoon && this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.commodityId == this.selectedCommodity.id&&
  //               res.gradeId == this.selectedGrade.id&&
  //               res.platoonId == this.selectedPlatoon.id&&                
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //         // enter itemName+selectedUnit+selectedCommodity+selectedGrade+selectedPlatoon
  //         else if (!this.selectedUnit && this.selectedCommodity && this.selectedGrade && this.selectedPlatoon && this.selectedGroup && name =='' ) {
        
  //           this.dataSource = res.filter(
  //             (res: any) =>
  //               res.commodityId == this.selectedCommodity.id&&
  //               res.gradeId == this.selectedGrade.id&&
  //               res.platoonId == this.selectedPlatoon.id&&                
  //               res.groupId == this.selectedGroup.id
  //           );
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }

  //       //enter all
  //       else if (this.selectedUnit && this.selectedCommodity && this.selectedGrade && this.selectedPlatoon && this.selectedGroup && name) {
          

  //         // this.dataSource = res.filter((res: any)=> res.name==name!)
  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.unitId == this.selectedUnit.id &&
  //             res.commodityId == this.selectedCommodity.id &&
  //             res.gradeId == this.selectedGrade.id &&
  //             res.platoonId == this.selectedPlatoon.id &&
  //             res.groupId == this.selectedGroup.id &&
  //             res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //       //no enter 
  //       else if (!this.selectedUnit && !this.selectedCommodity && !this.selectedGrade && !this.selectedPlatoon && !this.selectedGroup && name == '' ) {
        
          
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //     },
  //     error: (err) => {
  //       alert('Error');
  //     },
  //   });
  //   // this.getAllProducts()
  // }

  async getSearchItems(name: any,fullCode:any,type:any) {
    
    let commodity=this.itemForm.getRawValue().commodityId
    console.log("commodityRow:",commodity);    
    let grade=this.itemForm.getRawValue().gradeId
    console.log("gradeRow:",grade);
    let platoon=this.itemForm.getRawValue().platoonId
    console.log("platoonRow:",platoon);
    let group=this.itemForm.getRawValue().groupId
    console.log("groupRow:",group);
    let unit=this.itemForm.getRawValue().unitId
    console.log("unitRow:",unit);

   this.api.getSearchItem(name, fullCode,type, commodity, grade, platoon, group, unit).subscribe({
      next: (res) => {
        console.log("search:",res);
        
        this.dataSource = res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
console.log("eroorr",err)    
  }
    })
}

  async getSearchItemsWithprint(name: any) {
    if (name) {
      this.api.getItem().subscribe({
        next: (res) => {
          //enter itemName
          if (!this.selectedGroup && name && !this.selectedUnit) {
            console.log('filter name id: ', this.selectedGroup, 'name: ', name);

            // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
            this.dataSource = res.filter((res: any) =>
              res.name.toLowerCase().includes(name.toLowerCase())
            );
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          //enter selectedGroup
          if (this.selectedGroup && name == '' && !this.selectedUnit) {
            console.log('selectedGroup:', this.selectedGroup);

            this.dataSource = res.filter(
              (res: any) => res.groupId == this.selectedGroup.id
            );
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          //enter selectedUnit
          if (!this.selectedGroup && name == '' && this.selectedUnit) {
            console.log('selectedUnit: ', this.selectedUnit, 'name: ', name);

            this.dataSource = res.filter(
              (res: any) => res.unitId == this.selectedUnit.id
            );
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          //enter selectedUnit+selectedGroup
          if (this.selectedUnit && name == '' && this.selectedGroup) {
            console.log(
              'filter Unit, Group: ',
              this.selectedUnit,
              this.selectedGroup
            );

            this.dataSource = res.filter(
              (res: any) =>
                res.unitId == this.selectedUnit.id &&
                res.groupId == this.selectedGroup.id
            );
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          //enter selectedGroup+item
          else if (this.selectedGroup && name && !this.selectedUnit) {
            console.log(
              'selectedGroup ,name: ',
              this.selectedGroup,
              'name: ',
              name
            );

            // this.dataSource = res.filter((res: any)=> res.name==name!)
            this.dataSource = res.filter(
              (res: any) =>
                res.groupId == this.selectedGroup.id &&
                res.name.toLowerCase().includes(name.toLowerCase())
            );
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          //enter selectedUnit+item
          else if (this.selectedUnit && name && !this.selectedGroup) {
            console.log(
              'selectedUnit, name: ',
              this.selectedUnit,
              'name: ',
              name
            );

            // this.dataSource = res.filter((res: any)=> res.name==name!)
            this.dataSource = res.filter(
              (res: any) =>
                res.unitId == this.selectedUnit.id &&
                res.name.toLowerCase().includes(name.toLowerCase())
            );
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          //enter all
          else if (this.selectedUnit && this.selectedGroup && name) {
          

            // this.dataSource = res.filter((res: any)=> res.name==name!)
            this.dataSource = res.filter(
              (res: any) =>
                res.unitId == this.selectedUnit.id &&
                res.groupId == this.selectedGroup.id! &&
                res.name.toLowerCase().includes(name.toLowerCase())
            );
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          //enter itemName
          else if (!this.selectedGroup && name == '' && !this.selectedUnit) {
            console.log(
              'filter name mmmm id: ',
              this.selectedGroup,
              'name: ',
              name
            );
            // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
            // this.dataSource = res.filter((res: any)=> res.name.toLowerCase().includes(name.toLowerCase()))
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          this.reportData = this.dataSource;
          window.localStorage.setItem(
            'reportData',
            JSON.stringify(this.reportData)
          );
          window.localStorage.setItem(
            'reportName',
            JSON.stringify(this.reportName)
          );

          this.router.navigate(['/report']);
        },
        error: (err) => {
          alert('Error');
        },
      });
    } else {
      this.getAllItems();
      // this.getAllProducts()
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  printReport() {
    // case print in report component

    this.router.navigate(['/report']);

    // case print in current component

    // let header: any = document.getElementById('header');
    // let paginator: any = document.getElementById('paginator');
    // let action1: any = document.getElementById('action1');
    // let action2: any = document.querySelectorAll('action2');
    // console.log(action2);
    // let button1: any = document.querySelectorAll('#button1');
    // console.log(button1);
    // let button2: any = document.getElementById('button2');
    // let button: any = document.getElementsByClassName('mdc-icon-button');
    // console.log(button);
    // let reportFooter: any = document.getElementById('reportFooter');
    // let date: any = document.getElementById('date');
    // header.style.display = 'grid';
    // // paginator.style.display = 'none';
    // action1.style.display = 'none';
    // // button1.style.display = 'none';
    // // button2.style.display = 'none';
    // for (let index = 0; index < button.length; index++) {
    //   let element = button[index];

    //   element.hidden = true;
    // }
    // // reportFooter.style.display = 'block';
    // // date.style.display = 'block';
    // let printContent: any = document.getElementById('content')?.innerHTML;
    // let originalContent: any = document.body.innerHTML;
    // document.body.innerHTML = printContent;
    // // console.log(document.body.children);
    // document.body.style.cssText =
    //   'direction:rtl;-webkit-print-color-adjust:exact;';
    // window.print();
    // document.body.innerHTML = originalContent;
    // location.reload();
  }
}
