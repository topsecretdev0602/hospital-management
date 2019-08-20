﻿import { Component, ChangeDetectorRef } from "@angular/core";

import PHRMGridColumns from '../shared/phrm-grid-columns';
import { GridEmitModel } from "../../shared/danphe-grid/grid-emit.model";

import { PHRMItemTypeModel } from "../shared/phrm-item-type.model";
import { PHRMCategoryModel } from "../shared/phrm-category.model"
import { PharmacyBLService } from "../shared/pharmacy.bl.service"
import { SecurityService } from '../../security/shared/security.service';
import { MessageboxService } from '../../shared/messagebox/messagebox.service';
import * as moment from 'moment/moment';

@Component({
    templateUrl: "../../view/pharmacy-view/Setting/PHRMItemTypeManage.html" // "/PharmacyView/PHRMItemTypeManage"

})

export class PHRMItemTypeManageComponent {
    public CurrentItemType: PHRMItemTypeModel = new PHRMItemTypeModel();
    public selectedItem: PHRMItemTypeModel = new PHRMItemTypeModel();
    public itemtypeList: Array<PHRMItemTypeModel> = new Array<PHRMItemTypeModel>();
    public categoryList: Array<PHRMCategoryModel> = new Array<PHRMCategoryModel>();
    public itemtypeGridColumns: Array<any> = null;
    public showItemTypeAddPage: boolean = false;
    public update: boolean = false;
    public index: number;

    constructor(
        public pharmacyBLService: PharmacyBLService,
        public securityService: SecurityService,
        public changeDetector: ChangeDetectorRef,
        public msgBoxServ: MessageboxService) {
        this.itemtypeGridColumns = PHRMGridColumns.PHRMItemTypeList;
        this.getItemTypeList();
        this.getCategorys();
    }

    public getItemTypeList() {
        this.pharmacyBLService.GetItemTypeList()
            .subscribe(res => {
                if (res.Status == "OK") {
                    this.itemtypeList = res.Results;
                }
                else {
                    alert("Failed ! " + res.ErrorMessage);
                    console.log(res.ErrorMessage)
                }
            });
    }

    public getCategorys() {
        this.pharmacyBLService.GetCategoryList()
            .subscribe(res => {
                if (res.Status == 'OK') {
                    if (res.Results.length) {
                        this.categoryList = res.Results;
                    }
                }
                else {
                    this.msgBoxServ.showMessage("error", ["Something Wrong " + res.ErrorMessage]);
                }
            },
            err => {
                this.msgBoxServ.showMessage("error", ["Something Wrong " + err.ErrorMessage]);
            });
    }

    ItemTypeGridActions($event: GridEmitModel) {
        switch ($event.Action) {
            case "edit": {
                this.selectedItem = null;
                this.update = true;
                this.index = $event.RowIndex;
                this.showItemTypeAddPage = false;
                this.changeDetector.detectChanges();
                this.selectedItem = $event.Data;
                this.CurrentItemType.ItemTypeId = this.selectedItem.ItemTypeId;
                this.CurrentItemType.CategoryId = this.selectedItem.CategoryId;
                this.CurrentItemType.ItemTypeName = this.selectedItem.ItemTypeName;
                this.CurrentItemType.Description = this.selectedItem.Description;
                this.CurrentItemType.IsActive = this.selectedItem.IsActive;
                this.showItemTypeAddPage = true;

                break;
            }
            case "activateDeactivateIsActive": {
                if ($event.Data != null) {
                    this.selectedItem = null;
                    this.selectedItem = $event.Data;
                    this.ActivateDeactivateStatus(this.selectedItem);
                    this.selectedItem = null;
                }
                break;
            }
            default:
                break;
        }
    }

