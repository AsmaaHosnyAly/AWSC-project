// import { HrPositionComponent } from './hr-position/hr-position.component';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrGroupHomeComponent } from './str/str-group-home/str-group-home.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { storeGuard } from './guards/store.guard';
import { STRUnitsComponent } from './str/str-units/str-units.component';
import { STRGradeComponent } from './str/str-grade/str-grade.component';
import { StrCostcenterComponent } from './str/str-costcenter/str-costcenter.component';
// import { StrItemComponent } from './STR_item/STR_item..component';
import { StrGroupComponent } from './str/str-group/str-group.component';
import { StrStoreComponent } from './str/str-store/str-store.component';
import { STRPlatoonComponent } from './str/str-platoon/str-platoon.component';
import { STRHomeComponent } from './str/str-home/str-home.component';
import { StrCommodityComponent } from './str/STR_Commodity/STR_Commodity.component';
import { STRPlatoon1Component } from './str/str-platoon1/str-platoon1.component';
import { StrOpeningStockContainerComponent } from './str/str-opening-stock-container/str-opening-stock-container.component';
import { StrReportComponent } from './str/str-report/str-report.component';
import { StrEmployeeExchangeContainerComponent } from './str/str-employee-exchange-container/str-employee-exchange-container.component';
import { STRGroup1Component } from './str/str-group1/str-group1.component';
import { STRItem1Component } from './str/str-item1/str-item1.component';
import { STREmployeeOpeningCustodyComponent } from './str/str-employee-opening-custody/str-employee-opening-custody.component';
import { StrProductComponent } from './str/str-product/str-product.component';
import { FiEntryContainerComponent } from './fi/fi-entry-container/fi-entry-container.component';
import { StrWithdrawContainerComponent } from './str/str-withdraw-container/str-withdraw-container.component';
import { FIAccountComponent } from './fi/fi-account/fi-account.component';
import { FIAccountHierarchyComponent } from './fi/fi-account-hierarchy/fi-account-hierarchy.component';
import { FIEntrySourceComponent } from './fi/fi-entry-source/fi-entry-source.component';
import { FIEntrySourceTypeComponent } from './fi/fi-entry-source-type/fi-entry-source-type.component';
import { StrReportAddItemComponent } from './str/str-report-add-item/str-report-add-item.component';
import { FIAccountParentComponent } from './fi/fi-account-parent/fi-account-parent.component';
import { FiAccountItemComponent } from './fi/fi-account-item/fi-account-item.component';
import { FIJournalComponent } from './fi/fi-journal/fi-journal.component';
import { STRAddContainerComponent } from './str/str-add-container/str-add-container.component';
import { HrCityComponent } from './hr/hr-city/hr-city.component';
import { HrCityStateComponent } from './hr/hr-city-state/hr-city-state.component';
import { HrQualitativeGroupComponent } from './hr/hr-qualitative-group/hr-qualitative-group.component';
import { HrWorkPlaceComponent } from './hr/hr-work-place/hr-work-place.component';
import { HrSpecializationComponent } from './hr/hr-specialization/hr-specialization.component';

