import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export class PrRole {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-pr-group-dialog',
  templateUrl: './pr-group-dialog.component.html',
  styleUrls: ['./pr-group-dialog.component.css']
})
export class PrGroupDialogComponent implements OnInit {
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  priceCalled = 0;
  getMasterRowId: any;
  getDetailRowId: any;
  storeList: any;
  itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  isReadOnly: boolean = true;
  autoNo: any;
  // prRoleList: any;

  prRoleList: PrRole[] = [];
  prRoleCtrl: FormControl;
  filteredPrRole: Observable<PrRole[]>;
  selectedPrRole: PrRole | undefined;
  formcontrol = new FormControl('');

  displayedColumns: string[] = ['roleName', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PrGroupDialogComponent>,
    private toastr: ToastrService) {

    this.prRoleCtrl = new FormControl();
    this.filteredPrRole = this.prRoleCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPrRoles(value))
    );

  }


  ngOnInit(): void {
    this.getPrRole();

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      groupId: ['', Validators.required], //MasterId
      roleId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });



    if (this.editData) {
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['name'].setValue(this.editData.name);

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsForms();

    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

  }


  private _filterPrRoles(value: string): PrRole[] {
    const filterValue = value;
    return this.prRoleList.filter(prRole =>
      prRole.name.toLowerCase().includes(filterValue)
    );
  }
  displayPrRoleName(prRole: any): string {
    return prRole && prRole.name ? prRole.name : '';
  }
  PrRoleSelected(event: MatAutocompleteSelectedEvent): void {
    const prRole = event.option.value as PrRole;
    console.log("prRole selected: ", prRole);
    this.selectedPrRole = prRole;
    this.groupDetailsForm.patchValue({ roleId: prRole.id });
    console.log("prRole in form: ", this.groupDetailsForm.getRawValue().roleId);
  }
  openAutoPrRole() {
    this.prRoleCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.prRoleCtrl.updateValueAndValidity();
  }


  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id')
    console.log("Master add form : ", this.groupMasterForm.value)

    if (this.groupMasterForm.valid) {


      this.api.postPrGroup(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            this.getMasterRowId = {
              "id": res
            };
            this.MasterGroupInfoEntered = true;

            this.toastrSuccess();
            this.getAllDetailsForms();
            this.addDetailsInfo();
          },
          error: (err) => {
            // console.log("header post err: ", err);
            // alert("حدث خطأ أثناء إضافة مجموعة")
          }
        })
    }

  }

  getAllDetailsForms() {

    if (this.getMasterRowId) {
      this.api.getPrGroupRole()
        .subscribe({
          next: (res) => {

            this.matchedIds = res.filter((a: any) => {
              // console.log("matched Id & HeaderId : ", a.HeaderId === this.getMasterRowId.id)
              return a.groupId === this.getMasterRowId.id;
            });

            if (this.matchedIds) {
              
              // alert("jjjjjj")
              this.dataSource = new MatTableDataSource(this.matchedIds);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }

          },
          error: (err) => {
            alert("حدث خطا ما !!")
          }
        })

    }


  }
  async addDetailsInfo() {

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        // if (this.groupDetailsForm.getRawValue().itemId) {

        // this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
        // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
        // this.groupDetailsForm.controls['roleId'].setValue(this.itemName);
        this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        // }

        this.groupDetailsForm.controls['groupId'].setValue(this.getMasterRowId.id);
        // this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postPrGroupRole(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                // console.log("res details: ", res)
                this.groupDetailsForm.reset();
                this.prRoleCtrl.setValue('');
                this.updateDetailsForm()
                this.getAllDetailsForms();
                this.toastrSuccess();

              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        } else {
          this.updateBothForms();
        }

      }

    }
    else {
      this.updateDetailsForm();
    }
  }

  async updateDetailsForm() {
    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);

    if (this.getDetailRowId) {
      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.getDetailRowId.id);
    }


    this.api.putPrGroup(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          if (this.groupDetailsForm.value && this.getDetailedRowData) {
            this.api.putPrGroupRole(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  this.toastrSuccess();
                  this.groupDetailsForm.reset();
                  this.prRoleCtrl.setValue('');

                  this.getAllDetailsForms();
                  this.getDetailedRowData = '';
                },
                error: (err) => {
                  console.log("update err: ", err)
                  // alert("خطأ أثناء تحديث سجل المجموعة !!")
                }
              })
          }

        },

      })
  }

  updateBothForms() {
    if (this.groupMasterForm.getRawValue().name != '') {
      // console.log("change readOnly to enable");

      this.groupDetailsForm.controls['groupId'].setValue(this.getMasterRowId.id);
      // this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      this.updateDetailsForm();
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }

  }

  editDetailsForm(row: any) {

    if (this.editDataDetails || row) {
      this.getDetailedRowData = row;
      // console.log("details: ", this.getDetailedRowData, this.getMasterRowId)

      if (this.getDetailedRowData) {
        this.getDetailRowId = {
          "id": this.getDetailedRowData.id
        };
      }

      this.actionBtnDetails = "Update";
      this.groupDetailsForm.controls['groupId'].setValue(this.getDetailedRowData.groupId);

      // this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
      // this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);

      // this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      // this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);

    }


  }

  deleteFormDetails(id: number) {
    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    if (result) {
      this.api.deletePrGroupRole(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            this.getAllDetailsForms()
          },
          error: () => {
            // alert("خطأ أثناء حذف التفاصيل !!");
          }
        })
    }

  }

  getAllMasterForms() {
    this.dialogRef.close('save');
    this.api.getPrGroup()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })
  }

  getPrRole() {
    this.api.getPrRole()
      .subscribe({
        next: (res) => {
          this.prRoleList = res;
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
