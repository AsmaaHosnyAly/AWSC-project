import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatDialog,  MAT_DIALOG_DATA,  MatDialogModule} from '@angular/material/dialog';
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
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { HrSpecializationDialogComponent } from '../hr-specialization-dialog/hr-specialization-dialog.component';


export class Qualification {
  constructor(public id: number, public name: string, public code: string) {}
}

@Component({
  selector: 'app-hr-specialization',
  templateUrl: './hr-specialization.component.html',
  styleUrls: ['./hr-specialization.component.css']
})
export class HrSpecializationComponent {
  QualificationCtrl: FormControl;
  filteredQualification: Observable<Qualification[]>;
  qualification: Qualification[] = [];
  selectedQualification!: Qualification;
  formcontrol = new FormControl('');
  specializationForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name', 'qualificationName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // commidityDt: any = {
  //   id: 0,
  // };
  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService,private toastr: ToastrService,) {
    this.QualificationCtrl = new FormControl();
    this.filteredQualification = this.QualificationCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterQualification(value))
    );
  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getAllHrspecialization();
    this.api.getAllqualification().subscribe((hrqualification) => {
      this.qualification = hrqualification;
    });
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(HrSpecializationDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllHrspecialization();
        }
      });
  }

  displayqualificationName(qualification: any): string {
    return qualification && qualification.name ? qualification.name : '';
  }
  qualificationSelected(event: MatAutocompleteSelectedEvent): void {
    const qualification = event.option.value as Qualification;
    this.selectedQualification = qualification;
    this.specializationForm.patchValue({ qualificationId: qualification.id });
    this.specializationForm.patchValue({ qualificationName: qualification.name });
  }
  private _filterQualification(value: string): Qualification[] {
    const filterValue = value.toLowerCase();
    return this.qualification.filter(qualifications =>
      qualifications.name.toLowerCase().includes(filterValue) || qualifications.code.toLowerCase().includes(filterValue)
    );
  }

  getAllHrspecialization() {
    this.api.getHrspecialization().subscribe({
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

  editHrspecialization(row: any) {
    this.dialog
      .open(HrSpecializationDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllHrspecialization();
        }
      });
  }

  deleteHrspecialization(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteHrspecialization(id)
      .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
          // alert('تم الحذف بنجاح');
          this.toastrDeleteSuccess();
          this.getAllHrspecialization();
  
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

 
  openAutoQualification() {
    this.QualificationCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.QualificationCtrl.updateValueAndValidity();
  }
  async getSearchHrspecialization(name: any) {
    this.api.getHrspecialization().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedQualification && name == '') {
          console.log('filter ID id: ', this.selectedQualification, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.qualificationId == this.selectedQualification.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedQualification && name != '') {
          console.log('filter both id: ', this.selectedQualification, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.qualificationId == this.selectedQualification.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedQualification, 'name: ', name);
          // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
          this.dataSource = res.filter((res: any) =>
            res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        alert('Error');
      },
    });
    // this.getAllProducts()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