    AddItemType() {
        this.showItemTypeAddPage = false;
        this.changeDetector.detectChanges();
        this.showItemTypeAddPage = true;
    }
    Add() {
        for (var i in this.CurrentItemType.ItemTypeValidator.controls) {
            this.CurrentItemType.ItemTypeValidator.controls[i].markAsDirty();
            this.CurrentItemType.ItemTypeValidator.controls[i].updateValueAndValidity();
        }
        if (this.CurrentItemType.IsValidCheck(undefined, undefined)) {
            this.CurrentItemType.CreatedBy = this.securityService.GetLoggedInUser().EmployeeId;
            this.pharmacyBLService.AddItemType(this.CurrentItemType)
                .subscribe(
                res => {
                    if (res.Status == "OK") {
                        this.msgBoxServ.showMessage("success", ["Item Type Added."]);
                        this.CallBackAddUpdate(res)
                        this.CurrentItemType = new PHRMItemTypeModel();
                    }
                    else {
                        this.msgBoxServ.showMessage("error", ["Something Wrong" + res.ErrorMessage]);
                    }
                },
                err => {
                    this.msgBoxServ.showMessage("error", ["Something Wrong" + err.ErrorMessage]);
                });
        }
    }

    Update() {
        for (var i in this.CurrentItemType.ItemTypeValidator.controls) {
            this.CurrentItemType.ItemTypeValidator.controls[i].markAsDirty();
            this.CurrentItemType.ItemTypeValidator.controls[i].updateValueAndValidity();
        }
        if (this.CurrentItemType.IsValidCheck(undefined, undefined)) {
            this.pharmacyBLService.UpdateItemType(this.CurrentItemType)
                .subscribe(
                res => {
                    if (res.Status == "OK") {
                        this.msgBoxServ.showMessage("success", ['Item Type Details Updated.']);
                        this.CallBackAddUpdate(res)
                        this.CurrentItemType = new PHRMItemTypeModel();
                    }
                    else {
                        this.msgBoxServ.showMessage("failed", ["Something Wrong " + res.ErrorMessage]);
                    }
                },
                err => {
                    this.msgBoxServ.showMessage("error", ["Something Wrong " + err.ErrorMessage]);
                });
        }
    }

    CallBackAddUpdate(res) {
        if (res.Status == "OK") {
            var itemtype: any = {};
            itemtype.ItemTypeId = res.Results.ItemTypeId;
            itemtype.CategoryId = res.Results.CategoryId;
            itemtype.ItemTypeName = res.Results.ItemTypeName;
            itemtype.Description = res.Results.Description;
            itemtype.IsActive = res.Results.IsActive;
            for (let cat of this.categoryList) {
                if (cat.CategoryId == res.Results.CategoryId) {
                    itemtype.CategoryName = cat.CategoryName;
                    break;
                }
            };
            this.CallBackAdd(itemtype);
        }
        else {
            this.msgBoxServ.showMessage("error", ['some error ' + res.ErrorMessage]);
        }
    }

    CallBackAdd(itmtype: PHRMItemTypeModel) {
        this.itemtypeList.push(itmtype);
        if (this.index != null)
            this.itemtypeList.splice(this.index, 1);
        this.itemtypeList = this.itemtypeList.slice();
        this.changeDetector.detectChanges();
        this.showItemTypeAddPage = false;
        this.selectedItem = null;
        this.index = null;
    }
    ActivateDeactivateStatus(currItemType: PHRMItemTypeModel) {
        if (currItemType != null) {
            let status = currItemType.IsActive == true ? false : true;
            let msg = status == true ? 'Activate' : 'Deactivate';
            if (confirm("Are you Sure want to " + msg + ' ' + currItemType.ItemTypeName + ' ?')) {
                currItemType.IsActive = status;
                this.pharmacyBLService.UpdateItemType(currItemType)
                    .subscribe(
                    res => {
                        if (res.Status == "OK") {
                            let responseMessage = res.Results.IsActive ? "Item-Type is now activated." : "Item-Type is now Deactivated.";
                            this.msgBoxServ.showMessage("success", [responseMessage]);
                            this.getItemTypeList();
                        }
                        else {
                            this.msgBoxServ.showMessage("error", ['Something wrong' + res.ErrorMessage]);
                        }
                    },
                    err => {
                        this.msgBoxServ.showMessage("error", ["Something Wrong " + err.ErrorMessage]);
                    });
            }
            //to refresh the checkbox if we cancel the prompt
            //this.getItemTypeList();
        }
    }
    Close() {
        this.CurrentItemType = new PHRMItemTypeModel();
        this.selectedItem = null;
        this.update = false;
        this.showItemTypeAddPage = false;
    }
}