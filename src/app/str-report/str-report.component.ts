import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-str-report',
  templateUrl: './str-report.component.html',
  styleUrls: ['./str-report.component.css'],
  providers: [DatePipe],
})
export class StrReportComponent {
  displayedColumns: string[] = [];

  myDate: any = new Date();

  reportName: string = '';

  displayName: string = '';

  show: boolean = true;

  reportLocal: any;

  pagesNumber: number = 0;
  pageNumber: number = 1;
  pageSize: number = 2;
  pageData: [] = [];

  static flag: number = 1;

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private global: GlobalService
  ) {
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    global.getPermissionUserRoles(
      1,
      'stores',
      'إدارة المخازن وحسابات المخازن - تقارير المخازن',
      ''
    );
  }

  async ngOnInit() {
    // this.flag = true;
    this.loadReportData();
    this.reportData(this.reportName);
    // await this.delay(500);
    // this.printReport();
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  loadReportData() {
    // console.log(this.api.reportData);
    let reportFooter: any = document.getElementById('reportFooter');
    if (!this.show) {
      reportFooter.style.display = 'none';
    }
    let local: any = localStorage.getItem('reportData');
    let reportNameStorage: any = localStorage.getItem('reportName');
    this.reportName = JSON.parse(reportNameStorage);
    console.log(reportNameStorage);
    // console.log(local);
    this.reportLocal = JSON.parse(local);
    // // console.log(this.reportLocal);
    // this.pagesNumber = this.reportLocal.length / this.pageSize;
    // // console.log(this.pagesNumber);
    // this.pageData = this.reportLocal.slice(
    //   this.pageNumber - 1,
    //   this.pageNumber * this.pageSize
    // );
    // let report: any = this.pageData;
    // this.dataSource = new MatTableDataSource(report);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    //  All Data
    console.log(this.reportName);
    let report: any = this.reportLocal;

    console.log(report);
    this.dataSource = new MatTableDataSource(report);
    console.log(this.dataSource);
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  reportData(name: string) {
    console.log('name', name);
    switch (name) {
      case (name = 'items1'):
        console.log(name);
        this.displayedColumns = [
          'name',
          'commodityName',
          'gradeName',
          'platoonName',
          'groupName',
          'unitName',
          'isActive',
          'type',
        ];

        this.displayName = 'الاصناف';
        // this.show = false;
        break;
      case (name = 'withdraw'):
        console.log(name);
        this.displayedColumns = [
          'no',
          'storeName',
          'employeeName',
          'costCenterName',
          'date',
        ];
        this.displayName = 'اذن صرف';
        this.show = false;
        break;
      case (name = 'groupOpening'):
        console.log(name);
        this.displayedColumns = ['no', 'storeName', 'fiscalyear', 'date'];
        this.displayName = 'أرصدة إفتتاحية';
        this.show = false;
        break;
      case (name = 'employeeOpening'):
        console.log(name);
        this.displayedColumns = [
          'no',
          'fiscalyear',
          'employeeName',
          'destEmployeeName',
          'costCenterName',
          'date',
        ];
        this.displayName = 'ارصدة افتتاحية للعهد الشخصية';
        this.show = false;
        break;
      case (name = 'str-employee'):
        console.log(name);
        this.displayedColumns = ['no', 'employeeName', 'date'];
        this.displayName = 'نقل عهدة شخصية';
        this.show = false;
        break;
      default:
        this.displayedColumns = [];
        break;
    }
  }

  // loadAllData() {
  //   let local: any = localStorage.getItem('reportData');
  //   this.reportLocal = JSON.parse(local);
  //   let report: any = this.reportLocal;
  //   this.dataSource = new MatTableDataSource(report);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //
  // }

  printReport() {
    // this.loadAllData();
    // let flag: boolean = true;
    let reportFooter: any = document.getElementById('reportFooter');
    let date: any = document.getElementById('date');
    if (this.show) {
      reportFooter.style.display = 'block';
      date.style.display = 'block';
    }
    let printContent: any = document.getElementById('content')?.innerHTML;
    let originalContent: any = document.body.innerHTML;
    document.body.innerHTML = printContent;
    // console.log(document.body.children);
    document.body.style.cssText =
      'direction:rtl;-webkit-print-color-adjust:exact;';
    window.print();
    document.body.innerHTML = originalContent;

    // must be reloaded after printContent
    // location.reload();
    this.router.navigate([this.reportName]).then(() => {
      location.reload();
    });

    // if (StrReportComponent.flag == 1) {
    //   StrReportComponent.flag += 1;
    // }
    // window.history.back();
  }

  goBack() {
    console.log('goBack');
    window.history.back();
  }

  first() {
    this.pageNumber = 1;
    this.pageData = this.reportLocal.slice(
      (this.pageNumber - 1) * this.pageSize,
      this.pageNumber * this.pageSize
    );
    let data: any = this.pageData;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  back() {
    if (this.pageNumber > 1) {
      this.pageNumber = this.pageNumber - 1;
      // console.log(this.pageNumber);
      this.pageData = this.reportLocal.slice(
        (this.pageNumber - 1) * this.pageSize,
        this.pageNumber * this.pageSize
      );
      let data: any = this.pageData;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  next() {
    if (this.pageNumber < this.pagesNumber) {
      this.pageNumber = this.pageNumber + 1;
      console.log(this.pageNumber);
      this.pageData = this.reportLocal.slice(
        (this.pageNumber - 1) * this.pageSize,
        this.pageNumber * this.pageSize
      );
      let data: any = this.pageData;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  last() {
    this.pageNumber = this.pagesNumber;
    // console.log(this.pageNumber);
    this.pageData = this.reportLocal.slice(
      (this.pageNumber - 1) * this.pageSize,
      this.pageNumber * this.pageSize
    );
    let data: any = this.pageData;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
