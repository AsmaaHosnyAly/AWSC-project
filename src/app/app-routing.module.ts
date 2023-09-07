// import { HrPositionComponent } from './hr-position/hr-position.component';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrGroupHomeComponent } from './str-group-home/str-group-home.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { authGuard } from './guards/auth.guard';
import { STRUnitsComponent } from './str-units/str-units.component';
import { STRGradeComponent } from './str-grade/str-grade.component';
import { StrCostcenterComponent } from './str-costcenter/str-costcenter.component';
// import { StrItemComponent } from './STR_item/STR_item..component';
import { StrGroupComponent } from './str-group/str-group.component';
import { StrStoreComponent } from './str-store/str-store.component';
import { STRPlatoonComponent } from './str-platoon/str-platoon.component';
import { STRHomeComponent } from './str-home/str-home.component';
import { StrCommodityComponent } from './STR_Commodity/STR_Commodity.component';
import { STRPlatoon1Component } from './str-platoon1/str-platoon1.component';
import { StrOpeningStockContainerComponent } from './str-opening-stock-container/str-opening-stock-container.component';
import { StrReportComponent } from './str-report/str-report.component';
import { StrEmployeeExchangeContainerComponent } from './str-employee-exchange-container/str-employee-exchange-container.component';
import { STRGroup1Component } from './str-group1/str-group1.component';
import { STRItem1Component } from './str-item1/str-item1.component';
import { STREmployeeOpeningCustodyComponent } from './str-employee-opening-custody/str-employee-opening-custody.component';
import { StrProductComponent } from './str-product/str-product.component';
import { FiEntryContainerComponent } from './fi-entry-container/fi-entry-container.component';
import { StrWithdrawContainerComponent } from './str-withdraw-container/str-withdraw-container.component';
import { FIAccountComponent } from './fi-account/fi-account.component';
import { FIAccountHierarchyComponent } from './fi-account-hierarchy/fi-account-hierarchy.component';
import { FIEntrySourceComponent } from './fi-entry-source/fi-entry-source.component';
import { FIEntrySourceTypeComponent } from './fi-entry-source-type/fi-entry-source-type.component';
import { StrReportAddItemComponent } from './str-report-add-item/str-report-add-item.component';
import { FIAccountParentComponent } from './fi-account-parent/fi-account-parent.component';
import { FiAccountItemComponent } from './fi-account-item/fi-account-item.component';
import { FIJournalComponent } from './fi-journal/fi-journal.component';
import { STRAddContainerComponent } from './str-add-container/str-add-container.component';
import { HrCityComponent } from './hr-city/hr-city.component';
import { HrCityStateComponent } from './hr-city-state/hr-city-state.component';
import { HrQualitativeGroupComponent } from './hr-qualitative-group/hr-qualitative-group.component';
import { HrWorkPlaceComponent } from './hr-work-place/hr-work-place.component';
import { HrSpecializationComponent } from './hr-specialization/hr-specialization.component';

