import { HrEmployeeVacationBalanceDialogComponent } from './hr-employee-vacation-balance-dialog/hr-employee-vacation-balance-dialog.component';
import { HrEmployeeVacationBalanceComponent } from './hr-employee-vacation-balance/hr-employee-vacation-balance.component';
import {  HrEmployeeVacationComponent} from "./hr-employee-vacation/hr-employee-vacation.component";
import {  HrEmployeeVacationDialogComponent} from "./hr-employee-vacation-dialog/hr-employee-vacation-dialog.component";
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './pages/login/login.component';
import { StrGroupHomeComponent } from './str-group-home/str-group-home.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
// import { StrGroupNavBarComponent } from './shared/sidebar/str-group-nav-bar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { STRGradeComponent } from './str-grade/str-grade.component';
import { STRGradeDialogComponent } from './str-grade-dialog/str-grade-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StrCostcenterComponent } from '../app/str-costcenter/str-costcenter.component';
import { StrCostcenterDialogComponent } from './str-costcenter-dialog/str-costcenter-dialog.component';
// import { StrItemComponent } from './STR_item/STR_item..component';
// import { StrItemDialogComponent } from './STR_item_dialog/STR_item_dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { StrGroupComponent } from './str-group/str-group.component';
import { StrGroupDialogComponent } from './str-group-dialog/str-group-dialog.component';
import { StrStoreComponent } from './str-store/str-store.component';
import { StrStoreDialogComponent } from './str-store-dialog/str-store-dialog.component';
import { STRUnitsComponent } from './str-units/str-units.component';
import { STRUnitsDialogComponent } from './str-units-dialog/str-units-dialog.component';
import { STRPlatoonComponent } from './str-platoon/str-platoon.component';
import { STRPlatoonDialogComponent } from './str-platoon-dialog/str-platoon-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { STRHomeComponent } from './str-home/str-home.component';
import { StrCommodityComponent } from './STR_Commodity/STR_Commodity.component';
import { StrCommodityDialogComponent } from './STR_Commodity_dialog/str-commodity-dialog.component';
import { StrOpeningStockDialogComponent } from './str-opening-stock-dialog/str-opening-stock-dialog.component';
import { StrOpeningStockTableComponent } from './str-opening-stock-table/str-opening-stock-table.component';
import { StrOpeningStockContainerComponent } from './str-opening-stock-container/str-opening-stock-container.component';
import { ToastrModule } from 'ngx-toastr';
import { StrReportComponent } from './str-report/str-report.component';
import { MatStepperModule } from '@angular/material/stepper';
import { STRPlatoon1Component } from './str-platoon1/str-platoon1.component';
import { STRPlatoon1DialogComponent } from './str-platoon1-dialog/str-platoon1-dialog.component';
import { StrEmployeeExchangeContainerComponent } from './str-employee-exchange-container/str-employee-exchange-container.component';
import { StrEmployeeExchangeDialogComponent } from './str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { StrEmployeeExchangeTableComponent } from './str-employee-exchange-table/str-employee-exchange-table.component';
import { STREmployeeOpeningCustodyComponent } from './str-employee-opening-custody/str-employee-opening-custody.component';
import { STREmployeeOpeningCustodyTableComponent } from './str-employee-opening-custody-table/str-employee-opening-custody-table.component';
import { STREmployeeOpeningCustodyDialogComponent } from './str-employee-opening-custody-dialog/str-employee-opening-custody-dialog.component';
import { STRGroup1Component } from './str-group1/str-group1.component';
import { STRGroup1DialogComponent } from './str-group1-dialog/str-group1-dialog.component';
import { StrWithdrawContainerComponent } from './str-withdraw-container/str-withdraw-container.component';
import { StrWithdrawDialogComponent } from './str-withdraw-dialog2/str-withdraw-dialog2.component';
import { StrWithdrawTableComponent } from './str-withdraw-table2/str-withdraw-table2.component';
import { StrProductComponent } from './str-product/str-product.component';
import { StrProductDialogComponent } from './str-product-dialog/str-product-dialog.component';
import { STRItem1Component } from './str-item1/str-item1.component';
import { STRItem1DialogComponent } from './str-item1-dialog/str-item1-dialog.component';
import { FIAccountComponent } from './fi-account/fi-account.component';
import { FIAccountDialogComponent } from './fi-account-dialog/fi-account-dialog.component';
import { FiEntryContainerComponent } from './fi-entry-container/fi-entry-container.component';
import { FiEntryTableComponent } from './fi-entry-table/fi-entry-table.component';
import { FiEntryDialogComponent } from './fi-entry-dialog/fi-entry-dialog.component';
// import {  FileUploadComponent} from "./file-upload/file-upload.component";
// import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';
import { FIAccountHierarchyComponent } from './fi-account-hierarchy/fi-account-hierarchy.component';
import { FIAccountHierarchyDialogComponent } from './fi-account-hierarchy-dialog/fi-account-hierarchy-dialog.component';
import {PipesModule  } from "../app/pipes/pipes.module";
import { FIEntrySourceComponent } from './fi-entry-source/fi-entry-source.component';
import { FIEntrySourceDialogComponent } from './fi-entry-source-dialog/fi-entry-source-dialog.component';

