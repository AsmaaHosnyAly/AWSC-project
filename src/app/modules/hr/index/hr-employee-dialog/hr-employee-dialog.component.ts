
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}
export class disciplinary {
  constructor(public id: number, public name: string, public code: string) { }
}





@Component({
  selector: 'app-hr-employee-dialog',
  templateUrl: './hr-employee-dialog.component.html',
  styleUrls: ['./hr-employee-dialog.component.css']
})

export class HrEmployeeDialogComponent implements OnInit {
  groupForm !: FormGroup;
  actionBtn: string = "Save";
  jobTitleName: any;
  positionName: any;
  hiringTypeName: any;
  workPlaceName: any;
  specializationName: any;
  departmentName: any;
  financialDegreeName: any;
  severanceReasonName: any;
  fiscalYearsList: any;
  userIdFromStorage: any;
  employeesList: Employee[] = [];
  emploeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;
  formcontrol = new FormControl('');
  jobTitleNameList: any;
  positionNameList: any;
  workPlaceNameList: any;
  severanceReasonNameList: any;
  specializationNameList: any;
  hiringTypeNameList: any;
  financialDegreeNameList: any;
  qualificationNameList: any;
  qualificationLevelNameList: any;
  cityStateNameList:any;
  millitryStateNameList:any;

