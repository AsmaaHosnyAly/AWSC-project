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
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class Hierarchy {
  constructor(public id: number, public name: string, public level: string) {}
}

@Component({
  selector: 'app-fi-account-dialog',
  templateUrl: './fi-account-dialog.component.html',
  styleUrls: ['./fi-account-dialog.component.css']
})
export class FIAccountDialogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')
  hierarchyCtrl: FormControl;
  filteredHierarchies: Observable<Hierarchy[]>;
  hierarchies: Hierarchy[] = [];
  selectedHierarchy: Hierarchy | undefined;
  formcontrol = new FormControl('');  
  accountForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getAccountData: any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private readonly route:ActivatedRoute,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<FIAccountDialogComponent>){
      this.hierarchyCtrl = new FormControl();
      this.filteredHierarchies = this.hierarchyCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterHierarchies(value))
      );
    }
    ngOnInit(): void {
      this.accountForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      code : ['',Validators.required],
      name : ['',Validators.required],
      fiAccountHierarchyId : ['',Validators.required],
      fiAccountHierarchyName : [''],
      fiAccountlevel : [''],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllAccountHierarchy().subscribe((hierarchies) => {
        this.hierarchies = hierarchies;
      });
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addAccount();
        return false; // Prevent the default browser behavior
      }));
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getAccountData = this.editData;
      this.accountForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        this.accountForm.controls['code'].setValue(this.editData.code);
      this.accountForm.controls['name'].setValue(this.editData.name);            
      this.accountForm.controls['fiAccountHierarchyId'].setValue(this.editData.fiAccountHierarchyId);
      this.accountForm.controls['fiAccountHierarchyName'].setValue(this.editData.fiAccountHierarchyName);
      this.accountForm.controls['fiAccountlevel'].setValue(this.editData.fiAccountlevel);
      this.accountForm.addControl('id', new FormControl('', Validators.required));
      this.accountForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayHierarchyName(hierarchy: any): string {
      return hierarchy && hierarchy.name ? hierarchy.name : '';
    }
    hierarchySelected(event: MatAutocompleteSelectedEvent): void {
      const hierarchy = event.option.value as Hierarchy;
      this.selectedHierarchy = hierarchy;
      this.accountForm.patchValue({ fiAccountHierarchyId: hierarchy.id });
      this.accountForm.patchValue({ fiAccountHierarchyName: hierarchy.name });
      this.accountForm.patchValue({ fiAccountHierarchyLevel: hierarchy.level });
    }
    private _filterHierarchies(value: string): Hierarchy[] {
      const filterValue = value.toLowerCase();
      return this.hierarchies.filter(hierarchy =>
        hierarchy.name.toLowerCase().includes(filterValue) || hierarchy.level.toLowerCase().includes(filterValue)
      );
    }

    openAutoHierarchy() {
      this.hierarchyCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.hierarchyCtrl.updateValueAndValidity();
    }

    

    addAccount(){
    if(!this.editData){
      
      this.accountForm.removeControl('id')
      // this.accountForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.accountForm.value);
      this.accountForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.accountForm.valid){
        this.api.postAccount(this.accountForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.accountForm.reset();
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
        this.api.putAccount(this.accountForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.accountForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
  
  }
  
