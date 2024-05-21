import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ImagesModule } from './images/images.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ImagesModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
