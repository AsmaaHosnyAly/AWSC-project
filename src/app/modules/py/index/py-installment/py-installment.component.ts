import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { PyInstallmentDialogComponent } from '../py-installment-dialog/py-installment-dialog.component';
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
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-py-installment',
  templateUrl: './py-installment.component.html',
  styleUrls: ['./py-installment.component.css']
})
export class PyInstallmentComponent implements OnInit {

  formcontrol = new FormControl('');
  InstallmentForm!: FormGroup;
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['no', 'startDate', 'value', 'installmentValue', 'installmentNo','paiedSum','employeeName','pyItemName','description','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog,private toastr: ToastrService,
     private api: ApiService,
     private hotkeysService: HotkeysService) { }
  ngOnInit(): void {
    // console.log(productForm)
this.getAllInstallments();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(PyInstallmentDialogComponent, {
        width: '43%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllInstallments();
        }
      });
  }

  getAllInstallments() {
    this.api.getPyInstallment().subscribe({
      next: (res) => {
        console.log("dataaaaa:",res);
        
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  editInstallment(row: any) {
    this.dialog
      .open(PyInstallmentDialogComponent, {
        width: '43%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllInstallments();
        }
      });
  }

  deleteInstallment(id:number){
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deletePyInstallment(id).subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deleteInstallment:",res)
            this.toastrDeleteSuccess();
          this.getAllInstallments();
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

