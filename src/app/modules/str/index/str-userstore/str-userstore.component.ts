import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../services/api.service'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {
  FormGroup,
  FormBuilder,
  Validator,
  Validators,
  FormControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { StrUserstoreDialogComponent } from '../str-userstore-dialog/str-userstore-dialog.component';
export class User {
  constructor(public id: number, public name: string) {}
}

export class Store {
  constructor(
    public id: number,
    public name: string
   
  ) {}
}

@Component({
  selector: 'app-str-userstore',
  templateUrl: './str-userstore.component.html',
  styleUrls: ['./str-userstore.component.css']
})
export class StrUserstoreComponent implements OnInit{
  [x: string]: any;
  transactionUserId = localStorage.getItem('transactionUserId');
  userCtrl: FormControl;
  filteredUseres: Observable<User[]>;
  useres: User[] = [];
  storeCtrl: FormControl;
  filteredStores: Observable<Store[]>;
  stores: Store[] = [];
  selectedUser!: User;
  selectedStore!: Store;
  // selectedCommodity = this.commodities[0];
  // selectedGrade = this.grades[0];  
  formcontrol = new FormControl('');
  userStorrForm!: FormGroup;
  platoon: any;
  title = 'angular13crud';
  displayedColumns: string[] = [
   
    'userName',
    'storeName',    
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('autoUser') autoUsery!: MatAutocompleteTrigger;
@ViewChild('autoStore') autoStore!: MatAutocompleteTrigger;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  // selectedGrade: any;
  constructor(private formBuilder : FormBuilder,private dialog: MatDialog, private api: ApiService,private global:GlobalService,private hotkeysService: HotkeysService) {
    this.userCtrl = new FormControl();
    this.filteredUseres = this.userCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterUseres(value))
    );

    this.storeCtrl = new FormControl();
    this.filteredStores = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterStores(value))
    );

    global.getPermissionUserRoles(7,'stores', 'الفصيلة', '')
  }
  ngOnInit(): void {
    this.getAllPlatoons();
    this.api.getAllUseres().subscribe((useres) => {
      this.useres = useres;
    });

    this.api.getAllStores().subscribe((stores) => {
      this.stores = stores;
    });
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(StrUserstoreDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllPlatoons();
        }
      });
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
    console.log("commodityname:",user.name )
  }

  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as Store;
    this.selectedStore = store;
    this.userStorrForm.patchValue({ storeId: store.id });
    this.userStorrForm.patchValue({ storeName: store.name });
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
        )
    );
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

  getAllPlatoons() {
    this.api.getUserstore().subscribe({
      next: (res) => {
        console.log('res table: ', res);

        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('error while fetching the records!!');
      },
    });
  }
  editPlatoon(row: any) {
    console.log('data : ', row);
    this.dialog
      .open(StrUserstoreDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllPlatoons();
        }
      });
  }
  daletePlatoon(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteUserstore(id)
  .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
          alert('تم الحذف بنجاح');
          this.getAllPlatoons();

  
        }else{
          alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
        }
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  


  // clearFields() {  
    
  //   this.userStorrForm.get('platoonName')?.reset();
  //   // this.userStorrForm.get('commodityN')?.reset();
    
  //   this.userStorrForm.get('gradeN')?.reset();
  //   this.getAllPlatoons();
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

