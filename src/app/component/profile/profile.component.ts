import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from '../../services/api.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user_name:string = "";
  public onClick = () => {}
  constructor(private storage:Storage, private api:ApiService,private navCtrl:NavController) { 
   
  }

  ngOnInit() {
    this.storage.create();
    this.storage.get('name').then((result) => {
     this.user_name = result;
    });
  }
  logout()
  {
    this.onClick();
    this.api.logout();
    this.storage.remove("name");
    this.storage.remove("uid");
    this.storage.remove("type");
    this.navCtrl.navigateRoot(['login']).then(
      window.location.reload
    );

    
    
  }
}
