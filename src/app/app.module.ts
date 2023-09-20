import { HrEmployeeVacationBalanceDialogComponent } from './hr/hr-employee-vacation-balance-dialog/hr-employee-vacation-balance-dialog.component';
import { HrEmployeeVacationBalanceComponent } from './hr/hr-employee-vacation-balance/hr-employee-vacation-balance.component';
import { HrEmployeeVacationComponent } from './hr/hr-employee-vacation/hr-employee-vacation.component';
import { HrEmployeeVacationDialogComponent } from './hr/hr-employee-vacation-dialog/hr-employee-vacation-dialog.component';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './pages/login/login.component';
import { StrGroupHomeComponent } from './str/str-group-home/str-group-home.component';
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
import { STRGradeComponent } from './str/str-grade/str-grade.component';
import { STRGradeDialogComponent } from './str/str-grade-dialog/str-grade-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StrCostcenterComponent } from './str/str-costcenter/str-costcenter.component';
import { StrCostcenterDialogComponent } from './str/str-costcenter-dialog/str-costcenter-dialog.component';
// import { StrItemComponent } from './STR_item/STR_item..component';
// import { StrItemDialogComponent } from './STR_item_dialog/STR_item_dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { StrGroupComponent } from './str/str-group/str-group.component';
import { StrGroupDialogComponent } from './str/str-group-dialog/str-group-dialog.component';
import { StrStoreComponent } from './str/str-store/str-store.component';
import { StrStoreDialogComponent } from './str/str-store-dialog/str-store-dialog.component';
import { STRUnitsComponent } from './str/str-units/str-units.component';
import { STRUnitsDialogComponent } from './str/str-units-dialog/str-units-dialog.component';
import { STRPlatoonComponent } from './str/str-platoon/str-platoon.component';
import { STRPlatoonDialogComponent } from './str/str-platoon-dialog/str-platoon-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { STRHomeComponent } from './str/str-home/str-home.component';
import { StrCommodityComponent } from './str/STR_Commodity/STR_Commodity.component';
import { StrCommodityDialogComponent } from './str/STR_Commodity_dialog/str-commodity-dialog.component';
import { StrOpeningStockDialogComponent } from './str/str-opening-stock-dialog/str-opening-stock-dialog.component';
import { StrOpeningStockTableComponent } from './str/str-opening-stock-table/str-opening-stock-table.component';
import { StrOpeningStockContainerComponent } from './str/str-opening-stock-container/str-opening-stock-container.component';
import { ToastrModule } from 'ngx-toastr';
import { StrReportComponent } from './str/str-report/str-report.component';
import { MatStepperModule } from '@angular/material/stepper';
import { STRPlatoon1Component } from './str/str-platoon1/str-platoon1.component';
import { STRPlatoon1DialogComponent } from './str/str-platoon1-dialog/str-platoon1-dialog.component';
import { StrEmployeeExchangeContainerComponent } from './str/str-employee-exchange-container/str-employee-exchange-container.component';
import { StrEmployeeExchangeDialogComponent } from './str/str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { StrEmployeeExchangeTableComponent } from './str/str-employee-exchange-table/str-employee-exchange-table.component';
import { STREmployeeOpeningCustodyComponent } from './str/str-employee-opening-custody/str-employee-opening-custody.component';
import { STREmployeeOpeningCustodyTableComponent } from './str/str-employee-opening-custody-table/str-employee-opening-custody-table.component';
import { STREmployeeOpeningCustodyDialogComponent } from './str/str-employee-opening-custody-dialog/str-employee-opening-custody-dialog.component';
import { STRGroup1Component } from './str/str-group1/str-group1.component';
import { STRGroup1DialogComponent } from './str/str-group1-dialog/str-group1-dialog.component';
import { StrWithdrawContainerComponent } from './str/str-withdraw-container/str-withdraw-container.component';
import { StrWithdrawDialogComponent } from './str/str-withdraw-dialog2/str-withdraw-dialog2.component';
import { StrWithdrawTableComponent } from './str/str-withdraw-table2/str-withdraw-table2.component';
import { StrProductComponent } from './str/str-product/str-product.component';
import { StrProductDialogComponent } from './str/str-product-dialog/str-product-dialog.component';
import { STRItem1Component } from './str/str-item1/str-item1.component';
import { STRItem1DialogComponent } from './str/str-item1-dialog/str-item1-dialog.component';
import { FIAccountComponent } from './fi/fi-account/fi-account.component';
import { FIAccountDialogComponent } from './fi/fi-account-dialog/fi-account-dialog.component';
import { FiEntryContainerComponent } from './fi/fi-entry-container/fi-entry-container.component';
import { FiEntryTableComponent } from './fi/fi-entry-table/fi-entry-table.component';
import { FiEntryDialogComponent } from './fi/fi-entry-dialog/fi-entry-dialog.component';
// import {  FileUploadComponent} from "./file-upload/file-upload.component";
// import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';
import { FIAccountHierarchyComponent } from './fi/fi-account-hierarchy/fi-account-hierarchy.component';
import { FIAccountHierarchyDialogComponent } from './fi/fi-account-hierarchy-dialog/fi-account-hierarchy-dialog.component';
import { PipesModule } from '../app/pipes/pipes.module';
import { FIEntrySourceComponent } from './fi/fi-entry-source/fi-entry-source.component';
import { FIEntrySourceDialogComponent } from './fi/fi-entry-source-dialog/fi-entry-source-dialog.component';

