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
export class Commodity {
  constructor(public id: number, public name: string, public code: any) {}
}

export class Account {
  constructor(public id: number, public name: string, public code: any) {}
}

@Component({
  selector: 'app-str-grade-dialog',
  templateUrl: './str-grade-dialog.component.html',
  styleUrls: ['./str-grade-dialog.component.css'],
})
export class STRGradeDialogComponent {
  transactionUserId = localStorage.getItem('transactionUserId');
 loading :boolean=false;
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  getGradeData: any;
  selectedCommodity: Commodity | undefined;
  accountCtrl: FormControl;
  filteredAccounts: Observable<Account[]>;
  accounts: Account[] = [];
  selectedAccount:Account| undefined;
  formcontrol = new FormControl('');
  gradeForm!: FormGroup;
  actionBtn: string = 'حفظ';
  selectedOption: any;
  dataSource!: MatTableDataSource<any>;
  existingNames: string[] = [];
  existingCommodity: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  allGrades: any;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<STRGradeDialogComponent>,
    private toastr: ToastrService
  ) {
    this.commodityCtrl = new FormControl();
    this.filteredCommodities = this.commodityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCommodities(value))
    );

    this.accountCtrl = new FormControl();
    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccounts(value))
    );
  }
  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addGrade();
      return false; // Prevent the default browser behavior
    }));
    this.gradeForm = this.formBuilder.group({
      //define the components of the form
      transactionUserId: ['', Validators.required],
      code: [''],
      name: ['', Validators.required],
      commodityId: ['', Validators.required],
      accountId: ['', Validators.required],

      id: ['', Validators.required],
      // matautocompleteFieldName : [''],
    });

    this.getAllCommodities()
    

    this.getAccounts()
     

    if (this.editData) {
      this.actionBtn = 'تعديل';
      this.getGradeData = this.editData;
      this.gradeForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      this.gradeForm.controls['code'].setValue(this.editData.code);
      this.gradeForm.controls['name'].setValue(this.editData.name);

      this.gradeForm.controls['commodityId'].setValue(
        this.editData.commodityId
      );

      this.gradeForm.controls['accountId'].setValue(
        this.editData.accountId
      );
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.gradeForm.addControl('id', new FormControl('', Validators.required));
      this.gradeForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayCommodityName(commodity: any): string {
    return commodity ? commodity.name && commodity.name != null ? commodity.name : '-' : '';
  }
  getAccounts() {
    this.loading = true;
    this.api.getAllAccount().subscribe({
      next: (res) => {
        this.loading = false;
        this.accounts = res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

  getAllCommodities() {
    this.loading = true;
    this.api.getAllCommodities().subscribe({
      next: (res) => {
        this.loading = false;
        this.commodities= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  commoditySelected(event: MatAutocompleteSelectedEvent): void {
    const commodity = event.option.value as Commodity;
    this.selectedCommodity = commodity;
    this.gradeForm.patchValue({ commodityId: commodity.id });
    this.gradeForm.patchValue({ commodityName: commodity.name });
    this.getCodeByCommodityId();
  }

  private _filterCommodities(value: string): Commodity[] {
    const filterValue = value.toLowerCase();
    return this.commodities.filter(
      (commodity) =>
      commodity.name || commodity.code ? commodity.name.toLowerCase().includes(filterValue) ||
        commodity.code.toString().toLowerCase().includes(filterValue): '-'
    );
  }

  openAutoCommodity() {
    this.commodityCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.commodityCtrl.updateValueAndValidity();
  }

  displayAccountName(account: any): string {
    return account ? account.name && account.name != null ? account.name : '-' : '';
  }

  accountSelected(event: MatAutocompleteSelectedEvent): void {
    const account = event.option.value as Account;
    this.selectedAccount = account;
    this.gradeForm.patchValue({ accountId: account.id });
    this.gradeForm.patchValue({ accountName: account.name });
  }

  private _filterAccounts(value: string): Account[] {
    const filterValue = value.toLowerCase();
    return this.accounts.filter(
      (account) =>
        account.name || account.code ? account.name.toLowerCase().includes(filterValue) || account.code.toString().toLowerCase().includes(filterValue) : '-'
    );
  }

  openAutoAccount() {
    this.accountCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.accountCtrl.updateValueAndValidity();
  }

  getCodeByCommodityId() {
    this.api.getGradeCode(this.selectedCommodity?.id).subscribe({
      next: (res) => {
        if (this.editData) {
          if (this.editData.commodityId == this.selectedCommodity?.id) {
            console.log(' edit data with matched choices:');

            this.gradeForm.controls['code'].setValue(this.editData.code);
          } else {
            console.log(' edit data without matched choices:');

            this.gradeForm.controls['code'].setValue(res);
          }
        } else {
          console.log('without editData:');
          this.gradeForm.controls['code'].setValue(res);
        }
      },
      error: (err) => {
        console.log('get code. err: ', err);
      },
    });
  }
  getExistingNames() {
    this.api.getGrade().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }
  
  
  addGrade() {
    
    this.gradeForm.controls['code'].setValue(this.gradeForm.value.code);

    if (!this.editData) {
      const enteredName = this.gradeForm.get('name')?.value;
    
    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }
    
      this.gradeForm.removeControl('id');
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log('add: ', this.gradeForm.value);
      this.gradeForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      if (this.gradeForm.valid) {
        this.loading = true;
        this.api.postGrade(this.gradeForm.value).subscribe({
          next: (res) => {
            this.loading =false;
            this.toastrSuccess();
            this.gradeForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            this.loading=false;
            this.toastrErrorSave();
          },
          
        });
        
      }
      else{
        this.toastrWarningPost();
      }
    } else {
      this.updateGrade();
    }
  }


  updateGrade() {
    this.api.putGrade(this.gradeForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.gradeForm.reset();
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
  toastrWarningPost(): void {
    this.toastr.warning('كود النوعيةيجب أن يحتوي على رقم واحد ');
  }
}