  disciplinarysList: disciplinary[] = [];
  disciplinaryCtrl: FormControl;
  filtereddisciplinary: Observable<disciplinary[]>;
  selecteddisciplinary: disciplinary | undefined;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrEmployeeDialogComponent>,
    private toastr: ToastrService) {

    this.emploeeCtrl = new FormControl();
    this.filteredEmployee = this.emploeeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmployees(value))
    );


    this.disciplinaryCtrl = new FormControl();
    this.filtereddisciplinary = this.disciplinaryCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterdisciplinarys(value))
    );
  }

  ngOnInit(): void {
    this.getEmployees();
    this.getHrEmployee();
    this.getjobTitleName();
    this.getpositionName();
    this.getworkPlaceName();
    this.getseveranceReasonName();
    this.getspecializationName();
    this.gethiringTypeName();
    this.getfinancialDegreeName();
    this.getqualificationName();
    this.getqualificationLevelName();
    this.getcityStateName();
    this.getmillitryStateName();


    this.groupForm = this.formBuilder.group({
      code: ['',],
      name: ['',],
      national_Code: ['',],
      birth_Date: ['', Validators.required],
      gender: [''],
      address: [''],
      workingStateDate: ['', Validators.required],
      hiringDate: ['', Validators.required],
      financialDegreeDate: ['', Validators.required],
      qualificationDate: ['', Validators.required],
      qualificationId: ['', Validators.required],
      qualificationLevelId: ['', Validators.required],
      specializationId: ['', Validators.required],
      jobTitleId: ['', Validators.required],
      positionId: ['', Validators.required],
      millitryStateId: ['', Validators.required],//////////
      hiringTypeId: ['', Validators.required],
      financialDegreeId: ['', Validators.required],
      cityStateId: ['', Validators.required],/////////////
      workPlaceId: ['', Validators.required],
      departmentId: ['', Validators.required],
      severanceReasonId: ['', Validators.required],
      maritalState: ['',],
      transactionUserId: ['', Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current compone();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      this.actionBtn = "Update";
      this.groupForm.controls['code'].setValue(this.editData.code);
      this.groupForm.controls['name'].setValue(this.editData.name);

      this.groupForm.controls['national_Code'].setValue(this.editData.national_Code);
      this.groupForm.controls['birth_Date'].setValue(this.editData.birth_Date);
      this.groupForm.controls['gender'].setValue(this.editData.gender);
      this.groupForm.controls['address'].setValue(this.editData.address);

      this.groupForm.controls['jobTitleName'].setValue(this.editData.jobTitleName);
      this.groupForm.controls['jobTitleId'].setValue(this.editData.jobTitleId);

      this.groupForm.controls['positionName'].setValue(this.editData.positionName);
      this.groupForm.controls['positionId'].setValue(this.editData.positionId);



      this.groupForm.controls['hiringTypeName'].setValue(this.editData.hiringTypeName);
      this.groupForm.controls['hiringTypeId'].setValue(this.editData.hiringTypeId);

      this.groupForm.controls['workPlaceName'].setValue(this.editData.workPlaceName);
      this.groupForm.controls['workPlaceId'].setValue(this.editData.workPlaceId);

      this.groupForm.controls['hiringTypeName'].setValue(this.editData.hiringTypeName);
      this.groupForm.controls['hiringTypeId'].setValue(this.editData.hiringTypeId);

      this.groupForm.controls['specializationName'].setValue(this.editData.specializationName);
      this.groupForm.controls['specializationId'].setValue(this.editData.specializationId);



      this.groupForm.controls['departmentName'].setValue(this.editData.departmentName);
      this.groupForm.controls['departmentId'].setValue(this.editData.departmentId);

      this.groupForm.controls['financialDegreeName'].setValue(this.editData.financialDegreeName);
      this.groupForm.controls['financialDegreeId'].setValue(this.editData.financialDegreeId);

      this.groupForm.controls['severanceReasonName'].setValue(this.editData.severanceReasonName);
      this.groupForm.controls['severanceReasonId'].setValue(this.editData.severanceReasonId);




      this.groupForm.controls['workingStateDate'].setValue(this.editData.workingStateDate);
      this.groupForm.controls['hiringDate'].setValue(this.editData.hiringDate);
      this.groupForm.controls['financialDegreeDate'].setValue(this.editData.financialDegreeDate);
      this.groupForm.controls['qualificationDate'].setValue(this.editData.qualificationDate);
      this.groupForm.controls['qualificationId'].setValue(this.editData.qualificationId);
      this.groupForm.controls['qualificationLevelId'].setValue(this.editData.qualificationLevelId);
      this.groupForm.controls['specializationId'].setValue(this.editData.specializationId);
      this.groupForm.controls['jobTitleId'].setValue(this.editData.jobTitleId);
      this.groupForm.controls['positionId'].setValue(this.editData.positionId);
      this.groupForm.controls['millitryStateId'].setValue(this.editData.millitryStateId);
      this.groupForm.controls['hiringTypeId'].setValue(this.editData.hiringTypeId);
      this.groupForm.controls['financialDegreeId'].setValue(this.editData.financialDegreeId);
      this.groupForm.controls['cityStateId'].setValue(this.editData.cityStateId);
      this.groupForm.controls['workPlaceId'].setValue(this.editData.workPlaceId);
      this.groupForm.controls['departmentId'].setValue(this.editData.departmentId);
      this.groupForm.controls['qualificationLevelName'].setValue(this.editData.qualificationLevelName);
      this.groupForm.controls['qualificationName'].setValue(this.editData.qualificationName);
      this.groupForm.controls['maritalState'].setValue(this.editData.maritalState);


      this.userIdFromStorage = localStorage.getItem('transactionUserId');

      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }
  }

  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log("employee selected: ", employee);
    this.selectedEmployee = employee;
    this.groupForm.patchValue({ employeeId: employee.id });
    console.log("employee in form: ", this.groupForm.getRawValue().employeeId);
  }
  private _filterEmployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter(employee =>
      employee.name.toLowerCase().includes(filterValue) || employee.code.toLowerCase().includes(filterValue)
    );
  }
  openAutoEmployee() {
    this.emploeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.emploeeCtrl.updateValueAndValidity();
  }


  displaydisciplinaryName(disciplinary: any): string {
    return disciplinary && disciplinary.name ? disciplinary.name : '';
  }
  disciplinarySelected(event: MatAutocompleteSelectedEvent): void {
    const disciplinary = event.option.value as disciplinary;
    console.log("disciplinary selected: ", disciplinary);
    this.selecteddisciplinary = disciplinary;
    this.groupForm.patchValue({ disciplinaryId: disciplinary.id });
    console.log("disciplinary in form: ", this.groupForm.getRawValue().disciplinaryId);
  }
  private _filterdisciplinarys(value: string): disciplinary[] {
    const filterValue = value;
    return this.disciplinarysList.filter(disciplinary =>
      disciplinary.name.toLowerCase().includes(filterValue) || disciplinary.code.toLowerCase().includes(filterValue)
    );
  }
  openAutodisciplinary() {
    this.disciplinaryCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.disciplinaryCtrl.updateValueAndValidity();
  }
  async addEmployee() {
    if (!this.editData) {
      this.groupForm.removeControl('id')

      this.userIdFromStorage = localStorage.getItem('transactionUserId');
      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
      if (this.groupForm.getRawValue().jobTitleId) {
        this.jobTitleName = await this.getjobtitleByID(this.groupForm.getRawValue().jobTitleId);
        this.groupForm.controls['jobTitleName'].setValue(this.jobTitleName);

      }

      if (this.groupForm.getRawValue().positionId) {
        this.positionName = await this.getpositionByID(this.groupForm.getRawValue().positionId);
        this.groupForm.controls['positionName'].setValue(this.positionName);

      }


      // this.jobTitleName = await this.getjobtitleByID(this.groupForm.getRawValue().employeeId);
      // this.positionName = await this.getpositionByID(this.groupForm.getRawValue().disciplinaryId);
      // this.jobTitleName = await this.getjobtitleByID(this.groupForm.getRawValue().employeeId);
      // this.positionName = await this.getpositionByID(this.groupForm.getRawValue().disciplinaryId);
      // this.jobTitleName = await this.getjobtitleByID(this.groupForm.getRawValue().employeeId);
      // this.positionName = await this.getpositionByID(this.groupForm.getRawValue().disciplinaryId);



      console.log('form', this.groupForm.value)
      console.log('jobtitle', this.groupForm.getRawValue().jobTitleId)

      // if (this.groupForm.valid) {
        this.api.postHrEmployee(this.groupForm.value)
          .subscribe({
            next: (res) => {
              console.log("add HiringType res: ", res);

              this.toastrSuccess();
              this.groupForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("حدث خطأ أثناء إضافة نوع التعيين");
              console.log("post HiringType with api err: ", err)
            }
          })
      // }

    }
    else {
      this.updateDisciplinary()
    }
  }

  async updateDisciplinary() {
    console.log("update Disciplinary last values, id: ", this.groupForm.value)
    this.jobTitleName = await this.getjobtitleByID(this.groupForm.getRawValue().jobTitleId);
    this.groupForm.controls['jobTitleName'].setValue(this.jobTitleName);
    this.positionName = await this.getpositionByID(this.groupForm.getRawValue().disciplinaryId);
    this.groupForm.controls['positionName'].setValue(this.positionName);
    this.api.putHrEmployee(this.groupForm.value)
      .subscribe({
        next: (res) => {
          alert("تم تحديث انواع التعيين بنجاح");
          this.toastrSuccess();
          this.groupForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل انواع التعيين !!")
        }
      })
  }


  getjobTitleName() {
    this.api.getHrJobTitle()
      .subscribe({
        next: (res) => {
          this.jobTitleNameList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {


        }
      })
  }

  getpositionName() {
    this.api.getHrPosition()
      .subscribe({
        next: (res) => {
          this.positionNameList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getworkPlaceName() {
    this.api.getHrWorkPlace()
      .subscribe({
        next: (res) => {

          this.workPlaceNameList = res;
          // console.log("store res: ", this.storeList);

        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }


  getseveranceReasonName() {
    this.api.getSeveranceReason()
      .subscribe({
        next: (res) => {
          this.severanceReasonNameList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getspecializationName() {
    this.api.getHrspecialization()
      .subscribe({
        next: (res) => {
          this.specializationNameList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }


  gethiringTypeName() {
    this.api.getHrHiringType()
      .subscribe({
        next: (res) => {
          this.hiringTypeNameList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }
  getfinancialDegreeName() {
    this.api.getHrFinancialDegree()
      .subscribe({
        next: (res) => {
          this.financialDegreeNameList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getqualificationName() {
    this.api.getQualification()
      .subscribe({
        next: (res) => {
          this.qualificationNameList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getqualificationLevelName() {
    this.api.getQualificationLevel()
      .subscribe({
        next: (res) => {
          this.qualificationLevelNameList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }
  getcityStateName(){
    this.api.getHrCityState()
    .subscribe({
      next: (res) => {
        this.cityStateNameList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      }
    })
  }

  getmillitryStateName(){
    this.api.getMillitryState()
    .subscribe({
      next: (res) => {
        this.millitryStateNameList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      }
    })
  }

  getEmployees() {
    this.api.getEmployee()
      .subscribe({
        next: (res) => {
          this.employeesList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }
  getHrEmployee() {
    this.api.getHrEmployee()
      .subscribe({
        next: (res) => {
          this.disciplinarysList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }
  getjobtitleByID(id: any) {
    console.log("row jobtitle id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/HrJobTitle/get/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getpositionByID(id: any) {
    console.log("DISPLINARY id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/HrPosition/get/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}


