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

export class Account {
  constructor(public id: number, public name: string, public level: string) {}
}

export class Parent {
  constructor(public id: number, public name: string, public level: string) {}
}

@Component({
  selector: 'app-fi-account-parent-dialog',
  templateUrl: './fi-account-parent-dialog.component.html',
  styleUrls: ['./fi-account-parent-dialog.component.css']
})
export class FIAccountParentDialogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')
  accountCtrl: FormControl;
  filteredAccounts: Observable<Account[]>;
  accounts: Account[] = [];  
  selectedAccount!: Account;
  parentCtrl: FormControl;
  filteredParents: Observable<Parent[]>;
  parents: Parent[] = [];
  selectedParent!: Parent;
  formcontrol = new FormControl('');  
  accountParentForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getAccountParentData: any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<FIAccountParentDialogComponent>){
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
      this.accountParentForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      accountId : ['',Validators.required],
      accountName : [''],
      parentId : ['',Validators.required],
      parentName : [''],
      });
  
      this.api.getAllAccountsParents().subscribe((accounts) => {
        this.accounts = accounts;
      });
      this.api.getAllAccountsParents().subscribe((parents) => {
        this.parents = parents;
      });
      
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getAccountParentData = this.editData;
      this.accountParentForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);            
      this.accountParentForm.controls['accountId'].setValue(this.editData.accountId);
      this.accountParentForm.controls['parentId'].setValue(this.editData.parentId);
      this.accountParentForm.controls['accountName'].setValue(this.editData.accountName);
      this.accountParentForm.controls['parentName'].setValue(this.editData.parentName);
      this.accountParentForm.addControl('id', new FormControl('', Validators.required));
      this.accountParentForm.controls['id'].setValue(this.editData.id);
      }
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
        parent.name.toLowerCase().includes(filterValue) && parent.id !== this.selectedAccount?.id
      );
    }
  
    openAutoParent() {
      this.parentCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.parentCtrl.updateValueAndValidity();
    }
    

    addAccountParent(){
    if(!this.editData){
      
      this.accountParentForm.removeControl('id')
      // this.accountParentForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.accountParentForm.value);
      this.accountParentForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.accountParentForm.valid){
        this.api.postAccountParent(this.accountParentForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.accountParentForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateAccount()
    }
  }
      updateAccount(){
        this.api.putAccountParent(this.accountParentForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.accountParentForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
  
  }
  

