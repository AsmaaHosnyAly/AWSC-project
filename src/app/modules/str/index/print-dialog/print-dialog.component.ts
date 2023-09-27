import { Component } from '@angular/core';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.css'],
})
export class PrintDialogComponent {
  pdfurl: any = '';
  url: any;
  ngOnInit(): void {
    this.url = localStorage.getItem('url');
    this.pdfurl = JSON.parse(this.url);
  }
}
