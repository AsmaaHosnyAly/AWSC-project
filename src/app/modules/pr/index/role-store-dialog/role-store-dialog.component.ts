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


export class User {
  constructor(public id: number, public name: string) { }
}

export class Store {
  constructor(public id: number, public name: string, public code: any) { }
}


@Component({
  selector: 'app-role-store-dialog',
  templateUrl: './role-store-dialog.component.html',
  styleUrls: ['./role-store-dialog.component.css']
})
export class RoleStoreDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  loading :boolean=false;
  userCtrl: FormControl;
  filteredUsers: Observable<User[]>;
  users: User[] = [];
  stores: Store[] = [];
  storeCtrl: FormControl;
  filteredStores: Observable<Store[]>;
  selectedUser: User | undefined;
  selectedStore: Store | undefined;

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
    private dialogRef: MatDialogRef<RoleStoreDialogComponent>,
    private toastr: ToastrService) {

    this.userCtrl = new FormControl();
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value))
    );

    this.storeCtrl = new FormControl();
    this.filteredStores = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStores(value))
    );

   
  }


  ngOnInit(): void {
    // this.getExistingNames(); // Fetch existing names
    this.groupForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],

      userId: ['', Validators.required],
      userName: [''],
      storeId: ['', Validators.required],
      storeName: [''],
      id: [''],
    });


    this.getAllUsers();

    this.getAllStores();

    // this.api.getAllPlatoonsg().subscribe((platoons) => {
    //   this.platoons = platoons;
    // });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addGroup();
      return false; // Prevent the default browser behavior
    }));

    if (this.editData) {
      // console.log(this.editData);
      this.actionBtn = "تعديل";
      this.getGroupData = this.editData;
      this.groupForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.groupForm.controls['userId'].setValue(this.editData.userId);
      this.groupForm.controls['userName'].setValue(this.editData.userName);
      this.groupForm.controls['storeId'].setValue(this.editData.storeIdId);
      this.groupForm.controls['storeName'].setValue(this.editData.storeName);
      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);
    }
  }



  displayUserName(user: any): string {
    return user ? user.name && user.name != null ? user.name : '-' : '';
  }

  displayGradeName(grade: any): string {
    return grade ? grade.name && grade.name != null ? grade.name : '-' : '';
  }

  displayPlatoonName(platoon: any): string {
    return platoon ? platoon.name && platoon.name != null ? platoon.name : '-' : '';
  }
  getAllUsers() {
    this.loading = true;
    this.api.getPrUser().subscribe({
      next: (res) => {
        this.loading = false;
        this.users= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getAllStores() {
    this.loading = true;
    this.api.getAllStores().subscribe({
      next: (res) => {
        this.loading = false;
        this.stores= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  // getAllPlatoonsg() {
  //   this.loading = true;
  //   this.api.getAllPlatoonsg().subscribe({
  //     next: (res) => {
  //       this.loading = false;
  //       this.platoons= res;
       
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       console.log('fetch items data err: ', err);
  //       // alert("خطا اثناء جلب العناصر !");
  //     },
  //   });
  // }
  userSelected(event: MatAutocompleteSelectedEvent): void {
    const user = event.option.value as User;
    this.selectedUser = user;
    this.groupForm.patchValue({ userId: user.id });
    this.groupForm.patchValue({ userName: user.name });
    this.storeCtrl.setValue('');
  }

  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as Store;
    this.selectedStore = store;
    this.groupForm.patchValue({ storeId: store.id });
    this.groupForm.patchValue({ gradeName: store.name });
   
  }



  private _filterUsers(value: string): User[] {
    const filterValue = value
    return this.users.filter(
      user =>
      user.name  ? user.name.toLowerCase().includes(filterValue) : '-'

    );
  }

  private _filterStores(value: string): Store[] {
    const filterValue = value
    return this.stores.filter(
      store =>
        (store.name || store.code ? store.name.toLowerCase().includes(filterValue) ||
        store.code.toString().toLowerCase().includes(filterValue) : '-') 
    );
  }

 

  openAutoUser() {
    this.userCtrl.setValue(''); 
    this.userCtrl.updateValueAndValidity();
  }
  openAutoStore() {
    this.storeCtrl.setValue(''); 
    this.storeCtrl.updateValueAndValidity();
  }
 

  // getCodeByPlatoonId() {
  //   this.api.getGroupCode(this.selectedPlatoon?.id).subscribe({
  //     next: (res) => {
  //       if (this.editData) {
  //         if (this.editData.platoonId == this.selectedPlatoon?.id) {
  //           console.log(' edit data with matched choices:');

  //           this.groupForm.controls['code'].setValue(this.editData.code);
  //         } else {
  //           console.log(' edit data without matched choices:');

  //           this.groupForm.controls['code'].setValue(res);
  //         }
  //       } else {
  //         console.log('without editData:');
  //         this.groupForm.controls['code'].setValue(res);
  //       }
  //     },
  //     error: (err) => {
  //       console.log('get code. err: ', err);
  //     },
  //   });
  // }

  // getExistingNames() {
  //   this.api.getGroups().subscribe({
  //     next: (res) => {
  //       this.existingNames = res.map((item: any) => item.name);
  //     },
  //     error: (err) => {
  //       console.log('Error fetching existing names:', err);
  //     }
  //   });
  // }

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
        this.api.postUserStore(this.groupForm.value)
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
    this.api. putUserStore(this.groupForm.value)
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
