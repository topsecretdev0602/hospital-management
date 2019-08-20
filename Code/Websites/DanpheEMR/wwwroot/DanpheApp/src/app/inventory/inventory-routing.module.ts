import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { InventoryComponent } from "./inventory.component";
// import { ExternalMainComponent } from "./external/external-main.component";
import { InternalMainComponent } from "./internal/internal-main.component";
// import { PurchaseOrderItemsComponent } from "./external/purchase-order-items.component";
// import { PurchaseOrderListComponent } from "./external/purchase-order-list.component";
// import { PurchaseOrderDetailsComponent } from "./external/purchase-order-details.component";
// import { GoodsReceiptItemComponent } from "./external/goods-receipt-item.component";
// import { GoodsReceiptListComponent } from "./external/goods-receipt-list.component";
// import { GoodsReceiptDetailsComponent } from "./external/goods-receipt-details.component";
import { RequisitionItemsComponent } from "./internal/requisition-items.component";
import { DispatchItemsComponent } from "./internal/dispatch-items.component"
import { RequisitionListComponent } from "./internal/requisition-list.component";
import { WriteOffItemsComponent } from "./internal/write-off-items.component"
import { RequisitionDetailsComponent } from "./internal/requisition-details.component"
import { ReturnToVendorItemsComponent } from "./procurement/return-to-vendor/return-to-vendor-items.component";
import { StockMainComponent } from "./stock/stock-main.component";
import { StockListComponent } from "./stock/stock-list.component";
import { StockDetailsComponent } from "./stock/stock-details.component";
import { StockManageComponent } from "./stock/stock-manage.component";
import { DispatchAllComponent } from "./internal/dispatch-all.component";

import { InventoryDashboardComponent } from '../dashboards/inventory/inventory-dashboard.component';
// import { GoodsReceiptAddComponent } from './external/goods-receipt-add.component';
import { ReturnToVendorListComponent } from './procurement/return-to-vendor/return-to-vendor-list.component';
import { ReturnToVendorDetailsComponent } from './procurement/return-to-vendor/return-to-vendor-details.component';
import { PHRMWriteOffListComponent } from '../pharmacy/stock/phrm-write-off-items-list.component';
import { WriteOffItemsListComponent } from './internal/write-off-items-list.component';
import { AuthGuardService } from '../security/shared/auth-guard.service';
// import { RequestForQuotationComponent } from './external/request-for-quotation.component';
// import { RequestForQuotationItemsComponent } from './external/request-for-quotation-items.component';
import { ProcurementMainComponent } from './procurement/procurement-main.component';
import { PurchaseOrderItems } from './shared/purchase-order-items.model';
import { PurchaseOrderListComponent } from './procurement/purchase-order-list.component';
import { PurchaseOrderDetailsComponent } from './procurement/purchase-order-details.component';
import { GoodsReceiptItemComponent } from './procurement/goods-receipt-item.component';
import { GoodsReceiptListComponent } from './procurement/goods-receipt-list.component';
import { GoodsReceiptDetailsComponent } from './procurement/goods-receipt-details.component';
import { GoodsReceiptAddComponent } from './procurement/goods-receipt-add.component';
import { RequestForQuotationComponent } from './procurement/request-for-quotation.component';
import { RequestForQuotationItemsComponent } from './procurement/request-for-quotation-items.component';
import { PurchaseOrderItemsComponent } from './procurement/purchase-order-items.component';
import { QuotationItemsComponent } from './procurement/quotation-items.component';
import { QuotationComponent } from './procurement/quotation.component';
import { QuotationAnalysisComponent } from './procurement/quotation-analysis.component';
import { VendorsListComponent } from './procurement/vendorslist.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',//this is : '/Inventory'
        component: InventoryComponent, canActivate: [AuthGuardService],
        children: [

          { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
          { path: 'Dashboard', component: InventoryDashboardComponent, canActivate: [AuthGuardService] },
          {
            path: 'InternalMain',
            component: InternalMainComponent, canActivate: [AuthGuardService],
            children: [
              { path: '', redirectTo: 'RequisitionList', pathMatch: 'full' },
              { path: 'Requisition', component: RequisitionItemsComponent },
              { path: 'Dispatch', component: DispatchItemsComponent },
              { path: 'RequisitionList', component: RequisitionListComponent },
              { path: 'WriteOffItems', component: WriteOffItemsComponent },
              { path: 'RequisitionDetails', component: RequisitionDetailsComponent },
              { path: 'WriteOffItemsList', component: WriteOffItemsListComponent },
              { path: 'DispatchAll', component: DispatchAllComponent }
            ]
          },
          {
            path: 'ProcurementMain',
            component: ProcurementMainComponent, canActivate: [AuthGuardService],
            children: [
              { path: '', redirectTo: 'PurchaseOrderList', pathMatch: 'full' },
              { path: 'PurchaseOrderItems', component: PurchaseOrderItemsComponent, canActivate: [AuthGuardService] },
              { path: 'PurchaseOrderList', component: PurchaseOrderListComponent, canActivate: [AuthGuardService] },
              { path: 'PurchaseOrderDetails', component: PurchaseOrderDetailsComponent, canActivate: [AuthGuardService] },
              { path: 'GoodsReceiptItems', component: GoodsReceiptItemComponent, canActivate: [AuthGuardService] },
              { path: 'GoodsReceiptList', component: GoodsReceiptListComponent, canActivate: [AuthGuardService] },
              { path: 'GoodsReceiptDetails', component: GoodsReceiptDetailsComponent, canActivate: [AuthGuardService] },
              { path: 'GoodsReceiptAdd', component: GoodsReceiptAddComponent },
              { path: 'RequestForQuotation', component: RequestForQuotationComponent },
              { path: 'RequestForQuotationItems', component: RequestForQuotationItemsComponent },
              { path: 'Quotation', component: QuotationComponent },
              { path: 'QuotationItems', component: QuotationItemsComponent },
              { path: 'QuotationAnalysis', component: QuotationAnalysisComponent },
              { path: 'ReturnToVendorItems', component: ReturnToVendorItemsComponent },
              { path: 'ReturnToVendorListItems', component: ReturnToVendorListComponent },
              { path: 'ReturnToVendorDetails', component: ReturnToVendorDetailsComponent },
              { path: 'VendorsList', component: VendorsListComponent },
            ]
          },
          {
            path: 'StockMain', component: StockMainComponent, canActivate: [AuthGuardService],
            children: [
              { path: '', redirectTo: 'StockList', pathMatch: 'full' },
              { path: 'StockList', component: StockListComponent, canActivate: [AuthGuardService] },
              { path: 'StockDetails', component: StockDetailsComponent, canActivate: [AuthGuardService] },
              { path: 'StockManage', component: StockManageComponent, canActivate: [AuthGuardService] }
            ]
          },
          { path: 'Reports', loadChildren: './reports/inventory-reports.module#InventoryReportsModule', canActivate: [AuthGuardService] },
          { path: 'Settings', loadChildren: './settings/inventory-settings.module#InventorySettingsModule' },
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class InventoryRoutingModule {

}
