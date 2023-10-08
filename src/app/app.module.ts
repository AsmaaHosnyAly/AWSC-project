import { HrEmployeeVacationBalanceDialogComponent } from './modules/hr/index/hr-employee-vacation-balance-dialog/hr-employee-vacation-balance-dialog.component';
import { HrEmployeeVacationBalanceComponent } from './modules/hr/index/hr-employee-vacation-balance/hr-employee-vacation-balance.component';
import { HrEmployeeVacationComponent } from './modules/hr/index/hr-employee-vacation/hr-employee-vacation.component';
import { HrEmployeeVacationDialogComponent } from './modules/hr/index/hr-employee-vacation-dialog/hr-employee-vacation-dialog.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './pages/login/login.component';
import { StrGroupHomeComponent } from './modules/str/index/str-group-home/str-group-home.component';
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
import { STRGradeComponent } from './modules/str/index/str-grade/str-grade.component';
import { STRGradeDialogComponent } from './modules/str/index/str-grade-dialog/str-grade-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StrCostcenterComponent } from './modules/str/index/str-costcenter/str-costcenter.component';
import { StrCostcenterDialogComponent } from './modules/str/index/str-costcenter-dialog/str-costcenter-dialog.component';
// import { StrItemComponent } from './modules/str/index_item/STR_item..component';
// import { StrItemDialogComponent } from './modules/str/index_item_dialog/STR_item_dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { StrGroupComponent } from './modules/str/index/str-group/str-group.component';
import { StrGroupDialogComponent } from './modules/str/index/str-group-dialog/str-group-dialog.component';
import { StrStoreComponent } from './modules/str/index/str-store/str-store.component';
import { StrStoreDialogComponent } from './modules/str/index/str-store-dialog/str-store-dialog.component';
import { STRUnitsComponent } from './modules/str/index/str-units/str-units.component';
import { STRUnitsDialogComponent } from './modules/str/index/str-units-dialog/str-units-dialog.component';
import { STRPlatoonComponent } from './modules/str/index/str-platoon/str-platoon.component';
import { STRPlatoonDialogComponent } from './modules/str/index/str-platoon-dialog/str-platoon-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { STRHomeComponent } from './modules/str/index/str-home/str-home.component';
import { StrCommodityComponent } from './modules/str/index/STR_Commodity/STR_Commodity.component';
import { StrCommodityDialogComponent } from './modules/str/index/STR_Commodity_dialog/str-commodity-dialog.component';
import { StrOpeningStockDialogComponent } from './modules/str/index/str-opening-stock-dialog/str-opening-stock-dialog.component';
import { StrOpeningStockTableComponent } from './modules/str/index/str-opening-stock-table/str-opening-stock-table.component';
import { StrOpeningStockContainerComponent } from './modules/str/index/str-opening-stock-container/str-opening-stock-container.component';
import { ToastrModule } from 'ngx-toastr';
import { StrReportComponent } from './modules/str/index/str-report/str-report.component';
import { MatStepperModule } from '@angular/material/stepper';
import { STRPlatoon1Component } from './modules/str/index/str-platoon1/str-platoon1.component';
import { STRPlatoon1DialogComponent } from './modules/str/index/str-platoon1-dialog/str-platoon1-dialog.component';
import { StrEmployeeExchangeContainerComponent } from './modules/str/index/str-employee-exchange-container/str-employee-exchange-container.component';
import { StrEmployeeExchangeDialogComponent } from './modules/str/index/str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { StrEmployeeExchangeTableComponent } from './modules/str/index/str-employee-exchange-table/str-employee-exchange-table.component';
import { STREmployeeOpeningCustodyComponent } from './modules/str/index/str-employee-opening-custody/str-employee-opening-custody.component';
import { STREmployeeOpeningCustodyTableComponent } from './modules/str/index/str-employee-opening-custody-table/str-employee-opening-custody-table.component';
import { STREmployeeOpeningCustodyDialogComponent } from './modules/str/index/str-employee-opening-custody-dialog/str-employee-opening-custody-dialog.component';
import { STRGroup1Component } from './modules/str/index/str-group1/str-group1.component';
import { STRGroup1DialogComponent } from './modules/str/index/str-group1-dialog/str-group1-dialog.component';
import { StrWithdrawContainerComponent } from './modules/str/index/str-withdraw-container/str-withdraw-container.component';
import { StrWithdrawDialogComponent } from './modules/str/index/str-withdraw-dialog2/str-withdraw-dialog2.component';
import { StrWithdrawTableComponent } from './modules/str/index/str-withdraw-table2/str-withdraw-table2.component';
import { StrProductComponent } from './modules/str/index/str-product/str-product.component';
import { StrProductDialogComponent } from './modules/str/index/str-product-dialog/str-product-dialog.component';
import { STRItem1Component } from './modules/str/index/str-item1/str-item1.component';
import { STRItem1DialogComponent } from './modules/str/index/str-item1-dialog/str-item1-dialog.component';
import { FIAccountComponent } from './modules/fi/index/fi-account/fi-account.component';
import { FIAccountDialogComponent } from './modules/fi/index/fi-account-dialog/fi-account-dialog.component';
import { FiEntryContainerComponent } from './modules/fi/index/fi-entry-container/fi-entry-container.component';
import { FiEntryTableComponent } from './modules/fi/index/fi-entry-table/fi-entry-table.component';
import { FiEntryDialogComponent } from './modules/fi/index/fi-entry-dialog/fi-entry-dialog.component';
// import {  FileUploadComponent} from "./modules/fi/indexle-upload/file-upload.component";
// import { FileUploadDialogComponent } from './modules/fi/indexle-upload-dialog/file-upload-dialog.component';
import { FIAccountHierarchyComponent } from './modules/fi/index/fi-account-hierarchy/fi-account-hierarchy.component';
import { FIAccountHierarchyDialogComponent } from './modules/fi/index/fi-account-hierarchy-dialog/fi-account-hierarchy-dialog.component';
import { PipesModule } from '../app/pipes/pipes.module';
import { FIEntrySourceComponent } from './modules/fi/index/fi-entry-source/fi-entry-source.component';
import { FIEntrySourceDialogComponent } from './modules/fi/index/fi-entry-source-dialog/fi-entry-source-dialog.component';

