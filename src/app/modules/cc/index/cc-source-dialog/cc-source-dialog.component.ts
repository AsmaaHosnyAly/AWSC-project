
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
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
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
export class Ccfunction {
  constructor(public id: number, public name: string, public code: any) {}
}

// export class Account {
//   constructor(public id: number, public name: string, public code: any) {}
// }

@Component({
  selector: 'app-cc-source-dialog',
  templateUrl: './cc-source-dialog.component.html',
  styleUrls: ['./cc-source-dialog.component.css']
})
export class CcSourceDialogComponent {
  transactionUserId = localStorage.getItem('transactionUserId');
  CcfunctionCtrl: FormControl;
  filteredCcfunction: Observable<Ccfunction[]>;
  CcfunctionList: Ccfunction[] = [];
  getCcSourceData: any;
  selectedCcfunction: Ccfunction | undefined;
  // accountCtrl: FormControl;
  // filteredAccounts: Observable<Account[]>;
  // accounts: Account[] = [];
  // selectedAccount:Account| undefined;
  formcontrol = new FormControl('');
  CcSourceForm!: FormGroup;
  actionBtn: string = 'حفظ';
  selectedOption: any;
  dataSource!: MatTableDataSource<any>;
  existingNames: string[] = [];
  existingCcfunction: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  allCcSources: any;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<CcSourceDialogComponent>,
    private toastr: ToastrService
  ) {
    this.CcfunctionCtrl = new FormControl();
    this.filteredCcfunction = this.CcfunctionCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCcfunction(value))
    );

    // this.accountCtrl = new FormControl();
    // this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filterAccounts(value))
    // );
  }
  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteCcSource() function in the current component
      this.addCcSource();
      return false; // Prevent the default browser behavior
    }));
    this.CcSourceForm = this.formBuilder.group({
      //define the components of the form
      transactionUserId: [1, Validators.required],
      code: [''],
      name: ['', Validators.required],
      functionId: ['', Validators.required],

      id: ['', Validators.required],
      // matautocompleteFieldName : [''],
    });

  this.getccFunction();

    // this.api.getAllAccount().subscribe((accounts) => {
    //   this.accounts = accounts;
    // });

    if (this.editData) {
      this.actionBtn = 'تعديل';
      this.getCcSourceData = this.editData;
      this.CcSourceForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      this.CcSourceForm.controls['code'].setValue(this.editData.code);
      this.CcSourceForm.controls['name'].setValue(this.editData.name);

      this.CcSourceForm.controls['functionId'].setValue(
        this.editData.functionId
      );

      this.CcSourceForm.controls['accountId'].setValue(
        this.editData.accountId
      );
      // console.log("functionId: ", this.CcSourceForm.controls['functionId'].value)
      this.CcSourceForm.addControl('id', new FormControl('', Validators.required));
      this.CcSourceForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayCcfunctionName(Ccfunction: any): string {
    return Ccfunction && Ccfunction.name ? Ccfunction.name : '';
  }

  CcfunctionSelected(event: MatAutocompleteSelectedEvent): void {
    const Ccfunction = event.option.value as Ccfunction;
    this.selectedCcfunction = Ccfunction;
    this.CcSourceForm.patchValue({ functionId: Ccfunction.id });
    this.CcSourceForm.patchValue({ CcfunctionName: Ccfunction.name });
    // this.getCodeByfunctionId();
  }

  private _filterCcfunction(value: string): Ccfunction[] {
    const filterValue = value.toLowerCase();
    return this.CcfunctionList.filter(
      (Ccfunction) =>
        Ccfunction.name.toLowerCase().includes(filterValue) ||
        Ccfunction.code.toString().toLowerCase().includes(filterValue)
    );
  }

  openAutoCcfunction() {
    this.CcfunctionCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.CcfunctionCtrl.updateValueAndValidity();
  }

  // displayAccountName(account: any): string {
  //   return account && account.name ? account.name : '';
  // }

  // accountSelected(event: MatAutocompleteSelectedEvent): void {
  //   const account = event.option.value as Account;
  //   this.selectedAccount = account;
  //   this.CcSourceForm.patchValue({ accountId: account.id });
  //   this.CcSourceForm.patchValue({ accountName: account.name });
  // }

  // private _filterAccounts(value: string): Account[] {
  //   const filterValue = value.toLowerCase();
  //   return this.accounts.filter(
  //     (account) =>
  //       account.name.toLowerCase().includes(filterValue) ||
  //       account.code.toString().toLowerCase().includes(filterValue)
  //   );
  // }

  // openAutoAccount() {
  //   this.accountCtrl.setValue(''); // Clear the input field value

  //   // Open the autocomplete dropdown by triggering the value change event
  //   this.accountCtrl.updateValueAndValidity();
  // }

  // getCodeByfunctionId() {
  //   this.api.getCcSourceCode(this.selectedCcfunction?.id).subscribe({
  //     next: (res) => {
  //       if (this.editData) {
  //         if (this.editData.functionId == this.selectedCcfunction?.id) {
  //           console.log(' edit data with matched choices:');

  //           this.CcSourceForm.controls['code'].setValue(this.editData.code);
  //         } else {
  //           console.log(' edit data without matched choices:');

  //           this.CcSourceForm.controls['code'].setValue(res);
  //         }
  //       } else {
  //         console.log('without editData:');
  //         this.CcSourceForm.controls['code'].setValue(res);
  //       }
  //     },
  //     error: (err) => {
  //       console.log('get code. err: ', err);
  //     },
  //   });
  // }
  getExistingNames() {
    this.api.getCcSource().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }
  
  getccFunction(){
    this.api.getCcFunction().subscribe({
      next: (res) => {
        this.CcfunctionList = res;
        // console.log("items res: ", this.itemsList);
      },
      error: (err) => {
        // console.log("fetch items data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  addCcSource() {
    
    this.CcSourceForm.controls['code'].setValue(this.CcSourceForm.value.code);

    if (!this.editData) {
      const enteredName = this.CcSourceForm.get('name')?.value;
    
    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }
    
      this.CcSourceForm.removeControl('id');
      // this.CcSourceForm.controls['functionId'].setValue(this.selectedOption.id);
      console.log('add: ', this.CcSourceForm.value);
      this.CcSourceForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      if (this.CcSourceForm.valid) {
        this.api.postCcSource(this.CcSourceForm.value).subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.CcSourceForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            this.toastrErrorSave();
          },
        });
      }
    } else {
      this.updateCcSource();
    }
  }


  updateCcSource() {
    this.api.putCcSource(this.CcSourceForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.CcSourceForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        this.toastrErrorEdit();
      },
    });
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
