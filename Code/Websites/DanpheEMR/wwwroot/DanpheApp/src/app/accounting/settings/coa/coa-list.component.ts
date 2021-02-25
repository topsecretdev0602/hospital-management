import { Component } from "@angular/core";
import { GridEmitModel } from "../../../shared/danphe-grid/grid-emit.model";
import GridColumnSettings from "../../../shared/danphe-grid/grid-column-settings.constant";
import { MessageboxService } from "../../../shared/messagebox/messagebox.service";
import { AccountingSettingsBLService } from "../shared/accounting-settings.bl.service";
import { ChartofAccountModel } from "../shared/chart-of-account.model";

@Component({
    templateUrl: './coa-list.html'
})
export class COAListComponent {

    public coaList: Array<any> = new Array<any>();
    public showcoaList: boolean = true;
    public coaGridColumns: Array<any> = null;
    public showAddPage: boolean = false;

    //
    public coaObj: ChartofAccountModel = new ChartofAccountModel();
    public oldCoaObj: ChartofAccountModel = new ChartofAccountModel();

    public primaryGroupList: Array<any> = new Array<any>();

    public update: boolean = false;

    constructor(public accountingSettingsBLService: AccountingSettingsBLService,
        public msgBox: MessageboxService) {
        this.coaGridColumns = GridColumnSettings.coaList;
        this.getPrimaryGroupList();
        this.getCoaList();
    }

    public getCoaList() {
        this.accountingSettingsBLService.GetChartofAccount()
            .subscribe(res => {
                if (res.Status == "OK") {
                    this.coaList = res.Results;
                    this.showcoaList = true;
                }
                else {
                    this.msgBox.showMessage('Error', res.ErrorMessage);
                }

            });
    }
    public getPrimaryGroupList() {
        this.accountingSettingsBLService.getPrimaryGroupList()
            .subscribe(res => {
                if (res.Status == "OK") {
                    this.primaryGroupList = res.Results;
                }
                else {
                    this.msgBox.showMessage('Error', res.ErrorMessage);
                }

            });
    }
    COAGridActions($event: GridEmitModel) {

        switch ($event.Action) {
            case "edit": {
                this.coaObj.COACode = $event.Data.COACode;
                this.coaObj.ChartOfAccountId = $event.Data.ChartOfAccountId;
                this.coaObj.ChartOfAccountName = $event.Data.ChartOfAccountName;
                this.coaObj.Description = $event.Data.Description;
                this.coaObj.IsActive = $event.Data.IsActive;
                this.coaObj.PrimaryGroupId = $event.Data.PrimaryGroupId;
                this.update = true;
                this.showAddPage = true;
                this.oldCoaObj =  new ChartofAccountModel();
                this.oldCoaObj = Object.assign(this.oldCoaObj,this.coaObj);
                break;
            }
            default:
                break;
        }
    }
    AddCOAPopup() {
        this.showAddPage = true;
    }
    saveCOA() {
        let flag = true;
        let existingCOA = this.coaList.filter(c => c.PrimaryGroupId == this.coaObj.PrimaryGroupId && c.ChartOfAccountName == this.coaObj.ChartOfAccountName).length;

        flag = (existingCOA > 0) ? false : true;

        if (!flag) {
            this.showMessageBox("Error", "COA is already existed");
            return;
        }
        //for checking validations, marking all the fields as dirty and checking the validity.
        for (var i in this.coaObj.COAValidator.controls) {
            this.coaObj.COAValidator.controls[i].markAsDirty();
            this.coaObj.COAValidator.controls[i].updateValueAndValidity();
        }


        if (this.coaObj.IsValidCheck(undefined, undefined)) {
            this.accountingSettingsBLService.PostCOA(this.coaObj)
                .subscribe(
                    res => {
                        if (res.Status == "OK") {
                            this.getCoaList();
                            this.showMessageBox("success", "COA Added");
                            this.coaObj = new ChartofAccountModel();
                            this.showAddPage = false;
                        }

                    },
                    err => {
                        this.showMessageBox("Error", err);
                    });
        }


    }
    UpdateCOA() {
        let flag = true;
        if(this.coaObj.PrimaryGroupId != this.oldCoaObj.PrimaryGroupId || this.coaObj.ChartOfAccountName != this.oldCoaObj.ChartOfAccountName){
            
            let existingCOA = this.coaList.filter(c => (c.PrimaryGroupId == this.coaObj.PrimaryGroupId && c.ChartOfAccountName == this.coaObj.ChartOfAccountName) ).length;

            flag = (existingCOA > 0) ? false : true;
    
            if (!flag) {
                this.showMessageBox("Error", "COA is already existed");
                return;
            }
        }
       
        //for checking validations, marking all the fields as dirty and checking the validity.
        for (var i in this.coaObj.COAValidator.controls) {
            this.coaObj.COAValidator.controls[i].markAsDirty();
            this.coaObj.COAValidator.controls[i].updateValueAndValidity();
        }

        if (this.coaObj.IsValidCheck(undefined, undefined)) {
            this.accountingSettingsBLService.UpdateCOA(this.coaObj)
                .subscribe(
                    res => {
                        this.getCoaList();
                        this.showMessageBox("success", "COA Updated");
                        this.coaObj = new ChartofAccountModel();
                        this.showAddPage = false;
                        this.update = false;
                    },
                    err => {
                        this.showMessageBox("Error", err);
                    });
        }
        this.oldCoaObj =  new ChartofAccountModel();
    }
    showMessageBox(status: string, message: string) {
        this.msgBox.showMessage(status, [message]);
    }
    Close() {
        this.showAddPage = false;
        this.oldCoaObj =  new ChartofAccountModel();
        this.coaObj = new ChartofAccountModel();
    }
    PrimaryGroupChanged() {
        this.coaObj.PrimaryGroupId = +this.coaObj.PrimaryGroupId;
    }
}