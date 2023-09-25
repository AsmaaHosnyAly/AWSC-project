import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-custody-print-dialog',
  templateUrl: './employee-custody-print-dialog.component.html',
  styleUrls: ['./employee-custody-print-dialog.component.css'],
})
export class EmployeeCustodyPrintDialogComponent {
  pdfurl: any = '';
  url: any;
  ngOnInit(): void {
    this.url = localStorage.getItem('url');
    this.pdfurl = JSON.parse(this.url);
  }
}
