import { Component, OnInit, DoCheck, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';
import { Http } from "@angular/http";
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatAutocomplete } from '@angular/material';

@Component({
    selector: 'formly-ngx-autocomplete',
    styles: [`
  `],
    template: `
    <div [ngStyle]="{color:formControl.errors?'#f44336':'inherit'}">
        <md-input-container style="width: 100%">
            <input mdInput [placeholder]="to.placeholder" type="text" [(ngModel)]="value" (ngModelChange)="changed($event)" [disabled]="formControl.disabled" [mdAutocomplete]="autocomplete"/>
        </md-input-container>
        <md-autocomplete #autocomplete="mdAutocomplete" [displayWith]="displayFn">
            <md-option *ngFor="let item of items" [value]="item" (click)="clicked(item)" [mdTooltip]="to.tooltip && item.name" [mdTooltipPosition]="to.tooltip">{{item.name}}</md-option>
        </md-autocomplete>
    </div>
  `,
})
export class FormlyAutocompleteComponent extends FieldType implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    public items: any[] = [];
    public value: string = null;
    private lastInput: string = null;
    private sub: Subscription;
    private timeout: any;

    constructor(private http: Http, public dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    public ngOnInit() {
        this.to.disabled && this.formControl.disable();
        if (this.formControl.value) {
            this.value = this.formControl.value;
        }
        this.formControl.valueChanges.takeUntil(this.ngUnsubscribe).subscribe(x => {
            this.to.changed && this.to.changed(x);
            if (x && x.name) {
                this.value = x;
            }
        });
    }

    changed(e: any) {
        if (e && !e.name) {
            this.formControl.setValue(null);
            if (this.to.source) {
                this.sub && this.sub.unsubscribe();
                this.timeout && clearTimeout(this.timeout);
                if (e != this.lastInput) {
                    this.timeout = setTimeout(() => {
                        this.sub = this.to.source(e).first().subscribe(x => {
                            this.lastInput = e;
                            this.items = x;
                        });
                    }, this.to.debounceTime || 0);
                }
            }
        }
        else if (e && e.name) {
            this.value = e;
            this.formControl.setValue(e);
        }
        else if (!e) {
            this.timeout && clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.formControl.setValue(null);
                this.items = [];
                this.lastInput = e;
            }, this.to.debounceTime || 0);
            /*if (this.to.source && e != this.lastSearch) {
                this.sub && this.sub.unsubscribe();
                this.timeout && clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.sub = this.to.source(e).first().subscribe(x => {
                        this.lastSearch = e;
                        this.items = x;
                    });
                }, this.to.debounceTime || 0);
            }*/
        }
    }

    clicked(e: any) {
        if (e) {
            this.formControl.setValue(e);
            this.value = e;
        }
    }

    displayFn(e: any): string {
        return e ? e.name : null;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}