import { StrReportAddItemComponent } from './str/str-report-add-item/str-report-add-item.component';

import { FiAccountItemComponent } from './fi/fi-account-item/fi-account-item.component';
import { FiAccountItemdDialogComponent } from './fi/fi-account-itemd-dialog/fi-account-itemd-dialog.component';
import { FIEntrySourceTypeComponent } from './fi/fi-entry-source-type/fi-entry-source-type.component';
import { FIEntrySourceTypeDialogComponent } from './fi/fi-entry-source-type-dialog/fi-entry-source-type-dialog.component';

import { FIJournalComponent } from './fi/fi-journal/fi-journal.component';
import { FIJournalDialogComponent } from './fi/fi-journal-dialog/fi-journal-dialog.component';
import { STRAddContainerComponent } from './str/str-add-container/str-add-container.component';
import { STRAddDialogComponent } from './str/str-add-dialog/str-add-dialog.component';
import { STRAddTableComponent } from './str/str-add-table/str-add-table.component';
import { FIAccountParentComponent } from './fi/fi-account-parent/fi-account-parent.component';
import { FIAccountParentDialogComponent } from './fi/fi-account-parent-dialog/fi-account-parent-dialog.component';
import { HrJobTitleComponent } from './hr/hr-job-title/hr-job-title.component';
import { HrJobTitleDialogComponent } from './hr/hr-job-title-dialog/hr-job-title-dialog.component';
import { HrPositionComponent } from './hr/hr-position/hr-position.component';
import { HrPositionDialogComponent } from './hr/hr-position-dialog/hr-position-dialog.component';
import { StrVendorComponent } from './str/str-vendor/str-vendor.component';
import { StrVendorDialogComponent } from './str/str-vendor-dialog/str-vendor-dialog.component';
import { MenubarComponent } from './menubar/menubar.component';
import { MatBadgeModule } from '@angular/material/badge';
import { HrCityComponent } from './hr/hr-city/hr-city.component';
import { HrCityDialogComponent } from './hr/hr-city-dialog/hr-city-dialog.component';
import { HrCityStateComponent } from './hr/hr-city-state/hr-city-state.component';
import { HrCityStateDialogComponent } from './hr/hr-city-state-dialog/hr-city-state-dialog.component';
import { StrAccountsComponent } from './str/str-accounts/str-accounts.component';
import { StrEmployeesComponent } from './str/str-employees/str-employees.component';
import { HrIncentiveAllowanceComponent } from './hr/hr-incentive-allowance/hr-incentive-allowance.component';
import { HrIncentiveAllowanceDialogComponent } from './hr/hr-incentive-allowance-dialog/hr-incentive-allowance-dialog.component';
import { HrHiringTypeComponent } from './hr/hr-hiring-type/hr-hiring-type.component';
import { HrHiringTypeDialogComponent } from './hr/hr-hiring-type-dialog/hr-hiring-type-dialog.component';
import { HrMillitryStateComponent } from './hr/hr-millitry-state/hr-millitry-state.component';
import { HrMillitryStateDialogComponent } from './hr/hr-millitry-state-dialog/hr-millitry-state-dialog.component';
import { HrVacationComponent } from './hr/hr-vacation/hr-vacation.component';
import { HrVacationDailogComponent } from './hr/hr-vacation-dailog/hr-vacation-dailog.component';
import { HrSeveranceReasonComponent } from './hr/hr-severance-reason/hr-severance-reason.component';
import { HrSeveranceReasonDialogComponent } from './hr/hr-severance-reason-dialog/hr-severance-reason-dialog.component';
import { HrQualificationComponent } from './hr/hr-qualification/hr-qualification.component';
import { HrQualificationDialogComponent } from './hr/hr-qualification-dialog/hr-qualification-dialog.component';
import { HrQualitativeGroupComponent } from './hr/hr-qualitative-group/hr-qualitative-group.component';
import { HrQualitativeGroupDialogComponent } from './hr/hr-qualitative-group-dialog/hr-qualitative-group-dialog.component';
import { HrWorkPlaceComponent } from './hr/hr-work-place/hr-work-place.component';
import { HrWorkPlacedialogComponent } from './hr/hr-work-placedialog/hr-work-placedialog.component';
import { HrSpecializationComponent } from './hr/hr-specialization/hr-specialization.component';
import { HrSpecializationDialogComponent } from './hr/hr-specialization-dialog/hr-specialization-dialog.component';

