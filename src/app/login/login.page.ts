import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage-angular';
import { DatashareService } from '../services/datashare.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email:string;// = "alvinmcwkk@gmail.com";
  password:string;// = "Mcwei1987";
  message:string;
  logininprogress = false;
  constructor(public datashare:DatashareService, public storage:Storage, public menu:MenuController,public navCtrl: NavController,public api:ApiService) { }
  ngOnInit() {
  }
  ionViewWillEnter() {
   
    this.menu.enable(false);
    this.storage.create();
    this.storage.get('name').then((result) => {
      this.api.check_login_state().then((result) => {
        if(result["is_loggedin"] == true)
        {
          this.storage.get('type').then((type) => {
            
              if(type == "admin")
              {
                this.navCtrl.navigateForward(['dashboard']);
              }
              else
              {
                this.navCtrl.navigateForward(['mytracks']);
              }
             
              
             
             }, (err) => {
              
             });
         
        }
       
        
       
       }, (err) => {
        
       });
    });
   
  }
 
  login()
  {
    this.message = "";
    this.logininprogress = true;
    this.email = (this.email).replace(/\s/g, "");
    this.api.login(this.email,this.password).then((result) => {
    
       
        let user = result;
      
      
        if(user["isAdmin"] == true)
        {
          this.datashare.isUserLoggedIn.next("admin");
          this.storage.create();
          this.storage.set('name', user["name"]);
          this.storage.set('uid', user["uid"]);
          this.storage.set('type', "admin");
          this.navCtrl.navigateForward(['dashboard']);
        
        }
        else
        {

          if(user["artist_verify"] == true)
          {
            this.datashare.isUserLoggedIn.next("artist");
            this.storage.create();
            this.storage.set('name', user["name"]);
            this.storage.set('uid', user["uid"]);
            this.storage.set('type', "artist");
            this.navCtrl.navigateForward(['mytracks']);

          }
          else
          {
            this.logininprogress = false;
            this.message = "Only verified artist is allowed";
          }
        }
     
     
     }, (err) => {
      if(err["status"] == "2")
      {
        this.logininprogress = false;
        this.message = err["error"];
      }
     });
    /*this.auth.signInWithEmailAndPassword(this.email,this.password).then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      
      this.db.collection("users").doc(user.uid).valueChanges().pipe(take(1)).subscribe(users => {
      
       
        if(users["artist_verify"] == "yes")
        {
        this.navCtrl.navigateForward(['dashboard'], navExtras);
        }
        else
        {
          this.message = "Only verified artist is allowed";
        }
        
      });
    
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if(errorCode = "auth/user-not-found")
        this.message = "User Not Found"
      console.log(errorCode);
    });
   
    let navExtras: NavigationExtras = {
      queryParams: {
          //currency: JSON.stringify(currency),
          //refresh: refresh
        }
    };*/
    //t
  }
}