import { StrReportAddItemComponent } from './modules/str/index/str-report-add-item/str-report-add-item.component';

import { FiAccountItemComponent } from './modules/fi/index/fi-account-item/fi-account-item.component';
import { FiAccountItemdDialogComponent } from './modules/fi/index/fi-account-itemd-dialog/fi-account-itemd-dialog.component';
import { FIEntrySourceTypeComponent } from './modules/fi/index/fi-entry-source-type/fi-entry-source-type.component';
import { FIEntrySourceTypeDialogComponent } from './modules/fi/index/fi-entry-source-type-dialog/fi-entry-source-type-dialog.component';

import { FIJournalComponent } from './modules/fi/index/fi-journal/fi-journal.component';
import { FIJournalDialogComponent } from './modules/fi/index/fi-journal-dialog/fi-journal-dialog.component';
import { STRAddContainerComponent } from './modules/str/index/str-add-container/str-add-container.component';
import { STRAddDialogComponent } from './modules/str/index/str-add-dialog/str-add-dialog.component';
import { STRAddTableComponent } from './modules/str/index/str-add-table/str-add-table.component';
import { FIAccountParentComponent } from './modules/fi/index/fi-account-parent/fi-account-parent.component';
import { FIAccountParentDialogComponent } from './modules/fi/index/fi-account-parent-dialog/fi-account-parent-dialog.component';
import { HrJobTitleComponent } from './modules/hr/index/hr-job-title/hr-job-title.component';
import { HrJobTitleDialogComponent } from './modules/hr/index/hr-job-title-dialog/hr-job-title-dialog.component';
import { HrPositionComponent } from './modules/hr/index/hr-position/hr-position.component';
import { HrPositionDialogComponent } from './modules/hr/index/hr-position-dialog/hr-position-dialog.component';
import { StrVendorComponent } from './modules/str/index/str-vendor/str-vendor.component';
import { StrVendorDialogComponent } from './modules/str/index/str-vendor-dialog/str-vendor-dialog.component';
import { MenubarComponent } from './menubar/menubar.component';
import { MatBadgeModule } from '@angular/material/badge';
import { HrCityComponent } from './modules/hr/index/hr-city/hr-city.component';
import { HrCityDialogComponent } from './modules/hr/index/hr-city-dialog/hr-city-dialog.component';
import { HrCityStateComponent } from './modules/hr/index/hr-city-state/hr-city-state.component';
import { HrCityStateDialogComponent } from './modules/hr/index/hr-city-state-dialog/hr-city-state-dialog.component';
import { StrAccountsComponent } from './modules/str/index/str-accounts/str-accounts.component';
import { StrEmployeesComponent } from './modules/str/index/str-employees/str-employees.component';
import { HrIncentiveAllowanceComponent } from './modules/hr/index/hr-incentive-allowance/hr-incentive-allowance.component';
import { HrIncentiveAllowanceDialogComponent } from './modules/hr/index/hr-incentive-allowance-dialog/hr-incentive-allowance-dialog.component';
import { HrHiringTypeComponent } from './modules/hr/index/hr-hiring-type/hr-hiring-type.component';
import { HrHiringTypeDialogComponent } from './modules/hr/index/hr-hiring-type-dialog/hr-hiring-type-dialog.component';
import { HrMillitryStateComponent } from './modules/hr/index/hr-millitry-state/hr-millitry-state.component';
import { HrMillitryStateDialogComponent } from './modules/hr/index/hr-millitry-state-dialog/hr-millitry-state-dialog.component';
import { HrVacationComponent } from './modules/hr/index/hr-vacation/hr-vacation.component';
import { HrVacationDailogComponent } from './modules/hr/index/hr-vacation-dailog/hr-vacation-dailog.component';
import { HrSeveranceReasonComponent } from './modules/hr/index/hr-severance-reason/hr-severance-reason.component';
import { HrSeveranceReasonDialogComponent } from './modules/hr/index/hr-severance-reason-dialog/hr-severance-reason-dialog.component';
import { HrQualificationComponent } from './modules/hr/index/hr-qualification/hr-qualification.component';
import { HrQualificationDialogComponent } from './modules/hr/index/hr-qualification-dialog/hr-qualification-dialog.component';
import { HrQualitativeGroupComponent } from './modules/hr/index/hr-qualitative-group/hr-qualitative-group.component';
import { HrQualitativeGroupDialogComponent } from './modules/hr/index/hr-qualitative-group-dialog/hr-qualitative-group-dialog.component';
import { HrWorkPlaceComponent } from './modules/hr/index/hr-work-place/hr-work-place.component';
import { HrWorkPlacedialogComponent } from './modules/hr/index/hr-work-placedialog/hr-work-placedialog.component';
import { HrSpecializationComponent } from './modules/hr/index/hr-specialization/hr-specialization.component';
import { HrSpecializationDialogComponent } from './modules/hr/index/hr-specialization-dialog/hr-specialization-dialog.component';

