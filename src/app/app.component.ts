import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DatashareService } from './services/datashare.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
   
    /*{ title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },*/
  ];
  constructor(private datashare:DatashareService, private storage:Storage, private api: ApiService, private navctrl:NavController) {
    this.storage.create();
    this.datashare.isUserLoggedIn.subscribe( value => {
      
      if(value == "admin")
      {
        this.appPages = [
          { title: 'Dashboard', url: '/dashboard', icon: 'home' },
          { title: 'Tracks', url: '', icon: 'musical-notes', child:
           [
                    {
                      title: 'New Uploaded Tracks',
                      url: '/tracks',
                      icon: 'musical-notes',
                    }/*,
                    {
                      title: 'Rejected',
                      url: '/artist-rejected',
                      icon: 'person-remove',
                    }*/
           ]},
           { title: 'Artist', url: '', icon: 'person', child:
           [
                    {
                      title: 'New Request',
                      url: '/artist-request',
                      icon: 'person',
                    },
                    {
                      title: 'Approved',
                      url: '/artist-approved',
                      icon: 'person-add',
                    }/*,
                    {
                      title: 'Rejected',
                      url: '/artist-rejected',
                      icon: 'person-remove',
                    }*/
           ]}
          ]
      }
      else
      {
        this.appPages = [
          { title: 'My Tracks', url: '/mytracks', icon: 'musical-notes' }
         ]
      }
    });
    this.storage.get('type').then((result) => {
      console.log(result);
      if(result == "admin")
      {
        this.appPages = [
          { title: 'Dashboard', url: '/dashboard', icon: 'home' },
          { title: 'Tracks', url: '', icon: 'musical-notes', child:
           [
                  
                    {
                      title: 'New Uploaded Tracks',
                      url: '/tracks',
                      icon: 'musical-notes',
                    }/*,
                    {
                      title: 'Rejected',
                      url: '/artist-rejected',
                      icon: 'person-remove',
                    }*/
           ]},
          { title: 'Artist', url: '', icon: 'person', child:
           [
                    {
                      title: 'New Request',
                      url: '/artist-request',
                      icon: 'person',
                    },
                    {
                      title: 'Approved',
                      url: '/artist-approved',
                      icon: 'person-add',
                    }/*,
                    {
                      title: 'Rejected',
                      url: '/artist-rejected',
                      icon: 'person-remove',
                    }*/
           ]}]
      }
      else
      {
        this.appPages = [
          { title: 'My Tracks', url: '/mytracks', icon: 'musical-notes' }
         ]
      }
    });
    
    /*this.api.check_login_state().then((result) => {
      if(result["is_loggedin"] == false)
      {
     
        this.navctrl.navigateRoot('/login');
      }
     
      
     
     }, (err) => {
      
     });*/
     
    
    /*const things = db.collection('users').valueChanges();
    things.subscribe(console.log);*/
  }

}
