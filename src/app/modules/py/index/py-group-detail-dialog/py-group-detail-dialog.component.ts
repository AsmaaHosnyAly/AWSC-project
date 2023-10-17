import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { Params, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export class PyItem {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-py-group-detail-dialog',
  templateUrl: './py-group-detail-dialog.component.html',
  styleUrls: ['./py-group-detail-dialog.component.css']
})

export class PyGroupDetailDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  sumOfCreditTotals = 0;
  sumOfDebitTotals = 0;
  resultOfBalance = 0;

  getMasterRowId: any;
  getDetailsRowId: any;
  journalsList: any;
  sourcesList: any;

  employeesList: any;
  distEmployeesList: any;
  costCentersList: any;
  itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;

  PyItemsList: PyItem[] = [];
  pyItemCtrl: FormControl;
  filteredPyItem: Observable<PyItem[]>;
  selectedPyItem: PyItem | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PyGroupDetailDialogComponent>,

    private toastr: ToastrService,
    private route: Router) {

    this.pyItemCtrl = new FormControl();
    this.filteredPyItem = this.pyItemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPyItems(value))
    );

  }

  ngOnInit(): void {
    this.getPyItems();
    // this.getFiAccountItems();

    this.groupDetailsForm = this.formBuilder.group({
      itemGroupId: ['', Validators.required],
      pyItemId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);
      // this.actionBtnMaster = "Update";

      this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.groupDetailsForm.controls['itemGroupId'].setValue(this.editData.itemGroupId);
      this.groupDetailsForm.controls['pyItemId'].setValue(this.editData.pyItemId);

      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);

      console.log("details edit form after: ", this.editData);

    }

  }

  private _filterPyItems(value: string): PyItem[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.PyItemsList.filter(
      (pyItem) =>
        pyItem.name.toLowerCase().includes(filterValue)
    );
  }

  displayPyItemName(pyItem: any): string {
    return pyItem && pyItem.name ? pyItem.name : '';
  }
  PyItemSelected(event: MatAutocompleteSelectedEvent): void {
    const pyItem = event.option.value as PyItem;
    console.log("pyItem selected: ", pyItem);
    this.selectedPyItem = pyItem;
    this.groupDetailsForm.patchValue({ pyItemId: pyItem.id });
  }
  openAutoPyItem() {
    this.pyItemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.pyItemCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    this.getMasterRowId = this.route.url.split('=').pop();
    this.groupDetailsForm.controls['itemGroupId'].setValue(this.getMasterRowId);
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log("check : ", this.route.url.split('=').pop());
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.groupDetailsForm.getRawValue().itemGroupId);

    if (!this.editData) {
      console.log("Enteeeeerrr post condition: ", this.groupDetailsForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

        if (this.groupDetailsForm.valid) {

          this.api.postPyItemGroupDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)

                // alert("تمت إضافة التفاصيل بنجاح");
                this.toastrSuccess();
                this.groupDetailsForm.reset();

                this.dialogRef.close('save');

              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        }
        // else {
        //   this.updateBothForms();
        // }

      }

    }
    else {
      console.log("Enteeeeerrr edit condition: ", this.groupDetailsForm.value)

      this.api.putPyItemGroupDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.groupDetailsForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.groupDetailsForm.removeControl('id')
    }
  }


  getPyItems() {
    this.api.getPyItem()
      .subscribe({
        next: (res) => {
          this.PyItemsList = res;
          console.log("pyItems res: ", this.PyItemsList);
        },
        error: (err) => {
          console.log("fetch pyItems data err: ", err);
          // alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  closeDialog() {
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {

      this.dialogRef.close('Save');
    // }
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}
