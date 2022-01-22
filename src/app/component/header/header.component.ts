import { Component, OnInit ,Input} from '@angular/core';
import { MenuController,PopoverController } from '@ionic/angular';
import { ProfileComponent } from '../profile/profile.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(public menu:MenuController,public popoverCtrl:PopoverController) {
    
   }
  @Input() title: any;


  ngOnInit() {
    this.menu.enable(true);
  }
  async presentPopover(event) {
    const popover = await this.popoverCtrl.create({
      event,
      component: ProfileComponent,
      translucent: true,
      cssClass: "popover_class",
      componentProps: {
        onClick: () => {
          popover.dismiss();
        },
      },
      //scssClass: 'my-custom-class' // optional
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
