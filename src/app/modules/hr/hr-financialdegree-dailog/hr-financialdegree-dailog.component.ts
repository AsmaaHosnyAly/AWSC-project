import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-hr-financialdegree-dailog',
  templateUrl: './hr-financialdegree-dailog.component.html',
  styleUrls: ['./hr-financialdegree-dailog.component.css']
})
export class HrFinancialdegreeDailogComponent {
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
     private dialogRef : MatDialogRef<HrFinancialdegreeDailogComponent>){
     }
  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.unitsForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
      noYear:['',Validators.required],
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
      this.unitsForm.controls['noYear'].setValue(this.editData.noYear);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.unitsForm.addControl('id', new FormControl('', Validators.required));
      this.unitsForm.controls['id'].setValue(this.editData.id);
      console.log(this.unitsForm.value)
      
    }
  }

  getExistingNames() {
    this.api.getFinancialDegree().subscribe({
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
        this.api.postFinancialDegree(this.unitsForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.unitsForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
            console.log(err)
          }
        })
      }
    }else{
      this.updateunit()
    }
  }
    updateunit(){
      this.api.putFinancialDegree(this.unitsForm.value)
      .subscribe({
        next:(res)=>{
          alert("تم التحديث بنجاح");
          this.unitsForm.reset();
          this.dialogRef.close('update');
        },
        error:()=>{
          alert("خطأ عند تحديث البيانات");
        }
      })
    }


}
