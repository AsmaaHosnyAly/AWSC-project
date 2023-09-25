
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrPositionDialogComponent } from '../hr-position-dialog/hr-position-dialog.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
// import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-hr-position',
  templateUrl: './hr-position.component.html',
  styleUrls: ['./hr-position.component.css']
})
export class HrPositionComponent  implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  
  displayedColumns: string[] = [
 'name','action'
  ];


  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor( private toastr: ToastrService,
    private dialog: MatDialog,
    private api: ApiService
  ) {
    
  }
  ngOnInit(): void {
    this.getAllPositions();
  }
  openDialog() {
    this.dialog
      .open(HrPositionDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllPositions();
        }
      });
  }



 

 
  getAllPositions() {
    this.api.getHrPosition().subscribe({
      next: (res) => {
        console.log('res table: ', res);

        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('error while fetching the records!!');
      },
    });
  }
  editPositions(row: any) {
    console.log('data : ', row);
    this.dialog
      .open(HrPositionDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllPositions();
        }
      });
  }
  deletePositions(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح الصنف ؟ ');
    if (result) {
      this.api.deleteHrPosition(id).subscribe({
        next: (res) => {
          alert('Product deleted successfully');
          this.getAllPositions();
        },
        error: () => {
          alert('error while deleting the product!!');
        },
      });
    }
  }
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
