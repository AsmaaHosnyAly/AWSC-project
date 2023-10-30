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
  selector: 'app-tr-excuted-financier-details-dialog',
  templateUrl: './tr-excuted-financier-details-dialog.component.html',
  styleUrls: ['./tr-excuted-financier-details-dialog.component.css']
})
export class TrExcutedFinancierDetailsDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  excutedFinanciersForm !: FormGroup;
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
    private dialogRef: MatDialogRef<TrExcutedFinancierDetailsDialogComponent>,

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

    this.excutedFinanciersForm = this.formBuilder.group({
      excutedId: ['', Validators.required],
      financierId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);

      this.excutedFinanciersForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.excutedFinanciersForm.controls['excutedId'].setValue(this.editData.excutedId);
      this.excutedFinanciersForm.controls['financierId'].setValue(this.editData.financierId);

      this.excutedFinanciersForm.addControl('id', new FormControl('', Validators.required));
      this.excutedFinanciersForm.controls['id'].setValue(this.editData.id);

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
    this.excutedFinanciersForm.patchValue({ financierId: financier.id });
  }
  openAutoFinancier() {
    this.financierCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.financierCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    this.getMasterRowId = this.route.url.split('=').pop();
    this.excutedFinanciersForm.controls['excutedId'].setValue(this.getMasterRowId);
    this.excutedFinanciersForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log("check : ", this.route.url.split('=').pop());
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.excutedFinanciersForm.getRawValue().excutedId);

    if (!this.editData) {
      console.log("Enteeeeerrr post condition: ", this.excutedFinanciersForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.excutedFinanciersForm.value)

        if (this.excutedFinanciersForm.valid) {

          this.api.postTrExcutedFinancier(this.excutedFinanciersForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)

                this.toastrSuccess();
                this.excutedFinanciersForm.reset();

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
      this.excutedFinanciersForm.controls['excutedId'].setValue(this.editData.excutedId);
      console.log("Enteeeeerrr edit condition: ", this.excutedFinanciersForm.value)

      this.api.putTrExcutedFinancier(this.excutedFinanciersForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.excutedFinanciersForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.excutedFinanciersForm.removeControl('id')
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
