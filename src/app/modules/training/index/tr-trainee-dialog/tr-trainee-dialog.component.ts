import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

// export class Employee {
//   constructor(public id: number, public name: string) { }
// }
export class TrCoporteClient {
  constructor(public id: number, public name: string) { }
}
export class city {
  constructor(public id: number, public name: string) { }
}
export class cityState {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-tr-trainee-dialog',
  templateUrl: './tr-trainee-dialog.component.html',
  styleUrls: ['./tr-trainee-dialog.component.css']
})
export class TrTraineeDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');
  TrTraineeForm !: FormGroup;
  actionBtn: string = "حفظ";
  getTrInstructorData: any;

  // employeeCtrl: FormControl;
  // filteredEmployee: Observable<Employee[]>;
  // employeesList: Employee[] = [];
  // selectedEmployee: Employee | undefined;

  trCoporteClientCtrl: FormControl;
  filteredtrCoporteClient: Observable<TrCoporteClient[]>;
  trCoporteClientsList: TrCoporteClient[] = [];
  selectedTrCoporteClient: TrCoporteClient | undefined;



  cityCtrl: FormControl;
  filteredcity: Observable<city[]>;
  citysList: city[] = [];
  selectedcity: city | undefined;

  cityStateCtrl: FormControl;
  filteredcityState: Observable<cityState[]>;
  cityStatesList: cityState[] = [];
  selectedcityState: cityState | undefined;
  isReadOnlyPercentage = true;


  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<TrTraineeDialogComponent>) {

    // this.employeeCtrl = new FormControl();
    // this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterEmployee(value))
    // );

    this.trCoporteClientCtrl = new FormControl();
    this.filteredtrCoporteClient = this.trCoporteClientCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTrCoporteClient(value))
    );

    this.cityCtrl = new FormControl();
    this.filteredcity = this.cityCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtercity(value))
    );

    this.cityStateCtrl = new FormControl();
    this.filteredcityState = this.cityStateCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtercityState(value))
    );

  }
  ngOnInit(): void {
    this.TrTraineeForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      // employeeId: ['', Validators.required],
      corporationCLinetId: ['', Validators.required],
      cityStateId:[1,Validators.required],
      cityId:['',Validators.required],

      name:['',Validators.required],
      gender:['',Validators.required],
      address:['',Validators.required],
      email:['',Validators.required],
      phone:['',Validators.required],
      code:['',Validators.required],
      nationalId:['',Validators.required],

    });
    this.hrcity();
    this.hrcityState();
    this.trCoporteClient();
    // this.api.getHrEmployees().subscribe((employee) => {
    //   this.employeesList = employee;
    // });

    // this.api.getTrCoporteClient().subscribe((trCoporteClient) => {
    //   this.trCoporteClientsList = trCoporteClient;
    // });


    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addTrTrainee();
    
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.getTrInstructorData = this.editData;
      this.TrTraineeForm.controls['transactionUserId'].setValue(this.transactionUserId);
      // this.TrTraineeForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.TrTraineeForm.controls['corporationCLinetId'].setValue(this.editData.corporationCLinetId);



      this.TrTraineeForm.controls['name'].setValue(this.editData.name);
      this.TrTraineeForm.controls['code'].setValue(this.editData.code);
      this.TrTraineeForm.controls['gender'].setValue(this.editData.gender);
      this.TrTraineeForm.controls['address'].setValue(this.editData.address);
      this.TrTraineeForm.controls['phone'].setValue(this.editData.phone);
      this.TrTraineeForm.controls['email'].setValue(this.editData.email);
      this.TrTraineeForm.controls['cityId'].setValue(this.editData.cityId);
      this.TrTraineeForm.controls['nationalId'].setValue(this.editData.nationalId);
      this.TrTraineeForm.controls['cityStateId'].setValue(this.editData.cityStateId);
     


      this.TrTraineeForm.addControl('id', new FormControl('', Validators.required));
      this.TrTraineeForm.controls['id'].setValue(this.editData.id);
    }
  }

  addTrTrainee() {
    this.TrTraineeForm.controls['transactionUserId'].setValue(this.transactionUserId);
    console.log("TrTraineeForm value :", this.TrTraineeForm.value);


    if (!this.editData) {
      this.TrTraineeForm.removeControl('id')
      if (this.TrTraineeForm.valid) {
        this.api.postTrTrainee(this.TrTraineeForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              this.TrTraineeForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              // alert("خطأ عند اضافة البيانات")
              console.log(err)
            }
          })
      }
    }
    else {
      this.updateTrTrainee()
    }
  }
  updateTrTrainee() {
    this.api.putTrTrainee(this.TrTraineeForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess();
          this.TrTraineeForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ عند تحديث البيانات");
        }
      })
  }


  hrcity(){
    this.api.gethrCity().subscribe({
          next: (res) => {
            this.citysList = res;
            // console.log("sourcesList res: ", this.sourcesList);
          },
          error: (err) => {
            console.log('fetch sourcesList data err: ', err);
            // alert("خطا اثناء جلب الانواع !");
          },
        });
  }

  hrcityState(){
    this.api.gethrCityState().subscribe({
          next: (res) => {
            this.cityStatesList = res;
            // console.log("sourcesList res: ", this.sourcesList);
          },
          error: (err) => {
            console.log('fetch sourcesList data err: ', err);
            // alert("خطا اثناء جلب الانواع !");
          },
        });
  }
  trCoporteClient(){
    this.api.getTrCoporteClient().subscribe({
          next: (res) => {
            this.trCoporteClientsList = res;
            // console.log("sourcesList res: ", this.sourcesList);
          },
          error: (err) => {
            console.log('fetch sourcesList data err: ', err);
            // alert("خطا اثناء جلب الانواع !");
          },
        });
  }




  displaycityName(city: any): string {
    return city && city.name ? city.name : '';
  }

  citySelected(event: MatAutocompleteSelectedEvent): void {
    const city = event.option.value as city;
    this.selectedcity = city;
    this.TrTraineeForm.patchValue({ cityId: city.id });
  }

  private _filtercity(value: string): city[] {
    const filterValue = value;
    return this.citysList.filter(city =>
      city.name.toLowerCase().includes(filterValue)
    );
  }

  openAutocity() {
    this.cityCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.cityCtrl.updateValueAndValidity();
  }


  displaycityStateName(cityState: any): string {
    return cityState && cityState.name ? cityState.name : '';
  }

  cityStateSelected(event: MatAutocompleteSelectedEvent): void {
    const cityState = event.option.value as cityState;
    this.selectedcityState = cityState;
    this.TrTraineeForm.patchValue({ cityStateId: cityState.id });
  }

  private _filtercityState(value: string): cityState[] {
    const filterValue = value;
    return this.cityStatesList.filter(cityState =>
      cityState.name.toLowerCase().includes(filterValue)
    );
  }

  openAutocityState() {
    this.cityStateCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.cityStateCtrl.updateValueAndValidity();
  }


  displayTrCoporteClientName(trCoporteClient: any): string {
    return trCoporteClient && TrCoporteClient.name ? TrCoporteClient.name : '';
  }

  TrCoporteClientSelected(event: MatAutocompleteSelectedEvent): void {
    const trCoporteClient = event.option.value as TrCoporteClient;
    this.selectedTrCoporteClient = trCoporteClient;
    this.TrTraineeForm.patchValue({ corporationCLinetId: trCoporteClient.id });
  }

  private _filterTrCoporteClient(value: string): TrCoporteClient[] {
    const filterValue = value;
    return this.trCoporteClientsList.filter(trCoporteClient =>
      TrCoporteClient.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoTrCoporteClient() {
    this.trCoporteClientCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.trCoporteClientCtrl.updateValueAndValidity();
  }


  // set_Percentage(state: any) {

  //   console.log("state value changed: ", state.value);
  //   // this.TrTraineeForm.controls['state'].setValue(state.value);

  //   if (state.value == "موظف") {
  //     this.employeeCtrl.enable();
  //     // this.isReadOnlyPercentage = false;
  //   }
  //   else {
  //     this.isReadOnlyPercentage = true;
  //     // this.TrTraineeForm.controls['percentage'].setValue(100);
  //     this.employeeCtrl.disable();
  //     this.TrTraineeForm.controls['employeeId'].enable();
  //     this.TrTraineeForm.controls['employeeId'].setValue(0);

  //   }

  // }


  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
