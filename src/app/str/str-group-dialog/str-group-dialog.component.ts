
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-str-group-dialog',
  templateUrl: './str-group-dialog.component.html',
  styleUrls: ['./str-group-dialog.component.css']
})
export class StrGroupDialogComponent {

  freshnessList = ["Brand new", "Second Hand", "Refurbished"];
  groupForm !: FormGroup;
  actionBtn: string = "Save";
  groupSelectedSearch: any;
  basketballPlayers: any;
  platoonsList: any;
  platoonName: any;
  groupIdToEdit: any;
  userIdFromStorage: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrGroupDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getPlatoons();

    this.groupForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      platoonId: ['', Validators.required],
      platoonName: [''],
      transactionUserId: [''],
      createUserName: [''],
      id: [''],

    });

    // console.log("edit data", this.editData);
    if (this.editData) {
      this.actionBtn = "Update";
      this.groupForm.controls['code'].setValue(this.editData.code);
      this.groupForm.controls['name'].setValue(this.editData.name);
      this.groupForm.controls['platoonId'].setValue(this.editData.platoonId);
      this.userIdFromStorage = localStorage.getItem('transactionUserId');

      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
      // this.groupForm.controls['id'].setValue(this.editData.id);
      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }

  }

  async addGroup() {
    // console.log("form entered values", this.productForm.value);
    if (!this.editData) {
      this.groupForm.removeControl('id')

      if (this.groupForm.getRawValue().platoonId) {
        this.platoonName = await this.getPlatoonByID(this.groupForm.getRawValue().platoonId);
        this.groupForm.controls['platoonName'].setValue(this.platoonName);
        this.userIdFromStorage = localStorage.getItem('transactionUserId');
        this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        this.groupForm.controls['createUserName'].setValue("211 static name");

        // alert(this.groupForm.getRawValue().platoonName)
        // console.log("form add group value: ", this.groupForm.value)

        if (this.groupForm.valid && this.groupForm.getRawValue().platoonName) {

          this.api.postGroup(this.groupForm.value)
            .subscribe({
              next: (res) => {
                // console.log("add group res: ", res);
                this.groupIdToEdit = res.id;

                this.toastrSuccess();
                // alert("تمت إضافة المجموعة بنجاح");
                this.groupForm.reset();

                this.dialogRef.close('save');
              },
              error: (err) => {
                // alert("حدث خطأ أثناء إضافة مجموعة");
                // console.log("post group with api err: ", err)
              }
            })
        }
      }

    }
    else {
      this.updateGroup()
    }
  }

  updateGroup() {
    // console.log("update group last values, id: ", this.groupForm.value)
    this.api.putGroup(this.groupForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم تحديث المجموعة بنجاح");
          this.toastrSuccess();
          this.groupForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          // alert("خطأ أثناء تحديث سجل المجموعة !!")
        }
      })
  }

  getPlatoons() {
    this.api.getPlatoons()
      .subscribe({
        next: (res) => {
          this.platoonsList = res;
          // console.log("platoonsList res: ", this.platoonsList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getPlatoonByID(id: any) {
    // console.log("row platoon id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRPlatoon/get/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch platoon name by id res: ", json.gradeName);
        return json.gradeName;
      })
      .catch((err) => {
        // console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }

  getPlatoonByCode(code: any) {
    if (code.keyCode == 13) {
      // console.log("code: ", code.target.value, "platoonsList: ", this.platoonsList);

      this.platoonsList.filter((a: any) => {
        if (a.code == code.target.value) {
          // console.log("platoon obj: ", a.id)
          this.groupForm.controls['platoonId'].setValue(a.id);
        }
      })
    }


  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}








