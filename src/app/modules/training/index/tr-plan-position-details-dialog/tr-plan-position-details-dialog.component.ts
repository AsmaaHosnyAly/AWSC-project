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

export class Position {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-tr-plan-position-details-dialog',
  templateUrl: './tr-plan-position-details-dialog.component.html',
  styleUrls: ['./tr-plan-position-details-dialog.component.css']
})
export class TrPlanPositionDetailsDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  planpositionsForm !: FormGroup;
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

  positionsList: Position[] = [];
  positionCtrl: FormControl;
  filteredPosition: Observable<Position[]>;
  selectedPosition: Position | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // positionsList: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TrPlanPositionDetailsDialogComponent>,

    private toastr: ToastrService,
    private route: Router) {

    this.positionCtrl = new FormControl();
    this.filteredPosition = this.positionCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPositions(value))
    );

  }

  ngOnInit(): void {
    this.getHrPosition();

    this.planpositionsForm = this.formBuilder.group({
      planId: ['', Validators.required],
      positionId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);

      this.planpositionsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.planpositionsForm.controls['planId'].setValue(this.editData.planId);
      this.planpositionsForm.controls['positionId'].setValue(this.editData.positionId);

      this.planpositionsForm.addControl('id', new FormControl('', Validators.required));
      this.planpositionsForm.controls['id'].setValue(this.editData.id);

      console.log("details edit form after: ", this.editData);

    }

  }

  private _filterPositions(value: string): Position[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.positionsList.filter(
      (position) =>
        position.name.toLowerCase().includes(filterValue)
    );
  }

  displayPositionName(position: any): string {
    return position && position.name ? position.name : '';
  }
  PositionSelected(event: MatAutocompleteSelectedEvent): void {
    const position = event.option.value as Position;
    console.log("position selected: ", position);
    this.selectedPosition = position;
    this.planpositionsForm.patchValue({ positionId: position.id });
  }
  openAutoPosition() {
    this.positionCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.positionCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    this.getMasterRowId = this.route.url.split('=').pop();
    this.planpositionsForm.controls['planId'].setValue(this.getMasterRowId);
    this.planpositionsForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log("check : ", this.route.url.split('=').pop());
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.planpositionsForm.getRawValue().planId);

    if (!this.editData) {
      console.log("Enteeeeerrr post condition: ", this.planpositionsForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.planpositionsForm.value)

        if (this.planpositionsForm.valid) {

          this.api.postTrPlanPosition(this.planpositionsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)

                this.toastrSuccess();
                this.planpositionsForm.reset();

                this.dialogRef.close('save');

              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        }

      }

    }
    else {
      console.log("editData conflict: ", this.editData);
      this.planpositionsForm.controls['planId'].setValue(this.editData.planId);

      console.log("Enteeeeerrr edit condition: ", this.planpositionsForm.value)

      this.api.putTrPlanPosition(this.planpositionsForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.planpositionsForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.planpositionsForm.removeControl('id')
    }
  }


  getHrPosition() {
    this.api.getHrPosition()
      .subscribe({
        next: (res) => {
          this.positionsList = res;
          console.log("positionsList res: ", this.positionsList);
        },
        error: (err) => {
          console.log("fetch positionsList data err: ", err);
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
