



// import { Component, OnInit, ViewChild } from '@angular/core';
// import {
//   MatDialog,
//   MAT_DIALOG_DATA,
//   MatDialogModule,
// } from '@angular/material/dialog';
// import { ApiService } from '../../services/api.service';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatSort, MatSortModule } from '@angular/material/sort';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { map, startWith } from 'rxjs/operators';
// import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
// import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
// import { MatOptionSelectionChange } from '@angular/material/core';
// import { FormControl, FormGroup } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { GlobalService } from 'src/app/pages/services/global.service'; 
// import { HotkeysService } from 'angular2-hotkeys';
// import { Hotkey } from 'angular2-hotkeys';
// import { ToastrService } from 'ngx-toastr';
// import { CcCostCenterDialogComponent } from '../cc-cost-center-dialog/cc-cost-center-dialog.component';
// @Component({
//   selector: 'app-cc-cost-center',
//   templateUrl: './cc-cost-center.component.html',
//   styleUrls: ['./cc-cost-center.component.css']
// })
// export class CcCostCenterComponent implements OnInit {
  
//   title = 'Angular13Crud';
//   //define table fields which has to be same to api fields
//   displayedColumns: string[] = ['code', 'name', 'regionName', 'action'];
//   dataSource!: MatTableDataSource<any>;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
  
  
//   constructor(private dialog: MatDialog,private toastr: ToastrService, private api: ApiService,private global:GlobalService,private hotkeysService: HotkeysService) {
    
//     global.getPermissionUserRoles(4, 'stores', ' النوعية', '')
//   }
//   ngOnInit(): void {
//     this.getAllCostCenters();

//     this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
//       // Call the deleteCostCenter() function in the current component
//       this.openDialog();
//       return false; // Prevent the default browser behavior
//     }));
  
//   }
//   openDialog() {
//     this.dialog
//       .open(CcCostCenterDialogComponent, {
//         width: '45%',
//       })
//       .afterClosed()
//       .subscribe((val) => {
//         if (val === 'save') {
//           this.getAllCostCenters();
//         }
//       });
//   }


//   getAllCostCenters() {
//     this.api.getCcCostCenter().subscribe({
//       next: (res) => {
//         this.dataSource = new MatTableDataSource(res);
//         this.dataSource.paginator = this.paginator;
//         this.dataSource.sort = this.sort;
//       },
//       error: (err) => {
//         alert('Error');
//       },
//     });
//   }

//   editCostCenter(row: any) {
//     this.dialog
//       .open(CcCostCenterDialogComponent, {
//         width: '45%',
//         data: row,
//       })
//       .afterClosed()
//       .subscribe((val) => {
//         if (val === 'update') {
//           this.getAllCostCenters();
//         }
//       });
//   }

//   deleteCostCenter(id: number) {
//     var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
//     if (result) {
//       this.api.deleteCcCostCenter(id).subscribe({
//         next: (res) => {
//           if(res == 'Succeeded'){
//             console.log("res of deletestore:",res)
//             this.toastrDeleteSuccess();
//           this.getAllCostCenters();
//         }else{
//           alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
//         }
//         },
//         error: () => {
//           alert('خطأ فى حذف العنصر'); 
//         },
//       });
//     }
//   }
//   toastrDeleteSuccess(): void {
//     this.toastr.success('تم الحذف بنجاح');
//   }


//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
  
//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }
//   }
