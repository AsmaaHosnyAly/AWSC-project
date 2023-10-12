import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-fi-account-hierarchy-dialog',
  templateUrl: './fi-account-hierarchy-dialog.component.html',
  styleUrls: ['./fi-account-hierarchy-dialog.component.css']
})
export class FIAccountHierarchyDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');  
  FIAccountForm !:FormGroup;
  actionBtn : string = "حفظ";

  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private readonly route:ActivatedRoute,
     private hotkeysService: HotkeysService,
     private toastr: ToastrService,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<FIAccountHierarchyDialogComponent>){
     }
  ngOnInit(): void {
    this.FIAccountForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
      level : ['',Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addFIAccountHierarchy();
      return false; // Prevent the default browser behavior
    }));
    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.FIAccountForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.FIAccountForm.controls['name'].setValue(this.editData.name);
      this.FIAccountForm.controls['level'].setValue(this.editData.level);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.FIAccountForm.addControl('id', new FormControl('', Validators.required));
      this.FIAccountForm.controls['id'].setValue(this.editData.id);
    }
  }

  addFIAccountHierarchy(){
    if(!this.editData){
      this.FIAccountForm.removeControl('id')
      if(this.FIAccountForm.valid){
        console.log("FIAccountForm :",this.FIAccountForm.value);
        
        this.api.postFIAccountHierarchy(this.FIAccountForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.FIAccountForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
            console.log(err)
          }
        })
      }
    }else{
      this.updateAccount()
    }
  }
    updateAccount(){
      this.api.putFIAccountHierarchy(this.FIAccountForm.value)
      .subscribe({
        next:(res)=>{
          this.toastrEditSuccess();
          this.FIAccountForm.reset();
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
