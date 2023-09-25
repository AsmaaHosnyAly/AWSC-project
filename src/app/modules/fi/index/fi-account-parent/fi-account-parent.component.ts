import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FIAccountParentDialogComponent } from '../fi-account-parent-dialog/fi-account-parent-dialog.component';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
export class Account {
  constructor(public id: number, public name: string, public level: string) {}
}

export class Parent {
  constructor(public id: number, public name: string, public level: string) {}
}

@Component({
  selector: 'app-fi-account-parent',
  templateUrl: './fi-account-parent.component.html',
  styleUrls: ['./fi-account-parent.component.css']
})
export class FIAccountParentComponent implements OnInit {
  accountCtrl: FormControl;
  filteredAccounts: Observable<Account[]>;
  accounts: Account[] = [];  
  selectedAccount!: Account;
  parentCtrl: FormControl;
  filteredParents: Observable<Parent[]>;
  parents: Parent[] = [];
  selectedParent!: Parent;
  formcontrol = new FormControl('');
  accountParentForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['accountName', 'parentName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private api: ApiService) {
    this.accountCtrl = new FormControl();
    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccounts(value))
    );

    this.parentCtrl = new FormControl();
    this.filteredParents = this.parentCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterParents(value))
    );
  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getAllAccountParents();
    this.api.getAllAccountsParents().subscribe((accounts) => {
      this.accounts = accounts;
    });
    this.api.getAllAccountsParents().subscribe((parents) => {
      this.parents = parents;
    });
  }
  openDialog() {
    this.dialog
      .open(FIAccountParentDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllAccountParents();
        }
      });
  }

  displayAccountName(account: any): string {
    return account && account.name ? account.name : '';
  }
  accountSelected(event: MatAutocompleteSelectedEvent): void {
    const account = event.option.value as Account;
    this.selectedAccount = account;
    this.accountParentForm.patchValue({ accountId: account.id });
      this.accountParentForm.patchValue({ accountName: account.name });
  }
  private _filterAccounts(value: string): Account[] {
    const filterValue = value.toLowerCase();
    return this.accounts.filter(account =>
      account.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoAccount() {
    this.accountCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.accountCtrl.updateValueAndValidity();
  }

  displayParentName(parent: any): string {
    return parent && parent.name ? parent.name : '';
  }
  parentSelected(event: MatAutocompleteSelectedEvent): void {
    const parent = event.option.value as Parent;
    this.selectedParent = parent;
    this.accountParentForm.patchValue({ parentId: parent.id });
      this.accountParentForm.patchValue({ parentName: parent.name });
  }
  private _filterParents(value: string): Parent[] {
    const filterValue = value.toLowerCase();
    return this.parents.filter(parent =>
      parent.name.toLowerCase().includes(filterValue) 
    );
  }

  openAutoParent() {
    this.parentCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.parentCtrl.updateValueAndValidity();
  }

  getAllAccountParents() {
    this.api.getAccountParent().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  editAccountParent(row: any) {
    this.dialog
      .open(FIAccountParentDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllAccountParents();
        }
      });
  }

  deleteAccountParent(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح الحساب ؟ ');
    if (result) {
      this.api.deleteAccountParent(id).subscribe({
        next: (res) => {
          alert('تم الحذف بنجاح');
          this.getAllAccountParents();
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  async getAccountParents() {
    this.api.getAccountParent().subscribe({
      next: (res) => {
        //enter account
        if (this.selectedAccount && !this.selectedParent) {

          this.dataSource = res.filter(
            (res: any) => res.accountId == this.selectedAccount.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedAccount && this.selectedParent) {

          this.dataSource = res.filter((res: any) =>
              res.accountId == this.selectedAccount.id! &&
              res.parentId == this.selectedParent.id! 
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter parnet
        else if (!this.selectedAccount && this.selectedParent) {
          this.dataSource = res.filter(
            (res: any) => res.parentId == this.selectedParent.id!
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



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

