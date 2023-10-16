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

export class Category {
  constructor(public id: number, public name: string) {}
}

export class CourseType {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-tr-course-dialog',
  templateUrl: './tr-course-dialog.component.html',
  styleUrls: ['./tr-course-dialog.component.css']
})
export class TrCourseDialogComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')

  categoryCtrl: FormControl;
  filteredCategories: Observable<Category[]>;
  categories: Category[] = [];
  selectedCategory: Category | undefined;

  courseTypeCtrl: FormControl;
  filteredCourseTypes: Observable<CourseType[]>;
  courseTypes: CourseType[] = [];
  selectedCourseType: CourseType | undefined;

  gettrCourseForm: any;
  trCourseForm!: FormGroup;
  actionBtn: string = 'حفظ';
  productIdToEdit: any;
  existingNames: string[] = [];

  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<TrCourseDialogComponent>){
      this.categoryCtrl = new FormControl();
      this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCategories(value))
      );

      this.courseTypeCtrl = new FormControl();
      this.filteredCourseTypes = this.courseTypeCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCourseTypes(value))
      );
    }
    ngOnInit(): void {
      this.trCourseForm = this.formBuilder.group({
        name: ['', Validators.required],
        hours: ['', Validators.required],
        cost: ['', Validators.required],
        price: ['', Validators.required],
        isActive: ['', Validators.required],
        categoryId: ['', Validators.required],
        courseTypeId: ['', Validators.required],
        description: ['', Validators.required],
        transactionUserId: ['',Validators.required],
      });
      
      this.api.getAllCategory().subscribe((categories) => {
        this.categories = categories;
      });

      this.api.getCourseType().subscribe((courseTypes) => {
        this.courseTypes = courseTypes;
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
        
        this.gettrCourseForm = this.editData;
        this.trCourseForm.controls['name'].setValue(this.editData.name);
        this.trCourseForm.controls['hours'].setValue(this.editData.hours);
        this.trCourseForm.controls['cost'].setValue(this.editData.cost);
        this.trCourseForm.controls['price'].setValue(this.editData.price);
        this.trCourseForm.controls['isActive'].setValue(this.editData.isActive);
        this.trCourseForm.controls['description'].setValue(this.editData.description);
        this.trCourseForm.controls['categoryId'].setValue(this.editData.categoryId);
        this.trCourseForm.controls['courseTypeId'].setValue(this.editData.courseTypeId);
        this.trCourseForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        this.trCourseForm.addControl('id', new FormControl('', Validators.required));
        this.trCourseForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayCategoryName(category: any): string {
      return category && category.name ? category.name : '';
    }
  
    categorySelected(event: MatAutocompleteSelectedEvent): void {
      const category = event.option.value as Category;
      this.selectedCategory = category;
      this.trCourseForm.patchValue({ categoryId: category.id });
      this.trCourseForm.patchValue({ courseCategoryName: category.name });
    }
  
    private _filterCategories(value: string): Category[] {
      const filterValue = value.toLowerCase();
      return this.categories.filter(
        (category) => category.name.toLowerCase().includes(filterValue)
        );
    }
  
    openAutoCategory() {
      this.categoryCtrl.setValue('');
      this.categoryCtrl.updateValueAndValidity();
    }

    displayCourseTypeName(courseType: any): string {
      return courseType && courseType.name ? courseType.name : '';
    }
  
    courseTypeSelected(event: MatAutocompleteSelectedEvent): void {
      const courseType = event.option.value as CourseType;
      this.selectedCategory = courseType;
      this.trCourseForm.patchValue({ courseTypeId: courseType.id });
      this.trCourseForm.patchValue({ courseTypeName: courseType.name });
    }
  
    private _filterCourseTypes(value: string): CourseType[] {
      const filterValue = value.toLowerCase();
      return this.courseTypes.filter(
        (courseType) => courseType.name.toLowerCase().includes(filterValue)
        );
    }
  
    openAutoCourseType() {
      this.courseTypeCtrl.setValue('');
      this.courseTypeCtrl.updateValueAndValidity();
    }  
    

    getExistingNames() {
      this.api.getCourse().subscribe({
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
      
      this.trCourseForm.removeControl('id')
      console.log("add: ", this.trCourseForm.value);
      this.trCourseForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.trCourseForm.valid){
        this.api.postCourse(this.trCourseForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.trCourseForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            console.log("datttaaa:",this.trCourseForm.value);            
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateItem()
    }
  }


  updateItem(){
        this.api.putCourse(this.trCourseForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.trCourseForm.reset();
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

