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
export class Vendor {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-str-model-dailog',
  templateUrl: './str-model-dailog.component.html',
  styleUrls: ['./str-model-dailog.component.css']
})
export class StrModelDailogComponent {


  transactionUserId=localStorage.getItem('transactionUserId')
  vendorCtrl: FormControl;
  filteredVendores: Observable<Vendor[]>;
  vendores: Vendor[] = [];
  selectedVendor: Vendor | undefined;
  formcontrol = new FormControl('');  
  gradeForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getModelData: any;
  Id:string  | undefined | null;
   vendorDt:any={
  id:0,
}
commname:any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
vendorlist:any;
storeList: any;
vendorName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<StrModelDailogComponent>){
      this.vendorCtrl = new FormControl();
      this.filteredVendores = this.vendorCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterVendores(value))
      );
    }
    ngOnInit(): void {
      this.gradeForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      
      name : ['',Validators.required],
      vendorId : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllVendor().subscribe((vendores)=>{
        this.vendores = vendores;
      });
      
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getModelData = this.editData;
      this.gradeForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        
      this.gradeForm.controls['name'].setValue(this.editData.name);
      
      this.gradeForm.controls['vendorId'].setValue(this.editData.vendorId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.gradeForm.addControl('id', new FormControl('', Validators.required));
      this.gradeForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayVendorName(vendor: any): string {
      return vendor && vendor.name ? vendor.name : '';
    }

    vendorSelected(event: MatAutocompleteSelectedEvent): void {
      const vendor = event.option.value as Vendor;
      this.selectedVendor = vendor;
      this.gradeForm.patchValue({ vendorId: vendor.id });
      this.gradeForm.patchValue({ vendorName: vendor.name });
    }

    private _filterVendores(value: string): Vendor[] {
      const filterValue = value.toLowerCase();
      return this.vendores.filter(vendor =>
        vendor.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoVendor() {
      this.vendorCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.vendorCtrl.updateValueAndValidity();
    }

    

  addModel(){
    if(!this.editData){
      
      this.gradeForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.gradeForm.value);
      this.gradeForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.gradeForm.valid){
        this.api.postModel(this.gradeForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.gradeForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateModel()
    }
  }

  displayVendor (option:any):string {
    return option && option.name ? option.name:'';

  }
      updateModel(){
        this.api.putModel(this.gradeForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.gradeForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
  
  }
  

