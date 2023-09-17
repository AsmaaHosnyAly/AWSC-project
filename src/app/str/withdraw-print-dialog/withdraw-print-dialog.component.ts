import { Component } from '@angular/core';

@Component({
  selector: 'app-withdraw-print-dialog',
  templateUrl: './withdraw-print-dialog.component.html',
  styleUrls: ['./withdraw-print-dialog.component.css'],
})
export class WithdrawPrintDialogComponent {
  pdfurl: any = '';
  url: any;
  ngOnInit(): void {
    this.url = localStorage.getItem('url');
    this.pdfurl = JSON.parse(this.url);
  }
}
