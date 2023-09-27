import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validator,
  Validators,
  FormControl,
} from '@angular/forms';
import { ApiService } from './../services/api.service';
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
export class User {
  constructor(public id: number, public name: string) {}
}

export class Store {
  constructor(
    public id: number,
    public name: string,
    
  ) {}
}
@Component({
  selector: 'app-str-userstore-dialog',
  templateUrl: './str-userstore-dialog.component.html',
  styleUrls: ['./str-userstore-dialog.component.css']
})
export class StrUserstoreDialogComponent  implements OnInit{
  transactionUserId = localStorage.getItem('transactionUserId');
  userCtrl: FormControl;
  filteredUseres: Observable<User[]>;
  useres: User[] = [];
  selectedUser: User | undefined;
  storeCtrl: FormControl;
  filteredStores: Observable<Store[]>;
  stores: Store[] = [];
  selectedStore: Store | undefined;
  formcontrol = new FormControl('');
  userStorrForm!: FormGroup;
  selectedOption: any;
  getPlatoonData: any;
  actionBtn: string = 'حفظ';
  Code: any;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
    constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrUserstoreDialogComponent>
  ) {
    this.userCtrl = new FormControl();
    this.filteredUseres = this.userCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterUseres(value))
    );

    this.storeCtrl = new FormControl();
    this.filteredStores = this.userCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterStores(value))
    );
  }

  ngOnInit(): void {
    // this.getExistingNames(); // Fetch existing names
    this.userStorrForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
  
      userId: ['', Validators.required],
      // userName: ['', Validators.required],
      storeId: ['', Validators.required],
      // storeName: ['', Validators.required],
      id: ['', Validators.required],
    });

    this.api.getAllUseres().subscribe((useres) => {
      this.useres = useres;
    });

    this.api.getAllStores().subscribe((stores) => {
      this.stores = stores;
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addPlatoon();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log('edit:', this.editData);

      this.actionBtn = 'تعديل';
      this.getPlatoonData = this.editData;
      this.userStorrForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
 

      // this.userStorrForm.controls['name'].setValue(this.editData.name);
      this.userStorrForm.controls['userId'].setValue(
        this.editData.userId
      );
      // this.userStorrForm.controls['userName'].setValue(
      //   this.editData.userName
      // );
      this.userStorrForm.controls['storeId'].setValue(this.editData.storeId);
      // this.userStorrForm.controls['storeName'].setValue(this.editData.storeName);
      this.userStorrForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
      this.userStorrForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayUserName(user: any): string {
    return user && user.name ? user.name : '';
  }

  displayStoreName(store: any): string {
    return store && store.name ? store.name : '';
  }

  userSelected(event: MatAutocompleteSelectedEvent): void {
    const user = event.option.value as User;
    this.selectedUser = user;
    this.userStorrForm.patchValue({ userId: user.id });
    this.userStorrForm.patchValue({ userName: user.name });
    // this.storeCtrl.setValue('');
  }

  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as Store;
    this.selectedStore = store;
    this.userStorrForm.patchValue({ storeId: store.id });
    this.userStorrForm.patchValue({ storeName: store.name });
    // this. getuserstoreCode();
  }

  private _filterUseres(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.useres.filter(
      (user) =>
        user.name.toLowerCase().includes(filterValue) 
        
    );
  }

  private _filterStores(value: string): Store[] {
    const filterValue = value.toLowerCase();
    return this.stores.filter(
      (store) =>
        (store.name.toLowerCase().includes(filterValue) 
         
        // grade.commodityId === this.selectedCommodity?.id
     ) );
  }

  openAutoUser() {
    this.userCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.userCtrl.updateValueAndValidity();
  }
  openAutoStore() {
    this.storeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.storeCtrl.updateValueAndValidity();
  }

  // getuserstoreCode() {
  //   console.log('gradeid:', this.selectedStore?.id);
  //   this.api.getPlatoonCode(this.selectedStore?.id).subscribe({
  //     next: (res) => {
  //       if (this.editData) {
  //         if (this.editData.userId == this.selectedStore?.id) {
  //           console.log(' edit data with matched choices:');

  //           this.userStorrForm.controls['code'].setValue(this.editData.code);
  //         } else {
  //           console.log(' edit data without matched choices:');

  //           this.userStorrForm.controls['code'].setValue(res);
  //         }
  //       } else {
  //         console.log('without editData:');
  //         this.userStorrForm.controls['code'].setValue(res);
  //       }
  //     },
  //     error: (err) => {
  //       console.log('get code. err: ', err);
  //       // this.Code = err.error.text;
  //     },
  //   });
  // }

  // getExistingNames() {
  //   this.api.getPlatoon().subscribe({
  //     next: (res) => {
  //       this.existingNames = res.map((item: any) => item.name);
  //     },
  //     error: (err) => {
  //       console.log('Error fetching existing names:', err);
  //     }
  //   });
  // }

  addPlatoon() {

  
    if(!this.editData){
      
      this.userStorrForm.removeControl('id')
      
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.userStorrForm.value);
      this.userStorrForm.controls['transactionUserId'].setValue(this.transactionUserId);
      
      if(this.userStorrForm.valid){
        this.api.postUserstore(this.userStorrForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.userStorrForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updatePlatoon()
    }
  }

  updatePlatoon() {
    this.api.putUserstore(this.userStorrForm.value).subscribe({
      next: (res) => {
        alert('تم التحديث بنجاح');
        this.userStorrForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert('خطأ عند تحديث البيانات');
      },
    });
  }

}
