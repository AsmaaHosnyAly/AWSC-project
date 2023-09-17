import { Component } from '@angular/core';

@Component({
  selector: 'app-str-add-print-dialog',
  templateUrl: './str-add-print-dialog.component.html',
  styleUrls: ['./str-add-print-dialog.component.css'],
})
export class StrAddPrintDialogComponent {
  pdfurl: any = '';
  url: any;
  ngOnInit(): void {
    this.url = localStorage.getItem('url');
    this.pdfurl = JSON.parse(this.url);
  }
}