import { HrDisciplinaryComponent } from './modules/hr/index/hr-disciplinary/hr-disciplinary.component';
import { HrDisciplinaryDialogComponent } from './modules/hr/index/hr-disciplinary-dialog/hr-disciplinary-dialog.component';
import { HrEmployeeDisciplinaryComponent } from './modules/hr/index/hr-employee-disciplinary/hr-employee-disciplinary.component';
import { HrEmployeeDisciplinaryDialogComponent } from './modules/hr/index/hr-employee-disciplinary-dialog/hr-employee-disciplinary-dialog.component';
import { PrGroupTableComponent } from './modules/pr/index/pr-group-table/pr-group-table.component';
import { PrGroupDialogComponent } from './modules/pr/index/pr-group-dialog/pr-group-dialog.component';
import { StrModelComponent } from './modules/str/index/str-model/str-model.component';
import { StrModelDailogComponent } from './modules/str/index/str-model-dailog/str-model-dailog.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { PrUserDialogComponent } from './modules/pr/index/pr-user-dialog/pr-user-dialog.component';
import { PrUserTableComponent } from './modules/pr/index/pr-user-table/pr-user-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FiEntryDetailsDialogComponent } from './modules/fi/index/fi-entry-details-dialog/fi-entry-details-dialog.component';
import { StrOpeningStockDetailsDialogComponent } from './modules/str/index/str-opening-stock-details-dialog/str-opening-stock-details-dialog.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Item1DialogComponent } from './modules/str/index/item1-dialog/item1-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { StrEmployeeOpeningCustodyDetailDailogComponent } from './modules/str/index/str-employee-opening-custody-detail-dailog/str-employee-opening-custody-detail-dailog.component';
import { PrintDialogComponent } from './modules/str/index/print-dialog/print-dialog.component';
import { EmployeeExchangePrintDialogComponent } from './modules/str/index/employee-exchange-print-dialog/employee-exchange-print-dialog.component';
import { EmployeeCustodyPrintDialogComponent } from './modules/str/index/employee-custody-print-dialog/employee-custody-print-dialog.component';
import { StrAddPrintDialogComponent } from './modules/str/index/str-add-print-dialog/str-add-print-dialog.component';
import { OpeningStockPrintDialogComponent } from './modules/str/index/opening-stock-print-dialog/opening-stock-print-dialog.component';

