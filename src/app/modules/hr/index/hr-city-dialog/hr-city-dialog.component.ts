import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-hr-city-dialog',
  templateUrl: './hr-city-dialog.component.html',
  styleUrls: ['./hr-city-dialog.component.css']
})
export class HrCityDialogComponent {
  formcontrol = new FormControl('');  
  HrcityForm !:FormGroup;
  actionBtn : string = "حفظ";

  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private readonly route:ActivatedRoute,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<HrCityDialogComponent>){
     }
  ngOnInit(): void {
    this.HrcityForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
    });

    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.HrcityForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.HrcityForm.controls['name'].setValue(this.editData.name);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.HrcityForm.addControl('id', new FormControl('', Validators.required));
      this.HrcityForm.controls['id'].setValue(this.editData.id);
    }
  }

  addHrCities(){
    if(!this.editData){
      this.HrcityForm.removeControl('id')
      if(this.HrcityForm.valid){
        this.api.postHrCity(this.HrcityForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.HrcityForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
            console.log(err)
          }
        })
      }
    }else{
      this.updateHrCities()
    }
  }
  updateHrCities(){
      this.api.putHrCity(this.HrcityForm.value)
      .subscribe({
        next:(res)=>{
          alert("تم التحديث بنجاح");
          this.HrcityForm.reset();
          this.dialogRef.close('update');
        },
        error:()=>{
          alert("خطأ عند تحديث البيانات");
        }
      })
    }

}
