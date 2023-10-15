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
  selector: 'app-py-tax-bracket-dialog',
  templateUrl: './py-tax-bracket-dialog.component.html',
  styleUrls: ['./py-tax-bracket-dialog.component.css']
})
export class PyTaxBracketDialogComponent {

  formcontrol = new FormControl('');  
  TaxBracketsForm !:FormGroup;
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
     private dialogRef : MatDialogRef<PyTaxBracketDialogComponent>,
     private toastr: ToastrService){
     }
  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.TaxBracketsForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      value : ['',Validators.required],
      ratio : ['',Validators.required],
      id : ['',Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addTaxBrackets();
      return false; // Prevent the default browser behavior
    }));

    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.TaxBracketsForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.TaxBracketsForm.controls['value'].setValue(this.editData.value);
      this.TaxBracketsForm.controls['ratio'].setValue(this.editData.ratio);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.TaxBracketsForm.addControl('id', new FormControl('', Validators.required));
      this.TaxBracketsForm.controls['id'].setValue(this.editData.id);
      console.log(this.TaxBracketsForm.value)
      
    }
  }

  getExistingNames() {
    this.api.getTaxBracket().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
       
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }
  

  addTaxBrackets(){

    const enteredName = this.TaxBracketsForm.get('ratio')?.value;

    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }

    if(!this.editData){
      this.TaxBracketsForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.TaxBracketsForm.removeControl('id')
      if(this.TaxBracketsForm.valid){
        this.api.postTaxBracket(this.TaxBracketsForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.TaxBracketsForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            this.toastrErrorSave();  
            console.log(err)
          }
        })
      }
    }else{
      this.updateTaxBracket()
    }
  }
    updateTaxBracket(){
      this.api.putTaxBracket(this.TaxBracketsForm.value)
      .subscribe({
        next:(res)=>{
          this.toastrEdit();
          this.TaxBracketsForm.reset();
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

