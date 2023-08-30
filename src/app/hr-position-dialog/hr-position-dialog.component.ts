



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
  selector: 'app-hr-position-dialog',
  templateUrl: './hr-position-dialog.component.html',
  styleUrls: ['./hr-position-dialog.component.css']
})




export class HrPositionDialogComponent implements OnInit{
 
  positionList:any;
  groupForm !: FormGroup;
  actionBtn: string = "Save";
  
  productIdToEdit: any;
  userIdFromStorage: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,private http:HttpClient,
    private dialogRef: MatDialogRef<HrPositionDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {
   
    this.getHrPosition();

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



  async addPosition() {

    console.log("form entered values", this.groupForm.value);
    if (!this.editData) {
      this.groupForm.removeControl('id')

    
        this.userIdFromStorage = localStorage.getItem('transactionUserId');
        this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
     
        console.log("form add product value: ", this.groupForm.value)

        if (this.groupForm.valid) {

          this.api.postHrPosition(this.groupForm.value)
            .subscribe({
              next: (res) => {
                console.log("add product res: ", res);
                this.productIdToEdit = res.id;

                this.toastrSuccess();
                alert("تمت إضافة الوظيفة بنجاح");
                this.groupForm.reset();

                this.dialogRef.close('save');
              },
              error: (err) => {
                alert("حدث خطأ أثناء إضافة وظيفة");
                console.log("post product with api err: ", err)
              }
            })
        }
      // }

    }
    else {
      this.updatePosition()
    }
  }

  updatePosition() {
    console.log("update product last values, id: ", this.groupForm.value)
    this.api.putHrPosition(this.groupForm.value)
      .subscribe({
        next: (res) => {
          alert("تم تحديث الوظيفة بنجاح");
          this.toastrSuccess();
          this.groupForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل الوظيفة !!")
        }
      })
  }

  getHrPosition() {
    this.api.getHrPosition()
      .subscribe({
        next: (res) => {
          this.positionList = res;
          console.log("positionList res: ", this.positionList);
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
