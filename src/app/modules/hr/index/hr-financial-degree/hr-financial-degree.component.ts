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
import { HrCityStateDialogComponent } from '../hr-city-state-dialog/hr-city-state-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HrFinancialDegreeDialogComponent } from '../hr-financial-degree-dialog/hr-financial-degree-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-hr-financial-degree',
  templateUrl: './hr-financial-degree.component.html',
  styleUrls: ['./hr-financial-degree.component.css']
})
export class HrFinancialDegreeComponent {
  
  formcontrol = new FormControl('');
  financialDegreeForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name', 'noYear', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService,private toastr: ToastrService) {

  }
  ngOnInit(): void {
    // console.log(productForm)

   this.getHrFinancialDegree();
   this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
    // Call the deleteGrade() function in the current component
    this.openDialog();
    return false; // Prevent the default browser behavior
  }));
  }
  openDialog() {
    this.dialog
      .open(HrFinancialDegreeDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getHrFinancialDegree();
        }
      });
  }



  getHrFinancialDegree() {
    this.api.getHrFinancialDegree().subscribe({
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

  editHrFinancialDegree(row: any) {
    this.dialog
      .open(HrFinancialDegreeDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getHrFinancialDegree();
        }
      });
  }

  deleteHrFinancialDegree(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteHrFinancialDegree(id)
      .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getHrFinancialDegree();
  
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
 

  // async getSearchHrCityState(name: any) {
  //   this.api.getHrCityState().subscribe({
  //     next: (res) => {
  //       //enter id
  //       if (this.selectedCity && name == '') {
  //         console.log('filter ID id: ', this.selectedCity, 'name: ', name);

  //         this.dataSource = res.filter(
  //           (res: any) => res.cityId == this.selectedCity.id!
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //       //enter both
  //       else if (this.selectedCity && name != '') {
  //         console.log('filter both id: ', this.selectedCity, 'name: ', name);

  //         // this.dataSource = res.filter((res: any)=> res.name==name!)
  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.commodityId == this.selectedCity.id! &&
  //             res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //       //enter name
  //       else {
  //         console.log('filter name id: ', this.selectedCity, 'name: ', name);
  //         // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
  //         this.dataSource = res.filter((res: any) =>
  //           res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //     },
  //     error: (err) => {
  //       alert('Error');
  //     },
  //   });
  //   // this.getAllProducts()
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
