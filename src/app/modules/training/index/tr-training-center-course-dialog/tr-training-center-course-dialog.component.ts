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
export class Course {
  constructor(public id: number, public name: string) {}
}
export class TraingingCenter {
  constructor(public id: number, public name: string) {}
}
@Component({
  selector: 'app-tr-training-center-course-dialog',
  templateUrl: './tr-training-center-course-dialog.component.html',
  styleUrls: ['./tr-training-center-course-dialog.component.css']
})
export class TrTrainingCenterCourseDialogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')
  courseCtrl: FormControl;
  filteredCourses: Observable<Course[]>;
  courses: Course[] = [];
  selectedCourse: Course | undefined;
  traingingCenterCtrl: FormControl;
  filteredTraingingCenteres: Observable<TraingingCenter[]>;
  traingingCenteres:TraingingCenter[] = [];
  selectedTraingingCenter: TraingingCenter | undefined;
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
cityStatelist:any;
cityStateName: any;
trainingCenterList: any;
trainingCenterName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<TrTrainingCenterCourseDialogComponent>,
    private toastr: ToastrService) {
      this.courseCtrl = new FormControl();
      this.filteredCourses = this.courseCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCourses(value))
      );
      this.traingingCenterCtrl = new FormControl();
      this.filteredTraingingCenteres = this.traingingCenterCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterTraingingCenteres(value))
      );
    }
    ngOnInit(): void {
      // this.getExistingNames(); // Fetch existing names
      this.modelForm = this.formBuilder.group({
        //define the components of the form
     
      
        traingingCenterName : [''],
        courseName : [''],
        // id : ['',Validators.required],
        courseId : ['',Validators.required],
        trainingCenterId : ['',Validators.required],
        rating : ['',Validators.required],
        price : ['',Validators.required],
        notes : [''],
        transactionUserId : ['',Validators.required]
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllCourse().subscribe((courses)=>{
        this.courses = courses;
      });
      this.api.getAllTrainingCenterr().subscribe((traingingCenteres)=>{
        this.traingingCenteres = traingingCenteres;
      });
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addtrainCourse();
        return false; // Prevent the default browser behavior
      }));
  
      if(this.editData){
        this.actionBtn = "تعديل";
        console.log("")
      this.getModelData = this.editData;
      this.modelForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        
      this.modelForm.controls['traingingCenterName'].setValue(this.editData.traingingCenterName);
      this.modelForm.controls['courseName'].setValue(this.editData.courseName);
      this.modelForm.controls['courseId'].setValue(this.editData.courseId);
      this.modelForm.controls['trainingCenterId'].setValue(this.editData.trainingCenterId);
      this.modelForm.controls['rating'].setValue(this.editData.rating);
      this.modelForm.controls['price'].setValue(this.editData.price);
      this.modelForm.controls['notes'].setValue(this.editData.notes);
     
      // console.log("commodityId: ", this.modelForm.controls['commodityId'].value)
      this.modelForm.addControl('id', new FormControl('', Validators.required));
      this.modelForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayCourseName(course: any): string {
      return course && course.name ? course.name : '';
    }

    courseSelected(event: MatAutocompleteSelectedEvent): void {
      const course = event.option.value as Course;
      this.selectedCourse = course;
      this.modelForm.patchValue({ courseId: course.id });
      this.modelForm.patchValue({ courseName: course.name });
    }

    private _filterCourses(value: string): Course[] {
      const filterValue = value.toLowerCase();
      return this.courses.filter(course =>
        course.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoCourse() {
      this.courseCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.courseCtrl.updateValueAndValidity();
    }
    
    displayTraingingCenterName(traingingCenter: any): string {
      return traingingCenter && traingingCenter.name ? traingingCenter.name : '';
    }
    traingingCenterSelected(event: MatAutocompleteSelectedEvent): void {
      const traingingCenter = event.option.value as TraingingCenter;
      this.selectedTraingingCenter = traingingCenter;
      this.modelForm.patchValue({ trainingCenterId: traingingCenter.id });
      this.modelForm.patchValue({ traingingCenterName: traingingCenter.name });
    }

    private _filterTraingingCenteres(value: string): TraingingCenter[] {
      const filterValue = value.toLowerCase();
      return this.traingingCenteres.filter(traingingCenter =>
        traingingCenter.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoTraingingCenter() {
      this.traingingCenterCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.traingingCenterCtrl.updateValueAndValidity();
    }
    // getExistingNames() {
    //   this.api.getTrainingCenterCourse().subscribe({
    //     next: (res) => {
    //       this.existingNames = res.map((item: any) => item.name);
    //     },
    //     error: (err) => {
    //       console.log('Error fetching existing names:', err);
    //     }
    //   });
    // }

  addtrainCourse(){
    
   
  


    if (!this.editData) {

      this.modelForm.removeControl('id')
     
      this.modelForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log(this.modelForm.value)
      if (this.modelForm.valid) {
        this.api.postTrainingCenterCourse(this.modelForm.value)
        
          .subscribe({
            next: (res) => {
              // alert("تمت الاضافة بنجاح");
              this.toastrSuccess();
              this.modelForm.reset();
              this.dialogRef.close('save');
              
            },
            error: (err) => {
              alert("خطأ عند اضافة البيانات")
              console.log(err)
            }
          })
      }
    }else{
      this.updateTrainingCenterCourse()
    }
  }
  updateTrainingCenterCourse(){
        this.api.putTrainingCenterCourse(this.modelForm.value)
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
  



