import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from 'ng-formly';
import { Observable, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  JSON: any;
  model: any;
  form: FormGroup = new FormGroup({});
  chipsCollection: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['Argentina', 'Brazil', 'Italy', 'France', 'Germany', 'China', 'USA', 'England', 'Japan', 'Portugal', 'Canada', 'Mexico', 'Spain']);
  typesCollection: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    { name: 'Type 1', value: 1 },
    { name: 'Type 2', value: 2 },
    { name: 'Type 3', value: 3 },
  ]);
  subtypesCollection: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    { name: 'Fever', value: 1, type: 1, priority: 1 },
    { name: 'Cough', value: 2, type: 1, priority: 1 },
    { name: 'Hypotension', value: 3, type: 1, priority: 2 },
    { name: 'Dizziness', value: 4, type: 2, priority: 2 },
    { name: 'Hypertension', value: 5, type: 2, priority: 3 },
    { name: 'Chest pain', value: 6, type: 3, priority: 3 }
  ]);
  prioritiesCollection: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    { name: 'Low', value: 1 },
    { name: 'Normal', value: 2 },
    { name: 'High', value: 3 },
  ]);
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
  }

  ngOnInit() {
    this.JSON = (<any>window).JSON;
    this.model = {
      datetime: moment().format('DD-MM-YYYY HH:mm'),
      typeId: 1,
      subtypeId: 1,
      priorityId: 1,
      chips: "Argentina|Brazil|France",
      input1: "ARG",
      input2: null,
      checklist1: false,
      checklist2: true,
    }
  }

  formlyFields: FormlyFieldConfig[] = [
    {
      className: 'row',
      wrappers: ['card'],
      templateOptions: {
        title: 'Components',
        subtitle: 'Card #1',
      },
      fieldGroup: [
        {
          key: 'datetime',
          type: 'datetime',
          className: 'col-sm-3',
          templateOptions: {
            placeholder: 'Datetime',
            format: 'DD-MM-YYYY HH:mm',
            text_today: 'Today',
            mask: [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/]
          },
          validators: {
            validation: Validators.compose([(e) => {
              if (!e.value) {
                return { datetime: 'invalid' };
              }
              let valid = moment(e.value, 'DD-MM-YYYY HH:mm').isSameOrBefore(moment());
              valid = valid && e.value.indexOf('_') == -1;
              return valid ? null : { datetime: 'invalid' }
            }])
          }
        },
        {
          className: 'col-sm-3',
          key: 'typeId',
          type: 'select',
          wrapper: [],
          templateOptions: {
            placeholder: 'Type',
            nonull: true,
            source: this.typesCollection
          }
        },
        {
          className: 'col-sm-3',
          key: 'subtypeId',
          type: 'select',
          wrapper: [],
          templateOptions: {
            placeholder: 'Subtype',
            nonull: true,
            source: Observable.create(o => {
              let key = 'typeId';
              let val = this.model[key];
              let endpoint = this.subtypesCollection;
              endpoint.takeUntil(this.ngUnsubscribe).first().subscribe(y => {
                o.next(y);
              });
              this.form.valueChanges.takeUntil(this.ngUnsubscribe).map(x => x[key]).filter(x => x != val).subscribe(x => {
                endpoint.takeUntil(this.ngUnsubscribe).first().subscribe(y => {
                  val = x;
                  o.next(y);
                });
              });
            })
          }
        },
        {
          className: 'col-sm-3',
          key: 'priorityId',
          type: 'select',
          wrapper: [],
          templateOptions: {
            placeholder: 'Priority',
            disabled: true,
            nonull: true,
            //source: this.prioridadCollection
            source: Observable.create(o => {
              let key = 'subtypeId';
              let val = this.model[key];
              let endpoint = this.prioritiesCollection;
              endpoint.takeUntil(this.ngUnsubscribe).first().subscribe(y => {
                o.next(y);
              });
              this.form.valueChanges.takeUntil(this.ngUnsubscribe).map(x => x[key]).filter(x => x != val).subscribe(x => {
                endpoint.takeUntil(this.ngUnsubscribe).first().subscribe(y => {
                  val = x;
                  o.next(y);
                });
              });
            }),
            bind: Observable.create(o => {
              let key = 'subtypeId';
              let property = 'priority';
              let val = this.model[key];
              let result = this.subtypesCollection.takeUntil(this.ngUnsubscribe).first().subscribe(x => {
                o.next(x.filter(y => y.value == val)[0][property]);
              });
              this.form.valueChanges.takeUntil(this.ngUnsubscribe).map(x => x[key]).filter(x => x != val).subscribe(x => {
                val = x;
                let value = this.subtypesCollection.getValue().filter(y => y.value == x);
                if (value && value.length > 0) {
                  let result = value[0][property];
                  o.next(result);
                }
              });
            })
          }
        },
        {
          type: 'blank',
          className: 'col-xs-12',
        },
        {
          className: 'col-sm-3',
          key: 'chips',
          type: 'chips',
          templateOptions: {
            joinString: '|',
            source: this.chipsCollection,
            onlyAutocomplete: true,
            maxItems: 7,
            placeholder: "Press enter to add value"
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
        },
        {
          className: 'col-sm-3',
          key: 'input1',
          type: 'input',
          wrapper: [],
          templateOptions: {
            label: 'Input',
            disabled: true,
            source: this.chipsCollection,
            sourceFilter: (x) => {
              let arr = x.filter(x => x == 'Argentina');
              return arr;
            },
            format: (e: string) => e.trim().toUpperCase().replace(/(_|\W)+/g, '') // only uppercase alphanumeric allowed
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
        },
      ],
    },
    {
      className: '',
      wrappers: ['card'],
      templateOptions: {
        title: 'More Components',
        subtitle: 'Card #2'
      },
      fieldGroup: [
        {
          className: 'col-sm-4',
          key: 'input2',
          type: 'input',
          wrapper: [],
          templateOptions: {
            label: 'Input',
            placeholder: 'E-mail',
          },
          validators: {
            validation: Validators.compose([Validators.email])
          }
        },
        {
          className: 'col-sm-4',
          key: 'textarea',
          type: 'textarea',
          wrapper: [],
          templateOptions: {
            label: 'Input',
            placeholder: 'Comments',
            maxLength: 5
          }
        },
        {
          className: 'col-sm-2',
          key: 'checklist1',
          type: 'checklist',
          wrapper: [],
          templateOptions: {
            text: 'Short text',
          }
        },
        {
          className: 'col-sm-2',
          key: 'checklist2',
          type: 'checklist',
          wrapper: [],
          templateOptions: {
            text: 'Some checklist with lots of text',
          }
        },
      ]
    },
    {
      className: 'row',
      type: 'repeated-section',
      key: 'repeated',
      wrappers: ['card'],
      templateOptions: {
        title: 'Repeated Section',
        addText: 'Add Section',
        addIcon: 'fa fa-plus-square-o',
        removeText: 'Remove',
        removeIcon: 'fa fa-minus',
        class: null,
        canAdd: true,
        canRemove: true,
        // maxSections: 3, Cantidad maxima que se puede agregar, en este caso de adjuntos
      },
      fieldArray: {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-sm-3',
            key: 'chips',
            type: 'chips',
            templateOptions: {
              joinString: '|',
              source: this.chipsCollection,
              onlyAutocomplete: true,
              placeholder: "Press enter to add value"
            }
          },
          {
            className: 'col-sm-3',
            key: 'checklist',
            type: 'checklist',
            wrapper: [],
            templateOptions: {
              text: "I'm inside a repeated section!",
            }
          },
        ]
      }
    }
  ];

  submit() {
    console.log(this.model);
  }

  cancel() {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
