import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validator,
  Validators,
  FormControl,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

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

@Component({
  selector: 'app-str-platoon1-dialog',
  templateUrl: './str-platoon1-dialog.component.html',
  styleUrls: ['./str-platoon1-dialog.component.css'],
})
export class STRPlatoon1DialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  select = 0;
  Id: string | undefined | null;
  commodity: any = {
    id: 0,
    name: '',
    code: '',
  };
  grade: any = {
    id: 0,
    name: '',
    code: '',
  };
  commoditylist: any;
  gradelist: any;
  getHeaderRowId: any;
  commodityChoose: any;
  gradeName: any;
  commodityName: any;
  restGroupInfoDone = false;
  formcontrol = new FormControl('');
  platoonForm!: FormGroup;
  actionBtn: string = 'حفظ';
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<STRPlatoon1DialogComponent>
  ) {}

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.platoonForm = this.editData;

    this.fillSelect();

    this.platoonForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      commodityName: ['', Validators.required],
      commodityId: [''],
      gradeName: ['', Validators.required],
      gradeId: [''],
      id: [''],
    });

    if (this.editData) {
      this.actionBtn = 'تحديث';
      this.platoonForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      this.platoonForm.controls['code'].setValue(this.editData.code);
      this.platoonForm.controls['name'].setValue(this.editData.name);
      this.platoonForm.controls['commodityId'].setValue(
        this.editData.commodityId
      );
      this.platoonForm.controls['gradeId'].setValue(this.editData.gradeId);
      this.platoonForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
      this.platoonForm.controls['id'].setValue(this.editData.id);

      console.log(' after set: ', this.platoonForm.value);
      console.log('commodity :', this.platoonForm.getRawValue().commodityId);
    }
  }

  async testInputsValidating() {
    console.log("product form add", this.platoonForm.value)
    if(!this.editData){
    this.platoonForm.removeControl('id');
    this.gradeName = await this.getGradeByID(
      this.platoonForm.getRawValue().gradeId
    );
    this.commodityName = await this.getcommodityByID(
      this.platoonForm.getRawValue().commodityId
    );
    this.platoonForm.controls['gradeName'].setValue(this.gradeName);
    this.platoonForm.controls['commodityName'].setValue(this.commodityName);

    if (
      this.platoonForm.getRawValue().gradeName &&
      this.platoonForm.getRawValue().commodityName
    ) {
      console.log('test id input not empty');
      this.restGroupInfoDone = true;
      this.platoonForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      console.log('form : ', this.platoonForm.value);
      this.api.postPlatoon(this.platoonForm.value).subscribe({
        next: (res) => {
          console.log('ID header after post req: ', res);
          this.getHeaderRowId = res;
          alert('تمت إضافة الفصيلة بنجاح');
          this.platoonForm.reset();
          this.dialogRef.close('save');
        },
        error: (err) => {
          alert('حدث خطأ أثناء إضافة فصيلة');
        },
      });
    } else if (
      this.platoonForm.getRawValue().commodityName &&
      this.platoonForm.getRawValue().gradeName
    ) {
      this.getGradeByID(this.platoonForm.getRawValue().gradeId);
      this.getcommodityByID(this.platoonForm.getRawValue().commodityId);
    } else {
      alert('تاكد من ادخال البيانات صحيحة');
    }
  }else{
    this.updatePlatoon()
  }
  }

  getAllPlatoons() {
    this.api.getPlatoon().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error');
      },
    });
  }
  fillSelect() {
    this.api.getAllCommodities().subscribe((data: any) => {
      this.commoditylist = data;
    });
    this.api.getAllGrades().subscribe((res: any) => {
      this.gradelist = res.filter(
        (res: any) => res.commodityId == this.editData.commodityId!
      );
    });
  }

  onCommodityChange(commodityId: any) {
    this.api.getAllGrades().subscribe((res: any) => {
      this.gradelist = res.filter(
        (res: any) => res.commodityId == commodityId!
      )
    });
  }

  getcommodityByID(id: any) {
    return fetch(
      `http://ims.aswan.gov.eg/api/STR_Commodity/get-all-commodity/?id=${id}`
    )
      .then((response) => response.json())
      .then((json) => {
        return json[0].name;
      })
      .catch((err) => {
        alert('خطا اثناء جلب رقم المخزن !');
      });
  }

  getGradeByID(id: any) {
    return fetch(
      `http://ims.aswan.gov.eg/api/STR_Grade/get-all-grades/?id=${id}`
    )
      .then((response) => response.json())
      .then((json) => {
        return json[0].name;
      })
      .catch((err) => {
        alert('خطا اثناء جلب رقم المخزن !');
      });
  }

  updatePlatoon() {
    this.api.putPlatoon(this.platoonForm.value).subscribe({
      next: (res) => {
        alert('  تم التحديث بنجاح');
        this.platoonForm.reset();
          this.dialogRef.close('update');
      },
      error: () => {
        alert('خطأ في التحديث');
      },
    });
  }
}
