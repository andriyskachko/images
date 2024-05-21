import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesComponent } from './images.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ImagesComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [ImagesComponent],
})
export class ImagesModule {}
