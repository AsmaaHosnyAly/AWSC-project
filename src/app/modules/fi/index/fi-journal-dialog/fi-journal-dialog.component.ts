import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fi-journal-dialog',
  templateUrl: './fi-journal-dialog.component.html',
  styleUrls: ['./fi-journal-dialog.component.css']
})
export class FIJournalDialogComponent {
  formcontrol = new FormControl('');  
  FIJournal !:FormGroup;
  actionBtn : string = "حفظ";

  // groupEditId: any;

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private readonly route:ActivatedRoute, private toastr: ToastrService,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<FIJournalDialogComponent>){
     }
  ngOnInit(): void {
    this.FIJournal = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      no : ['',Validators.required],
      id : ['',Validators.required],
      description : ['',Validators.required],
      date : ['',Validators.required],
    });

    if(this.editData){
      console.log("edit data: ", this.editData)
      this.actionBtn = "تحديث";
      this.FIJournal.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.FIJournal.controls['no'].setValue(this.editData.no);
      this.FIJournal.controls['description'].setValue(this.editData.description);
      this.FIJournal.controls['date'].setValue(this.editData.date);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.FIJournal.addControl('id', new FormControl('', Validators.required));
      this.FIJournal.controls['id'].setValue(this.editData.id);
    }
  }

  addFIJournals(){
    if(!this.editData){
      this.FIJournal.removeControl('id')
      if(this.FIJournal.valid){
        console.log("FIJournal :",this.FIJournal.value);
        
        this.api.postFIJournal(this.FIJournal.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            // alert("تمت الاضافة بنجاح");
            this.FIJournal.reset();
            this.dialogRef.close('حفظ');
          },
          error:(err)=>{ 
            // alert("خطأ عند اضافة البيانات") 
            console.log(err)
          }
        })
      }
    }else{
      this.updateFIJournal()
    }
  }
    updateFIJournal(){
      console.log("this.FIJournal.value",this.FIJournal.value);
      
      this.api.putFIJournal(this.FIJournal.value)
      .subscribe({
        next:(res)=>{
          this.toastrEditSuccess()
          // alert("تم التحديث بنجاح");
          this.FIJournal.reset();
          this.dialogRef.close('تحديث');
        },
        error:()=>{
          alert("خطأ عند تحديث البيانات");
        }
      })
    }

    toastrSuccess(): void {
      this.toastr.success('تم الحفظ بنجاح');
    }
    toastrDeleteSuccess(): void {
      this.toastr.success('تم الحذف بنجاح');
    }
    toastrEditSuccess(): void {
      this.toastr.success('تم التعديل بنجاح');
    }
  

}
