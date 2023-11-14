import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { publishFacade } from '@angular/compiler';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
export class Keeper {
  constructor(public id: number, public name: string, public code: any) {}
}
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-str-store-dialog',
  templateUrl: './str-store-dialog.component.html',
  styleUrls: ['./str-store-dialog.component.css'],
})
export class StrStoreDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  storeKeeperCtrl: FormControl;
  filteredStoreKeepers: Observable<Keeper[]>;
  keepers: Keeper[] = [];
  getStoreData: any;
  selectedKeeper: Keeper | undefined;
  storeForm!: FormGroup;
  actionBtn: string = 'حفظ';
  autoCode: any;
  existingNames: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrStoreDialogComponent>,
    private toastr: ToastrService) {
    this.storeKeeperCtrl = new FormControl();
    this.filteredStoreKeepers = this.storeKeeperCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterStoreKeepers(value))
    );
  }

  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.getStoreAutoCode();
    this.storeForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      storekeeperId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.api.getEmployees().subscribe((keepers) => {
      this.keepers = keepers;
    });
    this.hotkeysService.add(
      new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addStores();
        return false; // Prevent the default browser behavior
      })
    );

    if (this.editData) {
      this.actionBtn = 'تحديث';
      this.getStoreData = this.editData;
      // alert( this.storeForm.controls['name'].setValue(this.editData.name))
      this.storeForm.controls['code'].setValue(this.editData.code);
      this.storeForm.controls['name'].setValue(this.editData.name);
      this.storeForm.controls['storekeeperId'].setValue(
        this.editData.storekeeperId
      );
      this.storeForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      this.storeForm.addControl('id', new FormControl('', Validators.required));
      this.storeForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayStoreKeeper(keeper: any): string {
    return keeper ? keeper.name && keeper.name != null ? keeper.name : '-' : '';
  }

  keeperSelected(event: MatAutocompleteSelectedEvent): void {
    const keeper = event.option.value as Keeper;
    this.selectedKeeper = keeper;
    this.storeForm.patchValue({ storekeeperId: keeper.id });
    this.storeForm.patchValue({ storekeeperName: keeper.name });
  }

  private _filterStoreKeepers(value: string): Keeper[] {
    const filterValue = value.toLowerCase();
    return this.keepers.filter(
      (keeper) =>
        keeper.name || keeper.code ? keeper.name.toLowerCase().includes(filterValue) ||
        keeper.code.toString().toLowerCase().includes(filterValue) : '-'
    );
  }

  openStoreKeeper() {
    this.storeKeeperCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.storeKeeperCtrl.updateValueAndValidity();
  }

  getExistingNames() {
    this.api.getStore().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      },
    });
  }

  addStores() {
    if (!this.editData) {
      const enteredName = this.storeForm.get('name')?.value;

      if (this.existingNames.includes(enteredName)) {
        alert('هذا الاسم موجود من قبل، قم بتغييره');
        return;
      }
      if (this.storeForm.getRawValue().code) {
        this.storeForm.controls['code'].setValue(this.autoCode);
      } else {
        this.storeForm.controls['code'].setValue(this.autoCode);
      }
      this.storeForm.removeControl('id');
      this.storeForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      if (this.storeForm.valid) {
        this.api.postStore(this.storeForm.value).subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.storeForm.reset();
            this.dialogRef.close('حفظ');
          },
          error: (err) => {
            this.toastrErrorSave();
          },
        });
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct() {
    this.api.putStore(this.storeForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.storeForm.reset();
        this.dialogRef.close('تحديث');
      },
      error: () => {
        this.toastrErrorEdit();
      },
    });
  }

  getStoreAutoCode() {
    this.api.getStoreAutoCode().subscribe({
      next: (res) => {
        this.autoCode = res;
        return res;
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
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
