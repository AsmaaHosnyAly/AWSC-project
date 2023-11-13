import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl, EmailValidator } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
export class Unit {
  constructor(public id: number, public name: string) { }
}

export class Commodity {
  constructor(public id: number, public name: string, public code: any) { }
}

export class Grade {
  constructor(public id: number, public name: string, public code: any, public commodityId: number) { }
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
  loading :boolean=false;
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
  existingNames: string[] = [];
  
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private readonly route: ActivatedRoute,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<STRItem1DialogComponent>,
    private toastr: ToastrService) {

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
    this.getExistingNames(); // Fetch existing names
    this.itemForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      fullCode: [''],
      name: ['', Validators.required],
      commodityId: ['', Validators.required],
      commodityName: [''],
      commoditycode: [''],
      gradeId: ['', Validators.required],
      gradeName: [''],
      gradecode: [''],
      platoonId: ['', Validators.required],
      platoonName: [''],
      platooncode: [''],
      groupId: ['', Validators.required],
      groupName: [''],
      groupcode: [''],
      unitId: ['', Validators.required],
      unitName: [''],
      type: ['عهدة'],
      isActive: [true],      
      no: [''],
      id: [''],
    });

    this.api.getAllUnitsi().subscribe((units) => {
      this.units = units;
    });

    this.getAllCommoditiesi();

    this.getAllGradesi();

    this.getAllPlatoonsi();
    this.api.getAllGroupsi().subscribe((groups) => {
      this.groups = groups;
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addItem();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      this.actionBtn = "تعديل";
      this.getItemData = this.editData;
      this.itemForm.controls['transactionUserId'].setValue(this.transactionUserId);
      this.itemForm.controls['fullCode'].setValue(this.editData.fullCode);
      this.itemForm.controls['type'].setValue(this.editData.type);
      this.itemForm.controls['isActive'].setValue(this.editData.isActive);
      this.itemForm.controls['no'].setValue(this.editData.no);     

      this.itemForm.controls['name'].setValue(this.editData.name);
      this.itemForm.controls['unitId'].setValue(this.editData.unitId);
      this.itemForm.controls['unitName'].setValue(this.editData.unitName);
      this.itemForm.controls['commodityId'].setValue(this.editData.commodityId);
      this.itemForm.controls['commodityName'].setValue(this.editData.commodityName);
      this.itemForm.controls['commoditycode'].setValue(this.editData.commoditycode);
      this.itemForm.controls['gradeId'].setValue(this.editData.gradeId);
      this.itemForm.controls['gradeName'].setValue(this.editData.gradeName);
      this.itemForm.controls['gradecode'].setValue(this.editData.gradecode);
      this.itemForm.controls['platoonId'].setValue(this.editData.platoonId);
      this.itemForm.controls['platoonName'].setValue(this.editData.platoonName);
      this.itemForm.controls['platooncode'].setValue(this.editData.platooncode);
      this.itemForm.controls['groupId'].setValue(this.editData.groupId);
      this.itemForm.controls['groupName'].setValue(this.editData.gradeName);
      this.itemForm.controls['groupcode'].setValue(this.editData.groupcode);
      this.itemForm.addControl('id', new FormControl('', Validators.required));
      this.itemForm.controls['id'].setValue(this.editData.id);
    }
  }


  displayUnitName(unit: any): string {
    return unit ? unit.name && unit.name != null ? unit.name : '-' : '';

  }

  displayCommodityName(commodity: any): string {
    return commodity ? commodity.name && commodity.name != null ? commodity.name : '-' : '';

  }

  displayGradeName(grade: any): string {
    return grade ? grade.name && grade.name != null ? grade.name : '-' : '';
  }

  displayPlatoonName(platoon: any): string {
    return platoon ? platoon.name && platoon.name != null ? platoon.name : '-' : '';
  }

  displayGroupName(group: any): string {
    return group ? group.name && group.name != null ? group.name : '-' : '';
  }

  unitSelected(event: MatAutocompleteSelectedEvent): void {
    const unit = event.option.value as Unit;
    this.selectedUnit = unit;
    this.itemForm.patchValue({ unitId: unit.id });
    this.itemForm.patchValue({ unitName: unit.name });
  }
  getAllPlatoonsi() {
    this.loading = true;
    this.api.getAllPlatoonsi().subscribe({
      next: (res) => {
        this.loading = false;
        this.platoons= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getAllCommoditiesi() {
    this.loading = true;
    this.api.getAllCommoditiesi().subscribe({
      next: (res) => {
        this.loading = false;
        this.commodities= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getAllGradesi() {
    this.loading = true;
    this.api.getAllGradesi().subscribe({
      next: (res) => {
        this.loading = false;
        this.grades= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getAllGroupsi() {
    this.loading = true;
    this.api.getAllGroupsi().subscribe({
      next: (res) => {
        this.loading = false;
        this.grades= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
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
      commodity.name || commodity.code ? commodity.name.toLowerCase().includes(filterValue) ||
      commodity.code.toString().toLowerCase().includes(filterValue): '-'
    );
  }

  private _filterGrades(value: string): Grade[] {
    const filterValue = value
    return this.grades.filter(
      grade =>
      (grade.name || grade.code ? grade.name.toLowerCase().includes(filterValue) ||
      grade.code.toString().toLowerCase().includes(filterValue) : '-') &&
        grade.commodityId === this.selectedCommodity?.id
    );
  }

  private _filterPlatoons(value: string): Platoon[] {
    const filterValue = value
    return this.platoons.filter(
      platoon =>
      (platoon.name || platoon.code ? platoon.name.toLowerCase().includes(filterValue) ||
      platoon.code.toString().toLowerCase().includes(filterValue) : '-') &&
        platoon.gradeId === this.selectedGrade?.id
    );
  }

  private _filterGroups(value: string): Group[] {
    const filterValue = value
    return this.groups.filter(
      group =>
      
      (group.name || group.code ? group.name.toLowerCase().includes(filterValue) ||
      group.code.toString().toLowerCase().includes(filterValue) : '-') &&
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
    console.log('groupId: ', this.selectedGroup?.id);
    
    this.api.getItemNo(this.selectedGroup?.id).subscribe({
      next: (res) => {
        if (this.editData) {
          if (this.editData.groupId == this.selectedGroup?.id) {
            console.log(' edit data with matched choices:');

            this.itemForm.controls['no'].setValue(this.editData.no);
          } else {
            console.log(' edit data without matched choices:');

            this.itemForm.controls['no'].setValue(res);
          }
        } else {
          console.log('without editData:');
          this.itemForm.controls['no'].setValue(res);
        }
      },
      error: (err) => {
        console.log('get no. err: ', err);
      },
    });
  }

  getExistingNames() {
    this.api.getItem().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }

  addItem() {
    this.fullCode =
    this.itemForm.value.commoditycode.toString()+
    this.itemForm.value.gradecode.toString() +
    this.itemForm.value.platooncode +
    this.itemForm.value.groupcode +
    this.itemForm.value.no;
    this.itemForm.controls['fullCode'].setValue(this.fullCode);
    // this.itemForm.controls['no'].setValue(this.No);
    console.log('add: ', this.itemForm.value);
    if (!this.editData) {
      const enteredName = this.itemForm.get('name')?.value;

      if (this.existingNames.includes(enteredName)) {
        alert('هذا الاسم موجود من قبل، قم بتغييره');
        return;
      }

      this.itemForm.removeControl('id')
      // this.itemForm.controls['commodityId'].setValue(this.selectedOption.id);
      // this.itemForm.controls['gradeId'].setValue(this.selectedOption.id);
      this.itemForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("add: ", this.itemForm.value);

      if (this.itemForm.valid) {
        this.api.postItems(this.itemForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              this.itemForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              this.toastrErrorSave();

            }
          })
      }
    } else {
      this.updateItem()
    }
  }

  updateItem() {
    console.log("update data:",this.itemForm.value);
    this.api.putItem(this.itemForm.value)
    
      .subscribe({
        next: (res) => {
  

          this.toastrEdit();
          this.itemForm.reset();
          console.log("update data rest:", this.itemForm.value);
          this.dialogRef.close('update');
        },
        error: () => {
          this.toastrErrorEdit();

        }
      })
  }
  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEdit(): void {
    this.toastr.success('تم التحديث بنجاح');
  }

  toastrErrorSave(): void {
    this.toastr.error('!خطأ عند حفظ البيانات');
  }

  toastrErrorEdit(): void {
    this.toastr.error('!خطأ عند تحديث البيانات');
  }
}
