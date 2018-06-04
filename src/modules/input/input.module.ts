import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormlyInputComponent } from './input.component';
import { MatInputModule, MatAutocompleteModule } from '@angular/material';
//import { InputFormat } from './input.pipe';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatAutocompleteModule
	],
	declarations: [FormlyInputComponent],
	exports: [FormlyInputComponent],
})
export class FormlyInputModule {
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: FormlyInputModule, providers: []
		};
	}
}