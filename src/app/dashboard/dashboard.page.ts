import { Component, OnInit } from '@angular/core';

import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private api:ApiService,private storage:Storage) {
   
  }
  header_title="Dashboard";
  dashboard:any={
    "total_users":"",
    "total_artist":"",
    "new_artist_request":"",
    "total_tracks":"",
   }
  ngOnInit() {
  

   
    /*this.api.get_dashboard().then((result) => {
     this.dashboard.total_users = result["total_users"];
     this.dashboard.total_artist = result["total_artist"];
     this.dashboard.new_artist_request = result["new_artist_request"];
     this.dashboard.total_tracks = result["total_tracks"];
    
    }, (err) => {
     
    });*/
  }
 
}