import { StrReportAddItemComponent } from './str-report-add-item/str-report-add-item.component';

import { FiAccountItemComponent } from './fi-account-item/fi-account-item.component';
import { FiAccountItemdDialogComponent } from './fi-account-itemd-dialog/fi-account-itemd-dialog.component';
import { FIEntrySourceTypeComponent } from './fi-entry-source-type/fi-entry-source-type.component';
import { FIEntrySourceTypeDialogComponent } from './fi-entry-source-type-dialog/fi-entry-source-type-dialog.component';

import { FIJournalComponent } from './fi-journal/fi-journal.component';
import { FIJournalDialogComponent } from './fi-journal-dialog/fi-journal-dialog.component';
import { STRAddContainerComponent } from './str-add-container/str-add-container.component';
import { STRAddDialogComponent } from './str-add-dialog/str-add-dialog.component';
import { STRAddTableComponent } from './str-add-table/str-add-table.component';
import { FIAccountParentComponent } from './fi-account-parent/fi-account-parent.component';
import { FIAccountParentDialogComponent } from './fi-account-parent-dialog/fi-account-parent-dialog.component';
import {HrJobTitleComponent} from './hr-job-title/hr-job-title.component';
import {HrJobTitleDialogComponent} from './hr-job-title-dialog/hr-job-title-dialog.component'
import {HrPositionComponent} from './hr-position/hr-position.component';
import {HrPositionDialogComponent} from './hr-position-dialog/hr-position-dialog.component'
import { StrVendorComponent } from './str-vendor/str-vendor.component';
import { StrVendorDialogComponent } from './str-vendor-dialog/str-vendor-dialog.component';
import { MenubarComponent } from './menubar/menubar.component';
import {MatBadgeModule} from '@angular/material/badge';
import { HrCityComponent } from './hr-city/hr-city.component';
import { HrCityDialogComponent } from './hr-city-dialog/hr-city-dialog.component';
import { HrCityStateComponent } from './hr-city-state/hr-city-state.component';
import { HrCityStateDialogComponent } from './hr-city-state-dialog/hr-city-state-dialog.component';
import { StrAccountsComponent } from './str-accounts/str-accounts.component';
import { StrEmployeesComponent } from './str-employees/str-employees.component';
import { HrIncentiveAllowanceComponent } from './hr-incentive-allowance/hr-incentive-allowance.component';
import { HrIncentiveAllowanceDialogComponent } from './hr-incentive-allowance-dialog/hr-incentive-allowance-dialog.component';
import { HrHiringTypeComponent } from './hr-hiring-type/hr-hiring-type.component';
import { HrHiringTypeDialogComponent } from './hr-hiring-type-dialog/hr-hiring-type-dialog.component';
import { HrMillitryStateComponent } from './hr-millitry-state/hr-millitry-state.component';
import { HrMillitryStateDialogComponent } from './hr-millitry-state-dialog/hr-millitry-state-dialog.component';
import { HrVacationComponent } from './hr-vacation/hr-vacation.component';
import { HrVacationDailogComponent } from './hr-vacation-dailog/hr-vacation-dailog.component';
import { HrSeveranceReasonComponent } from './hr-severance-reason/hr-severance-reason.component';
import { HrSeveranceReasonDialogComponent } from './hr-severance-reason-dialog/hr-severance-reason-dialog.component';
import { HrQualificationComponent } from './hr-qualification/hr-qualification.component';
import { HrQualificationDialogComponent } from './hr-qualification-dialog/hr-qualification-dialog.component';
import { HrQualitativeGroupComponent } from './hr-qualitative-group/hr-qualitative-group.component';
import { HrQualitativeGroupDialogComponent } from './hr-qualitative-group-dialog/hr-qualitative-group-dialog.component';
import { HrWorkPlaceComponent } from './hr-work-place/hr-work-place.component';
import { HrWorkPlacedialogComponent } from './hr-work-placedialog/hr-work-placedialog.component';
import { HrSpecializationComponent } from './hr-specialization/hr-specialization.component';
import { HrSpecializationDialogComponent } from './hr-specialization-dialog/hr-specialization-dialog.component';

import {HrDisciplinaryComponent} from './hr-disciplinary/hr-disciplinary.component'
import {HrDisciplinaryDialogComponent} from './hr-disciplinary-dialog/hr-disciplinary-dialog.component';
import { HrEmployeeDisciplinaryComponent } from './hr-employee-disciplinary/hr-employee-disciplinary.component';
import { HrEmployeeDisciplinaryDialogComponent } from './hr-employee-disciplinary-dialog/hr-employee-disciplinary-dialog.component';
import { PrGroupTableComponent } from './pr-group-table/pr-group-table.component';
import { PrGroupDialogComponent } from './pr-group-dialog/pr-group-dialog.component';
import { StrModelComponent } from './str-model/str-model.component';
import { StrModelDailogComponent } from './str-model-dailog/str-model-dailog.component';

