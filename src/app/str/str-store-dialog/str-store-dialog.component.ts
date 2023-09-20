





import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { publishFacade } from '@angular/compiler';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-str-store-dialog',
  templateUrl: './str-store-dialog.component.html',
  styleUrls: ['./str-store-dialog.component.css']
})
export class StrStoreDialogComponent implements OnInit {

  productForm !: FormGroup;
  actionBtn: string = "حفظ"

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrStoreDialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      // STRcode: ['', Validators.required],
      name: ['', Validators.required],
      transactionUserId:[1]
      
    });
    this.hotkeysService.add(new Hotkey('ctrl+p', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addStores();
      return false; // Prevent the default browser behavior
    }));

    if (this.editData) {
      this.actionBtn = "تحديث";
      // alert( this.productForm.controls['name'].setValue(this.editData.name))
      // this.productForm.controls['STRcode'].setValue(this.editData.STRcode);
      this.productForm.controls['name'].setValue(this.editData.name);
          //  console.log(this.editData.STRcode)
          this.productForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.productForm.addControl('id', new FormControl('', Validators.required));
      this.productForm.controls['id'].setValue(this.editData.id);

    }
  }

  addStores() {
    if (!this.editData) {
      this.productForm.removeControl('id')
      if (this.productForm.valid) {
        this.api.postStore(this.productForm.value)
          .subscribe({
            next: (res) => {
              alert("تم اضافة المخزن");
              this.productForm.reset();
              this.dialogRef.close('حفظ');
            },
            error: (err) => {
             alert("!خطأ في العملية")
              
            }
          })
      }
    }else{
      this.updateProduct()
    }
  }

  updateProduct(){
    this.api.putStore(this.productForm.value)
    .subscribe({
      next:(res)=>{
        alert("تم التحديث بنجاح");
        this.productForm.reset();
        this.dialogRef.close('تحديث');
      },
      error:()=>{
        alert("خطأ في التحديث");
      }
    })
  }

}