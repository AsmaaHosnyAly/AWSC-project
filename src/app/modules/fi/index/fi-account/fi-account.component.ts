import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FIAccountDialogComponent } from '../fi-account-dialog/fi-account-dialog.component';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/pages/services/global.service';
export class Hierarchy {
  constructor(public id: number, public name: string, public level: string) { }
}

interface FiAccount {
  code: any;
  name: any;
  fiAccountHierarchyName: any;
  fiAccountlevel: any;
  action: any;
}

@Component({
  selector: 'app-fi-account',
  templateUrl: './fi-account.component.html',
  styleUrls: ['./fi-account.component.css']
})
export class FIAccountComponent implements OnInit {
  ELEMENT_DATA: FiAccount[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<FiAccount> = new MatTableDataSource();

  hierarchyCtrl: FormControl;
  filteredHierarchies: Observable<Hierarchy[]>;
  hierarchies: Hierarchy[] = [];
  selectedHierarchy!: Hierarchy;
  formcontrol = new FormControl('');
  accountForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['code', 'name', 'fiAccountHierarchyName', 'fiAccountlevel', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  commidityDt: any = {
    id: 0,
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog, private toastr: ToastrService, private api: ApiService, private hotkeysService: HotkeysService, private global: GlobalService) {
    this.hierarchyCtrl = new FormControl();
    this.filteredHierarchies = this.hierarchyCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterHierarchies(value))
    );
    global.getPermissionUserRoles('Accounts', 'fi-home', 'إدارة الحسابات ', 'iso')
  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getAllAccounts();
    this.api.getAllAccountHierarchy().subscribe((hierarchies) => {
      this.hierarchies = hierarchies;
    });
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(FIAccountDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllAccounts();
        }
      });
  }

  displayHierarchyName(hierarchy: any): string {
    return hierarchy && hierarchy.name ? hierarchy.name : '';
  }
  hierarchySelected(event: MatAutocompleteSelectedEvent): void {
    const hierarchy = event.option.value as Hierarchy;
    this.selectedHierarchy = hierarchy;
    this.accountForm.patchValue({ fiAccountHierarchyId: hierarchy.id });
    this.accountForm.patchValue({ fiAccountHierarchyName: hierarchy.name });
    this.accountForm.patchValue({ fiAccountHierarchyLevel: hierarchy.level });
  }
  private _filterHierarchies(value: string): Hierarchy[] {
    const filterValue = value.toLowerCase();
    return this.hierarchies.filter(hierarchy =>
      hierarchy.name.toLowerCase().includes(filterValue) || hierarchy.level.toLowerCase().includes(filterValue)
    );
  }

  openAutoHierarchy() {
    this.hierarchyCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.hierarchyCtrl.updateValueAndValidity();
  }

  getAllAccounts() {
    // this.api.getAccount().subscribe({
    //   next: (res) => {
    //     this.dataSource = new MatTableDataSource(res);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   },
    //   error: (err) => {
    //     alert('Error');
    //   },
    // });

    if (!this.currentPage) {
      this.currentPage = 0;

      // this.isLoading = true;
      fetch(this.api.getFiAccountPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate first Time: ", data);
          this.dataSource.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }
    else {
      // this.isLoading = true;
      fetch(this.api.getFiAccountPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate: ", data);
          this.dataSource.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }

  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllAccounts();
  }

  editAccount(row: any) {
    this.dialog
      .open(FIAccountDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllAccounts();
        }
      });
  }

  deleteAccount(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteAccount(id).subscribe({
        next: (res) => {
          if (res == 'Succeeded') {
            console.log("res of deleteAccount:", res)
            this.toastrDeleteSuccess();
            this.getAllAccounts();
          } else {
            alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
          }
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }

  async getSearchAccounts(name: any) {
    this.api.getAccount().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedHierarchy && name == '') {
          console.log('filter ID id: ', this.selectedHierarchy, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.fiAccountHierarchyId == this.selectedHierarchy.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedHierarchy && name != '') {
          console.log('filter both id: ', this.selectedHierarchy, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.fiAccountHierarchyId == this.selectedHierarchy.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedHierarchy, 'name: ', name);
          // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
          this.dataSource = res.filter((res: any) =>
            res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        alert('Error');
      },
    });
    // this.getAllProducts()
  }


  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

