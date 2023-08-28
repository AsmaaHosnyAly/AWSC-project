import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject ,ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../services/global.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { __param } from 'tslib';



@Component({
  selector: 'app-hr-job-title-dialog',
  templateUrl: './hr-job-title-dialog.component.html',
  styleUrls: ['./hr-job-title-dialog.component.css']
})




export class HrJobTitleDialogComponent implements OnInit{
  
  JobTitleList:any;
  groupForm !: FormGroup;
  actionBtn: string = "Save";
  groupSelectedSearch: any;
  
  productIdToEdit: any;
  userIdFromStorage: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,private http:HttpClient,
    private dialogRef: MatDialogRef<HrJobTitleDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {
   
    this.getHrJobTitle();

    this.groupForm = this.formBuilder.group({
      // code: ['', Validators.required],
      name: ['', Validators.required],
   
      transactionUserId: [''],
    

    });

    console.log("edit data", this.editData);
    if (this.editData) {
      this.actionBtn = "Update";
      // this.groupForm.controls['code'].setValue(this.editData.code);
      this.groupForm.controls['name'].setValue(this.editData.name);
   
      this.userIdFromStorage = localStorage.getItem('transactionUserId');

      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
      // this.groupForm.controls['id'].setValue(this.editData.id);
      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }

  }



  async addJobTitle() {

    console.log("form entered values", this.groupForm.value);
    if (!this.editData) {
      this.groupForm.removeControl('id')

    
        this.userIdFromStorage = localStorage.getItem('transactionUserId');
        this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
     
        console.log("form add product value: ", this.groupForm.value)

        if (this.groupForm.valid) {

          this.api.postHrJobTitle(this.groupForm.value)
            .subscribe({
              next: (res) => {
                console.log("add product res: ", res);
                this.productIdToEdit = res.id;

                this.toastrSuccess();
                alert("تمت إضافة المنتج بنجاح");
                this.groupForm.reset();

                this.dialogRef.close('save');
              },
              error: (err) => {
                alert("حدث خطأ أثناء إضافة منتج");
                console.log("post product with api err: ", err)
              }
            })
        }
      // }

    }
    else {
      this.updateJobTitle()
    }
  }

  updateJobTitle() {
    console.log("update product last values, id: ", this.groupForm.value)
    this.api.putHrJobTitle(this.groupForm.value)
      .subscribe({
        next: (res) => {
          alert("تم تحديث المنتج بنجاح");
          this.toastrSuccess();
          this.groupForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل المنتج !!")
        }
      })
  }

  getHrJobTitle() {
    this.api.getHrJobTitle()
      .subscribe({
        next: (res) => {
          this.JobTitleList = res;
          console.log("JobTitleList res: ", this.JobTitleList);
        },
        error: (err) => {
          console.log("fetch items data err: ", err);
          alert("خطا اثناء جلب الوظائف !");
        }
      })
  }


  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }

}