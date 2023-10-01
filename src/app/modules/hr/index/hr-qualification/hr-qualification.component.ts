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

import { HrQualificationDialogComponent } from '../hr-qualification-dialog/hr-qualification-dialog.component'; 
export class QualitativeGroup {
  constructor(public id: number, public name: string,private toastr: ToastrService) {}
}


@Component({
  selector: 'app-hr-qualification',
  templateUrl: './hr-qualification.component.html',
  styleUrls: ['./hr-qualification.component.css']
})
export class HrQualificationComponent implements OnInit {
  qualitativeGroupCtrl: FormControl;
  filteredQualitativeGroup: Observable<QualitativeGroup[]>;
  qualitativeGroups: QualitativeGroup[] = [];
  selectedQualitativeGroup!: QualitativeGroup;
  formcontrol = new FormControl('');
  qualificationForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name', 'qualitativeGroupName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private api: ApiService,private toastr: ToastrService) {
    this.qualitativeGroupCtrl = new FormControl();
    this.filteredQualitativeGroup = this.qualitativeGroupCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterQualitativeGroup(value))
    );
  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getAllQualification();
    this.api.getAllQualitativeGroups().subscribe((qualitativeGroup) => {
      this.qualitativeGroups = qualitativeGroup;
    });
  }
  openDialog() {
    this.dialog
      .open(HrQualificationDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllQualification();
        }
      });
  }

  displayQualitativeGroup(qualitativeGroup: any): string {
    return qualitativeGroup && qualitativeGroup.name ? qualitativeGroup.name : '';
  }
  qualitativeGroupSelected(event: MatAutocompleteSelectedEvent): void {
    const qualitativeGroup = event.option.value as QualitativeGroup;
    this.selectedQualitativeGroup = qualitativeGroup;
    this.qualificationForm.patchValue({ qualitativeGroupId: qualitativeGroup.id });
    this.qualificationForm.patchValue({ qualitativeGroupName: qualitativeGroup.name });
  }
  private _filterQualitativeGroup(value: string): QualitativeGroup[] {
    const filterValue = value.toLowerCase();
    return this.qualitativeGroups.filter(qualitativeGroup =>
      qualitativeGroup.name.toLowerCase().includes(filterValue) 
    );
  }

  openAutoQualitativeGroup() {
    this.qualitativeGroupCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.qualitativeGroupCtrl.updateValueAndValidity();
  }

  getAllQualification() {
    this.api.getQualification().subscribe({
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

  editQualification(row: any) {
    this.dialog
      .open(HrQualificationDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllQualification();
        }
      });
  }

  deleteQualification(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح المؤهل ؟ ');
    if (result) {
      this.api.deleteQualification(id).subscribe({
        next: (res) => {
          // alert('تم الحذف بنجاح');
          this.toastrDeleteSuccess()
          this.getAllQualification();
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  
  async getQualification(name: any) {
    this.api.getQualification().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedQualitativeGroup && name == '') {
          console.log('filter ID id: ', this.selectedQualitativeGroup, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.qualitativeGroupId == this.selectedQualitativeGroup.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedQualitativeGroup && name != '') {
          console.log('filter both id: ', this.selectedQualitativeGroup, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.qualitativeGroupId == this.selectedQualitativeGroup.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedQualitativeGroup, 'name: ', name);
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

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
