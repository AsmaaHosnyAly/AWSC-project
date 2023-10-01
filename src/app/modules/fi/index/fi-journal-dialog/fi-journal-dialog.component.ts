import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';


@Component({
  selector: 'app-fi-journal-dialog',
  templateUrl: './fi-journal-dialog.component.html',
  styleUrls: ['./fi-journal-dialog.component.css']
})
export class FIJournalDialogComponent {
  formcontrol = new FormControl('');
  FIJournal !: FormGroup;
  actionBtn: string = "حفظ";

  fiscalYearsList: any;
  defaultFiscalYearSelectValue: any;
  // groupEditId: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<FIJournalDialogComponent>) {
  }
  ngOnInit(): void {
    this.getFiscalYears();

    this.FIJournal = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      no: ['', Validators.required],
      id: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addFIJournals();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log("edit data: ", this.editData)
      this.actionBtn = "تحديث";
      this.FIJournal.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.FIJournal.controls['no'].setValue(this.editData.no);
      this.FIJournal.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      this.FIJournal.controls['description'].setValue(this.editData.description);
      this.FIJournal.controls['startDate'].setValue(this.editData.startDate);
      this.FIJournal.controls['endDate'].setValue(this.editData.endDate);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.FIJournal.addControl('id', new FormControl('', Validators.required));
      this.FIJournal.controls['id'].setValue(this.editData.id);
    }
  }

  addFIJournals() {
    this.FIJournal.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    console.log("post form: ", this.FIJournal.value);
    if (!this.editData) {
      this.FIJournal.removeControl('id')
      if (this.FIJournal.valid) {
        console.log("FIJournal :", this.FIJournal.value);

        this.api.postFIJournal(this.FIJournal.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              // alert("تمت الاضافة بنجاح");
              this.FIJournal.reset();
              this.dialogRef.close('حفظ');
            },
            error: (err) => {
              // alert("خطأ عند اضافة البيانات") 
              console.log(err)
            }
          })
      }
    } else {
      this.updateFIJournal()
    }
  }
  updateFIJournal() {
    console.log("this.FIJournal.value", this.FIJournal.value);

    this.api.putFIJournal(this.FIJournal.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()
          // alert("تم التحديث بنجاح");
          this.FIJournal.reset();
          this.dialogRef.close('تحديث');
        },
        error: () => {
          alert("خطأ عند تحديث البيانات");
        }
      })
  }


  async getFiscalYears() {
    this.api.getFiscalYears()
      .subscribe({
        next: async (res) => {
          this.fiscalYearsList = res;

          this.api.getLastFiscalYear()
            .subscribe({
              next: async (res) => {
                // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
                this.defaultFiscalYearSelectValue = await res;
                console.log("selectedYearggggggggggggggggggg: ", this.defaultFiscalYearSelectValue);
                if (this.editData) {
                  this.FIJournal.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
                  // this.fiscalYearValueChanges(this.FIJournal.getRawValue().fiscalYearId);
                }
                else {
                  this.FIJournal.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
                  // this.fiscalYearValueChanges(this.groupMasterForm.getRawValue().fiscalYearId);
                  // this.getStrOpenAutoNo();
                }
              },
              error: (err) => {
                // console.log("fetch store data err: ", err);
                // alert("خطا اثناء جلب المخازن !");
              }
            })
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }


  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }


}
