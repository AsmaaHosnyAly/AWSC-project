import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
// import { publishFacade } from '@angular/compiler';
// import { STRGradeComponent } from '../str-grade/str-grade.component';

export class Account {
  constructor(public id: number, public name: string, public code: any) {}
}
export class AccountItemCategory {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-fi-account-itemd-dialog',
  templateUrl: './fi-account-itemd-dialog.component.html',
  styleUrls: ['./fi-account-itemd-dialog.component.css']
})
export class FiAccountItemdDialogComponent {
  // transactionUserId=localStorage.getItem('transactionUserId')
  accountCtrl: FormControl;
  filteredAccounts: Observable<Account[]>;
  accounts: Account[] = [];
  selectedAccount: Account | undefined;
  getAccountItemData: any;
  
  accountItemCategoryCtrl: FormControl;
  filteredAccountItemCategory: Observable<AccountItemCategory[]>;
  accountItemCategory: AccountItemCategory[] = [];
  selectedAccountItemCategory: AccountItemCategory | undefined;
  getAccountItemCategoryData: any;

  formcontrol = new FormControl('');  
  accountItemForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  Id:string  | undefined | null;

dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
storeList: any;
commodityName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,private toastr: ToastrService,
    private readonly route:ActivatedRoute,private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<FiAccountItemdDialogComponent>){
      this.accountCtrl = new FormControl();
      this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterAccounts(value))
      );
      this.accountItemCategoryCtrl = new FormControl();
      this.filteredAccountItemCategory = this.accountItemCategoryCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterItemCategory(value))
      );
    }
    ngOnInit(): void {
      this.accountItemForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['1',Validators.required],
      name : ['',Validators.required],
      accountId : ['',Validators.required],
      accountItemCategoryId: ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllAccounts().subscribe((fiAccount) => {
        this.accounts = fiAccount;
      });
      this.api.getAllAccountItemCategory().subscribe((itemCategory) => {
        this.accountItemCategory = itemCategory;
      });
      
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addFiAccountItem();
        return false; // Prevent the default browser behavior
      }));
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getAccountItemData = this.editData;
      this.getAccountItemCategoryData = this.editData;
      console.log("edit data: ",this.editData)
      this.accountItemForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.accountItemForm.controls['code'].setValue(this.editData.code);
      this.accountItemForm.controls['name'].setValue(this.editData.name);
      
      this.accountItemForm.controls['accountId'].setValue(this.editData.accountId);
      this.accountItemForm.controls['accountItemCategoryId'].setValue(this.editData.accountItemCategoryId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.accountItemForm.addControl('id', new FormControl('', Validators.required));
      this.accountItemForm.controls['id'].setValue(this.editData.id);
      }
    }
    openAutoFiAccountItem() {
      this.accountCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.accountCtrl.updateValueAndValidity();
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
        account.name.toLowerCase().includes(filterValue) || account.code.toString().toLowerCase().includes(filterValue)
      );
    }

    openAutoAccountItemCategory() {
      this.accountItemCategoryCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.accountItemCategoryCtrl.updateValueAndValidity();
    }
    displayAccountItemCategory(itemcategory: any): string {
      return itemcategory && itemcategory.name ? itemcategory.name : '';
    }
    ItemCategorySelected(event: MatAutocompleteSelectedEvent): void {
      const itemcategory = event.option.value as AccountItemCategory;
      this.selectedAccountItemCategory = itemcategory;
      this.accountItemForm.patchValue({ accountItemCategoryId: itemcategory.id });
      this.accountItemForm.patchValue({ accountItemCategoryName: itemcategory.name });
    }
    private _filterItemCategory(value: string): AccountItemCategory[] {
      const filterValue = value.toLowerCase();
      return this.accountItemCategory.filter(ItemCategory =>
        ItemCategory.name.toLowerCase().includes(filterValue) || ItemCategory.id.toString().toLowerCase().includes(filterValue)
      );
    }

  
    

  addFiAccountItem(){
    if(!this.editData){
      
      this.accountItemForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.accountItemForm.value);
      // this.accountItemForm.controls['transactionUserId'].setValue(this.transactionUserId);
      
      if(this.accountItemForm.valid){
        this.api.postFiAccountItem(this.accountItemForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.accountItemForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateFiAccountItem()
    }
  }

 
      updateFiAccountItem(){
        // console.log("accountItemForm.value: ", this.accountItemForm.value);
        
        this.api.putFiAccountItem(this.accountItemForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.accountItemForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
      toastrSuccess(): void {
        this.toastr.success('تم الحفظ بنجاح');
      }
      
      toastrEditSuccess(): void {
        this.toastr.success('تم التعديل بنجاح');
      }
}
