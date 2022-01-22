import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
//import { ImageCropperModule } from 'ngx-image-cropper';

/*const config = {
  apiKey: "AIzaSyAGdB4nqJRRWrglpJjTuQd_NI4aNBYzT9M",
  authDomain: "pushnotification-977be.firebaseapp.com",
  databaseURL: "https://pushnotification-977be.firebaseio.com",
  projectId: "pushnotification-977be",
  storageBucket: "pushnotification-977be.appspot.com",
  messagingSenderId: "688750917315",
  appId: "1:688750917315:web:d589e242c10a1f338a9476"
};*/
//Fressic
const config = {
  apiKey: "AIzaSyAaX86OOEYLKPXlC4lCocfvw4oxG1qUmA8",
  authDomain: "fressic-3ae60.firebaseapp.com",
  databaseURL: "https://fressic-3ae60.firebaseio.com",
  projectId: "fressic-3ae60",
  storageBucket: "fressic-3ae60.appspot.com",
  messagingSenderId: "353459281698",
  appId: "1:353459281698:web:ed19c3f69cd0e9ee2b4f7b"
};


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    //ImageCropperModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule // storage
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
