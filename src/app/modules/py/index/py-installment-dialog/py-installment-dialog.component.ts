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
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

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

  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<PyInstallmentDialogComponent>){
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
        this.PyInstallmentForm.controls['no'].setValue(this.editData.no);
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
      return this.employees.filter((employee) =>
      employee.name ? employee.name.includes(filterValue) : '-'
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

  AddInstallment(){
    if(!this.editData){
      
      this.PyInstallmentForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.PyInstallmentForm.value);
      this.PyInstallmentForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.PyInstallmentForm.valid){
        this.api.postPyInstallment(this.PyInstallmentForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.PyInstallmentForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateInstallment()
    }
  }


  updateInstallment(){
        this.api.putPyInstallment(this.PyInstallmentForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.PyInstallmentForm.reset();
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

