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



export class commodities {
  constructor(public name: string, public code: string) {}
}


@Component({
  selector: 'app-str-grade-dialog',
  templateUrl: './str-grade-dialog.component.html',
  styleUrls: ['./str-grade-dialog.component.css']
})
export class STRGradeDialogComponent {
  
  commodityCtrl: FormControl;
  filteredcommodities: Observable<any[]>;
  commodity_list: commodities[] = [];
  formcontrol = new FormControl('');  
  gradeForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
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
    private dialogRef : MatDialogRef<STRGradeDialogComponent>){
     this.commodityCtrl = new FormControl();
   this.filteredcommodities = this.commodityCtrl.valueChanges.pipe(
     startWith(''),
     map((gradd) =>
       gradd ? this.filtercommod(gradd) : this.commodity_list.slice()
     )
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
      // commodityName : ['',Validators.required],
      });
  
      this.api.getAllCommodity().subscribe((data)=>{
        this.commodity_list = data;
      });
      
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.gradeForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        this.gradeForm.controls['code'].setValue(this.editData.code);
      this.gradeForm.controls['name'].setValue(this.editData.name);
      // this.gradeForm.controls['commodityName'].setValue(this.editData.commodityName);
      console.log("editData commodityId: ", this.editData.commodityId)

      this.gradeForm.controls['commodityId'].setValue(this.editData.commodityId);
      this.gradeForm.addControl('id', new FormControl('', Validators.required));
      this.gradeForm.controls['id'].setValue(this.editData.id);
      }
    }

    
  
          
  // getcommodityByID(id: any) {
  //   console.log("row store id: ", id);
  //   return fetch(`http://ims.aswan.gov.eg/api/STR_Commodity/get-commodity-by-id/{id}`)
  //     .then(response => response.json())
  //     .then(json => {
  //       console.log("fetch name by id res: ", json[0].name);
  //       // this.storeName = res.name;
  //       // this.groupMasterForm.controls['Store'] = json[0].name;
  //      this.commname =  json[0].name;
  //      return this.commname 
  //     })
  //     .catch((err) => {
  //       console.log("error in fetch name by id: ", err);
  //       alert("خطا اثناء جلب رقم المخزن !");
  //     });
  // }
  //  async addGrade() {
  //     if (!this.editData) {
  //       this.commodityName =  await this.getcommodityByID(this.gradeForm.getRawValue().commodityId)
  //       console.log("form add: ", this.gradeForm.value, "comm name: ", this.commodityName)
  //       this.gradeForm.controls['commodityName'].setValue(this.commodityName);
  //       console.log("form add after select: ", this.gradeForm.value)
  //       if (this.gradeForm.valid) {
  //         this.api.postGrade(this.gradeForm.value)
  //           .subscribe({
  //             next: (res) => {
  
  //               alert("تمت الاضافة بنجاح");
  //               this.gradeForm.reset();
  //               this.dialogRef.close('save');
  //             },
  //             error: (err) => {
  //               alert("Error")
  //               // console.log("add product err:", err);
  //             }
  //           })
  //       }
  //     }else{
  //       this.updateGrade()
  //     }
  //   }

  addGrade(){
    if(!this.editData){
      
      this.gradeForm.removeControl('id')
      this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.gradeForm.value);

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
  
    optionSelected(event: MatAutocompleteSelectedEvent) {
      this.selectedOption = event.option.value;
      this.gradeForm.patchValue({ commodityId: this.selectedOption.id });
    }
  
    filtercommod(value: string) {
      const searchvalue = value.toLocaleLowerCase();
      let arr = this.commodity_list.filter(option => option.name.toLocaleLowerCase().includes(searchvalue) || 
      option.code.toLocaleLowerCase().includes(searchvalue));
      return arr.length ? arr : [{ name: 'No Item found', code: 'null' }];
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
  