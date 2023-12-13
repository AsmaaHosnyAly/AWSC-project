import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class CostCenter {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-cc-equipment-dailog',
  templateUrl: './cc-equipment-dailog.component.html',
  styleUrls: ['./cc-equipment-dailog.component.css']
})
export class CcEquipmentDailogComponent {

  transactionUserId = localStorage.getItem('transactionUserId')
  costCenterCtrl: FormControl;
  filteredCostCenteres: Observable<CostCenter[]>;
  costCenteres: CostCenter[] = [];
  selectedCostCenter: CostCenter | undefined;
  formcontrol = new FormControl('');
  equipmentForm !: FormGroup;
  actionBtn: string = "حفظ"
  selectedOption: any;
  getModelData: any;
  Id: string | undefined | null;
  subRegionDt: any = {
    id: 0,
  }
  commname: any;
  dataSource!: MatTableDataSource<any>;
  existingNames: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  vendorlist: any;
  storeList: any;
  vendorName: any;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<CcEquipmentDailogComponent>,
    private toastr: ToastrService) {
    this.costCenterCtrl = new FormControl();
    this.filteredCostCenteres = this.costCenterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCostCenteres(value))
    );
  }
  ngOnInit(): void {
    // this.getExistingNames(); // Fetch existing names
    this.equipmentForm = this.formBuilder.group({
      //define the components of the form
      transactionUserId: ['', Validators.required],

      name: ['', Validators.required],
      code: ['', Validators.required],
      costCenterId: ['', Validators.required],
      costCenterName: [''],

      id: ['', Validators.required],
      // matautocompleteFieldName : [''],
    });

    this.api.getAllCostCenteres().subscribe((costCenteres) => {
      this.costCenteres = costCenteres;
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addPlant();
      return false; // Prevent the default browser behavior
    }));

    if (this.editData) {
      console.log("editData: ", this.editData);
      this.actionBtn = "تعديل";
      console.log("")
      this.getModelData = this.editData;
      this.equipmentForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

      this.equipmentForm.controls['name'].setValue(this.editData.name);
      this.equipmentForm.controls['code'].setValue(this.editData.code);
      this.equipmentForm.controls['costCenterId'].setValue(this.editData.costCenterId);
      this.equipmentForm.controls['costCenterName'].setValue(this.editData.costCenterName);

      // console.log("commodityId: ", this.modelForm.controls['commodityId'].value)
      this.equipmentForm.addControl('id', new FormControl('', Validators.required));
      this.equipmentForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayCostCenterName(costCenter: any): string {
    return costCenter && costCenter.name ? costCenter.name : '';
  }

  costCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costCenter = event.option.value as CostCenter;
    this.selectedCostCenter = costCenter;
    this.equipmentForm.patchValue({ costCenterId: costCenter.id });
    this.equipmentForm.patchValue({ costCenterName: costCenter.name });
  }

  private _filterCostCenteres(value: string): CostCenter[] {
    const filterValue = value.toLowerCase();
    return this.costCenteres.filter(costCenter =>
      costCenter.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoCostCenter() {
    this.costCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.costCenterCtrl.updateValueAndValidity();
  }

  // getExistingNames() {
  //   this.api.getPlant().subscribe({
  //     next: (res) => {
  //       this.existingNames = res.map((item: any) => item.name);
  //     },
  //     error: (err) => {
  //       console.log('Error fetching existing names:', err);
  //     }
  //   });
  // }

  addPlant() {
    if (!this.editData) {
      //   const enteredName = this.equipmentForm.get('name')?.value;

      // if (this.existingNames.includes(enteredName)) {
      //   alert('هذا الاسم موجود من قبل، قم بتغييره');
      //   return;
      // }
      this.equipmentForm.removeControl('id')
      // this.modelForm.controls['commodityId'].setValue(this.selectedOption.id);

      this.equipmentForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("add: ", this.equipmentForm.value);
      if (this.equipmentForm.valid) {
        this.api.postEquipment(this.equipmentForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              this.equipmentForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              this.toastrErrorSave();
            }
          })
      }
    } else {
      this.updatePlant()
    }
  }

  displayCostCenter(option: any): string {
    return option && option.name ? option.name : '';

  }
  updatePlant() {
    this.api.putEquipment(this.equipmentForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEdit();
          this.equipmentForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          this.toastrErrorEdit();
        }
      })
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




