import { Component, OnInit, Inject, ViewChild } from '@angular/core';
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
  selector: 'app-tr-course-type-dialog',
  templateUrl: './tr-course-type-dialog.component.html',
  styleUrls: ['./tr-course-type-dialog.component.css']
})
export class TrCourseTypeDialogComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')
  
  courseTypeForm!: FormGroup;
  actionBtn: string = 'حفظ';
  productIdToEdit: any;
  existingNames: string[] = [];

  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<TrCourseTypeDialogComponent>){ }
    ngOnInit(): void {
      this.courseTypeForm = this.formBuilder.group({
        name: ['', Validators.required],
        transactionUserId: ['',Validators.required],
      });
      

  
      this.hotkeysService.add(
        new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
          // Call the deleteGrade() function in the current component
          this.addCourseType();
          return false; // Prevent the default browser behavior
        })
      );
  
      if (this.editData) {
        this.actionBtn = 'تحديث';
        console.log("edit",this.editData);        
        this.courseTypeForm.controls['name'].setValue(this.editData.name);
        this.courseTypeForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        this.courseTypeForm.addControl('id', new FormControl('', Validators.required));
        this.courseTypeForm.controls['id'].setValue(this.editData.id);
      }
    }

    

    getExistingNames() {
      this.api.getCourseType().subscribe({
        next: (res) => {
          this.existingNames = res.map((product: any) => product.name);
        },
        error: (err) => {
          console.log('Error fetching existing names:', err);
        },
      });
    }

  addCourseType(){
    if(!this.editData){
      
      this.courseTypeForm.removeControl('id')
      console.log("add: ", this.courseTypeForm.value);
      this.courseTypeForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.courseTypeForm.valid){
        this.api.postCourseType(this.courseTypeForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.courseTypeForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            console.log("datttaaa:",this.courseTypeForm.value);            
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateCourseType()
    }
  }


  updateCourseType(){
        this.api.putCourseType(this.courseTypeForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.courseTypeForm.reset();
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

