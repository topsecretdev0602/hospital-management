﻿
import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";

import { PackagingTypeModel } from '../shared/packaging-type.model';
import { InventorySettingBLService } from "../shared/inventory-settings.bl.service";

import { SecurityService } from '../../../security/shared/security.service';
//Parse, validate, manipulate, and display dates and times in JS.
import * as moment from 'moment/moment';
import { MessageboxService } from '../../../shared/messagebox/messagebox.service';


@Component({
    selector: 'packagingtype-add',
    templateUrl: './packaging-type-add.html'

})
export class PackagingTypeAddComponent {

    public showAddPage: boolean = false;
    @Input("selectedPackagingType")
    public selectedPackagingType: PackagingTypeModel;
    @Output("callback-add")
    callbackAdd: EventEmitter<Object> = new EventEmitter<Object>();
    public update: boolean = false;

    public CurrentPackagingType: PackagingTypeModel;
    public completepackagingtypelist: Array<PackagingTypeModel> = new Array<PackagingTypeModel>();
    public packagingtypelist: Array<PackagingTypeModel> = new Array<PackagingTypeModel>();


    constructor(public invSettingBL: InventorySettingBLService,
        public securityService: SecurityService,
        public changeDetector: ChangeDetectorRef, public msgBoxServ: MessageboxService) {

    }
    @Input("showAddPage")
    public set value(val: boolean) {
        this.showAddPage = val;
        if (this.selectedPackagingType) {
            this.update = true;
            this.CurrentPackagingType = Object.assign(this.CurrentPackagingType, this.selectedPackagingType);
            this.CurrentPackagingType.CreatedBy = this.securityService.GetLoggedInUser().EmployeeId;
            this.packagingtypelist = this.packagingtypelist.filter(itemcategory => (itemcategory.PackagingTypeId != this.selectedPackagingType.PackagingTypeId));
        }
        else {
            this.CurrentPackagingType = new PackagingTypeModel();
            this.CurrentPackagingType.CreatedBy = this.securityService.GetLoggedInUser().EmployeeId;
            this.update = false;
        }
    }




    //adding new department
    AddPackagingType() {
        //for checking validations, marking all the fields as dirty and checking the validity.
        for (var i in this.CurrentPackagingType.PackagingTypeValidator.controls) {
            this.CurrentPackagingType.PackagingTypeValidator.controls[i].markAsDirty();
            this.CurrentPackagingType.PackagingTypeValidator.controls[i].updateValueAndValidity();
        }


        if (this.CurrentPackagingType.IsValidCheck(undefined, undefined)) {
            this.invSettingBL.AddPackagingType(this.CurrentPackagingType)
                .subscribe(
                res => {
                    this.showMessageBox("success", "PackagingType Added");
                    this.CurrentPackagingType = new PackagingTypeModel();
                    this.CallBackAddPackagingType(res)
                },
                err => {
                    this.logError(err);
                });
        }
    }
    //adding new packagingtype
    Update() {
        //for checking validations, marking all the fields as dirty and checking the validity.
        for (var i in this.CurrentPackagingType.PackagingTypeValidator.controls) {
            this.CurrentPackagingType.PackagingTypeValidator.controls[i].markAsDirty();
            this.CurrentPackagingType.PackagingTypeValidator.controls[i].updateValueAndValidity();
        }

        if (this.CurrentPackagingType.IsValidCheck(undefined, undefined)) {
            this.invSettingBL.UpdatePackagingType(this.CurrentPackagingType)
                .subscribe(
                res => {
                    this.showMessageBox("success", "PackagingType Updated");
                    this.CurrentPackagingType = new PackagingTypeModel();
                    this.CallBackAddPackagingType(res)

                },
                err => {
                    this.logError(err);
                });
        }
    }

    Close() {
        this.callbackAdd.emit();
        this.selectedPackagingType = null;
        this.update = false;
        this.packagingtypelist = this.completepackagingtypelist;
        this.showAddPage = false;
    }

    //after adding Vendor is succesfully added  then this function is called.
    CallBackAddPackagingType(res) {
        if (res.Status == "OK") {
            this.callbackAdd.emit({ itemcategory: res.Results });



        }
        else {
            this.showMessageBox("error", "Check log for details");
            console.log(res.ErrorMessage);
        }
    }
    showMessageBox(status: string, message: string) {
        this.msgBoxServ.showMessage(status, [message]);
    }

    logError(err: any) {
        console.log(err);
    }



}