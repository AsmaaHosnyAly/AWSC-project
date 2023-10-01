import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-fi-entry-source-dialog',
  templateUrl: './fi-entry-source-dialog.component.html',
  styleUrls: ['./fi-entry-source-dialog.component.css']
})
export class FIEntrySourceDialogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')
  formcontrol = new FormControl('');  
  EntrySourceForm !:FormGroup;
  actionBtn : string = "حفظ"
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<FIEntrySourceDialogComponent>){ }
    ngOnInit(): void {
      this.EntrySourceForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
      });
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addEntrySource();
        return false; // Prevent the default browser behavior
      }));
      if(this.editData){
        this.actionBtn = "تعديل";
      this.EntrySourceForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.EntrySourceForm.controls['name'].setValue(this.editData.name);;
      this.EntrySourceForm.addControl('id', new FormControl('', Validators.required));
      this.EntrySourceForm.controls['id'].setValue(this.editData.id);
      }
    }

    addEntrySource(){
      this.EntrySourceForm.controls['transactionUserId'].setValue(this.transactionUserId);
    if(!this.editData){
      
      this.EntrySourceForm.removeControl('id')
      console.log("add: ", this.EntrySourceForm.value);
      
      if(this.EntrySourceForm.valid){
        this.api.postEntrySource(this.EntrySourceForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.EntrySourceForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateAccount()
    }
  }
      updateAccount(){
        this.api.putEntrySource(this.EntrySourceForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.EntrySourceForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
  
  }
  

