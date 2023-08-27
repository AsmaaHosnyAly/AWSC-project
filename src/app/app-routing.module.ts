// import { HrPositionComponent } from './hr-position/hr-position.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrGroupHomeComponent } from './str-group-home/str-group-home.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { authGuard } from './shared/auth.guard';
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
import { StrVendorComponent } from './str-vendor/str-vendor.component';
import {HrJobTitleComponent  } from "./hr-job-title/hr-job-title.component";
import {HrPositionComponent  } from "./hr-position/hr-position.component";
import { StrAccountsComponent } from './str-accounts/str-accounts.component';
import { StrEmployeesComponent } from './str-employees/str-employees.component';



const routes: Routes = [
  //  {path: 'products',
  //  children: [
  //    {
  //      path: ':productID',
  //      component: ProductComponent,
  //    },
  //  ],} ,

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'jobTitle', component: HrJobTitleComponent },
  { path: 'position', component: HrPositionComponent },
  { path: 'commodity', component: StrCommodityComponent },
  { path: 'home', component: StrGroupHomeComponent },
  { path: 'groupOpening', component: StrOpeningStockContainerComponent },
  { path: 'employeeOpening', component: StrEmployeeExchangeContainerComponent },
  { path: 'groupBannel', component: StrGroupComponent },
  { path: 'unit', component: STRUnitsComponent },
  { path: 'grade', component: STRGradeComponent },
  { path: 'costCenter', component: StrCostcenterComponent },
  // { path: 'items', component: StrItemComponent },
  { path: 'products', component: StrProductComponent },
  { path: 'group', component: StrGroupComponent },
  { path: 'store', component: StrStoreComponent },
  { path: 'str-grade', component: STRGradeComponent },
  { path: 'str-platoon', component: STRPlatoonComponent },
  { path: 'str-platoon1', component: STRPlatoon1Component },
  { path: 'str-home', component: STRHomeComponent },
  { path: 'report', component: StrReportComponent },
  { path: 'AccountHierarchy', component: FIAccountHierarchyComponent },
  { path: 'EntrySource' , component: FIEntrySourceComponent},
  { path: 'EntrySourceType' , component: FIEntrySourceTypeComponent},
  { path: 'withdraw', component: StrWithdrawContainerComponent },
  { path: 'add-item-report', component: StrReportAddItemComponent },
  //  {path: 'products',
  //  children: [
  //    {
  //      path: ':productID',
  //      component: ProductComponent,
  //    },
  //  ],} ,
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'commodity', component: StrCommodityComponent },
  { path: 'AccountParent', component: FIAccountParentComponent },
  { path: 'FiAccountItem', component: FiAccountItemComponent },
  { path: 'FIJournal', component: FIJournalComponent },
  { path: 'STRAdd', component: STRAddContainerComponent },
  {path:'withdraw',component:StrWithdrawContainerComponent },
//  {path: 'products',
//  children: [
//    {
//      path: ':productID',
//      component: ProductComponent,
//    },
//  ],} ,
  { path: "", redirectTo: "login", pathMatch: "full" },
   {path:'login' , component:LoginComponent},
   {path:'commodity' , component:StrCommodityComponent},
  
  { path: "home", component: StrGroupHomeComponent},
  { path: "groupOpening", component: StrOpeningStockContainerComponent },
  { path: "employeeOpening", component: StrEmployeeExchangeContainerComponent },
  { path: "groupBannel", component: StrGroupComponent },
  { path: "unit", component:STRUnitsComponent},
  { path: "grade", component:STRGradeComponent },
  { path: 'home', component: StrGroupHomeComponent },
  { path: 'groupOpening', component: StrOpeningStockContainerComponent },
  { path: 'employeeOpening', component: StrEmployeeExchangeContainerComponent },
  { path: 'groupBannel', component: StrGroupComponent },
  { path: 'unit', component: STRUnitsComponent },
  { path: 'grade', component: STRGradeComponent },
  { path: 'costCenter', component: StrCostcenterComponent },
  //  { path: "items", component:StrItemComponent},
  { path: 'items1', component: STRItem1Component },
  { path: 'group', component: StrGroupComponent },
  { path: 'group1', component: STRGroup1Component },
  { path: 'store', component: StrStoreComponent },
  { path: 'str-grade', component: STRGradeComponent },
  { path: 'str-platoon', component: STRPlatoonComponent },
  { path: 'str-platoon1', component: STRPlatoon1Component },
  { path: 'str-home', component: STRHomeComponent },

  { path: 'str-employee', component: STREmployeeOpeningCustodyComponent },
  { path: 'str-vendor', component: StrVendorComponent},

  { path: 'fi-entry', component: FiEntryContainerComponent },
  { path: 'withdraw', component: StrWithdrawContainerComponent },
  { path: 'account', component: FIAccountComponent },

  // {path:'dashboard' , canActivateChild:[CanActivateChildGuard],children:[
  //   {path:''  , component:DashboardComponent  },
  //   {path:'profile'  , component:ProfileComponent},
  //   {path:'edit-profile'  , component:EditProfileComponent},

  // ]},

  {path:'str-account',component:StrAccountsComponent},
  {path:'str-employees',component:StrEmployeesComponent},
  
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