import { HrDisciplinaryComponent } from './hr/hr-disciplinary/hr-disciplinary.component';
import { HrDisciplinaryDialogComponent } from './hr/hr-disciplinary-dialog/hr-disciplinary-dialog.component';
import { HrEmployeeDisciplinaryComponent } from './hr/hr-employee-disciplinary/hr-employee-disciplinary.component';
import { HrEmployeeDisciplinaryDialogComponent } from './hr/hr-employee-disciplinary-dialog/hr-employee-disciplinary-dialog.component';
import { PrGroupTableComponent } from './pr/pr-group-table/pr-group-table.component';
import { PrGroupDialogComponent } from './pr/pr-group-dialog/pr-group-dialog.component';
import { StrModelComponent } from './str/str-model/str-model.component';
import { StrModelDailogComponent } from './str/str-model-dailog/str-model-dailog.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { PrUserDialogComponent } from './pr/pr-user-dialog/pr-user-dialog.component';
import { PrUserTableComponent } from './pr/pr-user-table/pr-user-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FiEntryDetailsDialogComponent } from './fi-entry-details-dialog/fi-entry-details-dialog.component';
import { StrOpeningStockDetailsDialogComponent } from './str/str-opening-stock-details-dialog/str-opening-stock-details-dialog.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Item1DialogComponent } from './str/item1-dialog/item1-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { StrEmployeeOpeningCustodyDetailDailogComponent } from './str/str-employee-opening-custody-detail-dailog/str-employee-opening-custody-detail-dailog.component';
import { WithdrawPrintDialogComponent } from './str/withdraw-print-dialog/withdraw-print-dialog.component';
import { EmployeeExchangePrintDialogComponent } from './str/employee-exchange-print-dialog/employee-exchange-print-dialog.component';
import { EmployeeCustodyPrintDialogComponent } from './str/employee-custody-print-dialog/employee-custody-print-dialog.component';
import { StrAddPrintDialogComponent } from './str/str-add-print-dialog/str-add-print-dialog.component';
import { OpeningStockPrintDialogComponent } from './str/opening-stock-print-dialog/opening-stock-print-dialog.component';

import { PrHomeComponent } from './pr/pr-home/pr-home.component';

import { StrEmployeeExchangeDetailsDialogComponent } from './str/str-employee-exchange-details-dialog/str-employee-exchange-details-dialog.component';
import { StrAddDetailsDialogComponent } from './str/str-add-details-dialog/str-add-details-dialog.component';
import { StrWithdrawDetailsDialogComponent } from './str/str-withdraw-details-dialog/str-withdraw-details-dialog.component';
// import { StockTakingComponent } from './stock-taking/stock-taking.component';
import { StrStockTakingContainerComponent } from './str/str-stock-taking-container/str-stock-taking-container.component';
import { StrStockTakingDetailsDialogComponent } from './str/str-stock-taking-details-dialog/str-stock-taking-details-dialog.component';
import { StrStockTakingDialogComponent } from './str/str-stock-taking-dialog/str-stock-taking-dialog.component';
import { StrStockTakingTableComponent } from './str/str-stock-taking-table/str-stock-taking-table.component';
import { PageRolesComponent } from './pages/page-roles/page-roles.component';
// import { PrUsedrDetailsDialogComponent } from './pr/pr-usedr-details-dialog/pr-usedr-details-dialog.component';
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
    WithdrawPrintDialogComponent,
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
    // FontAwesomeModule,
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
