import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CcCostCenterDailogComponent } from '../cc-cost-center-dailog/cc-cost-center-dailog.component';
export class functionn {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
export class source {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
export class region {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
export class subRegion {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
export class plant {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
export class activity {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
export class plantComponent {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}

@Component({
  selector: 'app-cc-cost-center',
  templateUrl: './cc-cost-center.component.html',
  styleUrls: ['./cc-cost-center.component.css']
})
export class CcCostCenterComponent {

  functionnCtrl: FormControl;
  filteredFunctionnes: Observable<functionn[]>;
  functionnes: functionn[] = [];
  selectedFunctionn!: functionn;

  sourceCtrl: FormControl;
  filteredSources: Observable<source[]>;
  sources: source[] = [];
  selectedSource!: source;

  regionCtrl: FormControl;
  filteredRegiones: Observable<region[]>;
  regiones: region[] = [];
  selectedRegion!: region;

  subRegionCtrl: FormControl;
  filteredSubRegiones: Observable<subRegion[]>;
  subRegiones: subRegion[] = [];
  selectedSubRegion!: subRegion;

  plantCtrl: FormControl;
  filteredPlantes: Observable<plant[]>;
  plantes: plant[] = [];
  selectedPlant!: plant;

  activityCtrl: FormControl;
  filteredActivityes: Observable<activity[]>;
  activityes: activity[] = [];
  selectedActivity!: activity;

  plantComponentCtrl: FormControl;
  filteredPlantComponentes: Observable<plantComponent[]>;
  plantComponentes: plantComponent[] = [];
  selectedPlantComponent!: plantComponent;


  formcontrol = new FormControl('');
  equipmentForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name', 'code', 'functionName', 'sourceName', 'regionName', 'subRegionName', 'plantName', 'plantComponentName', 'activityName','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog,private toastr: ToastrService, private api: ApiService,private global:GlobalService,private hotkeysService: HotkeysService) {

    this.functionnCtrl = new FormControl();
    this.filteredFunctionnes = this.functionnCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterFunctionnes(value))
    );

    this.sourceCtrl = new FormControl();
    this.filteredSources = this.sourceCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterSources(value))
    );

    this.regionCtrl = new FormControl();
    this.filteredRegiones = this.regionCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterRegiones(value))
    );

