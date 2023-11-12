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
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
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
import { PipesModule } from './core/pipes/pipes.module';
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
import { MenubarComponent } from './pages/menubar/menubar.component';
import { MatBadgeModule } from '@angular/material/badge';
import { HrCityComponent } from './modules/hr/index/hr-city/hr-city.component';
import { HrCityDialogComponent } from './modules/hr/index/hr-city-dialog/hr-city-dialog.component';
import { HrCityStateComponent } from './modules/hr/index/hr-city-state/hr-city-state.component';
import { HrCityStateDialogComponent } from './modules/hr/index/hr-city-state-dialog/hr-city-state-dialog.component';
import { StrAccountsComponent } from './modules/str/index/str-accounts/str-accounts.component';
import { StrEmployeesComponent } from './modules/hr/index/hr-home/str-employees.component';
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

import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { StrProudctSerialComponent } from './modules/str/index/str-proudct-serial/str-proudct-serial.component';
import { StrProudctSerialDialogComponent } from './modules/str/index/str-proudct-serial-dialog/str-proudct-serial-dialog.component';
import { StrUserstoreComponent } from './modules/str/index/str-userstore/str-userstore.component';
import { StrUserstoreDialogComponent } from './modules/str/index/str-userstore-dialog/str-userstore-dialog.component';
import { HrFinancialDegreeComponent } from './modules/hr/index/hr-financial-degree/hr-financial-degree.component';
import { HrFinancialDegreeDialogComponent } from './modules/hr/index/hr-financial-degree-dialog/hr-financial-degree-dialog.component';
import { HrEmployeeFinancialDegreeComponent } from './modules/hr/index/hr-employee-financial-degree/hr-employee-financial-degree.component';
import { HrEmployeeFinancialDegreeDialogComponent } from './modules/hr/index/hr-employee-financial-degree-dialog/hr-employee-financial-degree-dialog.component';
import { HrEmployeePositionComponent } from './modules/hr/index/hr-employee-position/hr-employee-position.component';
import { HrEmployeePositionDialogComponent } from './modules/hr/index/hr-employee-position-dialog/hr-employee-position-dialog.component';
import { HrEmployeeAppraisalComponent } from './modules/hr/index/hr-employee-appraisal/hr-employee-appraisal.component';
import { HrEmployeeAppraisalDialogComponent } from './modules/hr/index/hr-employee-appraisal-dialog/hr-employee-appraisal-dialog.component';
import { HrEmployeeComponent } from './modules/hr/index/hr-employee/hr-employee.component';
import { HrEmployeeDialogComponent } from './modules/hr/index/hr-employee-dialog/hr-employee-dialog.component';
import { HrQualificationLevelComponent } from './modules/hr/index/hr-qualification-level/hr-qualification-level.component';
import { HrQualificationLevelDialogComponent } from './modules/hr/index/hr-qualification-level-dialog/hr-qualification-level-dialog.component';
import { HrEmployeeQualificationComponent } from './modules/hr/index/hr-employee-qualification/hr-employee-qualification.component';
import { HrEmployeeQualificationDialogComponent } from './modules/hr/index/hr-employee-qualification-dialog/hr-employee-qualification-dialog.component';
import { HrAttendanceMachineComponent } from './modules/attendance/index/hr-attendance-machine/hr-attendance-machine.component';
import { HrAttendanceMachineDialogComponent } from './modules/attendance/index/hr-attendance-machine-dialog/hr-attendance-machine-dialog.component';
import { HrAttendancePermissionComponent } from './modules/attendance/index/hr-attendance-permission/hr-attendance-permission.component';
import { HrAttendanceScheduleComponent } from './modules/attendance/index/hr-attendance-schedule/hr-attendance-schedule.component';
import { HrEmployeeAttendancePermissionComponent } from './modules/attendance/index/hr-employee-attendance-permission/hr-employee-attendance-permission.component';
import { HrEmployeeAttendanceScheduleComponent } from './modules/attendance/index/hr-employee-attendance-schedule/hr-employee-attendance-schedule.component';
import { HrAttendancePermissionDialogComponent } from './modules/attendance/index/hr-attendance-permission-dialog/hr-attendance-permission-dialog.component';
import { HrAttendanceMachineWorkPlaceComponent } from './modules/attendance/index/hr-attendance-machine-work-place/hr-attendance-machine-work-place.component';
import { HrAttendanceMachineWorkPlaceDialogComponent } from './modules/attendance/index/hr-attendance-machine-work-place-dialog/hr-attendance-machine-work-place-dialog.component';
import { HrAttendancHomeComponent } from './modules/attendance/index/hr-attendanc-home/hr-attendanc-home.component';
import { HrEmployeeAttendanceScheduleDialogeComponent } from './modules/attendance/index/hr-employee-attendance-schedule-dialoge/hr-employee-attendance-schedule-dialoge.component';
import { HrEmployeeAttendancePermissionDialogComponent } from './modules/attendance/index/hr-employee-attendance-permission-dialog/hr-employee-attendance-permission-dialog.component';
import { HrAttendanceScheduleDialogComponent } from './modules/attendance/index/hr-attendance-schedule-dialog/hr-attendance-schedule-dialog.component';
import { HrEmployeeAttendanceComponent } from './modules/attendance/index/hr-employee-attendance/hr-employee-attendance.component';
import { HrEmployeeAttendanceDialogComponent } from './modules/attendance/index/hr-employee-attendance-dialog/hr-employee-attendance-dialog.component';
import { PyInstallmentComponent } from './modules/py/index/py-installment/py-installment.component';
import { PyInstallmentDialogComponent } from './modules/py/index/py-installment-dialog/py-installment-dialog.component';
import { PyGroupComponent } from './modules/py/index/py-group/py-group.component';
import { PyGroupDialogComponent } from './modules/py/index/py-group-dialog/py-group-dialog.component';
import { PyGroupDetailDialogComponent } from './modules/py/index/py-group-detail-dialog/py-group-detail-dialog.component';
import { PyItemComponent } from './modules/py/index/py-item/py-item.component';
import { PyItemDialogComponent } from './modules/py/index/py-item-dialog/py-item-dialog.component';
import { PyExchangeComponent } from './modules/py/index/py-exchange-table/py-exchange.component';
import { PyExchangeDialogComponent } from './modules/py/index/py-exchange-dialog/py-exchange-dialog.component';
import { PyExchangeDetailsDialogComponent } from './modules/py/index/py-exchange-details-dialog/py-exchange-details-dialog.component';
import { PyExchangeContainerComponent } from './modules/py/index/py-exchange-container/py-exchange-container.component';
import { PyItemCategoryComponent } from './modules/py/index/py-item-category/py-item-category.component';
import { PyItemCategoryDialogComponent } from './modules/py/index/py-item-category-dialog/py-item-category-dialog.component';
import { PyTaxBracketComponent } from './modules/py/index/py-tax-bracket/py-tax-bracket.component';
import { PyTaxBracketDialogComponent } from './modules/py/index/py-tax-bracket-dialog/py-tax-bracket-dialog.component';
import { TrInstructorComponent } from './modules/training/index/tr-instructor/tr-instructor.component';
import { TrInstructorDialogComponent } from './modules/training/index/tr-instructor-dialog/tr-instructor-dialog.component';
import { TrCourseCategoryComponent } from './modules/training/index/tr-course-category/tr-course-category.component';
import { TrCourseCategoryDialogComponent } from './modules/training/index/tr-course-category-dialog/tr-course-category-dialog.component';
import { TrCoporteClientComponent } from './modules/training/index/tr-coporte-client/tr-coporte-client.component';
import { TrCoporteClientDialogComponent } from './modules/training/index/tr-coporte-client-dialog/tr-coporte-client-dialog.component';
import { TrCourseTypeComponent } from './modules/training/index/tr-course-type/tr-course-type.component';
import { TrCourseTypeDialogComponent } from './modules/training/index/tr-course-type-dialog/tr-course-type-dialog.component';
import { PyGroupDetailEmployeeDialogComponent } from './modules/py/index/py-group-detail-employee-dialog/py-group-detail-employee-dialog.component';
import { TrClassRoomComponent } from './modules/training/index/tr-class-room/tr-class-room.component';
import { TrClassRoomDialogComponent } from './modules/training/index/tr-class-room-dialog/tr-class-room-dialog.component';
import { TrCourseComponent } from './modules/training/index/tr-course/tr-course.component';
import { TrCourseDialogComponent } from './modules/training/index/tr-course-dialog/tr-course-dialog.component';
import { PyHomeComponent } from './modules/py/index/py-home/py-home.component';
import { TrTrackContainerComponent } from './modules/training/index/tr-track-container/tr-track-container.component';
import { TrTrackTableComponent } from './modules/training/index/tr-track-table/tr-track-table.component';
import { TrTrackDialogComponent } from './modules/training/index/tr-track-dialog/tr-track-dialog.component';
import { TrTrackDetailsDialogComponent } from './modules/training/index/tr-track-details-dialog/tr-track-details-dialog.component';
import { ReportsComponent } from './modules/str/index/reports/reports.component';
import { TrInstructorCourseComponent } from './modules/training/index/tr-instructor-course/tr-instructor-course.component';
import { TrInstructorCourseDialogComponent } from './modules/training/index/tr-instructor-course-dialog/tr-instructor-course-dialog.component';
import { TrTrainingCenterComponent } from './modules/training/index/tr-training-center/tr-training-center.component';
import { TrTrainingCenterDialogComponent } from './modules/training/index/tr-training-center-dialog/tr-training-center-dialog.component';
import { TrTraineeComponent } from './modules/training/index/tr-trainee/tr-trainee.component';
import { TrTraineeDialogComponent } from './modules/training/index/tr-trainee-dialog/tr-trainee-dialog.component';
import { TrTrainingCenterCourseComponent } from './modules/training/index/tr-training-center-course/tr-training-center-course.component';
import { TrTrainingCenterCourseDialogComponent } from './modules/training/index/tr-training-center-course-dialog/tr-training-center-course-dialog.component';
import { TrPlanComponent } from './modules/training/index/tr-plan/tr-plan.component';
import { TrPlanDialogComponent } from './modules/training/index/tr-plan-dialog/tr-plan-dialog.component';
import { TrPlanCourseDataComponent } from './modules/training/index/tr-plan-course-data/tr-plan-course-data.component';
import { TrPlanCourseDataDialogComponent } from './modules/training/index/tr-plan-course-data-dialog/tr-plan-course-data-dialog.component';
import { TrPurposeComponent } from './modules/training/index/tr-purpose/tr-purpose.component';
import { TrPurposeDialogComponent } from './modules/training/index/tr-purpose-dialog/tr-purpose-dialog.component';
import { FiReportsComponent } from './modules/fi/index/fi-reports/fi-reports.component';
import { TrPlanFinancierDetailsDialogComponent } from './modules/training/index/tr-plan-financier-details-dialog/tr-plan-financier-details-dialog.component';
import { TrPlanInstructorDetailsDialogComponent } from './modules/training/index/tr-plan-instructor-details-dialog/tr-plan-instructor-details-dialog.component';
import { TrPlanPositionDetailsDialogComponent } from './modules/training/index/tr-plan-position-details-dialog/tr-plan-position-details-dialog.component';
import { CcActivityComponent } from './modules/cc/index/cc-activity/cc-activity.component';
import { CcActivityDialogComponent } from './modules/cc/index/cc-activity-dialog/cc-activity-dialog.component';
import { CcFunctionComponent } from './modules/cc/index/cc-function/cc-function.component';
import { CcFunctionDialogComponent } from './modules/cc/index/cc-function-dialog/cc-function-dialog.component';
import { CcRegionComponent } from './modules/cc/index/cc-region/cc-region.component';
import { CcRegionDialogComponent } from './modules/cc/index/cc-region-dialog/cc-region-dialog.component';
import { CcSubRegionComponent } from './modules/cc/index/cc-sub-region/cc-sub-region.component';
import { CcSubRegionDialogComponent } from './modules/cc/index/cc-sub-region-dialog/cc-sub-region-dialog.component';
import { TrExcutedComponent } from './modules/training/index/tr-excuted/tr-excuted.component';
import { TrExcutedDialogComponent } from './modules/training/index/tr-excuted-dialog/tr-excuted-dialog.component';
import { TrExcutedInstructorDetailsDialogComponent } from './modules/training/index/tr-excuted-instructor-details-dialog/tr-excuted-instructor-details-dialog.component';
import { TrExcutedPositionDetailsDialogComponent } from './modules/training/index/tr-excuted-position-details-dialog/tr-excuted-position-details-dialog.component';
import { TrExcutedTraineeDetailsDialogComponent } from './modules/training/index/tr-excuted-trainee-details-dialog/tr-excuted-trainee-details-dialog.component';
import { CcPlantComponent } from './modules/cc/index/cc-plant/cc-plant.component';
import { CcPlantDialogComponent } from './modules/cc/index/cc-plant-dialog/cc-plant-dialog.component';
import { CcSourceComponent } from './modules/cc/index/cc-source/cc-source.component';
import { CcSourceDialogComponent } from './modules/cc/index/cc-source-dialog/cc-source-dialog.component';
import { CcPlantComponentComponent } from './modules/cc/index/cc-plant-component/cc-plant-component.component';
import { CcPlantComponentDialogComponent } from './modules/cc/index/cc-plant-component-dialog/cc-plant-component-dialog.component';
import { PrUserChangePasswordDialogComponent } from './modules/pr/index/pr-user-change-password-dialog/pr-user-change-password-dialog.component';
import { CcEquipmentComponent } from './modules/cc/index/cc-equipment/cc-equipment.component';
import { CcEquipmentDailogComponent } from './modules/cc/index/cc-equipment-dailog/cc-equipment-dailog.component';
import { CcCostCenterComponent } from './modules/cc/index/cc-cost-center/cc-cost-center.component';
import { CcCostCenterDailogComponent } from './modules/cc/index/cc-cost-center-dailog/cc-cost-center-dailog.component';
import { TrExcutedFinancierDetailsDialogComponent } from './modules/training/index/tr-excuted-financier-details-dialog/tr-excuted-financier-details-dialog.component';
import { CcEntryTableComponent } from './modules/cc/index/cc-entry-table/cc-entry-table.component';
import { CcEntryDialogComponent } from './modules/cc/index/cc-entry-dialog/cc-entry-dialog.component';
import { CcEntryContainerComponent } from './modules/cc/index/cc-entry-container/cc-entry-container.component';
import { CcEntryDetailsDialogComponent } from './modules/cc/index/cc-entry-details-dialog/cc-entry-details-dialog.component';
import { CcReportsComponent } from './modules/cc/index/cc-reports/cc-reports.component';
import { HrReportsComponent } from './modules/hr/index/hr-reports/hr-reports.component';
import { TrReportsComponent } from './modules/training/index/tr-reports/tr-reports.component';
import { AttendanceReportsComponent } from './modules/attendance/index/attendance-reports/attendance-reports.component';
import { PrReportsComponent } from './modules/pr/index/pr-reports/pr-reports.component';
import { PyReportsComponent } from './modules/py/index/py-reports/py-reports.component';
// import { CcCostCenterComponent } from './modules/cc/index/cc-cost-center/cc-cost-center.component';
// import { CcCostCenterDialogComponent } from './modules/cc/index/cc-cost-center-dialog/cc-cost-center-dialog.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FaHomeComponent } from './modules/fa/index/fa-home/fa-home.component';
import { FaCategoryThirdComponent } from './modules/fa/index/fa-category-third/fa-category-third.component';
import { FaCategoryThirdDialogComponent } from './modules/fa/index/fa-category-third-dialog/fa-category-third-dialog.component';
import { FaCategorySecondComponent } from './modules/fa/index/fa-category-second/fa-category-second.component';
import { FaCategorySecondDialogComponent } from './modules/fa/index/fa-category-second-dialog/fa-category-second-dialog.component';
import { FaCategoryFirstComponent } from './modules/fa/index/fa-category-first/fa-category-first.component';
import { FaCategoryFirstDialogComponent } from './modules/fa/index/fa-category-first-dialog/fa-category-first-dialog.component';
import { CcHomeComponent } from './modules/cc/index/cc-home/cc-home.component';
import { TrHomeComponent } from './modules/training/index/tr-home/tr-home.component';
import { TrBudgetComponent } from './modules/training/index/tr-budget/tr-budget.component';
import { TrBudgetDialogComponent } from './modules/training/index/tr-budget-dialog/tr-budget-dialog.component';
import { FaFixedAssetComponent } from './modules/fa/index/fa-fixed-asset/fa-fixed-asset.component';
import { FaFixedAssetDialogComponent } from './modules/fa/index/fa-fixed-asset-dialog/fa-fixed-asset-dialog.component';
import { ProTenderTypeComponent } from './modules/pro/index/pro-tender-type/pro-tender-type.component';
import { ProTenderTypeDailogComponent } from './modules/pro/index/pro-tender-type-dailog/pro-tender-type-dailog.component';
import { ProPlanTypeComponent } from './modules/pro/index/pro-plan-type/pro-plan-type.component';
import { ProPlanTypeDailogComponent } from './modules/pro/index/pro-plan-type-dailog/pro-plan-type-dailog.component';

