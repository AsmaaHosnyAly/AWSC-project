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

export class Financier {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-tr-plan-financier-details-dialog',
  templateUrl: './tr-plan-financier-details-dialog.component.html',
  styleUrls: ['./tr-plan-financier-details-dialog.component.css']
})
export class TrPlanFinancierDetailsDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  planFinanciersForm !: FormGroup;
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

  financiersList: Financier[] = [];
  financierCtrl: FormControl;
  filteredFinancier: Observable<Financier[]>;
  selectedFinancier: Financier | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // financiersList: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TrPlanFinancierDetailsDialogComponent>,

    private toastr: ToastrService,
    private route: Router) {

    this.financierCtrl = new FormControl();
    this.filteredFinancier = this.financierCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterFinanciers(value))
    );

  }

  ngOnInit(): void {
    this.getTrFinancier();

    this.planFinanciersForm = this.formBuilder.group({
      planId: ['', Validators.required],
      financierId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);

      this.planFinanciersForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.planFinanciersForm.controls['planId'].setValue(this.editData.planId);
      this.planFinanciersForm.controls['financierId'].setValue(this.editData.financierId);

      this.planFinanciersForm.addControl('id', new FormControl('', Validators.required));
      this.planFinanciersForm.controls['id'].setValue(this.editData.id);

      console.log("details edit form after: ", this.editData);

    }

  }

  private _filterFinanciers(value: string): Financier[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.financiersList.filter(
      (financier) =>
        financier.name.toLowerCase().includes(filterValue)
    );
  }

  displayFinancierName(financier: any): string {
    return financier && financier.name ? financier.name : '';
  }
  FinancierSelected(event: MatAutocompleteSelectedEvent): void {
    const financier = event.option.value as Financier;
    console.log("financier selected: ", financier);
    this.selectedFinancier = financier;
    this.planFinanciersForm.patchValue({ financierId: financier.id });
  }
  openAutoFinancier() {
    this.financierCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.financierCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    this.getMasterRowId = this.route.url.split('=').pop();
    this.planFinanciersForm.controls['planId'].setValue(this.getMasterRowId);
    this.planFinanciersForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log("check : ", this.route.url.split('=').pop());
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.planFinanciersForm.getRawValue().planId);

    if (!this.editData) {
      console.log("Enteeeeerrr post condition: ", this.planFinanciersForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.planFinanciersForm.value)

        if (this.planFinanciersForm.valid) {

          this.api.postTrFinancier(this.planFinanciersForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)

                this.toastrSuccess();
                this.planFinanciersForm.reset();

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
      console.log("Enteeeeerrr edit condition: ", this.planFinanciersForm.value)

      this.api.putTrFinancier(this.planFinanciersForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.planFinanciersForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.planFinanciersForm.removeControl('id')
    }
  }


  getTrFinancier() {
    this.api.getTrFinancial()
      .subscribe({
        next: (res) => {
          this.financiersList = res;
          console.log("financiersList res: ", this.financiersList);
        },
        error: (err) => {
          console.log("fetch financiersList data err: ", err);
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
