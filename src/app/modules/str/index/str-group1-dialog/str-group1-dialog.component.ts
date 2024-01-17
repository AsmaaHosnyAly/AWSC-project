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
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

export class Commodity {
  constructor(public id: number, public name: string, public code: any) { }
}

export class Grade {
  constructor(public id: number, public name: string, public code: any, public commodityId: number) { }
}

export class Platoon {
  constructor(public id: number, public name: string, public code: string, public commodityId: number, public gradeId: number) { }
}

@Component({
  selector: 'app-str-group1-dialog',
  templateUrl: './str-group1-dialog.component.html',
  styleUrls: ['./str-group1-dialog.component.css']
})
export class STRGroup1DialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  loading :boolean=false;
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  gradeCtrl: FormControl;
  filteredGrades: Observable<Grade[]>;
  grades: Grade[] = [];
  platoonCtrl: FormControl;
  filteredPlatoons: Observable<Commodity[]>;
  platoons: Platoon[] = [];
  selectedCommodity: Commodity | undefined;
  selectedGrade: Grade | undefined;
  selectedPlatoon: Platoon | undefined;
  formcontrol = new FormControl('');
  groupForm !: FormGroup;
  selectedOption: any;
  getGroupData: any;
  actionBtn: string = "حفظ"
  Code:any;
  dataSource!: MatTableDataSource<any>;
  existingNames: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  gradeName: any;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<STRGroup1DialogComponent>,
    private toastr: ToastrService) {

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
    this.getExistingNames(); // Fetch existing names
    this.groupForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      code: [''],
      name: ['', Validators.required],
      commodityId: ['', Validators.required],
      commodityName: [''],
      gradeId: ['', Validators.required],
      gradeName: [''],
      platoonId: ['', Validators.required],
      platoonName: [''],
      id: [''],
    });


    this.getAllCommodities();

    this.getAllGrades();

    this.api.getAllPlatoonsg().subscribe((platoons) => {
      this.platoons = platoons;
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addGroup();
      return false; // Prevent the default browser behavior
    }));

    if (this.editData) {
      this.actionBtn = "تعديل";
      this.getGroupData = this.editData;
      this.groupForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.groupForm.controls['code'].setValue(this.editData.code);
      this.groupForm.controls['name'].setValue(this.editData.name);
      this.groupForm.controls['commodityId'].setValue(this.editData.commodityId);
      this.groupForm.controls['commodityName'].setValue(this.editData.commodityName);
      this.groupForm.controls['gradeId'].setValue(this.editData.gradeId);
      this.groupForm.controls['gradeName'].setValue(this.editData.gradeName);
      this.groupForm.controls['platoonId'].setValue(this.editData.platoonId);
      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);
    }
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
  getAllCommodities() {
    this.loading = true;
    this.api.getAllCommodities().subscribe({
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
  getAllGrades() {
    this.loading = true;
    this.api.getAllGrades().subscribe({
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
  getAllPlatoonsg() {
    this.loading = true;
    this.api.getAllPlatoonsg().subscribe({
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
    this.getCodeByPlatoonId();
  }

  private _filterCommodities(value: string): Commodity[] {
    const filterValue = value
    return this.commodities.filter(
      commodity =>
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

  openAutoCommodity() {
    this.commodityCtrl.setValue(''); 
    this.commodityCtrl.updateValueAndValidity();
  }
  openAutoGrade() {
    this.gradeCtrl.setValue(''); 
    this.gradeCtrl.updateValueAndValidity();
  }
  openAutoPlatoon() {
    this.platoonCtrl.setValue(''); 
    this.platoonCtrl.updateValueAndValidity();
  }

  getCodeByPlatoonId() {
    this.api.getGroupCode(this.selectedPlatoon?.id).subscribe({
      next: (res) => {
        if (this.editData) {
          if (this.editData.platoonId == this.selectedPlatoon?.id) {
            console.log(' edit data with matched choices:');

            this.groupForm.controls['code'].setValue(this.editData.code);
          } else {
            console.log(' edit data without matched choices:');

            this.groupForm.controls['code'].setValue(res);
          }
        } else {
          console.log('without editData:');
          this.groupForm.controls['code'].setValue(res);
        }
      },
      error: (err) => {
        console.log('get code. err: ', err);
      },
    });
  }

  getExistingNames() {
    this.api.getGroups().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }

  addGroup() {
    // this.groupForm.controls['code'].setValue(this.Code);
    if (!this.editData) {
      const enteredName = this.groupForm.get('name')?.value;

      if (this.existingNames.includes(enteredName)) {
        alert('هذا الاسم موجود من قبل، قم بتغييره');
        return;
      }

      this.groupForm.removeControl('id')
      // this.groupForm.controls['commodityId'].setValue(this.selectedOption.id);
      // this.groupForm.controls['gradeId'].setValue(this.selectedOption.id);
      this.groupForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("add: ", this.groupForm.value);

      if (this.groupForm.valid) {
        this.api.postGroups(this.groupForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              this.groupForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              this.toastrErrorSave();
            }
          })
      }
    } else {
      this.updateGroup()
    }
  }

  updateGroup() {
    this.api.putGroups(this.groupForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEdit();
          this.groupForm.reset();
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
