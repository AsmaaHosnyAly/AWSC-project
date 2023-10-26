import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrGroupHomeComponent } from './modules/str/index/str-group-home/str-group-home.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { STRUnitsComponent } from './modules/str/index/str-units/str-units.component';
import { STRGradeComponent } from './modules/str/index/str-grade/str-grade.component';
import { StrCostcenterComponent } from './modules/str/index/str-costcenter/str-costcenter.component';
import { StrStoreComponent } from './modules/str/index/str-store/str-store.component';
import { STRPlatoonComponent } from './modules/str/index/str-platoon/str-platoon.component';
import { STRHomeComponent } from './modules/str/index/str-home/str-home.component';
import { StrCommodityComponent } from './modules/str/index/STR_Commodity/STR_Commodity.component';
import { StrOpeningStockContainerComponent } from './modules/str/index/str-opening-stock-container/str-opening-stock-container.component';
import { StrReportComponent } from './modules/str/index/str-report/str-report.component';
import { StrEmployeeExchangeContainerComponent } from './modules/str/index/str-employee-exchange-container/str-employee-exchange-container.component';
import { STRGroup1Component } from './modules/str/index/str-group1/str-group1.component';
import { STRItem1Component } from './modules/str/index/str-item1/str-item1.component';
import { STREmployeeOpeningCustodyComponent } from './modules/str/index/str-employee-opening-custody/str-employee-opening-custody.component';
import { StrProductComponent } from './modules/str/index/str-product/str-product.component';
import { FiEntryContainerComponent } from './modules/fi/index/fi-entry-container/fi-entry-container.component';
import { StrWithdrawContainerComponent } from './modules/str/index/str-withdraw-container/str-withdraw-container.component';
import { FIAccountComponent } from './modules/fi/index/fi-account/fi-account.component';
import { FIAccountHierarchyComponent } from './modules/fi/index/fi-account-hierarchy/fi-account-hierarchy.component';
import { FIEntrySourceComponent } from './modules/fi/index/fi-entry-source/fi-entry-source.component';
import { FIEntrySourceTypeComponent } from './modules/fi/index/fi-entry-source-type/fi-entry-source-type.component';
import { StrReportAddItemComponent } from './modules/str/index/str-report-add-item/str-report-add-item.component';
import { FIAccountParentComponent } from './modules/fi/index/fi-account-parent/fi-account-parent.component';
import { FiAccountItemComponent } from './modules/fi/index/fi-account-item/fi-account-item.component';
import { FIJournalComponent } from './modules/fi/index/fi-journal/fi-journal.component';
import { FiReportsComponent } from './modules/fi/index/fi-reports/fi-reports.component';
import { STRAddContainerComponent } from './modules/str/index/str-add-container/str-add-container.component';
import { HrCityComponent } from './modules/hr/index/hr-city/hr-city.component';
import { HrCityStateComponent } from './modules/hr/index/hr-city-state/hr-city-state.component';
import { HrQualitativeGroupComponent } from './modules/hr/index/hr-qualitative-group/hr-qualitative-group.component';
import { HrWorkPlaceComponent } from './modules/hr/index/hr-work-place/hr-work-place.component';
import { HrSpecializationComponent } from './modules/hr/index/hr-specialization/hr-specialization.component';
import { StrVendorComponent } from './modules/str/index/str-vendor/str-vendor.component';
import { HrJobTitleComponent } from './modules/hr/index/hr-job-title/hr-job-title.component';
import { HrPositionComponent } from './modules/hr/index/hr-position/hr-position.component';
import { StrAccountsComponent } from './modules/str/index/str-accounts/str-accounts.component';
import { StrEmployeesComponent } from './modules/hr/index/hr-home/str-employees.component';
import { HrMillitryStateComponent } from './modules/hr/index/hr-millitry-state/hr-millitry-state.component';
import { HrVacationComponent } from './modules/hr/index/hr-vacation/hr-vacation.component';
import { HrIncentiveAllowanceComponent } from './modules/hr/index/hr-incentive-allowance/hr-incentive-allowance.component';
import { HrHiringTypeComponent } from './modules/hr/index/hr-hiring-type/hr-hiring-type.component';
import { HrSeveranceReasonComponent } from './modules/hr/index/hr-severance-reason/hr-severance-reason.component';
import { HrQualificationComponent } from './modules/hr/index/hr-qualification/hr-qualification.component';
import { HrEmployeeVacationComponent } from './modules/hr/index/hr-employee-vacation/hr-employee-vacation.component';
import { HrEmployeeVacationBalanceComponent } from './modules/hr/index/hr-employee-vacation-balance/hr-employee-vacation-balance.component';
import { HrDisciplinaryComponent } from './modules/hr/index/hr-disciplinary/hr-disciplinary.component';
import { HrEmployeeDisciplinaryComponent } from './modules/hr/index/hr-employee-disciplinary/hr-employee-disciplinary.component';
import { PrGroupTableComponent } from './modules/pr/index/pr-group-table/pr-group-table.component';
import {
  StrModelComponent,
  vendor,
} from './modules/str/index/str-model/str-model.component';
import { MenubarComponent } from './pages/menubar/menubar.component';
import { PrUserTableComponent } from './modules/pr/index/pr-user-table/pr-user-table.component';
import { rolesGuard } from './core/guards/str/roles.guard';
import { withdrawGuard } from './core/guards/str/withdraw.guard';
import { sTRAddGuard } from './core/guards/str/stradd.guard';
import { strOpeningStockGuard } from './core/guards/str/str-opening-stock.guard';
import { employeeOpeningGuard } from './core/guards/str/employee-opening.guard';
import { employeeOpeningCustodyGuard } from './core/guards/str/employee-opening-custody.guard';
import { prUserGuard } from './core/guards/pr/pr-user.guard';
import { prGroupGuard } from './core/guards/pr/pr-group.guard';
import { unitGuard } from './core/guards/str/unit.guard';
import { commodityGuard } from './core/guards/str/commodity.guard';
import { costCenterGuard } from './core/guards/str/cost-center.guard';
import { gradeGuard } from './core/guards/str/grade.guard';
import { group1Guard } from './core/guards/str/group1.guard';
import { items1Guard } from './core/guards/str/items1.guard';
import { modelGuard } from './core/guards/str/model.guard';

