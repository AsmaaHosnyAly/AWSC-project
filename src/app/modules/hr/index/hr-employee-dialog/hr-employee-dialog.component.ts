
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
export class jobTitle {
  constructor(public id: number, public name: string, public code: string) { }
}
export class position {
  constructor(public id: number, public name: string) { }
}
export class hiringType {
  constructor(public id: number, public name: string) { }
}

export class qualification {
  constructor(public id: number, public name: string) { }
}

export class qualificationLevel {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-hr-employee-dialog',
  templateUrl: './hr-employee-dialog.component.html',
  styleUrls: ['./hr-employee-dialog.component.css']
})

export class HrEmployeeDialogComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')
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
  departmentNameList:any;
  employeesList: Employee[] = [];
  emploeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;
  formcontrol = new FormControl('');
  // jobTitleNameList: any;
  // positionNameList: any;
  workPlaceNameList: any;
  severanceReasonNameList: any;
  specializationNameList: any;
  // hiringTypeNameList: any;
  financialDegreeNameList: any;
  // qualificationNameList: any;
  // qualificationLevelNameList: any;
  cityStateNameList: any;
  millitryStateNameList: any;

  jobTitlesList: jobTitle[] = [];
  jobTitleCtrl: FormControl;
  filteredjobTitle: Observable<jobTitle[]>;
  selectedjobTitle: jobTitle | undefined;


  positionsList: position[] = [];
  positionCtrl: FormControl;
  filteredposition: Observable<position[]>;
  selectedposition: position | undefined;





  hiringTypesList: hiringType[] = [];
  hiringTypeCtrl: FormControl;
  filteredhiringType: Observable<hiringType[]>;
  selectedhiringType: hiringType | undefined;


  qualificationsList: qualification[] = [];
  qualificationCtrl: FormControl;
  filteredqualification: Observable<qualification[]>;
  selectedqualification: qualification | undefined;


  qualificationLevelsList: qualificationLevel[] = [];
  qualificationLevelCtrl: FormControl;
  filteredqualificationLevel: Observable<qualificationLevel[]>;
  selectedqualificationLevel: qualificationLevel | undefined;


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

    this.jobTitleCtrl = new FormControl();
    this.filteredjobTitle = this.jobTitleCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterjobTitles(value))
    );
    this.positionCtrl = new FormControl();
    this.filteredposition = this.positionCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterpositions(value))
    );

    this.hiringTypeCtrl = new FormControl();
    this.filteredhiringType = this.hiringTypeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterhiringTypes(value))
    );

    this.qualificationCtrl = new FormControl();
    this.filteredqualification = this.qualificationCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterqualifications(value))
    );

    this.qualificationLevelCtrl = new FormControl();
    this.filteredqualificationLevel = this.qualificationLevelCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterqualificationLevels(value))
    );
 
  }

  ngOnInit(): void {
    this.getEmployees();
    // this.getHrEmployee();
    this.getjobTitle();
    this.getposition();
    this.getworkPlace();
    this.getseveranceReason();
    this.getspecialization();
    this.gethiringType();
    this.getfinancialDegree();
    this.getqualification();
    this.getqualificationLevel();
    this.getcityState();
    this.getmillitryState();
    this.getdepartement();


    this.groupForm = this.formBuilder.group({
      code: ['',Validators.required],
      name: ['',Validators.required],
      national_Code: ['',Validators.required],
      birth_Date: ['', Validators.required],
      gender: ['',Validators.required],
      address: ['',Validators.required],
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
      maritalState: ['',Validators.required],
      email:['',Validators.required,Validators.email],
      phone:['',Validators.required],
      transactionUserId: ['', Validators.required],
      updateUserName:['admin',Validators.required]
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current compone();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log("edit: ", this.editData);

      this.actionBtn = "Update";
      this.groupForm.controls['code'].setValue(this.editData.code);
      this.groupForm.controls['name'].setValue(this.editData.name);

      this.groupForm.controls['national_Code'].setValue(this.editData.national_Code);
      this.groupForm.controls['birth_Date'].setValue(this.editData.birth_Date);
      this.groupForm.controls['gender'].setValue(this.editData.gender);
      this.groupForm.controls['address'].setValue(this.editData.address);

      this.groupForm.controls['phone'].setValue(this.editData.phone);
      this.groupForm.controls['jobTitleId'].setValue(this.editData.jobTitleId);

      this.groupForm.controls['email'].setValue(this.editData.email);
      this.groupForm.controls['positionId'].setValue(this.editData.positionId);



      // this.groupForm.controls['hiringTypeName'].setValue(this.editData.hiringTypeName);
      this.groupForm.controls['hiringTypeId'].setValue(this.editData.hiringTypeId);

      // this.groupForm.controls['workPlaceName'].setValue(this.editData.workPlaceName);
      this.groupForm.controls['workPlaceId'].setValue(this.editData.workPlaceId);

      // this.groupForm.controls['hiringTypeName'].setValue(this.editData.hiringTypeName);
      this.groupForm.controls['hiringTypeId'].setValue(this.editData.hiringTypeId);

      // this.groupForm.controls['specializationName'].setValue(this.editData.specializationName);
      this.groupForm.controls['specializationId'].setValue(this.editData.specializationId);



      // this.groupForm.controls['departmentName'].setValue(this.editData.departmentName);
      this.groupForm.controls['departmentId'].setValue(this.editData.departmentId);

      // this.groupForm.controls['financialDegreeName'].setValue(this.editData.financialDegreeName);
      this.groupForm.controls['financialDegreeId'].setValue(this.editData.financialDegreeId);

      // this.groupForm.controls['severanceReasonName'].setValue(this.editData.severanceReasonName);
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
      // this.groupForm.controls['qualificationLevelName'].setValue(this.editData.qualificationLevelName);
      // this.groupForm.controls['qualificationName'].setValue(this.editData.qualificationName);
      this.groupForm.controls['maritalState'].setValue(this.editData.maritalState);


      // this.userIdFromStorage = localStorage.getItem('transactionUserId');

      // this.groupForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.groupForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

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
    this.groupForm.patchValue({ name: employee.name });
    console.log("employee in form: ", this.groupForm.getRawValue().name);
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

  displaypositionName(position: any): string {
    return position && position.name ? position.name : '';
  }
  positionSelected(event: MatAutocompleteSelectedEvent): void {
    const position = event.option.value as position;
    console.log("position selected: ", position);
    this.selectedposition = position;
    this.groupForm.patchValue({ positionId: position.id });
    console.log("position in form: ", this.groupForm.getRawValue().positionId);
  }
  private _filterpositions(value: string): position[] {
    const filterValue = value;
    return this.positionsList.filter(position =>
      position.name.toLowerCase().includes(filterValue) 
    );
  }
  openAutoposition() {
    this.positionCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.positionCtrl.updateValueAndValidity();
  }

  displayjobTitleName(jobTitle: any): string {
    return jobTitle && jobTitle.name ? jobTitle.name : '';
  }
  jobTitleSelected(event: MatAutocompleteSelectedEvent): void {
    const jobTitle = event.option.value as jobTitle;
    console.log("jobTitle selected: ", jobTitle);
    this.selectedjobTitle = jobTitle;
    this.groupForm.patchValue({ jobTitleId: jobTitle.id });
    console.log("jobTitle in form: ", this.groupForm.getRawValue().jobTitleId);
  }
  private _filterjobTitles(value: string): jobTitle[] {
    const filterValue = value;
    return this.jobTitlesList.filter(jobTitle =>
      jobTitle.name.toLowerCase().includes(filterValue) || jobTitle.code.toLowerCase().includes(filterValue)
    );
  }
  openAutojobTitle() {
    this.jobTitleCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.jobTitleCtrl.updateValueAndValidity();
  }


  displayhiringTypeName(hiringType: any): string {
    return hiringType && hiringType.name ? hiringType.name : '';
  }
  hiringTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const hiringType = event.option.value as hiringType;
    console.log("hiringType selected: ", hiringType);
    this.selectedhiringType = hiringType;
    this.groupForm.patchValue({ hiringTypeId: hiringType.id });
    console.log("hiringType in form: ", this.groupForm.getRawValue().hiringTypeId);
  }
  private _filterhiringTypes(value: string): hiringType[] {
    const filterValue = value;
    return this.hiringTypesList.filter(hiringType =>
      hiringType.name.toLowerCase().includes(filterValue)
    );
  }
  openAutohiringType() {
    this.hiringTypeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.hiringTypeCtrl.updateValueAndValidity();
  }



  displayqualificationName(qualification: any): string {
    return qualification && qualification.name ? qualification.name : '';
  }
  qualificationSelected(event: MatAutocompleteSelectedEvent): void {
    const qualification = event.option.value as qualification;
    console.log("qualification selected: ", qualification);
    this.selectedqualification = qualification;
    this.groupForm.patchValue({ qualificationId: qualification.id });
    console.log("qualification in form: ", this.groupForm.getRawValue().qualificationId);
  }
  private _filterqualifications(value: string): qualification[] {
    const filterValue = value;
    return this.qualificationsList.filter(qualification =>
      qualification.name.toLowerCase().includes(filterValue) 
    );
  }
  openAutoqualification() {
    this.qualificationCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.qualificationCtrl.updateValueAndValidity();
  }



  displayqualificationLevelName(qualificationLevel: any): string {
    return qualificationLevel && qualificationLevel.name ? qualificationLevel.name : '';
  }
  qualificationLevelSelected(event: MatAutocompleteSelectedEvent): void {
    const qualificationLevel = event.option.value as qualificationLevel;
    console.log("qualificationLevel selected: ", qualificationLevel);
    this.selectedqualificationLevel = qualificationLevel;
    this.groupForm.patchValue({ qualificationLevelId: qualificationLevel.id });
    console.log("qualificationLevel in form: ", this.groupForm.getRawValue().qualificationLevelId);
  }
  private _filterqualificationLevels(value: string): qualificationLevel[] {
    const filterValue = value;
    return this.qualificationLevelsList.filter(qualificationLevel =>
      qualificationLevel.name.toLowerCase().includes(filterValue) 
    );
  }
  openAutoqualificationLevel() {
    this.qualificationLevelCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.qualificationLevelCtrl.updateValueAndValidity();
  }


  async addEmployee() {
    if (!this.editData) {
      this.groupForm.removeControl('id')

      // this.userIdFromStorage = localStorage.getItem('transactionUserId');
      // // this.groupForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.groupForm.controls['transactionUserId'].setValue(this.transactionUserId);

 



      console.log('form in ts', this.groupForm.value)
      console.log('jobtitle', this.groupForm.getRawValue().jobTitleId)

      console.log("date json beore: ", this.groupForm.getRawValue().birth_Date);
      
      this.groupForm.controls['birth_Date'].setValue(this.groupForm.getRawValue().birth_Date);
      this.groupForm.controls['qualificationDate'].setValue(this.groupForm.getRawValue().qualificationDate.toISOString());
      this.groupForm.controls['hiringDate'].setValue(this.groupForm.getRawValue().hiringDate.toISOString());
      this.groupForm.controls['workingStateDate'].setValue(this.groupForm.getRawValue().workingStateDate.toISOString());
      this.groupForm.controls['financialDegreeDate'].setValue(this.groupForm.getRawValue().financialDegreeDate.toISOString());
      this.groupForm.controls['national_Code'].setValue(this.groupForm.getRawValue().national_Code.toString());
      this.groupForm.controls['code'].setValue(this.groupForm.getRawValue().code.toString());
      // this.groupForm.controls['email'].setValue(this.groupForm.getRawValue().email.toISOString());
      // this.groupForm.controls['phone'].setValue(this.groupForm.getRawValue().phone.toISOString());

      console.log('post form sent', this.groupForm.value);
    console.log("group form after post:",this.groupForm.valid)
      if (this.groupForm.valid) {
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
      }

    }
    else {
      this.updateDisciplinary()
    }
  }

  async updateDisciplinary() {
    console.log("update Disciplinary last values, id: ", this.groupForm.value)
  
    this.api.putHrEmployee(this.groupForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم تحديث انواع التعيين بنجاح");
          this.toastrEditSuccess();
          this.groupForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل انواع التعيين !!")
        }
      })
  }


  getjobTitle() {
    this.api.getHrJobTitle()
      .subscribe({
        next: (res) => {
          this.jobTitlesList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {


        }
      })
  }

  getposition() {
    this.api.getHrPosition()
      .subscribe({
        next: (res) => {
          this.positionsList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getworkPlace() {
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


  getseveranceReason() {
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

  getspecialization() {
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


  gethiringType() {
    this.api.getHrHiringType()
      .subscribe({
        next: (res) => {
          this.hiringTypesList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getfinancialDegree() {
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

  getqualification() {
    this.api.getQualification()
      .subscribe({
        next: (res) => {
          this.qualificationsList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getqualificationLevel() {
    this.api.getQualificationLevel()
      .subscribe({
        next: (res) => {
          this.qualificationLevelsList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getcityState() {
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

  getmillitryState() {
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

  getdepartement(){
    this.api.getDepartment()
    .subscribe({
      next: (res) => {
        this.departmentNameList = res;
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
  // getHrEmployee() {
  //   this.api.getHrEmployee()
  //     .subscribe({
  //       next: (res) => {
  //         this.disciplinarysList = res;
  //         // console.log("store res: ", this.storeList);
  //       },
  //       error: (err) => {
  //         // console.log("fetch store data err: ", err);
  //         // alert("خطا اثناء جلب المخازن !");
  //       }
  //     })
  // }


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
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
  toastrEditSuccess(): void {
    this.toastr.success("تم التعديل بنجاح");
  }
}