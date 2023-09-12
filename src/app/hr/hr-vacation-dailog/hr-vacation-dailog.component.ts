import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-hr-vacation-dailog',
  templateUrl: './hr-vacation-dailog.component.html',
  styleUrls: ['./hr-vacation-dailog.component.css']
})
export class HrVacationDailogComponent {
  formcontrol = new FormControl('');  
  VacationsForm !:FormGroup;
  actionBtn : string = "حفظ";
  userIdFromStorage: any;
  transactionUserId=localStorage.getItem('transactionUserId')
  
  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private readonly route:ActivatedRoute,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<HrVacationDailogComponent>){
     }
  ngOnInit(): void {
    this.VacationsForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
    });

    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.userIdFromStorage = localStorage.getItem('transactionUserId');
      this.VacationsForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.VacationsForm.controls['name'].setValue(this.editData.name);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.VacationsForm.addControl('id', new FormControl('', Validators.required));
      this.VacationsForm.controls['id'].setValue(this.editData.id);
      console.log(this.VacationsForm.value)
    }
  }

  addProduct(){
    if(!this.editData){
      this.VacationsForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("hhhhhh",this.transactionUserId);

      this.VacationsForm.removeControl('id')
      if(this.VacationsForm.valid){
        console.log("hhhhhhthis.vendorsForm",this.VacationsForm);
        this.api.postVacation(this.VacationsForm.value)
        .subscribe({
          next:(res)=>{
            
            alert("تمت الاضافة بنجاح");
            this.VacationsForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
            console.log(err)
          }
        })
      }
    }else{
      this.updateVacation()
    }
  }
    updateVacation(){
      this.api.putVacation(this.VacationsForm.value )
      .subscribe({
        next:(res)=>{
          alert("تم التحديث بنجاح");
          this.VacationsForm.reset();
          this.dialogRef.close('update');
        },
        error:()=>{
          alert("خطأ عند تحديث البيانات");
        }
      })
    }




}
