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
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class financialDegree {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-employee-financial-degree-dialog',
  templateUrl: './hr-employee-financial-degree-dialog.component.html',
  styleUrls: ['./hr-employee-financial-degree-dialog.component.css']
})
export class HrEmployeeFinancialDegreeDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')
  financialDegreeCtrl: FormControl;
  filteredFinancialDegree: Observable<financialDegree[]>;
  financialDegree: financialDegree[] = [];
  selectedFinancialDegree: financialDegree | undefined;
  formcontrol = new FormControl('');  
  employeeeFinancialDegreeForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getFinancialDegreeData: any;
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
// citylist:any;
// storeList: any;
// cityName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrEmployeeFinancialDegreeDialogComponent>){
      this.financialDegreeCtrl = new FormControl();
      this.filteredFinancialDegree = this.financialDegreeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterFinancialDegree(value))
      );
    }
    ngOnInit(): void {
      this.employeeeFinancialDegreeForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      // code : ['',Validators.required],
      financialDegreeDate : ['',Validators.required],
      financialDegreeId : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllFinancialDegree().subscribe((financialDegree)=>{
        this.financialDegree = financialDegree;
      });
      
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addEmployeeFinancialDegree();
        return false; // Prevent the default browser behavior
      }));
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getFinancialDegreeData = this.editData;
      this.employeeeFinancialDegreeForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.cityStateForm.controls['code'].setValue(this.editData.code);
      this.employeeeFinancialDegreeForm.controls['financialDegreeDate'].setValue(this.editData.financialDegreeDate);
      
      this.employeeeFinancialDegreeForm.controls['financialDegreeId'].setValue(this.editData.financialDegreeId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.employeeeFinancialDegreeForm.addControl('id', new FormControl('', Validators.required));
      this.employeeeFinancialDegreeForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayfinancialDegreeName(financialDegree: any): string {
      return financialDegree && financialDegree.name ? financialDegree.name : '';
    }

    financialDegreeSelected(event: MatAutocompleteSelectedEvent): void {
      const financialDegree = event.option.value as financialDegree;
      this.selectedFinancialDegree = financialDegree;
      this.employeeeFinancialDegreeForm.patchValue({ financialDegreeId: financialDegree.id });
      this.employeeeFinancialDegreeForm.patchValue({ financialDegreeName: financialDegree.name });
    }

    private _filterFinancialDegree(value: string): financialDegree[] {
      const filterValue = value.toLowerCase();
      return this.financialDegree.filter(financialDegree =>
        financialDegree.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoFinancialDegree() {
      this.financialDegreeCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.financialDegreeCtrl.updateValueAndValidity();
    }

    

  addEmployeeFinancialDegree(){
    if(!this.editData){
      
      this.employeeeFinancialDegreeForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.employeeeFinancialDegreeForm.value);
      this.employeeeFinancialDegreeForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.employeeeFinancialDegreeForm.valid){
        this.api.postHrEmployeeFinancialDegree(this.employeeeFinancialDegreeForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.employeeeFinancialDegreeForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateEmployeeFinancialDegree()
    }
  }


  updateEmployeeFinancialDegree(){
        this.api.putEmployeeFinancialDegree(this.employeeeFinancialDegreeForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.employeeeFinancialDegreeForm.reset();
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
