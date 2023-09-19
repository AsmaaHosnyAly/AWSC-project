import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-str-vendor-dialog',
  templateUrl: './str-vendor-dialog.component.html',
  styleUrls: ['./str-vendor-dialog.component.css']
})
export class StrVendorDialogComponent {
  formcontrol = new FormControl('');  
  vendorsForm !:FormGroup;
  actionBtn : string = "حفظ";
  userIdFromStorage: any;
  transactionUserId=localStorage.getItem('transactionUserId')
  
  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private readonly route:ActivatedRoute,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<StrVendorDialogComponent>){
     }
  ngOnInit(): void {
    this.vendorsForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
    });

    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.userIdFromStorage = localStorage.getItem('transactionUserId');
      this.vendorsForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.vendorsForm.controls['name'].setValue(this.editData.name);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.vendorsForm.addControl('id', new FormControl('', Validators.required));
      this.vendorsForm.controls['id'].setValue(this.editData.id);
      console.log(this.vendorsForm.value)
    }
  }

  addVendor(){
    if(!this.editData){
      this.vendorsForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("hhhhhh",this.transactionUserId);

      this.vendorsForm.removeControl('id')
      if(this.vendorsForm.valid){
        console.log("hhhhhhthis.vendorsForm",this.vendorsForm);
        this.api.postVendor(this.vendorsForm.value)
        .subscribe({
          next:(res)=>{
            
            alert("تمت الاضافة بنجاح");
            this.vendorsForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
            console.log(err)
          }
        })
      }
    }else{
      this.updateVendor()
    }
  }
    updateVendor(){
      this.api.putVendor(this.vendorsForm.value )
      .subscribe({
        next:(res)=>{
          alert("تم التحديث بنجاح");
          this.vendorsForm.reset();
          this.dialogRef.close('update');
        },
        error:()=>{
          alert("خطأ عند تحديث البيانات");
        }
      })
    }


}