import { productsGuard } from './core/guards/str/products.guard';
import { storeGuard } from './core/guards/str/store.guard';
import { strPlatoonGuard } from './core/guards/str/str-platoon.guard';
import { vendorGuard } from './core/guards/str/vendor.guard';
import { PrHomeComponent } from './modules/pr/index/pr-home/pr-home.component';
import { StrStockTakingContainerComponent } from './modules/str/index/str-stock-taking-container/str-stock-taking-container.component';
import { HotkeyModule } from 'angular2-hotkeys/public-api';
import { PagesEnums } from './core/enums/pages.enum';
import { StrProudctSerialComponent } from './modules/str/index/str-proudct-serial/str-proudct-serial.component';
import { StrUserstoreComponent } from './modules/str/index/str-userstore/str-userstore.component';
import { productSerialGuard } from './core/guards/str/product-serial.guard';
import { HrFinancialDegreeComponent } from './modules/hr/index/hr-financial-degree/hr-financial-degree.component';
import { HrEmployeeFinancialDegreeComponent } from './modules/hr/index/hr-employee-financial-degree/hr-employee-financial-degree.component';
import { HrEmployeePositionComponent } from './modules/hr/index/hr-employee-position/hr-employee-position.component';
import { HrEmployeeAppraisalComponent } from './modules/hr/index/hr-employee-appraisal/hr-employee-appraisal.component';
import { HrQualificationLevelComponent } from './modules/hr/index/hr-qualification-level/hr-qualification-level.component';
import { HrEmployeeQualificationComponent } from './modules/hr/index/hr-employee-qualification/hr-employee-qualification.component';
import { ReportsComponent } from './modules/str/index/reports/reports.component';
import { HrEmployeeComponent } from './modules/hr/index/hr-employee/hr-employee.component';
import { HrAttendanceMachineComponent } from './modules/attendance/index/hr-attendance-machine/hr-attendance-machine.component';
import { HrAttendancePermissionComponent } from './modules/attendance/index/hr-attendance-permission/hr-attendance-permission.component';
import { HrAttendanceMachineWorkPlaceComponent } from './modules/attendance/index/hr-attendance-machine-work-place/hr-attendance-machine-work-place.component';
import { HrAttendancHomeComponent } from './modules/attendance/index/hr-attendanc-home/hr-attendanc-home.component';
import { HrEmployeeAttendanceScheduleComponent } from './modules/attendance/index/hr-employee-attendance-schedule/hr-employee-attendance-schedule.component';
import { HrEmployeeAttendancePermissionComponent } from './modules/attendance/index/hr-employee-attendance-permission/hr-employee-attendance-permission.component';
import { HrAttendanceScheduleComponent } from './modules/attendance/index/hr-attendance-schedule/hr-attendance-schedule.component';
import { HrEmployeeAttendanceComponent } from './modules/attendance/index/hr-employee-attendance/hr-employee-attendance.component';
import { PyInstallmentComponent } from './modules/py/index/py-installment/py-installment.component';
import { PyGroupComponent } from './modules/py/index/py-group/py-group.component';
import { PyItemComponent } from './modules/py/index/py-item/py-item.component';

