import { Component } from '@angular/core';

@Component({
  selector: 'app-opening-stock-print-dialog',
  templateUrl: './opening-stock-print-dialog.component.html',
  styleUrls: ['./opening-stock-print-dialog.component.css'],
})
export class OpeningStockPrintDialogComponent {
  pdfurl: any = '';
  url: any;
  ngOnInit(): void {
    this.url = localStorage.getItem('url');
    this.pdfurl = JSON.parse(this.url);
  }
}
