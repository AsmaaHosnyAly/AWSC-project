import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/pages/services/global.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { __param } from 'tslib';
import { ParseSourceSpan } from '@angular/compiler';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { UploadService } from 'src/app/upload.service';

export class Employee {
  constructor(public id: number, public name: string) {}
}

export class PyItem {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-py-installment-dialog',
  templateUrl: './py-installment-dialog.component.html',
  styleUrls: ['./py-installment-dialog.component.css']
})
export class PyInstallmentDialogComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')
  employeeCtrl: FormControl;
  filteredEmployees: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;

  pyItemCtrl: FormControl;
  filteredPyItems: Observable<PyItem[]>;
  pyItems: PyItem[] = [];
  selectedPyItem: PyItem | undefined;


  getPyInstallmentData: any;
  PyInstallmentForm!: FormGroup;
  actionBtn: string = 'حفظ';
  productIdToEdit: any;
  existingNames: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<PyInstallmentDialogComponent>,
    private toastr: ToastrService
  ) {
    this.employeeCtrl = new FormControl();
    this.filteredEmployees = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEmployees(value))
    );

    this.pyItemCtrl = new FormControl();
    this.filteredPyItems= this.pyItemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPyItems(value))
    );
  }

  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.PyInstallmentForm = this.formBuilder.group({
      no: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      value: ['', Validators.required],
      installmentValue: ['', Validators.required],
      installmentNo: ['', Validators.required],
      paiedSum: ['', Validators.required],
      employeeId: ['', Validators.required],
      pyItemId: ['', Validators.required],
      transactionUserId: ['',Validators.required],
    });

    this.api.getEmployees().subscribe((employees) => {
      this.employees = employees;
    });

    this.api.getAllpyItems().subscribe((pyItems) => {
      this.pyItems = pyItems;
    });


    this.hotkeysService.add(
      new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.AddInstallment();
        return false; // Prevent the default browser behavior
      })
    );

    if (this.editData) {
      this.actionBtn = 'تحديث';
      this.getPyInstallmentData = this.editData;
      alert( this.PyInstallmentForm.controls['no'].setValue(this.editData.no))
      this.PyInstallmentForm.controls['description'].setValue(this.editData.description);
      this.PyInstallmentForm.controls['startDate'].setValue(this.editData.startDate);
      this.PyInstallmentForm.controls['value'].setValue(this.editData.value);
      this.PyInstallmentForm.controls['installmentValue'].setValue(this.editData.installmentValue);
      this.PyInstallmentForm.controls['installmentNo'].setValue(this.editData.installmentNo);
      this.PyInstallmentForm.controls['paiedSum'].setValue(this.editData.paiedSum);
      this.PyInstallmentForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.PyInstallmentForm.controls['pyItemId'].setValue(this.editData.pyItemId);
      this.PyInstallmentForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.PyInstallmentForm.addControl('id', new FormControl('', Validators.required));
      this.PyInstallmentForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }

  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    this.selectedEmployee = employee;
    this.PyInstallmentForm.patchValue({ employeeId: employee.id });
    this.PyInstallmentForm.patchValue({ employeeName: employee.name });
  }

  private _filterEmployees(value: string): Employee[] {
    const filterValue = value.toLowerCase();
    return this.employees.filter(
      (employee) => employee.name.toLowerCase().includes(filterValue)
      );
  }

  openAutoEmployee() {
    this.employeeCtrl.setValue('');
    this.employeeCtrl.updateValueAndValidity();
  }

  displayPyItemName(pyItem: any): string {
    return pyItem && pyItem.name ? pyItem.name : '';
  }

  pyItemSelected(event: MatAutocompleteSelectedEvent): void {
    const pyItem = event.option.value as PyItem;
    this.selectedPyItem = pyItem;
    this.PyInstallmentForm.patchValue({ pyItemId: pyItem.id });
    this.PyInstallmentForm.patchValue({ pyItemName: pyItem.name });
  }

  private _filterPyItems(value: string): PyItem[] {
    const filterValue = value.toLowerCase();
    return this.pyItems.filter(
      (pyItem) => pyItem.name.toLowerCase().includes(filterValue)
      );
  }

  openAutoPyItem() {
    this.pyItemCtrl.setValue('');
    this.pyItemCtrl.updateValueAndValidity();
  }

  getExistingNames() {
    this.api.getPyInstallment().subscribe({
      next: (res) => {
        this.existingNames = res.map((product: any) => product.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      },
    });
  }
  

  AddInstallment() {
    if (!this.editData) {
      const enteredName = this.PyInstallmentForm.get('name')?.value;
      this.PyInstallmentForm.controls['transactionUserId'].setValue(this.transactionUserId);

      if (this.existingNames.includes(enteredName)) {
        alert('هذا الاسم موجود من قبل، قم بتغييره');
        return;
      }
      this.PyInstallmentForm.removeControl('id');
      if (this.PyInstallmentForm.valid) {
        
        this.api.postPyInstallment(this.PyInstallmentForm.value).subscribe({
          next: (res) => {
            console.log('add product res: ', res);
            this.productIdToEdit = res.id;

            this.toastrSuccess();
            this.PyInstallmentForm.reset();

            this.dialogRef.close('save');
          },
          error: (err) => {
            console.log('error:',err)
              this.toastrErrorSave(); 
          },
        });
      }
      // }
    } else {
      this.updateInstallment();
    }
  }

  updateInstallment() {
    console.log('update product last values, id: ', this.PyInstallmentForm.value);
    this.api.putPyInstallment(this.PyInstallmentForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.PyInstallmentForm.reset();
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

