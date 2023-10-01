import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrGroupHomeComponent } from './modules/str/index/str-group-home/str-group-home.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { storeGuard } from './core/guards/store.guard';
import { STRUnitsComponent } from './modules/str/index/str-units/str-units.component';
import { STRGradeComponent } from './modules/str/index/str-grade/str-grade.component';
import { StrCostcenterComponent } from './modules/str/index/str-costcenter/str-costcenter.component';
// import { StrItemComponent } from './modules/str/index_item/STR_item..component';
import { StrGroupComponent } from './modules/str/index/str-group/str-group.component';
import { StrStoreComponent } from './modules/str/index/str-store/str-store.component';
import { STRPlatoonComponent } from './modules/str/index/str-platoon/str-platoon.component';
import { STRHomeComponent } from './modules/str/index/str-home/str-home.component';
import { StrCommodityComponent } from './modules/str/index/STR_Commodity/STR_Commodity.component';
import { STRPlatoon1Component } from './modules/str/index/str-platoon1/str-platoon1.component';
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
import { StrEmployeesComponent } from './modules/hr/hr-home/str-employees.component';
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
import { MenubarComponent } from './menubar/menubar.component';
import { PrUserTableComponent } from './modules/pr/index/pr-user-table/pr-user-table.component';
import { rolesGuard } from './core/guards/roles.guard';
import { withdrawGuard } from './core/guards/withdraw.guard';
import { sTRAddGuard } from './core/guards/stradd.guard';
import { strOpeningStockGuard } from './core/guards/str-opening-stock.guard';
import { employeeOpeningGuard } from './core/guards/employee-opening.guard';
import { employeeOpeningCustodyGuard } from './core/guards/employee-opening-custody.guard';
import { prUserGuard } from './core/guards/pr-user.guard';
import { unitGuard } from './core/guards/unit.guard';
import { commodityGuard } from './core/guards/commodity.guard';
import { costCenterGuard } from './core/guards/cost-center.guard';
import { gradeGuard } from './core/guards/grade.guard';
import { group1Guard } from './core/guards/group1.guard';
import { items1Guard } from './core/guards/items1.guard';
import { modelGuard } from './core/guards/model.guard';
import { prGroupGuard } from './core/guards/pr-group.guard';
import { productsGuard } from './core/guards/products.guard';
import { storesGuard } from './core/guards/stores.guard';
import { strPlatoonGuard } from './core/guards/str-platoon.guard';
import { vendorGuard } from './core/guards/vendor.guard';
import { PrHomeComponent } from './modules/pr/index/pr-home/pr-home.component';
import { StrStockTakingContainerComponent } from './modules/str/index/str-stock-taking-container/str-stock-taking-container.component';
import { PageRolesComponent } from './pages/page-roles/page-roles.component';
import { HotkeyModule } from 'angular2-hotkeys/public-api';
import { PagesEnums } from './core/enums/pages.enum';
import { StrProudctSerialComponent } from './modules/str/index/str-proudct-serial/str-proudct-serial.component';
import { StrUserstoreComponent } from './modules/str/index/str-userstore/str-userstore.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MenubarComponent,
    canActivate: [storeGuard],
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
      }, //table filter done
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
      { path: 'str-vendor', component: StrVendorComponent },

      { path: 'str-model', component: StrModelComponent },
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
      { path: 'product-serial', component: StrProudctSerialComponent },
      /***********************end store modules المخازن **********************/

      /***********************Start account modules الحسابات **********************/
      { path: 'fi-home', component: StrAccountsComponent },
      { path: 'AccountHierarchy', component: FIAccountHierarchyComponent },
      { path: 'EntrySource', component: FIEntrySourceComponent },
      { path: 'EntrySourceType', component: FIEntrySourceTypeComponent },
      { path: 'AccountParent', component: FIAccountParentComponent },
      { path: 'FiAccountItem', component: FiAccountItemComponent },
      { path: 'FIJournal', component: FIJournalComponent },
      { path: 'fi-entry', component: FiEntryContainerComponent },
      { path: 'account', component: FIAccountComponent },
      /**********************End account modules الحسابات **********************/

      /*******************Start Roles modules الصلاحيات************************/

      { path: 'pr-home', component: PrHomeComponent },
      { path: 'pr-group', component: PrGroupTableComponent },
      { path: 'pr-user', component: PrUserTableComponent },
      /*********************End Roles modules الصلاحيات***************************/

      /*********************Start Hr modules شئون العاميلن***************************/
      { path: 'hr-home', component: StrEmployeesComponent },
      { path: 'city', component: HrCityComponent },
      { path: 'cityState', component: HrCityStateComponent },
      { path: 'QualitativeGroup', component: HrQualitativeGroupComponent },
      { path: 'WorkPlace', component: HrWorkPlaceComponent },
      { path: 'specialization', component: HrSpecializationComponent },
      { path: 'hr-jobTitle', component: HrJobTitleComponent },
      { path: 'hr-position', component: HrPositionComponent },
      { path: 'hr-MillitryState', component: HrMillitryStateComponent },
      { path: 'hr-vacation', component: HrVacationComponent },
      { path: 'hr-incentive', component: HrIncentiveAllowanceComponent },
      { path: 'hr-hiringType', component: HrHiringTypeComponent },
      { path: 'SeveranceReason', component: HrSeveranceReasonComponent },
      { path: 'Qualification', component: HrQualificationComponent },
      { path: 'hr-employeeVacation', component: HrEmployeeVacationComponent }, //waiting back to update
      {
        path: 'hr-employeeVacationBalance',
        component: HrEmployeeVacationBalanceComponent,
      },
      { path: 'hr-position', component: HrPositionComponent },
      { path: 'hr-disciplinary', component: HrDisciplinaryComponent },

      {
        path: 'hr-EmployeeDisciplinary',
        component: HrEmployeeDisciplinaryComponent,
      },
      { path: 'StrStockTaking', component: StrStockTakingContainerComponent },
      { path: 'struserstore', component: StrUserstoreComponent },

      /*********************End Hr modules شئون العاميلن***************************/

      //  report section
      { path: 'report', component: StrReportComponent },
      { path: 'add-item-report', component: StrReportAddItemComponent },

      // error section
      { path: '**', component: ErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
