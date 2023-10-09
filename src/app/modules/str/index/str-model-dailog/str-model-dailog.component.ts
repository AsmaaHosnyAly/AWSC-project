import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class Vendor {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-str-model-dailog',
  templateUrl: './str-model-dailog.component.html',
  styleUrls: ['./str-model-dailog.component.css']
})
export class StrModelDailogComponent {


  transactionUserId=localStorage.getItem('transactionUserId')
  vendorCtrl: FormControl;
  filteredVendores: Observable<Vendor[]>;
  vendores: Vendor[] = [];
  selectedVendor: Vendor | undefined;
  formcontrol = new FormControl('');  
  modelForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getModelData: any;
  Id:string  | undefined | null;
   vendorDt:any={
  id:0,
}
commname:any;
dataSource!: MatTableDataSource<any>;
existingNames: string[] = [];
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
vendorlist:any;
storeList: any;
vendorName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<StrModelDailogComponent>,
    private toastr: ToastrService) {
      this.vendorCtrl = new FormControl();
      this.filteredVendores = this.vendorCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterVendores(value))
      );
    }
    ngOnInit(): void {
      this.getExistingNames(); // Fetch existing names
      this.modelForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      
      name : ['',Validators.required],
      vendorId : ['',Validators.required],
      vendorName : [''],

      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllVendor().subscribe((vendores)=>{
        this.vendores = vendores;
      });
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addModel();
        return false; // Prevent the default browser behavior
      }));
  
      if(this.editData){
        this.actionBtn = "تعديل";
        console.log("")
      this.getModelData = this.editData;
      this.modelForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        
      this.modelForm.controls['name'].setValue(this.editData.name);
      
      this.modelForm.controls['vendorId'].setValue(this.editData.vendorId);
      this.modelForm.controls['vendorName'].setValue(this.editData.vendorName);

      // console.log("commodityId: ", this.modelForm.controls['commodityId'].value)
      this.modelForm.addControl('id', new FormControl('', Validators.required));
      this.modelForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayVendorName(vendor: any): string {
      return vendor && vendor.name ? vendor.name : '';
    }

    vendorSelected(event: MatAutocompleteSelectedEvent): void {
      const vendor = event.option.value as Vendor;
      this.selectedVendor = vendor;
      this.modelForm.patchValue({ vendorId: vendor.id });
      this.modelForm.patchValue({ vendorName: vendor.name });
    }

    private _filterVendores(value: string): Vendor[] {
      const filterValue = value.toLowerCase();
      return this.vendores.filter(vendor =>
        vendor.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoVendor() {
      this.vendorCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.vendorCtrl.updateValueAndValidity();
    }

    getExistingNames() {
      this.api.getModel().subscribe({
        next: (res) => {
          this.existingNames = res.map((item: any) => item.name);
        },
        error: (err) => {
          console.log('Error fetching existing names:', err);
        }
      });
    }

  addModel(){
    if(!this.editData){
      const enteredName = this.modelForm.get('name')?.value;

    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }
      this.modelForm.removeControl('id')
      // this.modelForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.modelForm.value);
      this.modelForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.modelForm.valid){
        this.api.postModel(this.modelForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.modelForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            this.toastrErrorSave();
          }
        })
      }
    }else{
      this.updateModel()
    }
  }

  displayVendor (option:any):string {
    return option && option.name ? option.name:'';

  }
      updateModel(){
        this.api.putModel(this.modelForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEdit();
            this.modelForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            this.toastrErrorEdit();
          }
        })
      }
      toastrSuccess(): void {
        this.toastr.success('تم الحفظ بنجاح');
      }
    
      toastrEdit(): void {
        this.toastr.success('تم التحديث بنجاح');
      }
    
      toastrErrorSave(): void {
        this.toastr.error('!خطأ عند حفظ البيانات');
      }
    
      toastrErrorEdit(): void {
        this.toastr.error('!خطأ عند تحديث البيانات');
      }
  }
  

