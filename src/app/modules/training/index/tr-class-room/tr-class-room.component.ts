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
import { TrClassRoomDialogComponent } from '../tr-class-room-dialog/tr-class-room-dialog.component';
export class cityState {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
export class trainingCenter {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}

interface TrClassRoom {
  code: any;
  name: any;
  address: any;
  type: any;
  capacity: any;
  cityStateName: any;
  trainingCenterName: any;
  action: any;
}

@Component({
  selector: 'app-tr-class-room',
  templateUrl: './tr-class-room.component.html',
  styleUrls: ['./tr-class-room.component.css']
})
export class TrClassRoomComponent {
  ELEMENT_DATA: TrClassRoom[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<TrClassRoom> = new MatTableDataSource();

  cityStateCtrl: FormControl;
  filteredCityStates: Observable<cityState[]>;
  cityStates: cityState[] = [];
  selectedCityState!: cityState;
  trainingCenterCtrl: FormControl;
  filteredTrainingCenteres: Observable<trainingCenter[]>;
  trainingCenteres: trainingCenter[] = [];
  selectedTrainingCenter!: trainingCenter;
  formcontrol = new FormControl('');
  gradeForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'code','name','address','type','capacity' ,'cityStateName','trainingCenterName', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog,private toastr: ToastrService, private api: ApiService,private global:GlobalService,private hotkeysService: HotkeysService) {
    this.cityStateCtrl = new FormControl();
    this.filteredCityStates = this.cityStateCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCityStates(value))
    );
    this.trainingCenterCtrl = new FormControl();
    this.filteredTrainingCenteres = this.trainingCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTrainingCenteres(value))
    );
    global.getPermissionUserRoles('IT', '', 'الإدارة العامة للتدريب', 'supervised_user_circle')
  }
  ngOnInit(): void {
    // console.log(productForm)
    
    this.getAllClassRooms();
    this.api.getAllCityState().subscribe((cityStates) => {
      this.cityStates = cityStates;
    });
    this.api.getAllTrainingCenter().subscribe((trainingCenteres) => {
      this.trainingCenteres = trainingCenteres;
    });
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(TrClassRoomDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllClassRooms();
        }
      });
  }

  displayCityStateName(cityState: any): string {
    return cityState && cityState.name ? cityState.name : '';
  }
  cityStateSelected(event: MatAutocompleteSelectedEvent): void {
    const cityState = event.option.value as cityState;
    this.selectedCityState = cityState;
    this.gradeForm.patchValue({ cityStateId: cityState.id });
    this.gradeForm.patchValue({ cityStateName: cityState.name });
  }
  private _filterCityStates(value: string): cityState[] {
    const filterValue = value.toLowerCase();
    return this.cityStates.filter(cityState =>
      cityState.name.toLowerCase().includes(filterValue) 
    );
  }
  displayTrainingCenterName(trainingCenter: any): string {
    return trainingCenter && trainingCenter.name ? trainingCenter.name : '';
  }
  trainingCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const trainingCenter = event.option.value as trainingCenter;
    this.selectedTrainingCenter = trainingCenter;
    this.gradeForm.patchValue({ trainingCenterId: trainingCenter.id });
    this.gradeForm.patchValue({ trainingCenterName: trainingCenter.name });
  }
  private _filterTrainingCenteres(value: string): trainingCenter[] {
    const filterValue = value.toLowerCase();
    return this.trainingCenteres.filter(trainingCenter =>
      trainingCenter.name.toLowerCase().includes(filterValue) 
    );
  }
  getAllClassRooms() {
    // this.api.getClassRoom().subscribe({
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
      fetch(this.api.getTrClassRoomPaginate(this.currentPage, this.pageSize))
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
      fetch(this.api.getTrClassRoomPaginate(this.currentPage, this.pageSize))
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

    this.getAllClassRooms();
  }


  editClassRoom(row: any) {
    this.dialog
      .open(TrClassRoomDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllClassRooms();
        }
      });
  }

  deleteClassRoom(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteClassRoom(id).subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllClassRooms();

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
  

  openAutoCityState() {
    this.cityStateCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.cityStateCtrl.updateValueAndValidity();
  }
  openAutoTrainingCenter() {
    this.trainingCenterCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.trainingCenterCtrl.updateValueAndValidity();
  }
  // async getSearchModels(name: any) {
  //   this.api.getModel().subscribe({
  //     next: (res) => {
        //enter id
        // if (this.selectedVendor && name == '') {
        //   console.log('filter ID id: ', this.selectedVendor, 'name: ', name);

        //   this.dataSource = res.filter(
        //     (res: any) => res.vendorId == this.selectedVendor.id!
        //   );
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        // }
        //enter both
        // else if (this.selectedVendor && name != '') {
        //   console.log('filter both id: ', this.selectedVendor, 'name: ', name);

        //   // this.dataSource = res.filter((res: any)=> res.name==name!)
        //   this.dataSource = res.filter(
        //     (res: any) =>
        //       res.vendorId == this.selectedVendor.id! &&
        //       res.name.toLowerCase().includes(name.toLowerCase())
        //   );
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        // }
        //enter name
        // else {
        //   console.log('filter name id: ', this.selectedVendor, 'name: ', name);
          // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
      //     this.dataSource = res.filter((res: any) =>
      //       res.name.toLowerCase().includes(name.toLowerCase())
      //     );
      //     this.dataSource.paginator = this.paginator;
      //     this.dataSource.sort = this.sort;
      //   }
      // },
    //   error: (err) => {
    //     alert('Error');
    //   },
    // });
    // this.getAllProducts()
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

