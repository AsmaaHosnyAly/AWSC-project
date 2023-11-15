import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { TrInstructorCourseDialogComponent } from '../tr-instructor-course-dialog/tr-instructor-course-dialog.component';
import { GlobalService } from 'src/app/pages/services/global.service';

interface TrInstructorCourse {
  headerName: any;
  rating: any;
  courseName: any;
  price: any;
  notes: any;
  action: any;
}

@Component({
  selector: 'app-tr-instructor-course',
  templateUrl: './tr-instructor-course.component.html',
  styleUrls: ['./tr-instructor-course.component.css']
})
export class TrInstructorCourseComponent implements OnInit {
  ELEMENT_DATA: TrInstructorCourse[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<TrInstructorCourse> = new MatTableDataSource();

  formcontrol = new FormControl('');
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['headerName', 'rating', 'courseName','price', 'notes','action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService,private toastr: ToastrService,global:GlobalService) {
    global.getPermissionUserRoles('IT', '', 'الإدارة العامة للتدريب', 'supervised_user_circle')
  }
  ngOnInit(): void {

    this.getInstructorCourse();

    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(TrInstructorCourseDialogComponent, {
        width: '50%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getInstructorCourse();
        }
      });
  }



  getInstructorCourse() {
    // this.api.getInstructorCourse().subscribe({
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
      fetch(this.api.getTrInstructorCoursePaginate(this.currentPage, this.pageSize))
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
      fetch(this.api.getTrInstructorCoursePaginate(this.currentPage, this.pageSize))
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

    this.getInstructorCourse();
  }

  editInstructorCourse(row: any) {
    this.dialog
      .open(TrInstructorCourseDialogComponent, {
        width: '50%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getInstructorCourse();
        }
      });
  }

  deleteInstructorCourse(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteInstructorCourse(id)
      .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getInstructorCourse();
  
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