import { PyExchangeContainerComponent } from './modules/py/index/py-exchange-container/py-exchange-container.component';
import { PyItemCategoryComponent } from './modules/py/index/py-item-category/py-item-category.component';
import { PyTaxBracketComponent } from './modules/py/index/py-tax-bracket/py-tax-bracket.component';
// import { PyHomeComponent } from './modules/py/index/py-home/py-home.component';


import { TrInstructorComponent } from './modules/training/index/tr-instructor/tr-instructor.component';
import { TrCourseCategoryComponent } from './modules/training/index/tr-course-category/tr-course-category.component';
import { TrCoporteClientComponent } from './modules/training/index/tr-coporte-client/tr-coporte-client.component';
import { TrCourseTypeComponent } from './modules/training/index/tr-course-type/tr-course-type.component';
import { TrTrackContainerComponent } from './modules/training/index/tr-track-container/tr-track-container.component';
import { TrClassRoomComponent } from './modules/training/index/tr-class-room/tr-class-room.component';
import { TrCourseComponent } from './modules/training/index/tr-course/tr-course.component';
import { TrInstructorCourseComponent } from './modules/training/index/tr-instructor-course/tr-instructor-course.component';
import { TrTrainingCenterComponent } from './modules/training/index/tr-training-center/tr-training-center.component';
import { PyHomeComponent } from './modules/py/index/py-home/py-home.component';
import { accountGuard } from './core/guards/fi/account.guard';
import { fiAccountItemGuard } from './core/guards/fi/fi-account-item.guard';
import { entrySourceTypeGuard } from './core/guards/fi/entry-source-type.guard';
import { fiEntryGuard } from './core/guards/fi/fi-entry.guard';
import { fIJournalGuard } from './core/guards/fi/fijournal.guard';
import { cityGuard } from './core/guards/hr/city.guard';
import { cityStateGuard } from './core/guards/hr/city-state.guard';
import { qualitativeGroupGuard } from './core/guards/hr/qualitative-group.guard';
import { workPlaceGuard } from './core/guards/hr/work-place.guard';
import { specializationGuard } from './core/guards/hr/specialization.guard';
import { hrJobTitleGuard } from './core/guards/hr/hr-job-title.guard';
import { hrPositionGuard } from './core/guards/hr/hr-position.guard';
import { hrMillitryStateGuard } from './core/guards/hr/hr-millitry-state.guard';
import { hrVacationGuard } from './core/guards/hr/hr-vacation.guard';
import { hrIncentiveGuard } from './core/guards/hr/hr-incentive.guard';
import { hrHiringTypeGuard } from './core/guards/hr/hr-hiring-type.guard';
import { severanceReasonGuard } from './core/guards/hr/severance-reason.guard';
import { qualificationGuard } from './core/guards/hr/qualification.guard';
import { qualificationLevelGuard } from './core/guards/hr/qualification-level.guard';
import { hrEmployeeVacationGuard } from './core/guards/hr/hr-employee-vacation.guard';
import { hrEmployeeVacationBalanceGuard } from './core/guards/hr/hr-employee-vacation-balance.guard';
import { hrDisciplinaryGuard } from './core/guards/hr/hr-disciplinary.guard';
import { hrFinancialDegreeGuard } from './core/guards/hr/hr-financial-degree.guard';
import { hrEmployeeFinancialDegreeGuard } from './core/guards/hr/hr-employee-financial-degree.guard';
import { hrEmployeeAppraisalGuard } from './core/guards/hr/hr-employee-appraisal.guard';
import { TrTraineeComponent } from './modules/training/index/tr-trainee/tr-trainee.component';
import { TrTrainingCenterCourseComponent } from './modules/training/index/tr-training-center-course/tr-training-center-course.component';
import { TrPlanComponent } from './modules/training/index/tr-plan/tr-plan.component';
import { TrPlanCourseDataComponent } from './modules/training/index/tr-plan-course-data/tr-plan-course-data.component';
import { TrPurposeComponent } from './modules/training/index/tr-purpose/tr-purpose.component';

