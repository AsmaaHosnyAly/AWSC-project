import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-hr-millitry-state-dialog',
  templateUrl: './hr-millitry-state-dialog.component.html',
  styleUrls: ['./hr-millitry-state-dialog.component.css']
})
export class HrMillitryStateDialogComponent {
  formcontrol = new FormControl('');  
  MillitryStatesForm !:FormGroup;
  actionBtn : string = "حفظ";
  userIdFromStorage: any;
  transactionUserId=localStorage.getItem('transactionUserId')
  
  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private readonly route:ActivatedRoute,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<HrMillitryStateDialogComponent>){
     }
  ngOnInit(): void {
    this.MillitryStatesForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
    });

    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.userIdFromStorage = localStorage.getItem('transactionUserId');
      this.MillitryStatesForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.MillitryStatesForm.controls['name'].setValue(this.editData.name);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.MillitryStatesForm.addControl('id', new FormControl('', Validators.required));
      this.MillitryStatesForm.controls['id'].setValue(this.editData.id);
      console.log(this.MillitryStatesForm.value)
    }
  }

  addProduct(){
    if(!this.editData){
      this.MillitryStatesForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("hhhhhh",this.transactionUserId);

      this.MillitryStatesForm.removeControl('id')
      if(this.MillitryStatesForm.valid){
        console.log("hhhhhhthis.MillitryStatesForm",this.MillitryStatesForm);
        this.api.postMillitryState(this.MillitryStatesForm.value)
        .subscribe({
          next:(res)=>{
            
            alert("تمت الاضافة بنجاح");
            this.MillitryStatesForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
            console.log(err)
          }
        })
      }
    }else{
      this.updateMillitryStates()
    }
  }
    updateMillitryStates(){
      this.api.putMillitryState(this.MillitryStatesForm.value )
      .subscribe({
        next:(res)=>{
          alert("تم التحديث بنجاح");
          this.MillitryStatesForm.reset();
          this.dialogRef.close('update');
        },
        error:()=>{
          alert("خطأ عند تحديث البيانات");
        }
      })
    }


}