import { StrVendorComponent } from './str-vendor/str-vendor.component';
import { HrJobTitleComponent } from './hr-job-title/hr-job-title.component';
import { HrPositionComponent } from './hr-position/hr-position.component';
import { StrAccountsComponent } from './str-accounts/str-accounts.component';
import { StrEmployeesComponent } from './str-employees/str-employees.component';
import { HrMillitryStateComponent } from './hr-millitry-state/hr-millitry-state.component';
import { HrVacationComponent } from './hr-vacation/hr-vacation.component';
import { HrIncentiveAllowanceComponent } from './hr-incentive-allowance/hr-incentive-allowance.component';
import { HrHiringTypeComponent } from './hr-hiring-type/hr-hiring-type.component';
import { HrSeveranceReasonComponent } from './hr-severance-reason/hr-severance-reason.component';
import { HrQualificationComponent } from './hr-qualification/hr-qualification.component';
import { HrEmployeeVacationComponent } from './hr-employee-vacation/hr-employee-vacation.component';
import { HrEmployeeVacationBalanceComponent } from './hr-employee-vacation-balance/hr-employee-vacation-balance.component';
import { HrDisciplinaryComponent } from './hr-disciplinary/hr-disciplinary.component';
import { HrEmployeeDisciplinaryComponent } from './hr-employee-disciplinary/hr-employee-disciplinary.component';
import { PrGroupTableComponent } from './pr-group-table/pr-group-table.component';
import { StrModelComponent } from './str-model/str-model.component';
import { MenubarComponent } from './menubar/menubar.component';
import { PrUserTableComponent } from './pr-user-table/pr-user-table.component';
import { rolesGuard } from './guards/roles.guard';
import { withdrawGuard } from './guards/withdraw.guard';
import { sTRAddGuard } from './guards/stradd.guard';
import { strOpeningStockGuard } from './guards/str-opening-stock.guard';
import { employeeOpeningGuard } from './guards/employee-opening.guard';
import { employeeOpeningCustodyGuard } from './guards/employee-opening-custody.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MenubarComponent,
    canActivate: [
      rolesGuard,
      sTRAddGuard,
      authGuard,
      withdrawGuard,
      strOpeningStockGuard,
      employeeOpeningGuard,
      employeeOpeningCustodyGuard
    ],
    children: [
      {
        path: 'withdraw',
        component: StrWithdrawContainerComponent,
        canActivate: [authGuard, withdrawGuard],
      },
      {
        path: 'STRAdd',
        component: STRAddContainerComponent,
        canActivate: [authGuard, sTRAddGuard],
      }, //table filter done
      {
        path: 'str-openingStock',
        component: StrOpeningStockContainerComponent,
        canActivate: [authGuard],
      },
      {
        path: 'employeeOpening',
        component: StrEmployeeExchangeContainerComponent,
        canActivate: [authGuard],
      },
      {
        path: 'commodity',
        component: StrCommodityComponent,
        canActivate: [authGuard],
      },
      { path: 'grade', component: STRGradeComponent, canActivate: [authGuard] },
      {
        path: 'str-platoon',
        component: STRPlatoonComponent,
        canActivate: [authGuard],
      },
      {
        path: 'group1',
        component: STRGroup1Component,
        canActivate: [authGuard],
      },
      { path: 'unit', component: STRUnitsComponent, canActivate: [authGuard] },
      {
        path: 'items1',
        component: STRItem1Component,
        canActivate: [authGuard],
      },
      {
        path: 'products',
        component: StrProductComponent,
        canActivate: [authGuard],
      },
      {
        path: 'home',
        component: StrGroupHomeComponent,
        canActivate: [authGuard],
      },
      { path: 'store', component: StrStoreComponent, canActivate: [authGuard] },
      {
        path: 'costCenter',
        component: StrCostcenterComponent,
        canActivate: [authGuard],
      },
      {
        path: 'EmployeeOpeningCustody',
        component: STREmployeeOpeningCustodyComponent,
        canActivate: [authGuard],
      },
      {
        path: 'groupBannel',
        component: StrGroupComponent,
        canActivate: [authGuard],
      },

      // { path: 'items', component: StrItemComponent },

      { path: 'group', component: StrGroupComponent },

      { path: 'str-grade', component: STRGradeComponent },

      { path: 'str-platoon1', component: STRPlatoon1Component },

      { path: 'report', component: StrReportComponent },
      { path: 'AccountHierarchy', component: FIAccountHierarchyComponent },
      { path: 'EntrySource', component: FIEntrySourceComponent },
      { path: 'EntrySourceType', component: FIEntrySourceTypeComponent },
      //table filter done
      { path: 'add-item-report', component: StrReportAddItemComponent },
      { path: 'AccountParent', component: FIAccountParentComponent },
      { path: 'FiAccountItem', component: FiAccountItemComponent },
      { path: 'FIJournal', component: FIJournalComponent },

      { path: 'city', component: HrCityComponent },
      { path: 'cityState', component: HrCityStateComponent },
      { path: 'QualitativeGroup', component: HrQualitativeGroupComponent },
      { path: 'WorkPlace', component: HrWorkPlaceComponent },
      { path: 'specialization', component: HrSpecializationComponent },

      { path: 'withdraw', component: StrWithdrawContainerComponent },
      { path: 'commodity', component: StrCommodityComponent },

      { path: 'home', component: StrGroupHomeComponent },
      // { path: 'groupOpening', component: StrOpeningStockContainerComponent },
      {
        path: 'employeeOpening',
        component: StrEmployeeExchangeContainerComponent,
      },
      { path: 'groupBannel', component: StrGroupComponent },

      { path: 'grade', component: STRGradeComponent },
      { path: 'home', component: StrGroupHomeComponent },
      // { path: 'groupOpening', component: StrOpeningStockContainerComponent },
      {
        path: 'employeeOpening',
        component: StrEmployeeExchangeContainerComponent,
      },
      { path: 'groupBannel', component: StrGroupComponent },
      { path: 'unit', component: STRUnitsComponent },
      { path: 'grade', component: STRGradeComponent },
      { path: 'costCenter', component: StrCostcenterComponent },
      //  { path: "items", component:StrItemComponent},
      // { path: "", redirectTo: "login", pathMatch: "full" },

      { path: 'str-vendor', component: StrVendorComponent },
      { path: 'str-model', component: StrModelComponent },
      { path: 'fi-entry', component: FiEntryContainerComponent }, //table filter waiting to design
      { path: 'account', component: FIAccountComponent },

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
      { path: 'hr-disciplinary', component: HrDisciplinaryComponent },

      {
        path: 'hr-EmployeeDisciplinary',
        component: HrEmployeeDisciplinaryComponent,
      },

      { path: 'pr-group', component: PrGroupTableComponent },
      { path: 'pr-user', component: PrUserTableComponent },

      // { path: '**', component: ErrorComponent },
    ],
  },

  // main screens
  { path: 'str-home', component: STRHomeComponent },
  { path: 'hr-home', component: StrEmployeesComponent },
  { path: 'fi-home', component: StrAccountsComponent },
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
  // {path:'fi-home',component:StrAccountsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