import { ProContractorTypeComponent } from './modules/pro/index/pro-contractor-type/pro-contractor-type.component';
import { ProContractorTypeDialogComponent } from './modules/pro/index/pro-contractor-type-dialog/pro-contractor-type-dialog.component';
import { ProOperationTypeComponent } from './modules/pro/index/pro-operation-type/pro-operation-type.component';
import { ProOperationTypeDialogComponent } from './modules/pro/index/pro-operation-type-dialog/pro-operation-type-dialog.component';

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
    StrProudctSerialComponent,
    StrProudctSerialDialogComponent,
    StrUserstoreComponent,
    StrUserstoreDialogComponent,
    HrFinancialDegreeComponent,
    HrFinancialDegreeDialogComponent,
    HrEmployeeFinancialDegreeComponent,
    HrEmployeeFinancialDegreeDialogComponent,
    HrEmployeePositionComponent,
    HrEmployeePositionDialogComponent,
    HrEmployeeAppraisalComponent,
    HrEmployeeAppraisalDialogComponent,
    HrEmployeeComponent,
    HrEmployeeDialogComponent,
    HrQualificationLevelComponent,
    HrQualificationLevelDialogComponent,
    HrEmployeeQualificationComponent,
    HrEmployeeQualificationDialogComponent,
    HrAttendanceMachineDialogComponent,
    HrAttendanceMachineComponent,
    HrAttendancePermissionComponent,
    HrAttendanceScheduleComponent,
    HrEmployeeAttendancePermissionComponent,
    HrEmployeeAttendanceScheduleComponent,
    HrAttendancePermissionDialogComponent,
    HrAttendanceMachineWorkPlaceComponent,
    HrAttendanceMachineWorkPlaceDialogComponent,
    HrAttendancHomeComponent,
    HrEmployeeAttendanceScheduleDialogeComponent,
    HrEmployeeAttendancePermissionDialogComponent,
    HrAttendanceScheduleDialogComponent,
    HrEmployeeAttendanceComponent,
    HrEmployeeAttendanceDialogComponent,
    PyInstallmentComponent,
    PyInstallmentDialogComponent,
    PyGroupComponent,
    PyGroupDialogComponent,
    PyGroupDetailDialogComponent,
    PyItemComponent,
    PyItemDialogComponent,
    PyExchangeComponent,
    PyExchangeDialogComponent,
    PyExchangeDetailsDialogComponent,
    PyExchangeContainerComponent,
    PyItemCategoryComponent,
    PyItemCategoryDialogComponent,
    PyTaxBracketComponent,
    PyTaxBracketDialogComponent,
    TrInstructorComponent,
    TrInstructorDialogComponent,   
    TrCourseTypeComponent,
    TrCourseTypeDialogComponent,
    PyGroupDetailEmployeeDialogComponent,
    TrClassRoomComponent,
    TrClassRoomDialogComponent,
    TrInstructorDialogComponent,
    TrCourseCategoryComponent,
    TrCourseCategoryDialogComponent,
    TrCoporteClientComponent,
    TrCoporteClientDialogComponent,
   
    TrCourseTypeComponent,
    TrCourseTypeDialogComponent,
    TrCourseComponent,
    TrCourseDialogComponent,
    PyHomeComponent,
    TrTrackContainerComponent,
    TrTrackTableComponent,
    TrTrackDialogComponent,
    TrTrackDetailsDialogComponent,
    ReportsComponent,
    TrInstructorCourseComponent,
    TrInstructorCourseDialogComponent,
    TrTrainingCenterComponent,
    TrTrainingCenterDialogComponent,
    TrTraineeComponent,
    TrTraineeDialogComponent,
    TrTrainingCenterCourseComponent,
    TrTrainingCenterCourseDialogComponent,
    TrPlanComponent,
    TrPlanDialogComponent,
    TrPlanCourseDataComponent,
    TrPlanCourseDataDialogComponent,
    TrPurposeComponent,
    TrPurposeDialogComponent,
    FiReportsComponent,
    TrPlanFinancierDetailsDialogComponent,
    TrPlanInstructorDetailsDialogComponent,
    TrPlanPositionDetailsDialogComponent,
    CcActivityComponent,
    CcActivityDialogComponent,
    CcFunctionComponent,
    CcFunctionDialogComponent,
    CcRegionComponent,
    CcRegionDialogComponent,
    CcSubRegionComponent,
    CcSubRegionDialogComponent,
   
    TrExcutedComponent,
    TrExcutedDialogComponent,
    TrExcutedInstructorDetailsDialogComponent,
    TrExcutedPositionDetailsDialogComponent,
    TrExcutedTraineeDetailsDialogComponent,
    CcPlantComponent,
    CcPlantDialogComponent,
    CcSourceComponent,
    CcSourceDialogComponent,
    CcPlantComponentComponent,
    CcPlantComponentDialogComponent,
    PrUserChangePasswordDialogComponent,
    CcEquipmentComponent,
    CcEquipmentDailogComponent,
    CcCostCenterComponent,
    CcCostCenterDailogComponent,
    TrExcutedFinancierDetailsDialogComponent,
    CcEntryTableComponent,
    CcEntryDialogComponent,
    CcEntryContainerComponent,
    CcEntryDetailsDialogComponent,
    CcReportsComponent,
    HrReportsComponent,
    TrReportsComponent,
    AttendanceReportsComponent,
    PrReportsComponent,
    PyReportsComponent,
    SpinnerComponent,
    FaHomeComponent,
    FaCategoryThirdComponent,
    FaCategoryThirdDialogComponent,
    FaCategorySecondComponent,
    FaCategorySecondDialogComponent,
    FaCategoryFirstComponent,
    FaCategoryFirstDialogComponent,
    CcHomeComponent,
    TrHomeComponent,
    TrBudgetComponent,
    TrBudgetDialogComponent,
    FaFixedAssetComponent,
    FaFixedAssetDialogComponent,
    ProTenderTypeComponent,
    ProTenderTypeDailogComponent,
    ProPlanTypeComponent,
    ProPlanTypeDailogComponent,
   
    ProContractorTypeComponent,
    ProContractorTypeDialogComponent,
    ProOperationTypeComponent,
    ProOperationTypeDialogComponent
    // CcCostCenterComponent,
    // CcCostCenterDialogComponent,
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
    HotkeyModule.forRoot(),
    
    // FontAwesomeModul
    // FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    [HotkeysService],
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