@NgModule({
  declarations: [
    AppComponent,HrEmployeeVacationBalanceComponent,HrEmployeeVacationBalanceDialogComponent,
    HrDisciplinaryDialogComponent,HrDisciplinaryComponent,
    HrVacationDailogComponent,HrVacationComponent,HrMillitryStateDialogComponent,
    HrMillitryStateComponent,HrHiringTypeDialogComponent,HrHiringTypeComponent,HrIncentiveAllowanceDialogComponent,HrIncentiveAllowanceComponent,StrEmployeesComponent,StrAccountsComponent,StrWithdrawContainerComponent,StrWithdrawDialogComponent,StrWithdrawTableComponent,
    StrCommodityComponent,HrJobTitleComponent,
    HrJobTitleDialogComponent,
    HrPositionDialogComponent,
    HrPositionComponent,
    StrCommodityDialogComponent,
    LoginComponent,
    StrGroupHomeComponent,
    HrEmployeeVacationComponent,HrEmployeeVacationDialogComponent,
    STRGradeComponent,
    STRGradeDialogComponent,

    StrCostcenterComponent,
    StrCostcenterDialogComponent,
    // StrItemDialogComponent,
    // StrItemComponent,
    StrGroupComponent,
    StrGroupDialogComponent,
    StrStoreComponent,
    StrStoreDialogComponent,
    STRUnitsComponent,
    STRUnitsDialogComponent,
    STRPlatoonComponent,
    STRPlatoonDialogComponent,
    STRHomeComponent,
    StrOpeningStockDialogComponent,
    StrOpeningStockTableComponent,
    StrOpeningStockContainerComponent,
    StrReportComponent,
    STRPlatoon1Component,
    STRPlatoon1DialogComponent,
    StrEmployeeExchangeContainerComponent,
    StrEmployeeExchangeDialogComponent,
    StrEmployeeExchangeTableComponent,
    STREmployeeOpeningCustodyComponent,
    STREmployeeOpeningCustodyTableComponent,
    STREmployeeOpeningCustodyDialogComponent,
    STRGroup1Component,
    STRGroup1DialogComponent,
    StrProductComponent,
    StrProductDialogComponent,
    STRItem1Component,
    STRItem1DialogComponent,
    FIAccountComponent,
    FIAccountDialogComponent,
    FiEntryContainerComponent,
    FiEntryTableComponent,
    FiEntryDialogComponent,
    FIAccountHierarchyComponent,
    FIAccountHierarchyDialogComponent,
    FIEntrySourceComponent,
    FIEntrySourceDialogComponent,

    StrReportAddItemComponent,
// selvana
    FiAccountItemComponent,
    FiAccountItemdDialogComponent,
    FIEntrySourceTypeComponent,
    FIEntrySourceTypeDialogComponent,
    FIJournalComponent,
    FIJournalDialogComponent,
    STRAddContainerComponent,
    STRAddDialogComponent,
    STRAddTableComponent,
    MenubarComponent,
    HrCityComponent,
    HrCityDialogComponent,
    HrCityStateComponent,
    HrCityStateDialogComponent,
    FIAccountParentComponent,
    FIAccountParentDialogComponent,
    MenubarComponent,
    StrVendorComponent,
    StrVendorDialogComponent,
    StrAccountsComponent,
    StrEmployeesComponent,
    HrIncentiveAllowanceComponent,
    HrIncentiveAllowanceDialogComponent,
    HrHiringTypeComponent,
    HrHiringTypeDialogComponent,
    HrMillitryStateComponent,
    HrMillitryStateDialogComponent,
    HrVacationComponent,
    HrVacationDailogComponent,
    HrSeveranceReasonComponent,
    HrSeveranceReasonDialogComponent,
    HrQualificationComponent,
    HrQualificationDialogComponent,
    HrQualitativeGroupComponent,
    HrQualitativeGroupDialogComponent,
    HrWorkPlaceComponent,
    HrWorkPlacedialogComponent,
    HrSpecializationComponent,
    HrSpecializationDialogComponent,
    HrEmployeeDisciplinaryComponent,
    HrEmployeeDisciplinaryDialogComponent,
    PrGroupTableComponent,
    PrGroupDialogComponent,
    StrModelComponent,
    StrModelDailogComponent,
   
  




  ],
  imports: [
    BrowserModule,PipesModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatTreeModule,
    MatExpansionModule,
    MatDialogModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    CommonModule,
    // NavbarComponent,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCardModule,
    MatAutocompleteModule,
    MatStepperModule,
    ToastrModule.forRoot(),
    MatBadgeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
