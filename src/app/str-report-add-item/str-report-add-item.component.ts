import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-str-report-add-item',
  templateUrl: './str-report-add-item.component.html',
  styleUrls: ['./str-report-add-item.component.css'],
  providers: [DatePipe],
})
export class StrReportAddItemComponent {
  displayedColumns: string[] = [
    'addReceiptId',
    'createUserName',
    'date',
    'employeeName',
    'fiscalyear',
    'notes',
    'sellerName',
    'storeName',
    'total',
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  myDate: any = '';
  storeName: string = '';

  constructor(private api: ApiService, private datePipe: DatePipe) {
    // this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }
  ngOnInit(): void {
    this.getDataFromLocalStorage();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDataFromLocalStorage(): any {
    const data: any = localStorage.getItem('store-data');
    const dataParse = JSON.parse(data);
    console.log(dataParse);
    console.log(dataParse[0].date);
    this.myDate = dataParse[0].date;
    this.storeName = dataParse[0].storeName;
  }

  printReport() {
    // this.loadAllData();
    let header: any = document.getElementById('header');
    let paginator: any = document.getElementById('paginator');
    let action1: any = document.getElementById('action1');
    let action2: any = document.querySelectorAll('action2');
    console.log(action2);
    let button1: any = document.querySelectorAll('#button1');
    console.log(button1);
    let button2: any = document.getElementById('button2');
    let button: any = document.getElementsByClassName('mdc-icon-button');
    console.log(button);
    let reportFooter: any = document.getElementById('reportFooter');
    let date: any = document.getElementById('date');
    header.style.display = 'grid';
    // button1.style.display = 'none';
    // button2.style.display = 'none';

    let printContent: any = document.getElementById('content')?.innerHTML;
    let originalContent: any = document.body.innerHTML;
    document.body.innerHTML = printContent;
    // console.log(document.body.children);
    document.body.style.cssText =
      'direction:rtl;-webkit-print-color-adjust:exact;';
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
  }
}
