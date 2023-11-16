import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CcPlantDialogComponent } from '../cc-plant-dialog/cc-plant-dialog.component';
import { CcEquipmentDailogComponent } from '../cc-equipment-dailog/cc-equipment-dailog.component';
export class costCenter {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}

interface CcEquipment {
  code: any;
  name: any;
  costCenterName: any;
  action: any;
}

@Component({
  selector: 'app-cc-equipment',
  templateUrl: './cc-equipment.component.html',
  styleUrls: ['./cc-equipment.component.css']
})

export class CcEquipmentComponent {
  ELEMENT_DATA: CcEquipment[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<CcEquipment> = new MatTableDataSource();

  costCenterCtrl: FormControl;
  filteredCostCenteres: Observable<costCenter[]>;
  costCenteres: costCenter[] = [];
  selectedCostCenter!: costCenter;
  formcontrol = new FormControl('');
  equipmentForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name', 'code', 'costCenterName','action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog,private toastr: ToastrService, private api: ApiService,private global:GlobalService,private hotkeysService: HotkeysService) {
    this.costCenterCtrl = new FormControl();
    this.filteredCostCenteres = this.costCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCostCenteres(value))
    );

    // global.getPermissionUserRoles(4, 'stores', ' الموديل', '')
  }
  ngOnInit(): void {
    // console.log(productForm)
    
    this.getAllEquipments();
    this.api.getAllCostCenteres().subscribe((costCenteres) => {
      this.costCenteres = costCenteres;
    });
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(CcEquipmentDailogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllEquipments();
        }
      });
  }

  displayCostCenterName(costCenter: any): string {
    return costCenter && costCenter.name ? costCenter.name : '';
  }
  costCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costCenter = event.option.value as costCenter;
    this.selectedCostCenter = costCenter;
    this.equipmentForm.patchValue({ costCenterId: costCenter.id });
    this.equipmentForm.patchValue({ costCenterName: costCenter.name });
  }
  private _filterCostCenteres(value: string): costCenter[] {
    const filterValue = value.toLowerCase();
    return this.costCenteres.filter(costCenter =>
      costCenter.name.toLowerCase().includes(filterValue) 
    );
  }

  getAllEquipments() {
    // this.api.getEquipment().subscribe({
    //   next: (res) => {
    //     this.dataSource = new MatTableDataSource(res);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   },
    //   error: (err) => {
    //     alert('Error');
    //   },
    // });

    if (!this.currentPage) {
      this.currentPage = 0;

      // this.isLoading = true;
      fetch(this.api.getCcEquipmentPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate first Time: ", data);
          this.dataSource.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }
    else {
      // this.isLoading = true;
      fetch(this.api.getCcEquipmentPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate: ", data);
          this.dataSource.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }
    
  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllEquipments();
  }

  editPlant(row: any) {
    this.dialog
      .open(CcEquipmentDailogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllEquipments();
        }
      });
  }

  deletePlant(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteEquipment(id).subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllEquipments();

        }else{
          alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
        }
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  

  // openAutoSubRegion() {
  //   this.costCenterCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
  //   this.costCenterCtrl.updateValueAndValidity();
  // }
  
  // async getSearchModels(name: any) {
  //   this.api.getPlant().subscribe({
  //     next: (res) => {
  //       //enter id
  //       if (this.selectedSubRegion && name == '') {
  //         console.log('filter ID id: ', this.selectedSubRegion, 'name: ', name);

  //         this.dataSource = res.filter(
  //           (res: any) => res.subRegionId == this.selectedSubRegion.id!
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //       //enter both
  //       else if (this.selectedSubRegion && name != '') {
  //         console.log('filter both id: ', this.selectedSubRegion, 'name: ', name);

  //         // this.dataSource = res.filter((res: any)=> res.name==name!)
  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.vendorId == this.selectedSubRegion.id! &&
  //             res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //       //enter name
  //       else {
  //         console.log('filter name id: ', this.selectedSubRegion, 'name: ', name);
  //         // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
  //         this.dataSource = res.filter((res: any) =>
  //           res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //     },
  //     error: (err) => {
  //       alert('Error');
  //     },
  //   });
  //   // this.getAllProducts()
  // }
  

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}


