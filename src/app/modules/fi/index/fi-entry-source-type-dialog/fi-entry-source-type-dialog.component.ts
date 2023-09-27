import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
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

export class EntrySource {
  constructor(public id: number, public name: string) {}
}


@Component({
  selector: 'app-fi-entry-source-type-dialog',
  templateUrl: './fi-entry-source-type-dialog.component.html',
  styleUrls: ['./fi-entry-source-type-dialog.component.css']
})
export class FIEntrySourceTypeDialogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')
  entrySourceCtrl: FormControl;
  filteredEntrySources: Observable<EntrySource[]>;
  entrySources: EntrySource[] = [];
  selectedEntrySource!: EntrySource;
  formcontrol = new FormControl('');  
  entrySourceTypeForm !:FormGroup;
  actionBtn : string = "حفظ"
  getEntrySourceTypeData: any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<FIEntrySourceTypeDialogComponent>){
      this.entrySourceCtrl = new FormControl();
    this.filteredEntrySources = this.entrySourceCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEntrySources(value))
    );
    }


    ngOnInit(): void {
      this.entrySourceTypeForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : [1,Validators.required],
      name : ['',Validators.required],
      fiEntrySourceName : [''],
      entrySourceId : ['',Validators.required],
      id:['']
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllEntrySources().subscribe((entrySources) => {
        this.entrySources = entrySources;
      });
      
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getEntrySourceTypeData = this.editData;
      console.log("edit dataa",this.editData)
      this.entrySourceTypeForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.entrySourceTypeForm.controls['name'].setValue(this.editData.name);            
      this.entrySourceTypeForm.controls['entrySourceId'].setValue(this.editData.entrySourceId);
      this.entrySourceTypeForm.controls['fiEntrySourceName'].setValue(this.editData.fiEntrySourceName);
      this.entrySourceTypeForm.addControl('id', new FormControl('', Validators.required));
      this.entrySourceTypeForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayEntrySourceName(entrySource: any): string {
      return entrySource && entrySource.name ? entrySource.name : '';
    }
    entrySourceSelected(event: MatAutocompleteSelectedEvent): void {
      const entrySource = event.option.value as EntrySource;
      this.selectedEntrySource = entrySource;
      this.entrySourceTypeForm.patchValue({ entrySourceId: entrySource.id });
        this.entrySourceTypeForm.patchValue({ fiEntrySourceName: entrySource.name });
    }
    private _filterEntrySources(value: string): EntrySource[] {
      const filterValue = value.toLowerCase();
      return this.entrySources.filter(entrySource =>
        entrySource.name.toLowerCase().includes(filterValue) 
      );
    }
  
    openAutoEntrySource() {
      this.entrySourceCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.entrySourceCtrl.updateValueAndValidity();
    }

    

    addEntrySourceType(){
    if(!this.editData){
      
      this.entrySourceTypeForm.removeControl('id')
      // this.entrySourceTypeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.entrySourceTypeForm.value);
      this.entrySourceTypeForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.entrySourceTypeForm.valid){
        this.api.postEntrySourceType(this.entrySourceTypeForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.entrySourceTypeForm.reset();
            this.dialogRef.close('حفظ');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateEntrySourceType()
    }
  }
      updateEntrySourceType(){
        this.api.putEntrySourceType(this.entrySourceTypeForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.entrySourceTypeForm.reset();
            this.dialogRef.close('تعديل');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
  
  }
  

