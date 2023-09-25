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
// import { publishFacade } from '@angular/compiler';
// import { STRGradeComponent } from '../str-grade/str-grade.component';

export class Account {
  constructor(public id: number, public name: string, public code: string) {}
}

@Component({
  selector: 'app-fi-account-itemd-dialog',
  templateUrl: './fi-account-itemd-dialog.component.html',
  styleUrls: ['./fi-account-itemd-dialog.component.css']
})
export class FiAccountItemdDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')
  accountCtrl: FormControl;
  filteredAccounts: Observable<Account[]>;
  accounts: Account[] = [];
  selectedAccount: Account | undefined;
  formcontrol = new FormControl('');  
  accountItemForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getAccountItemData: any;
  Id:string  | undefined | null;
   commidityDt:any={
  id:0,
}
commname:any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
commoditylist:any;
storeList: any;
commodityName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<FiAccountItemdDialogComponent>){
      this.accountCtrl = new FormControl();
      this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterAccounts(value))
      );
    }
    ngOnInit(): void {
      this.accountItemForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      accountId : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllAccounts().subscribe((fiAccount) => {
        this.accounts = fiAccount;
      });
      
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getAccountItemData = this.editData;
      this.accountItemForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.accountItemForm.controls['code'].setValue(this.editData.code);
      this.accountItemForm.controls['name'].setValue(this.editData.name);
      
      this.accountItemForm.controls['accountId'].setValue(this.editData.accountId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.accountItemForm.addControl('id', new FormControl('', Validators.required));
      this.accountItemForm.controls['id'].setValue(this.editData.id);
      }
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

    openAutoFiAccountItem() {
      this.accountCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.accountCtrl.updateValueAndValidity();
    }

    

  addFiAccountItem(){
    if(!this.editData){
      
      this.accountItemForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.accountItemForm.value);
      this.accountItemForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.accountItemForm.valid){
        this.api.postFiAccountItem(this.accountItemForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
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
        this.api.putFiAccountItem(this.accountItemForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.accountItemForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }

}
