import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

export class Instructor {
  constructor(public id: number, public headerName: string) {}
}

export class Course {
  constructor(public id: number, public name: string) {}
}


@Component({
  selector: 'app-tr-instructor-course-dialog',
  templateUrl: './tr-instructor-course-dialog.component.html',
  styleUrls: ['./tr-instructor-course-dialog.component.css']
})
export class TrInstructorCourseDialogComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')

  instructorCtrl: FormControl;
  filteredInstructors: Observable<Instructor[]>;
  instructors: Instructor[] = [];
  selectedInstructor: Instructor | undefined;

  courseCtrl: FormControl;
  filteredCourses: Observable<Course[]>;
  courses: Course[] = [];
  selectedCourse: Course | undefined;

  getInstructorCourseForm: any;
  InstructorCourseForm!: FormGroup;
  actionBtn: string = 'حفظ';
  productIdToEdit: any;
  existingNames: string[] = [];

  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<TrInstructorCourseDialogComponent>){
      this.instructorCtrl = new FormControl();
      this.filteredInstructors = this.instructorCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterInstructors(value))
      );

      this.courseCtrl = new FormControl();
      this.filteredCourses = this.courseCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCourses(value))
      );
    }
    ngOnInit(): void {
      this.InstructorCourseForm = this.formBuilder.group({
        rating: ['', Validators.required],
        price: ['', Validators.required],
        notes: ['', Validators.required],
        instructorId: ['', Validators.required],
        courseId: ['', Validators.required],
        transactionUserId: ['',Validators.required],
      });
      
      this.api.getTrInstructor().subscribe((instructors) => {
        this.instructors = instructors;
        console.log("instructors",instructors);

      });

      this.api.getCourse().subscribe((courses) => {
        this.courses = courses;
      });
  
  
  
      this.hotkeysService.add(
        new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
          // Call the deleteGrade() function in the current component
          this.addCourse();
          return false; // Prevent the default browser behavior
        })
      );
  
      if (this.editData) {
        this.actionBtn = 'تحديث';
        console.log("edit",this.editData);
        
        this.getInstructorCourseForm = this.editData;
        this.InstructorCourseForm.controls['rating'].setValue(this.editData.rating);
        this.InstructorCourseForm.controls['notes'].setValue(this.editData.notes);
        this.InstructorCourseForm.controls['instructorId'].setValue(this.editData.instructorId);
        this.InstructorCourseForm.controls['price'].setValue(this.editData.price);
        this.InstructorCourseForm.controls['courseId'].setValue(this.editData.courseId);
        this.InstructorCourseForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        this.InstructorCourseForm.addControl('id', new FormControl('', Validators.required));
        this.InstructorCourseForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayInstructorName(instructor: any): string {
      return instructor && instructor.headerName ? instructor.headerName : '';
    }
  
    instructorSelected(event: MatAutocompleteSelectedEvent): void {
      const instructor = event.option.value as Instructor;
      this.selectedInstructor = instructor;
      this.InstructorCourseForm.patchValue({ instructorId: instructor.id });
      this.InstructorCourseForm.patchValue({ instructorName: instructor.headerName });
    }
  
    private _filterInstructors(value: string): Instructor[] {
      const filterValue = value;
      console.log("filterValue: ", filterValue);
      return this.instructors.filter(
        (instructor) => instructor.headerName.toLowerCase().includes(filterValue)
        );
    }
  
    openAutoInstructor() {
      console.log("open instructorCtrl: ", this.instructorCtrl);
      this.instructorCtrl.setValue('');
      this.instructorCtrl.updateValueAndValidity();
      console.log("open instructorCtrl after: ", this.instructorCtrl);

    }

    displayCourseName(course: any): string {
      return course && course.name ? course.name : '';
    }
  
    courseSelected(event: MatAutocompleteSelectedEvent): void {
      const course = event.option.value as Course;
      this.selectedCourse = course;
      this.InstructorCourseForm.patchValue({ courseId: course.id });
      this.InstructorCourseForm.patchValue({ courseName: course.name });
    }
  
    private _filterCourses(value: string): Course[] {
      const filterValue = value.toLowerCase();
      return this.courses.filter(
        (course) => course.name.toLowerCase().includes(filterValue)
        );
    }
  
    openAutoCourse() {
      this.courseCtrl.setValue('');
      this.courseCtrl.updateValueAndValidity();
    }  
    

    getExistingNames() {
      this.api.getInstructorCourse().subscribe({
        next: (res) => {
          this.existingNames = res.map((product: any) => product.name);
        },
        error: (err) => {
          console.log('Error fetching existing names:', err);
        },
      });
    }

    addCourse(){
    if(!this.editData){
      
      this.InstructorCourseForm.removeControl('id')
      console.log("add: ", this.InstructorCourseForm.value);
      this.InstructorCourseForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.InstructorCourseForm.valid){
        this.api.postInstructorCourse(this.InstructorCourseForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.InstructorCourseForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            console.log("datttaaa:",this.InstructorCourseForm.value);            
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateInstructorCourse()
    }
  }


  updateInstructorCourse(){
        this.api.putInstructorCourse(this.InstructorCourseForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.InstructorCourseForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
      toastrSuccess(): void {
        this.toastr.success('تم الحفظ بنجاح');
      }
      
      toastrEditSuccess(): void {
        this.toastr.success('تم التعديل بنجاح');
      }
}