import { StrVendorComponent } from './str/str-vendor/str-vendor.component';
import { HrJobTitleComponent } from './hr/hr-job-title/hr-job-title.component';
import { HrPositionComponent } from './hr/hr-position/hr-position.component';
import { StrAccountsComponent } from './str/str-accounts/str-accounts.component';
import { StrEmployeesComponent } from './str/str-employees/str-employees.component';
import { HrMillitryStateComponent } from './hr/hr-millitry-state/hr-millitry-state.component';
import { HrVacationComponent } from './hr/hr-vacation/hr-vacation.component';
import { HrIncentiveAllowanceComponent } from './hr/hr-incentive-allowance/hr-incentive-allowance.component';
import { HrHiringTypeComponent } from './hr/hr-hiring-type/hr-hiring-type.component';
import { HrSeveranceReasonComponent } from './hr/hr-severance-reason/hr-severance-reason.component';
import { HrQualificationComponent } from './hr/hr-qualification/hr-qualification.component';
import { HrEmployeeVacationComponent } from './hr/hr-employee-vacation/hr-employee-vacation.component';
import { HrEmployeeVacationBalanceComponent } from './hr/hr-employee-vacation-balance/hr-employee-vacation-balance.component';
import { HrDisciplinaryComponent } from './hr/hr-disciplinary/hr-disciplinary.component';
import { HrEmployeeDisciplinaryComponent } from './hr/hr-employee-disciplinary/hr-employee-disciplinary.component';
import { PrGroupTableComponent } from './pr/pr-group-table/pr-group-table.component';
import { StrModelComponent, vendor } from './str/str-model/str-model.component';
import { MenubarComponent } from './menubar/menubar.component';
import { PrUserTableComponent } from './pr/pr-user-table/pr-user-table.component';
import { rolesGuard } from './guards/roles.guard';
import { withdrawGuard } from './guards/withdraw.guard';
import { sTRAddGuard } from './guards/stradd.guard';
import { strOpeningStockGuard } from './guards/str-opening-stock.guard';
import { employeeOpeningGuard } from './guards/employee-opening.guard';
import { employeeOpeningCustodyGuard } from './guards/employee-opening-custody.guard';
import { prUserGuard } from './guards/pr-user.guard';
import { unitGuard } from './guards/unit.guard';
import { commodityGuard } from './guards/commodity.guard';
import { costCenterGuard } from './guards/cost-center.guard';
import { gradeGuard } from './guards/grade.guard';
import { group1Guard } from './guards/group1.guard';
import { items1Guard } from './guards/items1.guard';
import { modelGuard } from './guards/model.guard';
import { prGroupGuard } from './guards/pr-group.guard';
import { productsGuard } from './guards/products.guard';
import { storesGuard } from './guards/stores.guard';
import { strPlatoonGuard } from './guards/str-platoon.guard';
import { vendorGuard } from './guards/vendor.guard';
import { PrHomeComponent } from './pr/pr-home/pr-home.component';
import { StrStockTakingContainerComponent } from './str/str-stock-taking-container/str-stock-taking-container.component';
import { PageRolesComponent } from './pages/page-roles/page-roles.component';
import { HotkeyModule } from 'angular2-hotkeys/public-api';
import { PagesEnums } from './core/enums/pages.enum';
import { StrProudctSerialComponent } from "../app/str/str-proudct-serial/str-proudct-serial.component";
import { StrUserstoreComponent } from './str-userstore/str-userstore.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MenubarComponent,
    canActivate: [      storeGuard,     
    ],
    data: { 
          },
    // data2:{roles:['18','19']},
    children: [
    
      {
        path: 'withdraw',
        component: StrWithdrawContainerComponent,
        canActivate: [withdrawGuard],
        data: { PageLsit: [PagesEnums.WITHDRAW] },
      },

      {
        path: 'STRAdd',
        component: STRAddContainerComponent,
        canActivate:[sTRAddGuard],
        data: { PageLsit: [PagesEnums.STRAdd] },
      }, //table filter done
      {
        path: 'str-openingStock',
        component: StrOpeningStockContainerComponent,
        canActivate:[strOpeningStockGuard],
        data: { PageLsit: [PagesEnums.STR_OPENING_STOCK] },
      },
      {
        path: 'employeeOpening',
        component: StrEmployeeExchangeContainerComponent,
        canActivate:[employeeOpeningGuard],
        data: { PageLsit: [PagesEnums.EMPLOYEE_OPENING] },

      },
      {
        path: 'commodity',
        component: StrCommodityComponent,
        canActivate: [commodityGuard],
        data: { PageLsit: [PagesEnums.COMMODITY] },
      },
      { path: 'grade', component: STRGradeComponent },
      {
        path: 'str-platoon',
        component: STRPlatoonComponent,
      },
      {
        path: 'group1',
        component: STRGroup1Component,
      },
      { path: 'unit', component: STRUnitsComponent },
      {
        path: 'items1',
        component: STRItem1Component,
      },
      {
        path: 'products',
        component: StrProductComponent,
      },
      {
        path: 'home',
        component: StrGroupHomeComponent,
      },
      { path: 'store', component: StrStoreComponent },
      {
        path: 'costCenter',
        component: StrCostcenterComponent,
      },
      {
        path: 'EmployeeOpeningCustody',
        component: STREmployeeOpeningCustodyComponent,
      },
      {
        path: 'groupBannel',
        component: StrGroupComponent,
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

      

      { path: 'home', component: StrGroupHomeComponent },
      // { path: 'groupOpening', component: StrOpeningStockContainerComponent },
      {
        path: 'employeeOpening',
        component: StrEmployeeExchangeContainerComponent,
      },
      { path: 'groupBannel', component: StrGroupComponent },

      { path: 'grade', component: STRGradeComponent },
      { path: 'home', component: StrGroupHomeComponent },
      { path: 'pr-home', component: PrHomeComponent },
      // { path: 'groupOpening', component: StrOpeningStockContainerComponent },
      {
        path: 'employeeOpening',
        component: StrEmployeeExchangeContainerComponent,
      },
      { path: 'groupBannel', component: StrGroupComponent },
      { path: 'unit', component: STRUnitsComponent },
      { path: 'grade', component: STRGradeComponent },
      { path: 'costCenter', component: StrCostcenterComponent },
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

      // main screens
      { path: 'str-home', component: STRHomeComponent },
      { path: 'hr-home', component: StrEmployeesComponent },
      { path: 'fi-home', component: StrAccountsComponent },

      { path: 'stock-taking', component: StrStockTakingContainerComponent },
      { path: 'pr-group', component: PrGroupTableComponent },
      { path: 'pr-user', component: PrUserTableComponent },
      
      { path: 'product-serial', component: StrProudctSerialComponent },


  {path:'StrStockTaking',component: StrStockTakingContainerComponent},
  { path:'struserstore' ,component: StrUserstoreComponent},
      // { path: '**', component: ErrorComponent },
    ],
  },
  // {
  //   path: 'it',
  //   component: PageRolesComponent,
  //   canActivate: [
  //     rolesGuard
  //   ],
  //   data: {  role2: ['18'] },
  //   // data2:{roles:['18','19']},
  //   children: [
      
  //   
  //   ],
  // },
];

@NgModule({  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
 
})
export class AppRoutingModule {}
