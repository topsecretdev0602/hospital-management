import { Component, Input, Output, Injector, ChangeDetectorRef, Inject, OnChanges } from "@angular/core";
import { BillingReceiptModel, DischargeDetailsVM } from '../shared/billing-receipt.model';
//sud:5May'18--BackButtonDisable is not working as expected, correct and implement later
//import { BackButtonDisable } from "../../core/shared/backbutton-disable.service";
import { BillingBLService } from "../shared/billing.bl.service";
import { BillingService } from "../shared/billing.service";
import { CoreService } from "../../core/shared/core.service";
import { HttpClient } from '@angular/common/http';
import { NepaliCalendarService } from "../../shared/calendar/np/nepali-calendar.service";
import { DanpheHTTPResponse } from "../../shared/common-models";
import * as moment from 'moment/moment';
import { CommonFunctions } from "../../shared/common.functions";


@Component({
  selector: "ip-billing-receipt",
  templateUrl: "./ip-billing-receipt.html",
})
export class IPBillingReceiptComponent {

  @Input("receipt")
  public receipt: BillingReceiptModel = new BillingReceiptModel();


  @Input("showPrintBtn")
  public showPrintBtn: boolean = true;
  public localDateTime: string;
  public taxLabel: string;
  public currencyUnit: string;
  public patientQRCodeInfo: string = "";
  public showQrCode: boolean = false;
  public printSize: string = "A4";
  public indexNo: number = 0;
  //public setValOnInit = 

  constructor(
    public billingBLService: BillingBLService,
    public nepaliCalendarServ: NepaliCalendarService,
    public billingService: BillingService,
    public coreService: CoreService,
    public httpobj: HttpClient,
    public injector: Injector) {
    this.taxLabel = this.billingService.taxLabel;
    this.currencyUnit = this.billingService.currencyUnit;
  }



  @Input("receipt")
  public set value(_receipt: BillingReceiptModel) {
    if (_receipt) {
      this.receipt = _receipt;
      for (var i = 0; i < this.receipt.BillingItems.length; i++) {
        if (this.receipt.BillingItems[i].RequestedBy != null && this.receipt.BillingItems[i].RequestedBy > 0) {
          this.indexNo = i;
          break;
        }
      }
      //this.receipt.BillingItems
      let _tax = this.coreService.Masters.Taxes.find(tax => tax.TaxId == this.receipt.TaxId);
      if (_tax)
        this.taxLabel = _tax.TaxLabel;
    }
  }

  GetLocalDate(engDate: string): string {
    let npDate = this.nepaliCalendarServ.ConvertEngToNepDateString(engDate);
    return npDate + " BS";
  }

  print() {
    let popupWinindow;
    var printContents = document.getElementById("printpage").innerHTML;
    popupWinindow = window.open('', '_blank', 'width=1600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    //popupWinindow.document.write('<html><head><link href="../assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" /><link rel="stylesheet" type="text/css" href="../../themes/theme-default/DanpheStyle.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../themes/theme-default/DanpheStyle.css" /></head><body onload="window.print()">' + printContents + '</body></html>');

    popupWinindow.document.close();

    //add 1 to existing printcount.
    let printCount = this.receipt.PrintCount + 1;
    let recptNo = this.receipt.ReceiptNo;

    this.billingBLService.PutPrintCount(printCount, recptNo)
      .subscribe(res => {
        if (res.Status == "OK") {

        }
        else {

          //this.msgBoxServ.showMessage("failed", [res.ErrorMessage]);
        }
      });

  }

  ngOnInit() {
    if (this.receipt) {
      let invDate = this.receipt.BillingDate;
      this.receipt.InvIssueDateLocal = this.GetLocalDate(invDate);

      this.patientQRCodeInfo = `Name: ` + this.receipt.Patient.ShortName + `
            Hospital No: `+ '[' + this.receipt.Patient.PatientCode + ']' + `
            Invoice No: ` + this.receipt.CurrentFinYear + ` - ` + this.receipt.InvoiceCode + this.receipt.InvoiceNo;
      this.showQrCode = true;

      this.receipt.ReceiptType = "discharge-receipt";

      if (this.receipt.VisitId) {
        this.GetDischargeBillInfo();
      }
      this.receipt.BillingItems.forEach(a => a.Price = CommonFunctions.parseAmount(a.Price));
    }
  }

  ngOnChanges() {
    if (this.receipt) {

      let invDate = this.receipt.BillingDate;
      this.receipt.InvIssueDateLocal = this.GetLocalDate(invDate);

      this.patientQRCodeInfo = `Name: ` + this.receipt.Patient.ShortName + `
            Hospital No: `+ '[' + this.receipt.Patient.PatientCode + ']' + `
            Invoice No: ` + this.receipt.CurrentFinYear + ` - ` + this.receipt.InvoiceCode + this.receipt.InvoiceNo;
      this.showQrCode = true;
    }
  }

  GetDischargeBillInfo() {

    this.billingBLService.GetAdditionalInfoForDischarge(this.receipt.VisitId, this.receipt.BillingTransactionId)
      .subscribe((res: DanpheHTTPResponse) => {

        if (res.Status == "OK") {
          this.receipt.DischargeDetails = res.Results;

          if (this.receipt.DischargeDetails.AdmissionInfo) {
            let admInfo = this.receipt.DischargeDetails.AdmissionInfo;
            admInfo.AdmissionDate = moment(admInfo.AdmissionDate).format("YYYY-MM-DD");
            admInfo.DischargeDate = moment(admInfo.DischargeDate).format("YYYY-MM-DD");
          }
        }

      });

  }

}
