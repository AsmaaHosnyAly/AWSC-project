// import { CcPlantComponent } from './../cc-plant/cc-plant.component';




// import { Component, OnInit, Inject, ViewChild } from '@angular/core';
// import {
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   Validators,
//   FormArray,
// } from '@angular/forms';
// import { ApiService } from '../../services/api.service';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';
// import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
// import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatSort, MatSortModule } from '@angular/material/sort';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { HotkeysService } from 'angular2-hotkeys';
// import { Hotkey } from 'angular2-hotkeys';
// import { ToastrService } from 'ngx-toastr';
// export class CcRegion {
//   constructor(public id: number, public name: string, public code: any) {}
// }
// export class CcFunction {
//   constructor(public id: number, public name: string, public code: any) {}
// }
// export class CcSource {
//   constructor(public id: number, public name: string, public code: any) {}
// }
// export class CcPlant {
//   constructor(public id: number, public name: string, public code: any) {}
// }
// export class CcPlantComponent {
//   constructor(public id: number, public name: string, public code: any) {}
// }
// export class CcRegion {
//   constructor(public id: number, public name: string, public code: any) {}
// }
// export class CcRegion {
//   constructor(public id: number, public name: string, public code: any) {}
// }




// @Component({
//   selector: 'app-cc-cost-center-dialog',
//   templateUrl: './cc-cost-center-dialog.component.html',
//   styleUrls: ['./cc-cost-center-dialog.component.css']
// })
// export class CcCostCenterDialogComponent {
//   transactionUserId = localStorage.getItem('transactionUserId');
//   CcRegionCtrl: FormControl;
//   filteredCcRegion: Observable<CcRegion[]>;
//   CcRegion: CcRegion[] = [];
//   getCcCostCenterData: any;
//   selectedCcRegion: CcRegion | undefined;
//   // accountCtrl: FormControl;
//   // filteredAccounts: Observable<Account[]>;
//   // accounts: Account[] = [];
//   // selectedAccount:Account| undefined;
//   formcontrol = new FormControl('');
//   CcCostCenterForm!: FormGroup;
//   actionBtn: string = 'حفظ';
//   selectedOption: any;
//   dataSource!: MatTableDataSource<any>;
//   existingNames: string[] = [];
//   existingCcRegion: string[] = [];
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild(MatAccordion)
//   accordion!: MatAccordion;
//   allCcCostCenters: any;
//   constructor(
//     private formBuilder: FormBuilder,
//     private api: ApiService,
//     private hotkeysService: HotkeysService,
//     private readonly route: ActivatedRoute,
//     @Inject(MAT_DIALOG_DATA) public editData: any,
//     private dialogRef: MatDialogRef<CcCostCenterDialogComponent>,
//     private toastr: ToastrService
//   ) {
//     this.CcRegionCtrl = new FormControl();
//     this.filteredCcRegion = this.CcRegionCtrl.valueChanges.pipe(
//       startWith(''),
//       map((value) => this._filterCcRegion(value))
//     );

//     // this.accountCtrl = new FormControl();
//     // this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
//     //   startWith(''),
//     //   map((value) => this._filterAccounts(value))
//     // );
//   }
//   ngOnInit(): void {
//     this.getExistingNames(); // Fetch existing names
//     this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
//       // Call the deleteCcCostCenter() function in the current component
//       this.addCcCostCenter();
//       return false; // Prevent the default browser behavior
//     }));
//     this.CcCostCenterForm = this.formBuilder.group({
//       //define the components of the form
//       transactionUserId: [1, Validators.required],
//       code: [''],
//       name: ['', Validators.required],
//       RegionId: ['', Validators.required],

//       id: ['', Validators.required],
//       // matautocompleteFieldName : [''],
//     });

//     this.api.getCcRegion().subscribe((CcRegion) => {
//       this.CcRegion = CcRegion;
//     });

//     // this.api.getAllAccount().subscribe((accounts) => {
//     //   this.accounts = accounts;
//     // });

//     if (this.editData) {
//       this.actionBtn = 'تعديل';
//       this.getCcCostCenterData = this.editData;
//       this.CcCostCenterForm.controls['transactionUserId'].setValue(
//         this.editData.transactionUserId
//       );
//       this.CcCostCenterForm.controls['code'].setValue(this.editData.code);
//       this.CcCostCenterForm.controls['name'].setValue(this.editData.name);

//       this.CcCostCenterForm.controls['RegionId'].setValue(
//         this.editData.RegionId
//       );

//       this.CcCostCenterForm.controls['accountId'].setValue(
//         this.editData.accountId
//       );
//       // console.log("RegionId: ", this.CcCostCenterForm.controls['RegionId'].value)
//       this.CcCostCenterForm.addControl('id', new FormControl('', Validators.required));
//       this.CcCostCenterForm.controls['id'].setValue(this.editData.id);
//     }
//   }

//   displayCcRegionName(CcRegion: any): string {
//     return CcRegion && CcRegion.name ? CcRegion.name : '';
//   }

