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

export class PrGroup {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-pr-user-dialog',
  templateUrl: './pr-user-dialog.component.html',
  styleUrls: ['./pr-user-dialog.component.css']
})
export class PrUserDialogComponent implements OnInit {
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
  // prGroupList: any;


  prGroupList: PrGroup[] = [];
  prGroupCtrl: FormControl;
  filteredPrGroup: Observable<PrGroup[]>;
  selectedPrGroup: PrGroup | undefined;
  formcontrol = new FormControl('');


  displayedColumns: string[] = ['group_Name', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PrUserDialogComponent>,

    private toastr: ToastrService) {

    this.prGroupCtrl = new FormControl();
    this.filteredPrGroup = this.prGroupCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPrGroups(value))
    );

  }


  ngOnInit(): void {
    this.getPrGroup();

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      isActive: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      userId: ['', Validators.required], //MasterId
      groupId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });



    if (this.editData) {
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['name'].setValue(this.editData.name);
      this.groupMasterForm.controls['password'].setValue(this.editData.password);
      this.groupMasterForm.controls['isActive'].setValue(this.editData.isActive);

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsForms();

    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

  }


  private _filterPrGroups(value: string): PrGroup[] {
    const filterValue = value;
    return this.prGroupList.filter(prGroup =>
      prGroup.name.toLowerCase().includes(filterValue)
    );
  }
  displayPrGroupName(prGroup: any): string {
    return prGroup && prGroup.name ? prGroup.name : '';
  }
  PrGroupSelected(event: MatAutocompleteSelectedEvent): void {
    const prGroup = event.option.value as PrGroup;
    console.log("prGroup selected: ", prGroup);
    this.selectedPrGroup = prGroup;
    this.groupDetailsForm.patchValue({ groupId: prGroup.id });
    console.log("prGroup in form: ", this.groupDetailsForm.getRawValue().groupId);
  }
  openAutoPrGroup() {
    this.prGroupCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.prGroupCtrl.updateValueAndValidity();
  }


  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id');
    this.groupMasterForm.controls['isActive'].setValue(true);

    console.log("Master add form : ", this.groupMasterForm.value)

    if (this.groupMasterForm.valid) {

      this.api.PrUserCheckAuthenticate(this.groupMasterForm.getRawValue().name, this.groupMasterForm.getRawValue().password)
        .subscribe({
          next: (res) => {
            console.log("user already exist: ", res);
            this.toastrUserWarning();
            this.groupMasterForm.reset();
            // this.getAllDetailsForms();
            // this.addDetailsInfo();
          },
          error: (err) => {
            console.log("add new user: ", err);
            // alert("حدث خطأ أثناء إضافة مجموعة")
            this.api.postPrUser(this.groupMasterForm.value)
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

        })

      // this.api.postPrUser(this.groupMasterForm.value)
      //   .subscribe({
      //     next: (res) => {
      //       this.getMasterRowId = {
      //         "id": res
      //       };
      //       this.MasterGroupInfoEntered = true;

      //       this.toastrSuccess();
      //       this.getAllDetailsForms();
      //       this.addDetailsInfo();
      //     },
      //     error: (err) => {
      //       // console.log("header post err: ", err);
      //       // alert("حدث خطأ أثناء إضافة مجموعة")
      //     }
      //   })
    }

  }

  getAllDetailsForms() {

    if (this.getMasterRowId) {
      // this.http.get<any>("http://ims.aswan.gov.eg/api/PRUserGroup/get/all")
      //   .subscribe(res => {

      //     this.matchedIds = res.filter((a: any) => {
      //       return a.userId == this.getMasterRowId.id
      //     })

      //     if (this.matchedIds) {

      //       this.dataSource = new MatTableDataSource(this.matchedIds);
      //       this.dataSource.paginator = this.paginator;
      //       this.dataSource.sort = this.sort;
      //     }
      //   }
      //     , err => {
      //       alert("حدث خطا ما !!")
      //     }
      //   )

      this.api.getPrGroupByUserId(this.getMasterRowId.id)
        .subscribe({
          next: (res) => {
            this.matchedIds = res.user_Group;
            console.log("matched groups: ", this.matchedIds);
            if (this.matchedIds) {

              this.dataSource = new MatTableDataSource(this.matchedIds);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            //       alert("حدث خطا ما !!")
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

        this.groupDetailsForm.controls['userId'].setValue(this.getMasterRowId.id);
        // this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));


        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          // console.log("groupId selected: ", this.prGroupCtrl.value);

          if (this.matchedIds) {
          console.log("check if group is added before: ", this.matchedIds.find((userGroup: { groupId: any; }) => userGroup.groupId == this.groupDetailsForm.getRawValue().groupId));

            if (!this.matchedIds.find((userGroup: { groupId: any; }) => userGroup.groupId == this.groupDetailsForm.getRawValue().groupId)) {
              this.api.postPrUserGroup(this.groupDetailsForm.value)
                .subscribe({
                  next: (res) => {
                    // console.log("res details: ", res)
                    this.toastrSuccess();
                    this.groupDetailsForm.reset();
                    this.prGroupCtrl.setValue('');
                    this.updateDetailsForm()
                    this.getAllDetailsForms();
                  },
                  error: () => {
                    // alert("حدث خطأ أثناء إضافة مجموعة")
                  }
                })

            }
            else {
              this.groupDetailsForm.reset();
              this.prGroupCtrl.setValue('');
              this.toastrGroupWarning();
              this.getAllDetailsForms();

            }
          }
          else {
            this.api.postPrUserGroup(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  // console.log("res details: ", res)
                  this.toastrSuccess();
                  this.groupDetailsForm.reset();
                  this.prGroupCtrl.setValue('');
                  this.updateDetailsForm()
                  this.getAllDetailsForms();
                },
                error: () => {
                  // alert("حدث خطأ أثناء إضافة مجموعة")
                }
              })
          }

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


    this.api.putPrUser(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          if (this.groupDetailsForm.value && this.getDetailedRowData) {
            this.api.putPrUserGroup(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  this.toastrSuccess();
                  this.groupDetailsForm.reset();
                  this.prGroupCtrl.setValue('');

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

      this.groupDetailsForm.controls['userId'].setValue(this.getMasterRowId.id);
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
      console.log("details: ", this.getDetailedRowData)

      if (this.getDetailedRowData) {
        this.getDetailRowId = {
          "id": this.getDetailedRowData.id
        };
      }

      this.actionBtnDetails = "Update";
      this.groupDetailsForm.controls['userId'].setValue(this.getDetailedRowData.userId);

      // this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
      // this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);

      // this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      // this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);

    }


  }

  deleteFormDetails(id: number) {
    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    if (result) {
      this.api.deletePrUserGroup(id)
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

  getPrGroup() {
    this.api.getPrGroup()
      .subscribe({
        next: (res) => {
          this.prGroupList = res;
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
  toastrUserWarning(): void {
    this.toastr.warning("المستخدم موجود بالفعل");
  }
  toastrGroupWarning(): void {
    this.toastr.warning("المجموعة موجودة بالفعل");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}