import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GlobalService } from 'src/app/pages/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { PyTaxBracketDialogComponent } from '../py-tax-bracket-dialog/py-tax-bracket-dialog.component';

interface PyTaxBracket {
  value: any;
  ratio: any;
  action: any;
}

@Component({
  selector: 'app-py-tax-bracket',
  templateUrl: './py-tax-bracket.component.html',
  styleUrls: ['./py-tax-bracket.component.css']
})
export class PyTaxBracketComponent {
  ELEMENT_DATA: PyTaxBracket[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<PyTaxBracket> = new MatTableDataSource();

  title = 'angular13crud';
  displayedColumns: string[] = ['value', 'ratio', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog, private toastr: ToastrService, private api: ApiService, private global: GlobalService, private http: HttpClient, private hotkeysService: HotkeysService) {
    global.getPermissionUserRoles(9, 'stores', 'الوحدة', '')
  }
  ngOnInit(): void {
    this.getAllTaxBrackets();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  openDialog() {

    this.dialog.open(PyTaxBracketDialogComponent, {
      width: '30%'

    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllTaxBrackets();
      }
    })
  }
  getAllTaxBrackets() {
    // this.api.getTaxBracket()
    //   .subscribe({
    //     next: (res) => {
    //       this.dataSource = new MatTableDataSource(res);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //     },
    //     error: (err) => {
    //       alert("خطأ عند استدعاء البيانات");
    //     }

    //   })

    if (!this.currentPage) {
      this.currentPage = 0;

      // this.isLoading = true;
      fetch(this.api.getPyTaxBracketPaginate(this.currentPage, this.pageSize))
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
      fetch(this.api.getPyTaxBracketPaginate(this.currentPage, this.pageSize))
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

    this.getAllTaxBrackets();
  }

  editTaxBracket(row: any) {
    this.dialog.open(PyTaxBracketDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllTaxBrackets();
      }
    })
  }
  daleteTaxBracket(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteTaxBracket(id)

        .subscribe({
          next: (res) => {
            if (res == 'Succeeded') {
              console.log("res of deletestore:", res)
              this.toastrDeleteSuccess();
              this.getAllTaxBrackets();

            } else {
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
