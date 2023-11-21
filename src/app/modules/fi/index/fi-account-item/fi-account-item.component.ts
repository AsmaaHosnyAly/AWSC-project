import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatDialog,  MAT_DIALOG_DATA,  MatDialogModule} from '@angular/material/dialog';
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
import { FiAccountItemdDialogComponent } from '../fi-account-itemd-dialog/fi-account-itemd-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/pages/services/global.service';

interface FiAccountItem {
  name: any;
  accounName: any;
  accountItemCategoryName: any;
  action: any;
}

@Component({
  selector: 'app-fi-account-item',
  templateUrl: './fi-account-item.component.html',
  styleUrls: ['./fi-account-item.component.css']
})
export class FiAccountItemComponent  implements OnInit {
  ELEMENT_DATA: FiAccountItem[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<FiAccountItem> = new MatTableDataSource();

  getAccountItemData: any;
  formcontrol = new FormControl('');
  accountItemForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name', 'accounName','accountItemCategoryName', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // commidityDt: any = {
  //   id: 0,
  // };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private global:GlobalService,private dialog: MatDialog,private toastr: ToastrService, private api: ApiService,private hotkeysService: HotkeysService) {
    global.getPermissionUserRoles('Accounts', 'fi-home', 'إدارة الحسابات ', 'iso')  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getAllAccountItem();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
 
  }
  openDialog() {
    this.dialog
      .open(FiAccountItemdDialogComponent, {
        width: '40%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllAccountItem();
        }
      });
  }

 

  getAllAccountItem() {
    // this.api.getFiAccountItem().subscribe({
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
      fetch(this.api.getFiAccountItemPaginate(this.currentPage, this.pageSize))
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
      fetch(this.api.getFiAccountItemPaginate(this.currentPage, this.pageSize))
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

    this.getAllAccountItem();
  }


  editFiAccountItem(row: any) {
    this.dialog
      .open(FiAccountItemdDialogComponent, {
        width: '40%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllAccountItem();
        }
      });
  }

  deleteFiAccountItem(id: number) {
 var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
  if (result) {
    this.api.deleteFiAccountItem(id)
    .subscribe({
      next: (res) => {
        if(res == 'Succeeded'){
          console.log("res of deletestore:",res)
          this.toastrDeleteSuccess();
                  this.getAllAccountItem();


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
