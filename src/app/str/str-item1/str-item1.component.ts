import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { STRItem1DialogComponent } from '../str-item1-dialog/str-item1-dialog.component';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  FormGroup,
  FormBuilder,
  Validator,
  Validators,
  FormControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { Item1DialogComponent } from 'src/app/str/item1-dialog/item1-dialog.component';
export class Commodity {
  constructor(public id: number, public name: string, public code: string) {}
}

export class Grade {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public commodityId: number
  ) {}
}

export class Platoon {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public commodityId: number,
    public gradeId: number
  ) {}
}

export class Group {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public commodityId: number,
    public gradeId: number,
    public platoonId: number
  ) {}
}

export class Unit {
  constructor(
    public id: number,
    public name: string,
    private global: GlobalService
  ) {}
}

@Component({
  selector: 'app-str-item1',
  templateUrl: './str-item1.component.html',
  styleUrls: ['./str-item1.component.css'],
  providers: [DatePipe],
})
export class STRItem1Component implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  unitCtrl: FormControl;
  filteredUnits: Observable<Unit[]>;
  units: Unit[] = [];
  selectedUnit!: Unit;
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  selectedCommodity!: Commodity;
  commodities: Commodity[] = [];
  gradeCtrl: FormControl;
  filteredGrades: Observable<Grade[]>;
  selectedGrade!: Grade;
  grades: Grade[] = [];
  platoonCtrl: FormControl;
  filteredPlatoons: Observable<Platoon[]>;
  platoons: Platoon[] = [];
  selectedPlatoon!: Platoon;
  groupCtrl: FormControl;
  filteredGroups: Observable<Group[]>;
  groups: Group[] = [];
  selectedGroup!: Group;
  formcontrol = new FormControl('');
  itemForm!: FormGroup;
  title = 'angular13crud';
  displayedColumns: string[] = [
    'fullCode',
    'name',
    'type',
    'commodityName',
    'gradeName',
    'platoonName',
    'groupName',
    'unitName',
    'action',
  ];

  myDate: any = new Date();

  reportName: string = 'str-item1';
  reportData: any;
  dataSource2!: MatTableDataSource<any>;
  dataSource!: MatTableDataSource<any>;
  Invoiceheader: any;
  pdfurl = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private api: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private global: GlobalService
  ) {
    global.getPermissionUserRoles(
      1,
      'stores',
      'إدارة المخازن وحسابات المخازن-الاصناف',
      ''
    );
    this.unitCtrl = new FormControl();
    this.filteredUnits = this.unitCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterUnits(value))
    );

    this.commodityCtrl = new FormControl();
    this.filteredCommodities = this.commodityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCommodities(value))
    );

    this.gradeCtrl = new FormControl();
    this.filteredGrades = this.gradeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGrades(value))
    );

    this.platoonCtrl = new FormControl();
    this.filteredPlatoons = this.platoonCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPlatoons(value))
    );

    this.groupCtrl = new FormControl();
    this.filteredGroups = this.groupCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroups(value))
    );

    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }
  ngOnInit(): void {
    this.getAllItems();
    this.api.getAllUnitsi().subscribe((units) => {
      this.units = units;
    });

    this.api.getAllCommoditiesi().subscribe((commodities) => {
      this.commodities = commodities;
    });

    this.api.getAllGradesi().subscribe((grades) => {
      this.grades = grades;
    });

    this.api.getAllPlatoonsi().subscribe((platoons) => {
      this.platoons = platoons;
    });

    this.api.getAllGroupsi().subscribe((groups) => {
      this.groups = groups;
    });

    this.itemForm = this.formBuilder.group({
      itemName: [''],
      fullCode: [''],
      type: [''],
      unitN: [''],
      commodityN: [''],
      gradeN: [''],
      platoonN: [''],
      groupN: [''],
      unitId: [''],
      commodityId: [''],
      gradeId: [''],
      platoonId: [''],
      groupId: [''],
    });
  }
  openDialog() {
    this.dialog
      .open(STRItem1DialogComponent, {
        width: '50%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllItems();
        }
      });
  }

  displayUnitName(unit: any): string {
    return unit && unit.name ? unit.name : '';
  }

  displayCommodityName(commodity: any): string {
    return commodity && commodity.name ? commodity.name : '';
  }

  displayGradeName(grade: any): string {
    return grade && grade.name ? grade.name : '';
  }

  displayPlatoonName(platoon: any): string {
    return platoon && platoon.name ? platoon.name : '';
  }

  displayGroupName(group: any): string {
    return group && group.name ? group.name : '';
  }

  unitSelected(event: MatAutocompleteSelectedEvent): void {
    const unit = event.option.value as Unit;
    this.selectedUnit = unit;
    this.itemForm.patchValue({ unitId: unit.id });
    this.itemForm.patchValue({ unitName: unit.name });
  }

  commoditySelected(event: MatAutocompleteSelectedEvent): void {
    const commodity = event.option.value as Commodity;
    this.selectedCommodity = commodity;
    this.itemForm.patchValue({ commodityId: commodity.id });
    this.itemForm.patchValue({ commodityName: commodity.name });
    this.itemForm.patchValue({ commoditycode: commodity.code });
  }

  gradeSelected(event: MatAutocompleteSelectedEvent): void {
    const grade = event.option.value as Grade;
    this.selectedGrade = grade;
    this.itemForm.patchValue({ gradeId: grade.id });
    this.itemForm.patchValue({ gradeName: grade.name });
    this.itemForm.patchValue({ gradecode: grade.code });
  }

  platoonSelected(event: MatAutocompleteSelectedEvent): void {
    const platoon = event.option.value as Platoon;
    this.selectedPlatoon = platoon;
    this.itemForm.patchValue({ platoonId: platoon.id });
    this.itemForm.patchValue({ platoonName: platoon.name });
    this.itemForm.patchValue({ platooncode: platoon.code });
  }

  groupSelected(event: MatAutocompleteSelectedEvent): void {
    const group = event.option.value as Group;
    this.selectedGroup = group;
    this.itemForm.patchValue({ groupId: group.id });
    this.itemForm.patchValue({ groupName: group.name });
    this.itemForm.patchValue({ groupcode: group.code });
  }

  private _filterUnits(value: string): Unit[] {
    const filterValue = value;
    return this.units.filter((unit) =>
      unit.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterCommodities(value: string): Commodity[] {
    const filterValue = value;
    return this.commodities.filter(
      (commodity) =>
        commodity.name.toLowerCase().includes(filterValue) ||
        commodity.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterGrades(value: string): Grade[] {
    const filterValue = value;
    return this.grades.filter(
      (grade) =>
        grade.name.toLowerCase().includes(filterValue) ||
        grade.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterPlatoons(value: string): Platoon[] {
    const filterValue = value;
    return this.platoons.filter(
      (platoon) =>
        platoon.name.toLowerCase().includes(filterValue) ||
        platoon.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterGroups(value: string): Group[] {
    const filterValue = value;
    return this.groups.filter(
      (group) =>
        group.name.toLowerCase().includes(filterValue) ||
        group.code.toLowerCase().includes(filterValue)
    );
  }
  openAutoUnit() {
    this.unitCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.unitCtrl.updateValueAndValidity();
  }
  openAutoCommodity() {
    this.commodityCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.commodityCtrl.updateValueAndValidity();
  }
  openAutoGrade() {
    this.gradeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.gradeCtrl.updateValueAndValidity();
  }
  openAutoPlatoon() {
    this.platoonCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.platoonCtrl.updateValueAndValidity();
  }

  openAutoGroup() {
    this.groupCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.groupCtrl.updateValueAndValidity();
  }

  getAllItems() {
    this.api.getItem().subscribe({
      next: (res) => {
        console.log('res table: ', res);
        this.reportData = res;
        // let data: any = this.api.reportData;
        window.localStorage.setItem(
          'reportData',
          JSON.stringify(this.reportData)
        );
        window.localStorage.setItem(
          'reportName',
          JSON.stringify(this.reportName)
        );
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.itemForm.reset();
      },
      error: (err) => {
        alert('error while fetching the records!!');
      },
    });
  }
  editItem(row: any) {
    console.log('data : ', row);
    this.dialog
      .open(STRItem1DialogComponent, {
        width: '50%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllItems();
        }
      });
  }
  deleteItem(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح الصنف ؟ ');
    if (result) {
      this.api.deleteItems(id).subscribe({
        next: (res) => {
          alert('Product deleted successfully');
          this.getAllItems();
        },
        error: () => {
          alert('error while deleting the product!!');
        },
      });
    }
  }
  

  async getSearchItems(name: any, fullCode: any, type: any) {
    let commodity = this.itemForm.getRawValue().commodityId;
    console.log('commodityRow:', commodity);
    let grade = this.itemForm.getRawValue().gradeId;
    console.log('gradeRow:', grade);
    let platoon = this.itemForm.getRawValue().platoonId;
    console.log('platoonRow:', platoon);
    let group = this.itemForm.getRawValue().groupId;
    console.log('groupRow:', group);
    let unit = this.itemForm.getRawValue().unitId;
    console.log('unitRow:', unit);

    this.api
      .getSearchItem(
        name,
        fullCode,
        type,
        commodity,
        grade,
        platoon,
        group,
        unit
      )
      .subscribe({
        next: (res) => {
          console.log('search:', res);

          this.dataSource = res;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log('eroorr', err);
        },
      });
  }

  async getSearch(name: any) {
    this.api.getItem().subscribe({
      next: (res) => {
        //enter itemName
        if (!this.selectedGroup && name && !this.selectedUnit) {
          console.log('filter name id: ', this.selectedGroup, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
          this.dataSource = res.filter((res: any) =>
            res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        //enter selectedGroup
        if (this.selectedGroup && name == '' && !this.selectedUnit) {
          console.log('selectedGroup:', this.selectedGroup);

          this.dataSource = res.filter(
            (res: any) => res.groupId == this.selectedGroup.id
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        //enter selectedUnit
        if (!this.selectedGroup && name == '' && this.selectedUnit) {
          console.log('selectedUnit: ', this.selectedUnit, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.unitId == this.selectedUnit.id
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        //enter selectedUnit+selectedGroup
        if (this.selectedUnit && name == '' && this.selectedGroup) {
          console.log(
            'filter Unit, Group: ',
            this.selectedUnit,
            this.selectedGroup
          );

          this.dataSource = res.filter(
            (res: any) =>
              res.unitId == this.selectedUnit.id &&
              res.groupId == this.selectedGroup.id
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        //enter selectedGroup+item
        else if (this.selectedGroup && name && !this.selectedUnit) {
          console.log(
            'selectedGroup ,name: ',
            this.selectedGroup,
            'name: ',
            name
          );

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.groupId == this.selectedGroup.id &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        //enter selectedUnit+item
        else if (this.selectedUnit && name && !this.selectedGroup) {
          console.log(
            'selectedUnit, name: ',
            this.selectedUnit,
            'name: ',
            name
          );

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.unitId == this.selectedUnit.id &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        //enter all
        else if (this.selectedUnit && this.selectedGroup && name) {
          console.log(
            'all: ',
            this.selectedUnit,
            this.selectedGroup,
            'name: ',
            name
          );

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.unitId == this.selectedUnit.id &&
              res.groupId == this.selectedGroup.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        //enter itemName
        else if (!this.selectedGroup && name == '' && !this.selectedUnit) {
          console.log(
            'filter name mmmm id: ',
            this.selectedGroup,
            'name: ',
            name
          );
          // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
          // this.dataSource = res.filter((res: any)=> res.name.toLowerCase().includes(name.toLowerCase()))
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        alert('Error');
      },
    });
    // this.getAllProducts()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    let buttn: any = document.querySelectorAll('#buttn');
    for (let index = 0; index < buttn.length; index++) {
      buttn[index].hidden = true;
    }

    let actionHeader: any = document.getElementById('action-header');
    actionHeader.style.display = 'none';

    let reportFooter: any = document.getElementById('reportFooter');
    let date: any = document.getElementById('date');
    header.style.display = 'grid';
    //button1.style.display = 'none';
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

  // printReport() {
  //   // case print in report component

  //   this.router.navigate(['/report']);

  //   // case print in current component

  //   let header: any = document.getElementById('header');
  //   let paginator: any = document.getElementById('paginator');
  //   let action1: any = document.getElementById('action1');
  //   let action2: any = document.querySelectorAll('action2');
  //   console.log(action2);
  //   let button1: any = document.querySelectorAll('#button1');
  //   console.log(button1);
  //   let button2: any = document.getElementById('button2');
  //   let button: any = document.getElementsByClassName('mdc-icon-button');
  //   console.log(button);
  //   let reportFooter: any = document.getElementById('reportFooter');
  //   let date: any = document.getElementById('date');
  //   header.style.display = 'grid';
  //   // // paginator.style.display = 'none';
  //   action1.style.display = 'none';
  //   // // button1.style.display = 'none';
  //   // // button2.style.display = 'none';
  //   for (let index = 0; index < button.length; index++) {
  //     let element = button[index];

  //     element.hidden = true;
  //   }
  //   // // reportFooter.style.display = 'block';
  //   // // date.style.display = 'block';
  //   let printContent: any = document.getElementById('content')?.innerHTML;
  //   let originalContent: any = document.body.innerHTML;
  //   document.body.innerHTML = printContent;
  //   // // console.log(document.body.children);
  //   document.body.style.cssText =
  //     'direction:rtl;-webkit-print-color-adjust:exact;';
  //   window.print();
  //   document.body.innerHTML = originalContent;
  //   location.reload();
  // }
  // PreviewInvoice(invoice: any) {
  //   this.service.GenerateInvoicePDF(invoice).subscribe((res) => {
  //     let blob: Blob = res.body as Blob;
  //     let url = window.URL.createObjectURL(blob);
  //     this.pdfurl = url;
  //   });
  // }

  async getSearchItemsWithprint(name: any, fullCode: any, type: any) {
    console.log('print');
    let commodity = this.itemForm.getRawValue().commodityId;
    console.log('commodityRow:', commodity);
    let grade = this.itemForm.getRawValue().gradeId;
    console.log('gradeRow:', grade);
    let platoon = this.itemForm.getRawValue().platoonId;
    console.log('platoonRow:', platoon);
    let group = this.itemForm.getRawValue().groupId;
    console.log('groupRow:', group);
    let unit = this.itemForm.getRawValue().unitId;
    console.log('unitRow:', unit);

    this.api
      .printReportItems(
        name,
        fullCode,
        type,
        commodity,
        grade,
        platoon,
        group,
        unit
      )
      .subscribe({
        next: (res) => {
          console.log('search:', res);
          const url: any = res.url;
          window.open(url);
          // let blob: Blob = res.body as Blob;
          // let url = window.URL.createObjectURL(blob);

          // this.dataSource = res;
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log('eroorr', err);
          window.open(err.url);
        },
      });
  }

  async preview(name: any, fullCode: any, type: any) {
    // console.log('print');
    let commodity = this.itemForm.getRawValue().commodityId;
    // console.log('commodityRow:', commodity);
    let grade = this.itemForm.getRawValue().gradeId;
    // console.log('gradeRow:', grade);
    let platoon = this.itemForm.getRawValue().platoonId;
    // console.log('platoonRow:', platoon);
    let group = this.itemForm.getRawValue().groupId;
    // console.log('groupRow:', group);
    let unit = this.itemForm.getRawValue().unitId;
    // console.log('unitRow:', unit);

    this.api
      .printReportItems(
        name,
        fullCode,
        type,
        commodity,
        grade,
        platoon,
        group,
        unit
      )
      .subscribe({
        next: (res) => {
          let blob: Blob = res.body as Blob;
          console.log(blob);
          let url = window.URL.createObjectURL(blob);
          localStorage.setItem('url', JSON.stringify(url));
          this.pdfurl = url;
          this.dialog.open(Item1DialogComponent, {
            width: '50%',
          });

          // this.dataSource = res;
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log('eroorr', err);
          window.open(err.url);
        },
      });
  }
}
