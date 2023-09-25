import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatDialog,  MAT_DIALOG_DATA,  MatDialogModule} from '@angular/material/dialog';
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
import { FiAccountItemdDialogComponent } from '../fi-account-itemd-dialog/fi-account-itemd-dialog.component';
export class Account {
  constructor(public id: number, public name: string, public code: string) {}
}

@Component({
  selector: 'app-fi-account-item',
  templateUrl: './fi-account-item.component.html',
  styleUrls: ['./fi-account-item.component.css']
})
export class FiAccountItemComponent  implements OnInit {
  accountCtrl: FormControl;
  filteredAccounts: Observable<Account[]>;
  accounts: Account[] = [];
  selectedAccount!: Account;
  formcontrol = new FormControl('');
  accountItemForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name', 'accounName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // commidityDt: any = {
  //   id: 0,
  // };
  constructor(private dialog: MatDialog, private api: ApiService) {
    this.accountCtrl = new FormControl();
    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccounts(value))
    );
  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getAllAccountItem();
    this.api.getAllAccounts().subscribe((fiAccount) => {
      this.accounts = fiAccount;
    });
  }
  openDialog() {
    this.dialog
      .open(FiAccountItemdDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllAccountItem();
        }
      });
  }

  displayAccountName(account: any): string {
    return account && account.name ? account.name : '';
  }
  accountSelected(event: MatAutocompleteSelectedEvent): void {
    const account = event.option.value as Account;
    this.selectedAccount = account;
    this.accountItemForm.patchValue({ accountId: account.id });
    this.accountItemForm.patchValue({ accounName: account.name });
  }
  private _filterAccounts(value: string): Account[] {
    const filterValue = value.toLowerCase();
    return this.accounts.filter(account =>
      account.name.toLowerCase().includes(filterValue) || account.code.toLowerCase().includes(filterValue)
    );
  }

  getAllAccountItem() {
    this.api.getFiAccountItem().subscribe({
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

  editFiAccountItem(row: any) {
    this.dialog
      .open(FiAccountItemdDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllAccountItem();
        }
      });
  }

  deleteFiAccountItem(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح النوعية ؟ ');
    if (result) {
      this.api.deleteFiAccountItem(id).subscribe({
        next: (res) => {
          alert('تم الحذف بنجاح');
          this.getAllAccountItem();
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  openAutoFiAccountItem() {
    this.accountCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.accountCtrl.updateValueAndValidity();
  }
  async getSearchAccountItem(name: any) {
    this.api.getFiAccountItem().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedAccount && name == '') {
          console.log('filter ID id: ', this.selectedAccount, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.accountId == this.selectedAccount.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedAccount && name != '') {
          console.log('filter both id: ', this.selectedAccount, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.accountId == this.selectedAccount.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedAccount, 'name: ', name);
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
