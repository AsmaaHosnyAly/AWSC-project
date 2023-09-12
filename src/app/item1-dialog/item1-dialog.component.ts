import { Component } from '@angular/core';

@Component({
  selector: 'app-item1-dialog',
  templateUrl: './item1-dialog.component.html',
  styleUrls: ['./item1-dialog.component.css'],
})
export class Item1DialogComponent {
  pdfurl: any = '';
  url: any;
  ngOnInit(): void {
    this.url = localStorage.getItem('url');
    this.pdfurl = JSON.parse(this.url);
  }
}