//   CcRegionSelected(event: MatAutocompleteSelectedEvent): void {
//     const CcRegion = event.option.value as CcRegion;
//     this.selectedCcRegion = CcRegion;
//     this.CcCostCenterForm.patchValue({ RegionId: CcRegion.id });
//     this.CcCostCenterForm.patchValue({ CcRegionName: CcRegion.name });
//     // this.getCodeByRegionId();
//   }

//   private _filterCcRegion(value: string): CcRegion[] {
//     const filterValue = value.toLowerCase();
//     return this.CcRegion.filter(
//       (CcRegion) =>
//         CcRegion.name.toLowerCase().includes(filterValue) ||
//         CcRegion.code.toString().toLowerCase().includes(filterValue)
//     );
//   }

//   openAutoCcRegion() {
//     this.CcRegionCtrl.setValue(''); // Clear the input field value

//     // Open the autocomplete dropdown by triggering the value change event
//     this.CcRegionCtrl.updateValueAndValidity();
//   }

//   // displayAccountName(account: any): string {
//   //   return account && account.name ? account.name : '';
//   // }

//   // accountSelected(event: MatAutocompleteSelectedEvent): void {
//   //   const account = event.option.value as Account;
//   //   this.selectedAccount = account;
//   //   this.CcCostCenterForm.patchValue({ accountId: account.id });
//   //   this.CcCostCenterForm.patchValue({ accountName: account.name });
//   // }

//   // private _filterAccounts(value: string): Account[] {
//   //   const filterValue = value.toLowerCase();
//   //   return this.accounts.filter(
//   //     (account) =>
//   //       account.name.toLowerCase().includes(filterValue) ||
//   //       account.code.toString().toLowerCase().includes(filterValue)
//   //   );
//   // }

//   // openAutoAccount() {
//   //   this.accountCtrl.setValue(''); // Clear the input field value

//   //   // Open the autocomplete dropdown by triggering the value change event
//   //   this.accountCtrl.updateValueAndValidity();
//   // }

//   // getCodeByRegionId() {
//   //   this.api.getCcCostCenterCode(this.selectedCcRegion?.id).subscribe({
//   //     next: (res) => {
//   //       if (this.editData) {
//   //         if (this.editData.RegionId == this.selectedCcRegion?.id) {
//   //           console.log(' edit data with matched choices:');

//   //           this.CcCostCenterForm.controls['code'].setValue(this.editData.code);
//   //         } else {
//   //           console.log(' edit data without matched choices:');

//   //           this.CcCostCenterForm.controls['code'].setValue(res);
//   //         }
//   //       } else {
//   //         console.log('without editData:');
//   //         this.CcCostCenterForm.controls['code'].setValue(res);
//   //       }
//   //     },
//   //     error: (err) => {
//   //       console.log('get code. err: ', err);
//   //     },
//   //   });
//   // }
//   getExistingNames() {
//     this.api.getCcCostCenter().subscribe({
//       next: (res) => {
//         this.existingNames = res.map((item: any) => item.name);
//       },
//       error: (err) => {
//         console.log('Error fetching existing names:', err);
//       }
//     });
//   }
  
  
//   addCcCostCenter() {
    
//     this.CcCostCenterForm.controls['code'].setValue(this.CcCostCenterForm.value.code);

//     if (!this.editData) {
//       const enteredName = this.CcCostCenterForm.get('name')?.value;
    
//     if (this.existingNames.includes(enteredName)) {
//       alert('هذا الاسم موجود من قبل، قم بتغييره');
//       return;
//     }
    
//       this.CcCostCenterForm.removeControl('id');
//       // this.CcCostCenterForm.controls['RegionId'].setValue(this.selectedOption.id);
//       console.log('add: ', this.CcCostCenterForm.value);
//       this.CcCostCenterForm.controls['transactionUserId'].setValue(
//         this.transactionUserId
//       );
//       if (this.CcCostCenterForm.valid) {
//         this.api.postCcCostCenter(this.CcCostCenterForm.value).subscribe({
//           next: (res) => {
//             this.toastrSuccess();
//             this.CcCostCenterForm.reset();
//             this.dialogRef.close('save');
//           },
//           error: (err) => {
//             this.toastrErrorSave();
//           },
//         });
//       }
//     } else {
//       this.updateCcCostCenter();
//     }
//   }


//   updateCcCostCenter() {
//     this.api.putCcCostCenter(this.CcCostCenterForm.value).subscribe({
//       next: (res) => {
//         this.toastrEdit();
//         this.CcCostCenterForm.reset();
//         this.dialogRef.close('update');
//       },
//       error: () => {
//         this.toastrErrorEdit();
//       },
//     });
//   }
//   toastrSuccess(): void {
//     this.toastr.success('تم الحفظ بنجاح');
//   }

//   toastrEdit(): void {
//     this.toastr.success('تم التحديث بنجاح');
//   }

//   toastrErrorSave(): void {
//     this.toastr.error('!خطأ عند حفظ البيانات');
//   }

//   toastrErrorEdit(): void {
//     this.toastr.error('!خطأ عند تحديث البيانات');

//   }
// }
