import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { publishFacade } from '@angular/compiler';

import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';

export class Account {
  constructor(public id: number, public name: string, public code: any) {}
}


@Component({
    selector: 'app-str-commodity-dialog',
    templateUrl: './STR_Commodity_dialog.component.html',
    styleUrls: ['./STR_Commodity_dialog.component.css']
  })

export class StrCommodityDialogComponent implements OnInit {
  accountCtrl: FormControl;
  filteredAccounts: Observable<Account[]>;
  accounts: Account[] = [];
  selectedAccount:Account| undefined;
  getCommodityData: any;
  commodityForm !: FormGroup;
  existingNames: string[] = [];
  actionBtn: string = "حفظ"
  autoCode:any;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrCommodityDialogComponent>) {
      this.accountCtrl = new FormControl();
    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccounts(value))
    );
     }

  ngOnInit(): void {
    this.getCommodityAutoCode();
    this.getExistingNames(); // Fetch existing names
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addCommodity();
      return false; // Prevent the default browser behavior
    }));
    this.commodityForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      accountId: ['', Validators.required],
      transactionUserId:[1, Validators.required],
  
    });

    this.api.getAllAccount().subscribe((accounts) => {
      this.accounts = accounts;
    });

    if (this.editData) {
      this.actionBtn = "تحديث";
      this.getCommodityData = this.editData;
      this.commodityForm.controls['code'].setValue(this.editData.code);
      this.commodityForm.controls['name'].setValue(this.editData.name);  
      this.commodityForm.controls['accountId'].setValue( 
        this.editData.accountId
      );    
      this.commodityForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.commodityForm.addControl('id', new FormControl('', Validators.required));
      this.commodityForm.controls['id'].setValue(this.editData.id);

    }
  }

  displayAccountName(account: any): string {
    return account && account.name ? account.name : '';
  }

  accountSelected(event: MatAutocompleteSelectedEvent): void {
    const account = event.option.value as Account;
    this.selectedAccount = account;
    this.commodityForm.patchValue({ accountId: account.id });
    this.commodityForm.patchValue({ accountName: account.name });
  }

  private _filterAccounts(value: string): Account[] {
    const filterValue = value.toLowerCase();
    return this.accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(filterValue) ||
        account.code.toString().toLowerCase().includes(filterValue)
    );
  }

  openAutoAccount() {
    this.accountCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.accountCtrl.updateValueAndValidity();
  }

  getExistingNames() {
    this.api.getcommodity().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }

  addCommodity() {
    
    
  
    if (!this.editData) {
      const enteredName = this.commodityForm.get('name')?.value;

    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }
      this.commodityForm.removeControl('id')
      console.log("add form before go to post: ", this.commodityForm.value)
      if (this.commodityForm.getRawValue().code) {
        console.log("no changed: ", this.commodityForm.getRawValue().code)
        this.commodityForm.controls['code'].setValue(this.autoCode);
      }
      else{
        this.commodityForm.controls['code'].setValue(this.autoCode);
        console.log("no took auto number: ", this.commodityForm.getRawValue().code)
      }
      if (this.commodityForm.valid) {
        console.log('commodityForm:',this.commodityForm.value)
        this.api.postCommodity(this.commodityForm.value)
          .subscribe({
            next: (res) => {
              alert(" تم اضافة السلعة بنجاح" );
              this.commodityForm.reset();
              this.dialogRef.close('حفظ');
            },
            error: (err) => {
              console.log('error:',err)
              alert("!خطأ في العملية")
              
            }
          })
      }
      
    }else{
      this.updateCommodity()
    }
  }

  updateCommodity(){
    console.log("edit form : ", this.commodityForm.value)
    this.api.putCommodity(this.commodityForm.value)
    .subscribe({
      next:(res)=>{
        alert("تم التحديث بنجاح");
        this.commodityForm.reset();
        this.dialogRef.close('تحديث');
      },
      error:(err)=>{
        console.log('error:',err)
      }
    })
  }

  getCommodityAutoCode() {
    this.api.getCommodityAutoCode()
      .subscribe({
        next: (res) => {
          this.autoCode = res;
          console.log("autocode:",this.autoCode)
          return res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

}


  