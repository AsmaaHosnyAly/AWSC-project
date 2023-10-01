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
import { ToastrService } from 'ngx-toastr';

export class QualitativeGroup {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-qualification-dialog',
  templateUrl: './hr-qualification-dialog.component.html',
  styleUrls: ['./hr-qualification-dialog.component.css']
})
export class HrQualificationDialogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')
  qualitativeGroupCtrl: FormControl;
  filteredQualitativeGroup: Observable<QualitativeGroup[]>;
  qualitativeGroups: QualitativeGroup[] = [];
  selectedQualitativeGroup!: QualitativeGroup;
  formcontrol = new FormControl('');  
  qualificationForm!: FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getQualificationData: any;
 dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,private toastr: ToastrService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrQualificationDialogComponent>){
      this.qualitativeGroupCtrl = new FormControl();
    this.filteredQualitativeGroup = this.qualitativeGroupCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterQualitativeGroup(value))
    );
    }
    ngOnInit(): void {
      this.qualificationForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      qualitativeGroupId : ['',Validators.required],
      qualitativeGroupName : [''],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllQualitativeGroups().subscribe((qualitativeGroup) => {
        this.qualitativeGroups = qualitativeGroup;
      });
      
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getQualificationData = this.editData;
      this.qualificationForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.qualificationForm.controls['name'].setValue(this.editData.name);            
      this.qualificationForm.controls['qualitativeGroupId'].setValue(this.editData.qualitativeGroupId);
      this.qualificationForm.controls['qualitativeGroupName'].setValue(this.editData.qualitativeGroupName);
      this.qualificationForm.addControl('id', new FormControl('', Validators.required));
      this.qualificationForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayQualitativeGroup(qualitativeGroup: any): string {
      return qualitativeGroup && qualitativeGroup.name ? qualitativeGroup.name : '';
    }
    qualitativeGroupSelected(event: MatAutocompleteSelectedEvent): void {
      const qualitativeGroup = event.option.value as QualitativeGroup;
      this.selectedQualitativeGroup = qualitativeGroup;
      this.qualificationForm.patchValue({ qualitativeGroupId: qualitativeGroup.id });
      this.qualificationForm.patchValue({ qualitativeGroupName: qualitativeGroup.name });
    }
    private _filterQualitativeGroup(value: string): QualitativeGroup[] {
      const filterValue = value.toLowerCase();
      return this.qualitativeGroups.filter(qualitativeGroup =>
        qualitativeGroup.name.toLowerCase().includes(filterValue) 
      );
    }
  
    openAutoQualitativeGroup() {
      this.qualitativeGroupCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.qualitativeGroupCtrl.updateValueAndValidity();
    }

    

    addQualification(){
    if(!this.editData){
      
      this.qualificationForm.removeControl('id')
      // this.qualificationForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.qualificationForm.value);
      this.qualificationForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.qualificationForm.valid){
        this.api.postQualification(this.qualificationForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess()
            // alert("تمت الاضافة بنجاح");
            this.qualificationForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateQualification()
    }
  }
      updateQualification(){
        this.api.putQualification(this.qualificationForm.value)
        .subscribe({
          next:(res)=>{
            // alert("تم التحديث بنجاح");
            this.toastrEditSuccess()
            this.qualificationForm.reset();
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
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }

  }
  
