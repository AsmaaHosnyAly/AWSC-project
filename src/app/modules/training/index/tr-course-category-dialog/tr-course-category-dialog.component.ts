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

@Component({
  selector: 'app-tr-course-category-dialog',
  templateUrl: './tr-course-category-dialog.component.html',
  styleUrls: ['./tr-course-category-dialog.component.css']
})
export class TrCourseCategoryDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');  
  TrCourseCategoryForm !:FormGroup;
  actionBtn : string = "حفظ";

  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private hotkeysService: HotkeysService,
     private readonly route:ActivatedRoute,
     private toastr: ToastrService,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<TrCourseCategoryDialogComponent>){
     }
  ngOnInit(): void {
    this.TrCourseCategoryForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addTrCourseCategory();
      return false; // Prevent the default browser behavior
    }));
    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.TrCourseCategoryForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.TrCourseCategoryForm.controls['name'].setValue(this.editData.name);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.TrCourseCategoryForm.addControl('id', new FormControl('', Validators.required));
      this.TrCourseCategoryForm.controls['id'].setValue(this.editData.id);
    }
  }

  addTrCourseCategory(){
    if(!this.editData){
      this.TrCourseCategoryForm.removeControl('id')
      this.TrCourseCategoryForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.TrCourseCategoryForm.valid){
        this.api.postTrCourseCategory(this.TrCourseCategoryForm.value)
        .subscribe({
          next:(res)=>{
            // alert("تمت الاضافة بنجاح");
            this.toastrSuccess();
            this.TrCourseCategoryForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
            console.log(err)
          }
        })
      }
    }else{
      this.updateTrCourseCategory()
    }
  }
  updateTrCourseCategory(){
      this.api.putTrCourseCategory(this.TrCourseCategoryForm.value)
      .subscribe({
        next:(res)=>{
          // alert("تم التحديث بنجاح");
          this.toastrEditSuccess();
          this.TrCourseCategoryForm.reset();
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
