import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';

@Component({
  selector: 'app-hr-attendance-permission-dialog',
  templateUrl: './hr-attendance-permission-dialog.component.html',
  styleUrls: ['./hr-attendance-permission-dialog.component.css']
})
export class HrAttendancePermissionDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');  
  HrAttendancePermissionForm!:FormGroup;
  actionBtn : string = "حفظ";

  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private hotkeysService: HotkeysService,
     private readonly route:ActivatedRoute,
     private toastr: ToastrService,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     global:GlobalService,
     private dialogRef : MatDialogRef<HrAttendancePermissionDialogComponent>){
      global.getPermissionUserRoles('IT', '', 'الحضور والإنصراف', 'book')
     }
  ngOnInit(): void {
    this.HrAttendancePermissionForm  = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addHrAttendancePermission();
      return false; // Prevent the default browser behavior
    }));
    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.HrAttendancePermissionForm .controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.HrAttendancePermissionForm .controls['name'].setValue(this.editData.name);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.HrAttendancePermissionForm.addControl('id', new FormControl('', Validators.required));
      this.HrAttendancePermissionForm.controls['id'].setValue(this.editData.id);
    }
  }

  addHrAttendancePermission(){
    if(!this.editData){
      this.HrAttendancePermissionForm.removeControl('id')
      this.HrAttendancePermissionForm .controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.HrAttendancePermissionForm.valid){
        this.api.postHrAttendancePermission(this.HrAttendancePermissionForm .value)
        .subscribe({
          next:(res)=>{
            // alert("تمت الاضافة بنجاح");
            this.toastrSuccess();
            this.HrAttendancePermissionForm .reset();
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
      this.api.putHrAttendancePermission(this.HrAttendancePermissionForm .value)
      .subscribe({
        next:(res)=>{
          // alert("تم التحديث بنجاح");
          this.toastrEditSuccess();
          this.HrAttendancePermissionForm .reset();
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

