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
  selector: 'app-py-item-category-dialog',
  templateUrl: './py-item-category-dialog.component.html',
  styleUrls: ['./py-item-category-dialog.component.css']
})
export class PyItemCategoryDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')
  formcontrol = new FormControl('');  
  PyItemCategoryForm !:FormGroup;
  actionBtn : string = "حفظ";

  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private hotkeysService: HotkeysService,
     private readonly route:ActivatedRoute,
     private toastr: ToastrService,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<PyItemCategoryDialogComponent>){
     }
  ngOnInit(): void {
    this.PyItemCategoryForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addPyItemCategory();
      return false; // Prevent the default browser behavior
    }));
    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.PyItemCategoryForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.PyItemCategoryForm.controls['name'].setValue(this.editData.name);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.PyItemCategoryForm.addControl('id', new FormControl('', Validators.required));
      this.PyItemCategoryForm.controls['id'].setValue(this.editData.id);
    }
  }

  addPyItemCategory(){
    if(!this.editData){
      this.PyItemCategoryForm.removeControl('id')
      this.PyItemCategoryForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.PyItemCategoryForm.valid){
        this.api.postPyItemCategory(this.PyItemCategoryForm.value)
        .subscribe({
          next:(res)=>{
            // alert("تمت الاضافة بنجاح");
            this.toastrSuccess();
            this.PyItemCategoryForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
            console.log(err)
          }
        })
      }
    }else{
      this.updatePyItemCategory()
    }
  }
  updatePyItemCategory(){
      this.api.putPyItemCategory(this.PyItemCategoryForm.value)
      .subscribe({
        next:(res)=>{
          // alert("تم التحديث بنجاح");
          this.toastrEditSuccess();
          this.PyItemCategoryForm.reset();
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
