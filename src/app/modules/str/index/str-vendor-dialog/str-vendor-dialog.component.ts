import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-str-vendor-dialog',
  templateUrl: './str-vendor-dialog.component.html',
  styleUrls: ['./str-vendor-dialog.component.css']
})
export class StrVendorDialogComponent {
  formcontrol = new FormControl('');  
  vendorsForm !:FormGroup;
  actionBtn : string = "حفظ";
  userIdFromStorage: any;
  transactionUserId=localStorage.getItem('transactionUserId')
  existingNames: string[] = [];
  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private hotkeysService: HotkeysService,
     private readonly route:ActivatedRoute,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<StrVendorDialogComponent>,
     private toastr: ToastrService) {
     }
  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.vendorsForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addVendor();
      return false; // Prevent the default browser behavior
    }));
    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.vendorsForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.vendorsForm.controls['name'].setValue(this.editData.name);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.vendorsForm.addControl('id', new FormControl('', Validators.required));
      this.vendorsForm.controls['id'].setValue(this.editData.id);
      console.log(this.vendorsForm.value)
    }
  }

  getExistingNames() {
    this.api.getVendor().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }

  addVendor(){
    if(!this.editData){
      const enteredName = this.vendorsForm.get('name')?.value;

    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }
      this.vendorsForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.vendorsForm.removeControl('id')
      if(this.vendorsForm.valid){
        console.log("hhhhhhthis.vendorsForm",this.vendorsForm);
        this.api.postVendor(this.vendorsForm.value)
        .subscribe({
          next:(res)=>{
            
            this.toastrSuccess();
            this.vendorsForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            this.toastrErrorSave(); 
            console.log(err)
          }
        })
      }
    }else{
      this.updateVendor()
    }
  }
    updateVendor(){
      this.api.putVendor(this.vendorsForm.value )
      .subscribe({
        next:(res)=>{
          this.toastrEdit();
          this.vendorsForm.reset();
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
