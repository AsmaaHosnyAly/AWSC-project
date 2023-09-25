import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-exchange-print-dialog',
  templateUrl: './employee-exchange-print-dialog.component.html',
  styleUrls: ['./employee-exchange-print-dialog.component.css'],
})
export class EmployeeExchangePrintDialogComponent {
  pdfurl: any = '';
  url: any;
  ngOnInit(): void {
    this.url = localStorage.getItem('url');
    this.pdfurl = JSON.parse(this.url);
  }
}