/////////////cc///////////////////////
import { CcActivityComponent } from './modules/cc/index/cc-activity/cc-activity.component';
import { CcFunctionComponent } from './modules/cc/index/cc-function/cc-function.component';
import { CcRegionComponent } from './modules/cc/index/cc-region/cc-region.component';
import { CcSubRegionComponent } from './modules/cc/index/cc-sub-region/cc-sub-region.component';
import { CcPlantComponent } from './modules/cc/index/cc-plant/cc-plant.component';
import { CcSourceComponent } from './modules/cc/index/cc-source/cc-source.component';
import { CcPlantComponentComponent } from './modules/cc/index/cc-plant-component/cc-plant-component.component';
import { PrUserChangePasswordDialogComponent } from './modules/pr/index/pr-user-change-password-dialog/pr-user-change-password-dialog.component';
import { CcEquipmentComponent } from './modules/cc/index/cc-equipment/cc-equipment.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MenubarComponent,
    data: {},

    children: [
      { path: 'home', component: StrGroupHomeComponent },
      /***************start stores modules المخازن***************/
      { path: 'str-home', component: STRHomeComponent },
      {
        path: 'withdraw',
        component: StrWithdrawContainerComponent,
        canActivate: [withdrawGuard],
        data: { PageLsit: [PagesEnums.WITHDRAW] },
      },
      {
        path: 'STRAdd',
        component: STRAddContainerComponent,
        canActivate: [sTRAddGuard],
        data: { PageLsit: [PagesEnums.STRAdd] },
      },
      {
        path: 'str-openingStock',
        component: StrOpeningStockContainerComponent,
        canActivate: [strOpeningStockGuard],
        data: { PageLsit: [PagesEnums.STR_OPENING_STOCK] },
      },
      {
        path: 'employeeOpening',
        component: StrEmployeeExchangeContainerComponent,
        canActivate: [employeeOpeningGuard],
        data: { PageLsit: [PagesEnums.EMPLOYEE_OPENING] },
      },
      {
        path: 'EmployeeOpeningCustody',
        component: STREmployeeOpeningCustodyComponent,
        canActivate: [employeeOpeningCustodyGuard],
        data: { PageLsit: [PagesEnums.EMPLOYEE_OPENING_CUSTODY] },
      },
      {
        path: 'commodity',
        component: StrCommodityComponent,
        canActivate: [commodityGuard],
        data: { PageLsit: [PagesEnums.COMMODITY] },
      },
      {
        path: 'grade',
        component: STRGradeComponent,
        canActivateChild: [gradeGuard],
        data: { PageLsit: [PagesEnums.GRADE] },
      },

      {
        path: 'str-platoon',
        component: STRPlatoonComponent,
        canActivate: [strPlatoonGuard],
        data: { PageLsit: [PagesEnums.STR_PLATOON] },
      },
      {
        path: 'group1',
        component: STRGroup1Component,
        canActivate: [group1Guard],
        data: { PageLsit: [PagesEnums.GROUP1] },
      },
      {
        path: 'unit',
        component: STRUnitsComponent,
        canActivate: [unitGuard],
        data: { PageLsit: [PagesEnums.UNIT] },
      },
      {
        path: 'items1',
        component: STRItem1Component,
        canActivate: [items1Guard],
        data: { PageLsit: [PagesEnums.ITEMES1] },
      },
      {
        path: 'store',
        component: StrStoreComponent,
        canActivate: [storeGuard],
        data: { PageLsit: [PagesEnums.STORE] },
      },
      {
        path: 'str-vendor',
        component: StrVendorComponent,
        canActivate: [vendorGuard],
        data: { PageLsit: [PagesEnums.STR_VENDOR] },
      },

      {
        path: 'str-model',
        component: StrModelComponent,
        canActivate: [modelGuard],
        data: { PageLsit: [PagesEnums.MODEL] },
      },
      {
        path: 'costCenter',
        component: StrCostcenterComponent,
        canActivate: [costCenterGuard],
        data: { PageLsit: [PagesEnums.COST_CENTER] },
      },
      {
        path: 'products',
        component: StrProductComponent,
        canActivate: [productsGuard],
        data: { PageLsit: [PagesEnums.PRODUCTS] },
      },
      {
        path: 'product-serial',
        component: StrProudctSerialComponent,
        canActivate: [productSerialGuard],
        data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
      },
      { path: 'struserstore', component: StrUserstoreComponent },
      { path: 'StrStockTaking', component: StrStockTakingContainerComponent },
      {
        path: 'reports', component: ReportsComponent
      },

      /***********************end store modules المخازن **********************/

      /***********************Start account modules الحسابات **********************/
      {
        path: 'fi-home',
        component: StrAccountsComponent,
        canActivate: [productSerialGuard],
        data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
      },
      // {
      //   path: 'AccountHierarchy',
      //   component: FIAccountHierarchyComponent,
      //   canActivate: [productSerialGuard],
      //   data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
      // },
      {
        path: 'EntrySource',
        component: FIEntrySourceComponent,
        canActivate: [accountGuard],
        data: { PageLsit: [PagesEnums.ADD_ACCOUNT] },
      },
      {
        path: 'EntrySourceType',
        component: FIEntrySourceTypeComponent,
        canActivate: [entrySourceTypeGuard],
        data: { PageLsit: [PagesEnums.EntrySourceType] },
      },
      // {
      //   path: 'AccountParent',
      //   component: FIAccountParentComponent,
      //   canActivate: [productSerialGuard],
      //   data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
      // },
      {
        path: 'FiAccountItem',
        component: FiAccountItemComponent,
        canActivate: [fiAccountItemGuard],
        data: { PageLsit: [PagesEnums.FiAccountItem] },
      },
      {
        path: 'FIJournal',
        component: FIJournalComponent,
        canActivate: [fIJournalGuard],
        data: { PageLsit: [PagesEnums.FIJournal] },
      },
      {
        path: 'fi-entry',
        component: FiEntryContainerComponent,
        canActivate: [fiEntryGuard],
        data: { PageLsit: [PagesEnums.FI_ENTRY] },
      },
      {
        path: 'account',
        component: FIAccountComponent,
        canActivate: [accountGuard],
        data: { PageLsit: [PagesEnums.ADD_ACCOUNT] },
      },


      {
        path: 'fiReports',component: FiReportsComponent
      },


      
  /**********************End account modules الحسابات **********************/

  /*******************Start Roles modules الصلاحيات************************/

  { path: 'pr-home', component: PrHomeComponent },
  {
    path: 'pr-group',
    component: PrGroupTableComponent,
    canActivate: [prGroupGuard],
    data: { PageLsit: [PagesEnums.PR_GROUP] },
  },
  {
    path: 'pr-user',
    component: PrUserTableComponent,
    canActivate: [prUserGuard],
    data: { PageLsit: [PagesEnums.PR_USER] },
  },
 
  { path: 'pr-user-changPassword', component: PrUserChangePasswordDialogComponent },

  /*********************End Roles modules الصلاحيات***************************/

  /*********************Start Hr modules شئون العاميلن***************************/
  {
    path: 'hr-home',
    component: StrEmployeesComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'city',
    component: HrCityComponent,
    canActivate: [cityGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'cityState',
    component: HrCityStateComponent,
    canActivate: [cityStateGuard],
    data: { PageLsit: [PagesEnums.CITY_STATE] },
  },
  {
    path: 'QualitativeGroup',
    component: HrQualitativeGroupComponent,
    canActivate: [qualitativeGroupGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'WorkPlace',
    component: HrWorkPlaceComponent,
    canActivate: [workPlaceGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'specialization',
    component: HrSpecializationComponent,
    canActivate: [specializationGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-jobTitle',
    component: HrJobTitleComponent,
    canActivate: [hrJobTitleGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-position',
    component: HrPositionComponent,
    canActivate: [hrPositionGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-MillitryState',
    component: HrMillitryStateComponent,
    canActivate: [hrMillitryStateGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-vacation',
    component: HrVacationComponent,
    canActivate: [hrVacationGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-incentive',
    component: HrIncentiveAllowanceComponent,
    canActivate: [hrIncentiveGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-hiringType',
    component: HrHiringTypeComponent,
    canActivate: [hrHiringTypeGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'SeveranceReason',
    component: HrSeveranceReasonComponent,
    canActivate: [severanceReasonGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'Qualification',
    component: HrQualificationComponent,
    canActivate: [qualificationGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'QualificationLevel',
    component: HrQualificationLevelComponent,
    canActivate: [qualificationLevelGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-employeeVacation',
    component: HrEmployeeVacationComponent,
    canActivate: [hrEmployeeVacationGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  }, //waiting back to update
  {
    path: 'hr-employeeVacationBalance',
    component: HrEmployeeVacationBalanceComponent,
    canActivate: [hrEmployeeVacationBalanceGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-position',
    component: HrPositionComponent,
    canActivate: [hrPositionGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-disciplinary',
    component: HrDisciplinaryComponent,
    canActivate: [hrDisciplinaryGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-financialDegree',
    component: HrFinancialDegreeComponent,
    canActivate: [hrFinancialDegreeGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-employeeFinancialDegree',
    component: HrEmployeeFinancialDegreeComponent,
    canActivate: [hrEmployeeFinancialDegreeGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-employeeِAppraisal',
    component: HrEmployeeAppraisalComponent,
    canActivate: [hrEmployeeAppraisalGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },

  {
    path: 'hr-EmployeeDisciplinary',
    component: HrEmployeeDisciplinaryComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },

  {
    path: 'hr-employee-position',
    component: HrEmployeePositionComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },

  {
    path: 'hr-employee',
    component: HrEmployeeComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'EmployeeQualification',
    component: HrEmployeeQualificationComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },

  /*********************End Hr modules شئون العاميلن***************************/

  /*********************start Hr-attendance module  الحضور والانصراف***************************/

  {
    path: 'hr-AttendanceHome',
    component: HrAttendancHomeComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-AttendancePermission',
    component: HrAttendancePermissionComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-attendanceMachine',
    component: HrAttendanceMachineComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-attendanceMachineWorkPlace',
    component: HrAttendanceMachineWorkPlaceComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-attendanceSchedule',
    component: HrAttendanceScheduleComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-employeeAttendanceSchedule',
    component: HrEmployeeAttendanceScheduleComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-EmployeeAttendancePermission',
    component: HrEmployeeAttendancePermissionComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },
  {
    path: 'hr-EmployeeAttendance',
    component: HrEmployeeAttendanceComponent,
    canActivate: [productSerialGuard],
    data: { PageLsit: [PagesEnums.PRODUCT_SERIAL] },
  },

  /*********************End Hr-attendance module  الحضور والانصراف***************************/
  /*********************start TR   التدريب***************************/

  { path: 'TR-Instructor', component: TrInstructorComponent },
  { path: 'Tr-CourseType', component: TrCourseTypeComponent },
  { path: 'Tr-ClassRoom', component: TrClassRoomComponent },
  { path: 'TrTrainee', component: TrTraineeComponent },
  { path: 'TrPlan', component: TrPlanComponent },

  /*********************start TR   التدريب***************************/

  /*********************start py module  المرتبات***************************/

  //  { path: 'pyHome', component:  },
  { path: 'PyInstallment', component: PyInstallmentComponent },
  { path: 'PyItem', component: PyItemComponent },
  /*********************End Hr-attendance module  الحضور والانصراف***************************/

  /*********************start TR   التدريب***************************/

  { path: 'Tr-ClassRoom', component: TrClassRoomComponent },
  { path: 'TrTrainee', component: TrTraineeComponent },
  { path: 'TR-Instructor', component: TrInstructorComponent },
  { path: 'Tr-CourseCategory', component: TrCourseCategoryComponent },
  { path: 'Tr-CoporteClient', component: TrCoporteClientComponent },
  { path: 'Tr-CourseType', component: TrCourseTypeComponent },
  { path: 'Tr-Course', component: TrCourseComponent },
  { path: 'Tr-InstructorCourse', component: TrInstructorCourseComponent },
  { path: 'Tr-TrainingCenter', component: TrTrainingCenterComponent },
  { path: 'Tr-trainingCenterCourse', component: TrTrainingCenterCourseComponent },
  { path: 'TrTrack', component: TrTrackContainerComponent },
  { path: 'TrPlanCourseData', component: TrPlanCourseDataComponent },
  { path: 'Tr-Purpose', component: TrPurposeComponent },

  /*********************End  TR   التدريب***************************/

  /*********************start py module  المرتبات***************************/
  { path: 'pyHome', component: PyHomeComponent },
  { path: 'PyInstallment', component: PyInstallmentComponent },
  { path: 'PyItem', component: PyItemComponent },
  { path: 'Py-Exchange', component: PyExchangeContainerComponent },
  { path: 'PyItemCategory', component: PyItemCategoryComponent },
  { path: 'pytaxbracket', component: PyTaxBracketComponent },
  { path: 'PyItemGroup', component: PyGroupComponent },
  /*********************End py module  المرتبات***************************/

  //  report section
  { path: 'report', component: StrReportComponent },
  { path: 'add-item-report', component: StrReportAddItemComponent },
  // error section
  // { path: '**', component: ErrorComponent },



  ////////////////////////////////CC///////////////////
  
  { path: 'Cc-activity', component: CcActivityComponent },
  
  { path: 'Cc-Function', component: CcFunctionComponent },
  
  { path: 'Cc-Region', component: CcRegionComponent },
  { path: 'Cc-SubRegion', component: CcSubRegionComponent },
  { path: 'Cc-plant', component: CcPlantComponent},
  
  { path: 'Cc-Source', component: CcSourceComponent },
  

  { path: 'Cc-PlantComponent', component: CcPlantComponentComponent },
  { path: 'Cc-Equipment',component:CcEquipmentComponent},

],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
