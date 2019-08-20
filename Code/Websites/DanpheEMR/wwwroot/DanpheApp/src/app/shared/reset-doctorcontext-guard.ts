﻿import { Injectable } from '@angular/core';
import { CanDeactivate, CanActivate } from '@angular/router';
import { NavigationService } from './navigation-service';
import { VisitService } from '../appointments/shared/visit.service';
import { PatientService } from '../patients/shared/patient.service';

@Injectable()
export class ResetDoctorcontextGuard<T> implements CanDeactivate<T>, CanActivate {
    constructor(public visitService: VisitService, public patientService: PatientService, public navService: NavigationService) {

    }
    canDeactivate() {
        this.patientService.CreateNewGlobal();
        this.visitService.CreateNewGlobal();
        this.navService.showSideNav = true;
        this.navService.showTopNav = true;
        return true;
    }

    canActivate() {
        if (this.visitService.getGlobal().PatientId && this.visitService.getGlobal().PatientVisitId) {
            this.navService.showSideNav = false;
            this.navService.showTopNav = false;
            return true;
        }
        else {
            alert("Error ! Please select a patient-visit first.");
            return false;
        }        
    }
}