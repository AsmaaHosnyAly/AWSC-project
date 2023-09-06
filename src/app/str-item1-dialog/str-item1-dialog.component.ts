import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl, EmailValidator } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export class Unit {
  constructor(public id: number, public name: string) { }
}

export class Commodity {
  constructor(public id: number, public name: string, public code: string) { }
}

export class Grade {
  constructor(public id: number, public name: string, public code: string, public commodityId: number) { }
}

export class Platoon {
  constructor(public id: number, public name: string, public code: string, public gradeId: number) { }
}

export class Group {
  constructor(public id: number, public name: string, public code: string, public platoonId: number) { }
}
@Component({
  selector: 'app-str-item1-dialog',
  templateUrl: './str-item1-dialog.component.html',
  styleUrls: ['./str-item1-dialog.component.css'],
})
export class STRItem1DialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  unitCtrl: FormControl;
  filteredUnits: Observable<Unit[]>;
  units: Unit[] = [];
  selectedUnit: Unit | undefined;
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  selectedCommodity: Commodity | undefined;
  commodities: Commodity[] = [];
  gradeCtrl: FormControl;
  filteredGrades: Observable<Grade[]>;
  selectedGrade: Grade | undefined;
  grades: Grade[] = [];
  platoonCtrl: FormControl;
  filteredPlatoons: Observable<Platoon[]>;
  platoons: Platoon[] = [];
  selectedPlatoon: Platoon | undefined;
  groupCtrl: FormControl;
  filteredGroups: Observable<Group[]>;
  groups: Group[] = [];
  selectedGroup: Group | undefined;
  formcontrol = new FormControl('');
  itemForm !: FormGroup;
  getItemData: any;
  actionBtn: string = "حفظ"
  Code:any;
  No:any;
  gradeName: any;
  fullCode: any;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<STRItem1DialogComponent>) {

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
  }


  ngOnInit(): void {

    this.itemForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      fullCode: [''],
      no: [''],
      name: ['', Validators.required],
      commodityId: ['', Validators.required],
      commodityName: [''],
      commodityCode: [''],
      gradeId: ['', Validators.required],
      gradeName: [''],
      gradeCode: [''],
      platoonId: ['', Validators.required],
      platoonName: [''],
      platoonCode: [''],
      groupId: ['', Validators.required],
      groupName: [''],
      groupCode: [''],
      unitId: ['', Validators.required],
      unitName: [''],
      unitCode: [''],
      id: [''],
    });

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

    if (this.editData) {
      this.actionBtn = "تعديل";
      this.getItemData = this.editData;
      this.itemForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.itemForm.controls['fullCode'].setValue(this.editData.fullCode);
      this.itemForm.controls['type'].setValue(this.editData.type);
      this.itemForm.controls['isActive'].setValue(this.editData.isActive);
      this.itemForm.controls['no'].setValue(this.editData.no);
      this.itemForm.controls['name'].setValue(this.editData.name);
      this.itemForm.controls['unitId'].setValue(this.editData.commodityId);
      this.itemForm.controls['unitName'].setValue(this.editData.commodityName);
      this.itemForm.controls['unitCode'].setValue(this.editData.commodityName);      
      this.itemForm.controls['commodityId'].setValue(this.editData.commodityId);
      this.itemForm.controls['commodityName'].setValue(this.editData.commodityName);
      this.itemForm.controls['commodityCode'].setValue(this.editData.commodityName);
      this.itemForm.controls['gradeId'].setValue(this.editData.gradeId);
      this.itemForm.controls['gradeName'].setValue(this.editData.gradeName);
      this.itemForm.controls['gradeCode'].setValue(this.editData.commodityName);
      this.itemForm.controls['platoonId'].setValue(this.editData.platoonId);
      this.itemForm.controls['platoonName'].setValue(this.editData.gradeName);
      this.itemForm.controls['platoonCode'].setValue(this.editData.commodityName);
      this.itemForm.controls['groupId'].setValue(this.editData.platoonId);
      this.itemForm.controls['groupName'].setValue(this.editData.gradeName);
      this.itemForm.controls['groupCode'].setValue(this.editData.commodityName);
      this.itemForm.addControl('id', new FormControl('', Validators.required));
      this.itemForm.controls['id'].setValue(this.editData.id);
    }
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
    this.itemForm.patchValue({ commodityCode: commodity.code });
    this.gradeCtrl.setValue('');
  }

  gradeSelected(event: MatAutocompleteSelectedEvent): void {
    const grade = event.option.value as Grade;
    this.selectedGrade = grade;
    this.itemForm.patchValue({ gradeId: grade.id });
    this.itemForm.patchValue({ gradeName: grade.name });
    this.itemForm.patchValue({ gradeCode: grade.code });
    this.platoonCtrl.setValue('');
  }

  platoonSelected(event: MatAutocompleteSelectedEvent): void {
    const platoon = event.option.value as Platoon;
    this.selectedPlatoon = platoon;
    this.itemForm.patchValue({ platoonId: platoon.id });
    this.itemForm.patchValue({ platoonName: platoon.name });
    this.itemForm.patchValue({ platoonCode: platoon.code });
  }

  groupSelected(event: MatAutocompleteSelectedEvent): void {
    const group = event.option.value as Group;
    this.selectedGroup = group;
    this.itemForm.patchValue({ groupId: group.id });
    this.itemForm.patchValue({ groupName: group.name });
    this.itemForm.patchValue({ groupCode: group.code });
    this.getNoByGroupId();
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
        (grade.name.toLowerCase().includes(filterValue) || grade.code.toLowerCase().includes(filterValue)) &&
        grade.commodityId === this.selectedCommodity?.id
    );
  }

  private _filterPlatoons(value: string): Platoon[] {
    const filterValue = value
    return this.platoons.filter(
      platoon =>
        (platoon.name.toLowerCase().includes(filterValue) || platoon.code.toLowerCase().includes(filterValue)) &&
        platoon.gradeId === this.selectedGrade?.id
    );
  }

  private _filterGroups(value: string): Group[] {
    const filterValue = value
    return this.groups.filter(
      group =>
        (group.name.toLowerCase().includes(filterValue) || group.code.toLowerCase().includes(filterValue)) &&
        group.platoonId === this.selectedPlatoon?.id
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

  getNoByGroupId() {
    this.api.getItemNo(this.selectedGroup?.id).subscribe({
      next: (res) => {

        this.No = res;
        console.log('number: ', this.No);
      },
      error: (err) => {
        console.log('get no. err: ', err);
      },
    });
  }

  addGroup() {
    this.fullCode =
    this.itemForm.value.commodityCode.toString()+
    this.itemForm.value.gradeCode.toString() +
    this.itemForm.value.platoonCode +
    this.itemForm.value.groupCode +
    this.No;
    this.itemForm.controls['fullCode'].setValue(this.fullCode);
    this.itemForm.controls['no'].setValue(this.No);
    console.log('add: ', this.itemForm.value);
    this.itemForm.controls['transactionUserId'].setValue(
      this.transactionUserId
    );
    if (!this.editData) {
      this.itemForm.removeControl('id')
      // this.itemForm.controls['commodityId'].setValue(this.selectedOption.id);
      // this.itemForm.controls['gradeId'].setValue(this.selectedOption.id);
      this.itemForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("add: ", this.itemForm.value);

      if (this.itemForm.valid) {
        this.api.postItems(this.itemForm.value)
          .subscribe({
            next: (res) => {
              alert("تمت الاضافة بنجاح");
              this.itemForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("خطأ عند تحديث البيانات")
            }
          })
      }
    } else {
      this.updateGroup()
    }
  }

  updateGroup() {
    this.api.putItem(this.itemForm.value)
      .subscribe({
        next: (res) => {
          alert("تم التحديث بنجاح");
          this.itemForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ عند تحديث البيانات");
        }
      })
  }

}
