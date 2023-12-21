
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
import { CcSubRegionDialogComponent } from '../cc-sub-region-dialog/cc-sub-region-dialog.component';

interface CcSubRegion {
  code: any;
  name: any;
  regionName: any;
  action: any;
}

@Component({
  selector: 'app-cc-sub-region',
  templateUrl: './cc-sub-region.component.html',
  styleUrls: ['./cc-sub-region.component.css']
})
export class CcSubRegionComponent implements OnInit {
  ELEMENT_DATA: CcSubRegion[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<CcSubRegion> = new MatTableDataSource();

  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['code', 'name', 'regionName', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog, private toastr: ToastrService, private api: ApiService, private global: GlobalService, private hotkeysService: HotkeysService) {

    global.getPermissionUserRoles('CC', 'ccHome', 'التكاليف', 'credit_card')
  }
  ngOnInit(): void {
    this.getAllSubRegions();

    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteSubRegion() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));

  }
  openDialog() {
    this.dialog
      .open(CcSubRegionDialogComponent, {
        width: '45%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllSubRegions();
        }
      });
  }


  getAllSubRegions() {
    // this.api.getCcSubRegion().subscribe({
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
      fetch(this.api.getCcSubReginPaginate(this.currentPage, this.pageSize))
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
      fetch(this.api.getCcSubReginPaginate(this.currentPage, this.pageSize))
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

    this.getAllSubRegions();
  }

  editSubRegion(row: any) {
    this.dialog
      .open(CcSubRegionDialogComponent, {
        width: '45%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllSubRegions();
        }
      });
  }

  deleteSubRegion(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteCcSubRegion(id).subscribe({
        next: (res) => {
          if (res == 'Succeeded') {
            console.log("res of deletestore:", res)
            this.toastrDeleteSuccess();
            this.getAllSubRegions();
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
