import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/pages/services/global.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { __param } from 'tslib';
import { ParseSourceSpan } from '@angular/compiler';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { UploadService } from 'src/app/upload.service';
import { Router, Params } from '@angular/router';
import { PyGroupDetailDialogComponent } from '../py-group-detail-dialog/py-group-detail-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


export class PyItem {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-py-group-dialog',
  templateUrl: './py-group-dialog.component.html',
  styleUrls: ['./py-group-dialog.component.css']
})

export class PyGroupDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  PyItemGroupForm!: FormGroup;
  PyItemGroupdetailsForm!: FormGroup;
  actionBtn: string = 'حفظ';
  productIdToEdit: any;
  existingNames: string[] = [];
  MasterGroupInfoEntered = false;

  dataSource!: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'pyItemName', 'action',
  ];

  pyItemCtrl: FormControl;
  filteredPyItems: Observable<PyItem[]>;
  pyItems: PyItem[] = [];
  selectedPyItem: PyItem | undefined;
  getPyInstallmentData: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  getMasterRowId: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private dialogRef: MatDialogRef<PyGroupDialogComponent>,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router
  ) {

    this.pyItemCtrl = new FormControl();
    this.filteredPyItems = this.pyItemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPyItems(value))
    );

  }

  ngOnInit(): void {

    this.getAllDetailsForms();

    // this.getExistingNames(); // Fetch existing names
    this.PyItemGroupForm = this.formBuilder.group({
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.PyItemGroupdetailsForm = this.formBuilder.group({
      pyItemId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(
      new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.nextToAddFormDetails();
        return false; // Prevent the default browser behavior
      })
    );

    if (this.editData) {
      this.actionBtn = 'تحديث';
      // this.getPyInstallmentData = this.editData;
      this.PyItemGroupForm.controls['name'].setValue(this.editData.name);
      this.PyItemGroupForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

      this.PyItemGroupForm.addControl('id', new FormControl('', Validators.required));
      this.PyItemGroupForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayPyItemName(pyItem: any): string {
    return pyItem && pyItem.name ? pyItem.name : '';
  }

  pyItemSelected(event: MatAutocompleteSelectedEvent): void {
    const pyItem = event.option.value as PyItem;
    this.selectedPyItem = pyItem;
    this.PyItemGroupdetailsForm.patchValue({ pyItemId: pyItem.id });
    // this.PyItemGroupdetailsForm.patchValue({ pyItemName: pyItem.name });
  }

  private _filterPyItems(value: string): PyItem[] {
    const filterValue = value.toLowerCase();
    return this.pyItems.filter(
      (pyItem) => pyItem.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoPyItem() {
    this.pyItemCtrl.setValue('');
    this.pyItemCtrl.updateValueAndValidity();
  }

  async nextToAddFormDetails() {
    this.PyItemGroupForm.removeControl('id');

    // this.PyItemGroupForm.controls['creditTotal'].setValue(0);
    // this.PyItemGroupForm.controls['debitTotal'].setValue(0);
    // this.PyItemGroupForm.controls['balance'].setValue(0);
    this.PyItemGroupForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log('ItemGroup master form: ', this.PyItemGroupForm.value);

    if (this.PyItemGroupForm.valid) {
      console.log('Master add form : ', this.PyItemGroupForm.value);
      this.api.postPyItemGroup(this.PyItemGroupForm.value).subscribe({
        next: (res) => {
          // console.log('ID fiEntry after post: ', res);
          // this.getMasterRowId = {
          //   id: res,
          // };
          this.getMasterRowId = {
            id: res,
          };
          // console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;

          // alert("تم الحفظ بنجاح");
          this.toastrSuccess();
          this.getAllDetailsForms();
          this.addDetailsInfo();
        },
        error: (err) => {
          console.log('header post err: ', err);
          // alert("حدث خطأ أثناء إضافة مجموعة")
        },
      });
    }
  }

  getAllDetailsForms() {
    // console.log("edddit get all data: ", this.editData)
    // console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
    this.api.getPyItemGroupDetails().subscribe({
      next: (res) => {
        // this.matchedIds = res;
        console.log("item group details res: ", res);

        // if (this.matchedIds) {
        // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);
        // this.dataSource = new MatTableDataSource(this.matchedIds);
        this.dataSource = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // this.sumOfTotals = 0;
        // for (let i = 0; i < this.matchedIds.length; i++) {
        // this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
        // this.sumOfTotals = Number(this.sumOfTotals.toFixed(2));
        // this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
        // alert('totalll: '+ this.sumOfTotals)
        // this.updateBothForms();
        // this.updateMaster();
        // }
        // }
      },
      error: (err) => {
        // console.log("fetch items data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      }
    })
    }
  }

  addDetailsInfo() {
    if (!this.editData) {
      // const enteredName = this.PyItemGroupForm.get('name')?.value;
      this.PyItemGroupdetailsForm.controls['transactionUserId'].setValue(this.transactionUserId);

      // if (this.existingNames.includes(enteredName)) {
      //   alert('هذا الاسم موجود من قبل، قم بتغييره');
      //   return;
      // }
      this.PyItemGroupdetailsForm.removeControl('id');
      if (this.PyItemGroupdetailsForm.valid) {

        this.api.postPyItemGroupDetails(this.PyItemGroupdetailsForm.value).subscribe({
          next: (res) => {
            console.log('item group details res: ', res);
            // this.productIdToEdit = res.id;

            this.toastrSuccess();
            this.PyItemGroupdetailsForm.reset();

            this.dialogRef.close('save');
          },
          error: (err) => {
            console.log('error:', err)
            this.toastrErrorSave();
          },
        });
      }
      // }
    } else {
      this.updateMaster();
    }
  }

  updateMaster() {
    console.log('update itemGroup master form: ', this.PyItemGroupForm.value);
    this.api.putPyItemGroup(this.PyItemGroupForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.PyItemGroupForm.reset();
        // this.dialogRef.close('update');
      },
      error: () => {
        this.toastrErrorEdit();
      },
    });
  }

  OpenItemGroupDetailsDialog() {
    this.router.navigate(['/PyItemGroup']);
    this.dialog
      .open(PyGroupDetailDialogComponent, {
        width: '40%',
        height: '78%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsForms();
        }
      });
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEdit(): void {
    this.toastr.success('تم التحديث بنجاح');
  }

  toastrErrorSave(): void {
    this.toastr.error('!خطأ عند حفظ البيانات');
  }

  toastrErrorEdit(): void {
    this.toastr.error('!خطأ عند تحديث البيانات');
  }
}
