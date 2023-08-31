

// import { Component, OnInit, Inject } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { ApiService } from '../services/api.service';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { publishFacade } from '@angular/compiler';


// @Component({
//     selector: 'app-str-commodity-dialog',
//     templateUrl: './STR_Commodity_dialog.component.html',
//     styleUrls: ['./STR_Commodity_dialog.component.css']
//   })

// export class StrCommodityDialogComponent implements OnInit {

//   productForm !: FormGroup;
//   actionBtn: string = "حفظ"

//   constructor(private formBuilder: FormBuilder,
//     private api: ApiService,
//     @Inject(MAT_DIALOG_DATA) public editData: any,
//     private dialogRef: MatDialogRef<StrCommodityDialogComponent>) { }

//   ngOnInit(): void {
//     this.productForm = this.formBuilder.group({
//       code: ['', Validators.required],
//       name: ['', Validators.required],
//       transactionUserId:["1", Validators.required],
 


      
//     });

//     if (this.editData) {
//       this.actionBtn = "تحديث";
//       this.productForm.controls['code'].setValue(this.editData.code);
//       this.productForm.controls['name'].setValue(this.editData.name);
      
//       this.productForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
//       this.productForm.addControl('id', new FormControl('', Validators.required));
//       this.productForm.controls['id'].setValue(this.editData.id);

//     }
//   }

//   addCommodity() {
  
//     if (!this.editData) {
//       this.productForm.removeControl('id')
//       console.log("add form before go to post: ", this.productForm.value)
//       if (this.productForm.valid) {
//         console.log('productform:',this.productForm.value)
//         this.api.postCommodity(this.productForm.value)
//           .subscribe({
//             next: (res) => {
//               alert(" تم اضافة السلعة بنجاح" );
//               this.productForm.reset();
//               this.dialogRef.close('حفظ');
//             },
//             error: (err) => {
//               console.log('error:',err)
//               alert("!خطأ في العملية")
              
//             }
//           })
//       }
//     }else{
//       this.updateCommodity()
//     }
//   }

//   updateCommodity(){
//     console.log("edit form : ", this.productForm.value)
//     this.api.putCommodity(this.productForm.value)
//     .subscribe({
//       next:(res)=>{
//         alert("تم التحديث بنجاح");
//         this.productForm.reset();
//         this.dialogRef.close('تحديث');
//       },
//       error:(err)=>{
//         console.log('error:',err)
//       }
//     })
//   }

// }

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
// import { publishFacade } from '@angular/compiler';
// import { STRGradeComponent } from '../str-grade/str-grade.component';

export class Commodity {
  constructor(public id: number, public name: string, public code: string) {}
}

@Component({
  selector: 'app-str-commodity-dialog',
  templateUrl: './STR_Commodity_dialog.component.html',
  styleUrls: ['./STR_Commodity_dialog.component.css']
})

export class StrCommodityDialogComponent  {
  transactionUserId=localStorage.getItem('transactionUserId')
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  selectedCommodity: Commodity | undefined;
  formcontrol = new FormControl('');  
  gradeForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getGradeData: any;
  Id:string  | undefined | null;
   commidityDt:any={
  id:0,
}
commname:any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
commoditylist:any;
storeList: any;
commodityName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<StrCommodityDialogComponent>){
      this.commodityCtrl = new FormControl();
      this.filteredCommodities = this.commodityCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCommodities(value))
      );
    }
    ngOnInit(): void {
      this.gradeForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      code : ['',Validators.required],
      name : ['',Validators.required],
      commodityId : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllCommodities().subscribe((commodities)=>{
        this.commodities = commodities;
      });
      
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getGradeData = this.editData;
      this.gradeForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        this.gradeForm.controls['code'].setValue(this.editData.code);
      this.gradeForm.controls['name'].setValue(this.editData.name);
      
      this.gradeForm.controls['commodityId'].setValue(this.editData.commodityId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.gradeForm.addControl('id', new FormControl('', Validators.required));
      this.gradeForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayCommodityName(commodity: any): string {
      return commodity && commodity.name ? commodity.name : '';
    }

    commoditySelected(event: MatAutocompleteSelectedEvent): void {
      const commodity = event.option.value as Commodity;
      this.selectedCommodity = commodity;
      this.gradeForm.patchValue({ commodityId: commodity.id });
      this.gradeForm.patchValue({ commodityName: commodity.name });
    }

    private _filterCommodities(value: string): Commodity[] {
      const filterValue = value.toLowerCase();
      return this.commodities.filter(commodity =>
        commodity.name.toLowerCase().includes(filterValue) || commodity.code.toLowerCase().includes(filterValue)
      );
    }

    openAutoCommodity() {
      this.commodityCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.commodityCtrl.updateValueAndValidity();
    }

    

  addGrade(){
    if(!this.editData){
      
      this.gradeForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.gradeForm.value);
      this.gradeForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.gradeForm.valid){
        this.api.postGrade(this.gradeForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.gradeForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateGrade()
    }
  }

  displayCommodity (option:any):string {
    return option && option.name ? option.name:'';

  }
      updateGrade(){
        this.api.putGrade(this.gradeForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.gradeForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
  
  }
  