    this.subRegionCtrl = new FormControl();
    this.filteredSubRegiones = this.subRegionCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterSubRegiones(value))
    );

    this.plantCtrl = new FormControl();
    this.filteredPlantes = this.plantCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPlantes (value))
    );

    this.activityCtrl = new FormControl();
    this.filteredActivityes = this.activityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterActivityes(value))
    );

    this.plantComponentCtrl = new FormControl();
    this.filteredPlantComponentes = this.plantComponentCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPlantComponentes(value))
    );
    // global.getPermissionUserRoles(4, 'stores', ' الموديل', '')
  }
  ngOnInit(): void {
    // console.log(productForm)
    
    this.getAllCostCenters();
    this.api.getAllFunctionnes().subscribe((functionnes) => {
      this.functionnes = functionnes;
    });

    this.api.getAllSources().subscribe((sources) => {
      this.sources = sources;
    });

    this.api.getAllRegiones().subscribe((regiones) => {
      this.regiones = regiones;
    });

    this.api.getAllSubRegioness().subscribe((subRegiones) => {
      this.subRegiones = subRegiones;
    });

    this.api.getAllPlantes().subscribe((plantes) => {
      this.plantes = plantes;
    });

    this.api.getAllActivityes().subscribe((activityes) => {
      this.activityes = activityes;
    });

    this.api.getAllplantComponentes().subscribe((plantComponentes) => {
      this.plantComponentes = plantComponentes;
    });
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(CcCostCenterDailogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllCostCenters();
        }
      });
  }

  displayFunctionnName(functionn: any): string {
    return functionn && functionn.name ? functionn.name : '';
  }
  functionnSelected(event: MatAutocompleteSelectedEvent): void {
    const functionn = event.option.value as functionn;
    this.selectedFunctionn = functionn;
    this.equipmentForm.patchValue({ functionId: functionn.id });
    this.equipmentForm.patchValue({ functionName: functionn.name });
  }
  private _filterFunctionnes(value: string): functionn[] {
    const filterValue = value.toLowerCase();
    return this.functionnes.filter(functionn =>
      functionn.name.toLowerCase().includes(filterValue) 
    );
  }

  displaySourcesName(source: any): string {
    return source && source.name ? source.name : '';
  }
  sourcesSelected(event: MatAutocompleteSelectedEvent): void {
    const source = event.option.value as source;
    this.selectedSource = source;
    this.equipmentForm.patchValue({ sourceId: source.id });
    this.equipmentForm.patchValue({ sourceName: source.name });
  }
  private _filterSources(value: string): source[] {
    const filterValue = value.toLowerCase();
    return this.sources.filter(source =>
      source.name.toLowerCase().includes(filterValue) 
    );
  }


  displayRegionName(region: any): string {
    return region && region.name ? region.name : '';
  }
  regionSelected(event: MatAutocompleteSelectedEvent): void {
    const region = event.option.value as region;
    this.selectedRegion = region;
    this.equipmentForm.patchValue({ regionId: region.id });
    this.equipmentForm.patchValue({ regionName: region.name });
  }
  private _filterRegiones(value: string): region[] {
    const filterValue = value.toLowerCase();
    return this.regiones.filter(region =>
      region.name.toLowerCase().includes(filterValue) 
    );
  }


  displaySubRegionName(subRegion: any): string {
    return subRegion && subRegion.name ? subRegion.name : '';
  }
  subRegionSelected(event: MatAutocompleteSelectedEvent): void {
    const subRegion = event.option.value as subRegion;
    this.selectedSubRegion = subRegion;
    this.equipmentForm.patchValue({ subRegionId: subRegion.id });
    this.equipmentForm.patchValue({ subRegionName: subRegion.name });
  }
  private _filterSubRegiones(value: string): subRegion[] {
    const filterValue = value.toLowerCase();
    return this.subRegiones.filter(subRegion =>
      subRegion.name.toLowerCase().includes(filterValue) 
    );
  }


  displayPlantName(plant: any): string {
    return plant && plant.name ? plant.name : '';
  }
  plantSelected(event: MatAutocompleteSelectedEvent): void {
    const plant = event.option.value as plant;
    this.selectedPlant = plant;
    this.equipmentForm.patchValue({ plantId: plant.id });
    this.equipmentForm.patchValue({ plantName: plant.name });
  }
  private _filterPlantes(value: string): plant[] {
    const filterValue = value.toLowerCase();
    return this.plantes.filter(plant =>
      plant.name.toLowerCase().includes(filterValue) 
    );
  }

  displayActivityName(activity: any): string {
    return activity && activity.name ? activity.name : '';
  }
  activitySelected(event: MatAutocompleteSelectedEvent): void {
    const activity = event.option.value as activity;
    this.selectedPlant = activity;
    this.equipmentForm.patchValue({ activityId: activity.id });
    this.equipmentForm.patchValue({ activityName: activity.name });
  }
  private _filterActivityes(value: string): activity[] {
    const filterValue = value.toLowerCase();
    return this.activityes.filter(activity =>
      activity.name.toLowerCase().includes(filterValue) 
    );
  }


  displayPlantComponentName(plant: any): string {
    return plant && plant.name ? plant.name : '';
  }
  plantComponentSelected(event: MatAutocompleteSelectedEvent): void {
    const plantComponent = event.option.value as plantComponent;
    this.selectedPlantComponent = plantComponent;
    this.equipmentForm.patchValue({ plantComponentId: plantComponent.id });
    this.equipmentForm.patchValue({ plantComponentName: plantComponent.name });
  }
  private _filterPlantComponentes(value: string): plant[] {
    const filterValue = value.toLowerCase();
    return this.plantComponentes.filter(plantComponent =>
      plantComponent.name.toLowerCase().includes(filterValue) 
    );
  }
  getAllCostCenters() {
    this.api.getCostCenter().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  editPlant(row: any) {
    this.dialog
      .open(CcCostCenterDailogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllCostCenters();
        }
      });
  }

  deletePlant(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteCostCenter(id).subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllCostCenters();

        }else{
          alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
        }
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  

  // openAutoSubRegion() {
  //   this.costCenterCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
  //   this.costCenterCtrl.updateValueAndValidity();
  // }
  
  
 

  // async getSearchModels(name: any) {
  //   this.api.getPlant().subscribe({
  //     next: (res) => {
  //       //enter id
  //       if (this.selectedSubRegion && name == '') {
  //         console.log('filter ID id: ', this.selectedSubRegion, 'name: ', name);

  //         this.dataSource = res.filter(
  //           (res: any) => res.subRegionId == this.selectedSubRegion.id!
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //       //enter both
  //       else if (this.selectedSubRegion && name != '') {
  //         console.log('filter both id: ', this.selectedSubRegion, 'name: ', name);

  //         // this.dataSource = res.filter((res: any)=> res.name==name!)
  //         this.dataSource = res.filter(
  //           (res: any) =>
  //             res.vendorId == this.selectedSubRegion.id! &&
  //             res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //       //enter name
  //       else {
  //         console.log('filter name id: ', this.selectedSubRegion, 'name: ', name);
  //         // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
  //         this.dataSource = res.filter((res: any) =>
  //           res.name.toLowerCase().includes(name.toLowerCase())
  //         );
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //     },
  //     error: (err) => {
  //       alert('Error');
  //     },
  //   });
  //   // this.getAllProducts()
  // }
  

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}