import { PrHomeComponent } from './modules/pr/index/pr-home/pr-home.component';

import { StrEmployeeExchangeDetailsDialogComponent } from './modules/str/index/str-employee-exchange-details-dialog/str-employee-exchange-details-dialog.component';
import { StrAddDetailsDialogComponent } from './modules/str/index/str-add-details-dialog/str-add-details-dialog.component';
import { StrWithdrawDetailsDialogComponent } from './modules/str/index/str-withdraw-details-dialog/str-withdraw-details-dialog.component';
// import { StockTakingComponent } from './stock-taking/stock-taking.component';
import { StrStockTakingContainerComponent } from './modules/str/index/str-stock-taking-container/str-stock-taking-container.component';
import { StrStockTakingDetailsDialogComponent } from './modules/str/index/str-stock-taking-details-dialog/str-stock-taking-details-dialog.component';
import { StrStockTakingDialogComponent } from './modules/str/index/str-stock-taking-dialog/str-stock-taking-dialog.component';
import { StrStockTakingTableComponent } from './modules/str/index/str-stock-taking-table/str-stock-taking-table.component';
import { PageRolesComponent } from './pages/page-roles/page-roles.component';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { StrProudctSerialComponent } from './modules/str/index/str-proudct-serial/str-proudct-serial.component'; 
import { StrProudctSerialDialogComponent } from './modules/str/index/str-proudct-serial-dialog/str-proudct-serial-dialog.component'; 
import { StrUserstoreComponent } from './modules/str/index/str-userstore/str-userstore.component';
import { StrUserstoreDialogComponent } from './modules/str/index/str-userstore-dialog/str-userstore-dialog.component';


// import { PrUsedrDetailsDialogComponent } from './modules/pr/index/pr-usedr-details-dialog/pr-usedr-details-dialog.component';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    HrEmployeeVacationBalanceComponent,
    HrEmployeeVacationBalanceDialogComponent,
    HrDisciplinaryDialogComponent,
    HrDisciplinaryComponent,
    HrVacationDailogComponent,
    HrVacationComponent,
    HrMillitryStateDialogComponent,
    HrMillitryStateComponent,
    HrHiringTypeDialogComponent,
    HrHiringTypeComponent,
    HrIncentiveAllowanceDialogComponent,
    HrIncentiveAllowanceComponent,
    StrEmployeesComponent,
    StrAccountsComponent,
    StrWithdrawContainerComponent,
    StrWithdrawDialogComponent,
    StrWithdrawTableComponent,
    StrCommodityComponent,
    HrJobTitleComponent,
    HrJobTitleDialogComponent,
    HrPositionDialogComponent,
    HrPositionComponent,
    StrCommodityDialogComponent,
    LoginComponent,
    StrGroupHomeComponent,
    HrEmployeeVacationComponent,
    HrEmployeeVacationDialogComponent,
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
    PrUserDialogComponent,
    PrUserTableComponent,
    FiEntryDetailsDialogComponent,
    StrOpeningStockDetailsDialogComponent,

    Item1DialogComponent,
                StrEmployeeOpeningCustodyDetailDailogComponent,
                     PrHomeComponent,
                StrEmployeeExchangeDetailsDialogComponent,
                StrAddDetailsDialogComponent,
                PrintDialogComponent,
    EmployeeExchangePrintDialogComponent,
    EmployeeCustodyPrintDialogComponent,
    StrAddPrintDialogComponent,
    OpeningStockPrintDialogComponent,
    PrHomeComponent,
    StrEmployeeExchangeDetailsDialogComponent,
    StrAddDetailsDialogComponent,
    StrWithdrawDetailsDialogComponent,

    StrStockTakingContainerComponent,
    StrStockTakingDetailsDialogComponent,
    StrStockTakingDialogComponent,
    StrStockTakingTableComponent,
    PageRolesComponent,
    StrProudctSerialComponent,
    StrProudctSerialDialogComponent,
    StrUserstoreComponent,
    StrUserstoreDialogComponent,
    
   
   

   
  ],
  imports: [
    BrowserModule,
    PipesModule,
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
    MatBadgeModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    NgxExtendedPdfViewerModule,
    MatTabsModule,
    HotkeyModule.forRoot()
    // FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
      

    },
    [HotkeysService]
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}