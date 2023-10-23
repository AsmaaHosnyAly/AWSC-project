

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
export class CcRegion {
  constructor(public id: number, public name: string, public code: any) {}
}

// export class Account {
//   constructor(public id: number, public name: string, public code: any) {}
// }

@Component({
  selector: 'app-cc-sub-region-dialog',
  templateUrl: './cc-sub-region-dialog.component.html',
  styleUrls: ['./cc-sub-region-dialog.component.css']
})
export class CcSubRegionDialogComponent {
  transactionUserId = localStorage.getItem('transactionUserId');
  CcRegionCtrl: FormControl;
  filteredCcRegion: Observable<CcRegion[]>;
  CcRegion: CcRegion[] = [];
  getCcSubRegionData: any;
  selectedCcRegion: CcRegion | undefined;
  // accountCtrl: FormControl;
  // filteredAccounts: Observable<Account[]>;
  // accounts: Account[] = [];
  // selectedAccount:Account| undefined;
  formcontrol = new FormControl('');
  CcSubRegionForm!: FormGroup;
  actionBtn: string = 'حفظ';
  selectedOption: any;
  dataSource!: MatTableDataSource<any>;
  existingNames: string[] = [];
  existingCcRegion: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  allCcSubRegions: any;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<CcSubRegionDialogComponent>,
    private toastr: ToastrService
  ) {
    this.CcRegionCtrl = new FormControl();
    this.filteredCcRegion = this.CcRegionCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCcRegion(value))
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
      // Call the deleteCcSubRegion() function in the current component
      this.addCcSubRegion();
      return false; // Prevent the default browser behavior
    }));
    this.CcSubRegionForm = this.formBuilder.group({
      //define the components of the form
      transactionUserId: [1, Validators.required],
      code: [''],
      name: ['', Validators.required],
      RegionId: ['', Validators.required],

      id: ['', Validators.required],
      // matautocompleteFieldName : [''],
    });

    this.api.getCcRegion().subscribe((CcRegion) => {
      this.CcRegion = CcRegion;
    });

    // this.api.getAllAccount().subscribe((accounts) => {
    //   this.accounts = accounts;
    // });

    if (this.editData) {
      this.actionBtn = 'تعديل';
      this.getCcSubRegionData = this.editData;
      this.CcSubRegionForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      this.CcSubRegionForm.controls['code'].setValue(this.editData.code);
      this.CcSubRegionForm.controls['name'].setValue(this.editData.name);

      this.CcSubRegionForm.controls['RegionId'].setValue(
        this.editData.RegionId
      );

      this.CcSubRegionForm.controls['accountId'].setValue(
        this.editData.accountId
      );
      // console.log("RegionId: ", this.CcSubRegionForm.controls['RegionId'].value)
      this.CcSubRegionForm.addControl('id', new FormControl('', Validators.required));
      this.CcSubRegionForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayCcRegionName(CcRegion: any): string {
    return CcRegion && CcRegion.name ? CcRegion.name : '';
  }

  CcRegionSelected(event: MatAutocompleteSelectedEvent): void {
    const CcRegion = event.option.value as CcRegion;
    this.selectedCcRegion = CcRegion;
    this.CcSubRegionForm.patchValue({ RegionId: CcRegion.id });
    this.CcSubRegionForm.patchValue({ CcRegionName: CcRegion.name });
    // this.getCodeByRegionId();
  }

  private _filterCcRegion(value: string): CcRegion[] {
    const filterValue = value.toLowerCase();
    return this.CcRegion.filter(
      (CcRegion) =>
        CcRegion.name.toLowerCase().includes(filterValue) ||
        CcRegion.code.toString().toLowerCase().includes(filterValue)
    );
  }

  openAutoCcRegion() {
    this.CcRegionCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.CcRegionCtrl.updateValueAndValidity();
  }

  // displayAccountName(account: any): string {
  //   return account && account.name ? account.name : '';
  // }

  // accountSelected(event: MatAutocompleteSelectedEvent): void {
  //   const account = event.option.value as Account;
  //   this.selectedAccount = account;
  //   this.CcSubRegionForm.patchValue({ accountId: account.id });
  //   this.CcSubRegionForm.patchValue({ accountName: account.name });
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

  // getCodeByRegionId() {
  //   this.api.getCcSubRegionCode(this.selectedCcRegion?.id).subscribe({
  //     next: (res) => {
  //       if (this.editData) {
  //         if (this.editData.RegionId == this.selectedCcRegion?.id) {
  //           console.log(' edit data with matched choices:');

  //           this.CcSubRegionForm.controls['code'].setValue(this.editData.code);
  //         } else {
  //           console.log(' edit data without matched choices:');

  //           this.CcSubRegionForm.controls['code'].setValue(res);
  //         }
  //       } else {
  //         console.log('without editData:');
  //         this.CcSubRegionForm.controls['code'].setValue(res);
  //       }
  //     },
  //     error: (err) => {
  //       console.log('get code. err: ', err);
  //     },
  //   });
  // }
  getExistingNames() {
    this.api.getCcSubRegion().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }
  
  
  addCcSubRegion() {
    
    this.CcSubRegionForm.controls['code'].setValue(this.CcSubRegionForm.value.code);

    if (!this.editData) {
      const enteredName = this.CcSubRegionForm.get('name')?.value;
    
    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }
    
      this.CcSubRegionForm.removeControl('id');
      // this.CcSubRegionForm.controls['RegionId'].setValue(this.selectedOption.id);
      console.log('add: ', this.CcSubRegionForm.value);
      this.CcSubRegionForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      if (this.CcSubRegionForm.valid) {
        this.api.postCcSubRegion(this.CcSubRegionForm.value).subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.CcSubRegionForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            this.toastrErrorSave();
          },
        });
      }
    } else {
      this.updateCcSubRegion();
    }
  }


  updateCcSubRegion() {
    this.api.putCcSubRegion(this.CcSubRegionForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.CcSubRegionForm.reset();
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
