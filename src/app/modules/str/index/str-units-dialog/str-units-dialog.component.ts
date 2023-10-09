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
  selector: 'app-str-units-dialog',
  templateUrl: './str-units-dialog.component.html',
  styleUrls: ['./str-units-dialog.component.css']
})
export class STRUnitsDialogComponent {
  formcontrol = new FormControl('');  
  unitsForm !:FormGroup;
  actionBtn : string = "حفظ";
  userIdFromStorage: any;
  transactionUserId=localStorage.getItem('transactionUserId')
  // groupEditId: any;
  existingNames: string[] = [];
  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private hotkeysService: HotkeysService,
     private readonly route:ActivatedRoute,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<STRUnitsDialogComponent>,
     private toastr: ToastrService){
     }
  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.unitsForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addUnits();
      return false; // Prevent the default browser behavior
    }));

    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.userIdFromStorage = localStorage.getItem('transactionUserId');
      this.unitsForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.unitsForm.controls['name'].setValue(this.editData.name);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.unitsForm.addControl('id', new FormControl('', Validators.required));
      this.unitsForm.controls['id'].setValue(this.editData.id);
      console.log(this.unitsForm.value)
      
    }
  }

  getExistingNames() {
    this.api.getunit().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }
  

  addUnits(){

    const enteredName = this.unitsForm.get('name')?.value;

    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }

    if(!this.editData){
      this.unitsForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.unitsForm.removeControl('id')
      if(this.unitsForm.valid){
        this.api.postunit(this.unitsForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.unitsForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            this.toastrErrorSave();  
            console.log(err)
          }
        })
      }
    }else{
      this.updateunit()
    }
  }
    updateunit(){
      this.api.putunit(this.unitsForm.value)
      .subscribe({
        next:(res)=>{
          this.toastrEdit();
          this.unitsForm.reset();
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
