import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
import { TrBudgetDialogComponent } from '../tr-budget-dialog/tr-budget-dialog.component';



export class courseName {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
export class trainingCenter {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}

@Component({
  selector: 'app-tr-budget',
  templateUrl: './tr-budget.component.html',
  styleUrls: ['./tr-budget.component.css']
})
export class TrBudgetComponent {
  
  courseNameCtrl: FormControl;
  filteredCourseName: Observable<courseName[]>;
  courseName: courseName[] = [];
  selectedCourseName!: courseName;
  trainingCenterCtrl: FormControl;
  filteredTrainingCenteres: Observable<trainingCenter[]>;
  trainingCenteres: trainingCenter[] = [];
  selectedTrainingCenter!: trainingCenter;
  formcontrol = new FormControl('');
  gradeForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'courseName','noTrainee','noHour','instructorHourFee','instructorTotalFee' ,'superVisingFee','otherFee','suppliesCost','transportCost','courseTotal', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog,private toastr: ToastrService, private api: ApiService,private global:GlobalService,private hotkeysService: HotkeysService) {
    this. courseNameCtrl = new FormControl();
    this.filteredCourseName = this.courseNameCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCourseName(value))
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
    
    this.getAllTrBudget();
    this.api.getAllCityState().subscribe((cityStates) => {
      this.courseName = cityStates;
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
      .open(TrBudgetDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllTrBudget();
        }
      });
  }

  displayCourseName(courseName: any): string {
    return courseName && courseName.name ? courseName.name : '';
  }
  courseNameSelected(event: MatAutocompleteSelectedEvent): void {
    const courseName = event.option.value as courseName;
    this.selectedCourseName = courseName;
    this.gradeForm.patchValue({ courseId: courseName.id });
    this.gradeForm.patchValue({ courseName: courseName.name });
  }
  private _filterCourseName(value: string): courseName[] {
    const filterValue = value.toLowerCase();
    return this.courseName.filter(courseName =>
      courseName.name.toLowerCase().includes(filterValue) 
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
  getAllTrBudget() {
    this.api.getTrBudget().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  editTrBudget(row: any) {
    this.dialog
      .open(TrBudgetDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllTrBudget();
        }
      });
  }

  deleteTrBudget(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteTrBudget(id).subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllTrBudget();

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
    this.courseNameCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.courseNameCtrl.updateValueAndValidity();
  }
  openAutoTrainingCenter() {
    this.trainingCenterCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.trainingCenterCtrl.updateValueAndValidity();
  }
 

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
