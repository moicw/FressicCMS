import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController,NavController } from '@ionic/angular';
import { Dimensions, ImageCroppedEvent, ImageTransform,base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-mytracks',
  templateUrl: './mytracks.page.html',
  styleUrls: ['./mytracks.page.scss'],
})
export class MytracksPage implements OnInit {
  profileUrl: Observable<string | null>;  
  constructor(private navCtrl:NavController,private alertController:AlertController, private localstorage:Storage,private storage: AngularFireStorage,private api: ApiService) { }
  header_title="My Track";
  filelist = []
  user_info:any;
  lastResponse:any = [];
  data:any = [];
  track_info:any;

  selected_track_info:any;
  selected_track:any;
  selected_artist:any;
  selected_ethnic:any;
  upload_track_cover:any;
  artist_uid:any;
  track ={
    track_id:"",
    track_title:"",
    track_language:"",
    track_genre:"",
    track_lyric:"",
  }
  ngOnInit() {
    this.localstorage.create();
    this.localstorage.get('uid').then((result) => {
     let uid = result;
     this.artist_uid = uid;
     this.api.get_artist_request_track(uid).then((result_track) => {
      this.track_info = result_track;
    
      for(let i = 0; i < this.track_info.length; i++)
      {
        let track_id = this.track_info[i];
       
        this.api.getTrackLink(uid,track_id["trackid"]).then((result_tracklink) => {
          let track_list:any;
          track_list = result_tracklink;
        
         track_id["track"] =result_tracklink;
         }, (err) => {
          
         });
         
      }
    
     //this.selected_track_info = this.track_info[0];
    //console.log(this.track_info);
  
    });
    });

     
  }

  load_more()
  {
    this.api.nextApprovedArtistPage(this.lastResponse).then((result) => {
      console.log(result);
      this.lastResponse = result["lastResponse"];
      let data = result["data"];
      for(let i = 0; i< data.length;i++)
      {
        this.user_info.push(data[i]);
      }
      
    }, (err) => {
      
     });
  }


  /*******  ARTIST HANDLING PART ********/
  edit_artist(uid,user)
  {
    this.selected_artist = user;
    document.getElementById("edit_modal").style.display =  "block";

     /* this.api.get_artist_request_track(uid).then((result_track) => {
        this.track_info = result_track;
      
        for(let i = 0; i < this.track_info.length; i++)
        {
          let track_id = this.track_info[i];
         */
          this.api.getUserLink(uid).then((result_userlink) => {
          
            this.selected_artist.image = result_userlink;
          
         
           }, (err) => {
            
           });
           /*
        }
      
       this.selected_track_info = this.track_info[0];
       this.selected_author = user;
        
    });*/
    
  }
  save_track()
  {
  let id = this.makeid(20)
   const file = base64ToFile(this.croppedImage);   
   this.startPickedFileUpload(file,id,"cover_image");
   this.compressImage(this.croppedImage, 300, 300).then(compressed => {
    const new_file = base64ToFile(compressed.toString()); 
    this.startPickedFileUpload(new_file,id,"cover_image_small");
  })
  this.previewFileUpload(id,"preview");
  this.fullFileUpload(id,"audio");
  this.track.track_id = id;
   //{
   this.api.add_new_track(this.artist_uid,this.track).then((user_stat) => {
      
      this.close_edit_modal();
      console.log(user_stat);
      this.ngOnInit();
    }, (err) => {
          console.log()  
    });
  }
  compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      }
      img.onerror = error => rej(error);
    })
  }
   makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
   }
   return result;
}
  startPickedFileUpload(file,id,name) {
    let path = "/musics/"+this.artist_uid+"/"+id+"/"+name+".jpg";
    const ref = this.storage.ref(path);
    let task = this.storage.upload(path, file);
   
    }
  previewFileUpload(id,name) {
  let path = "/musics/"+this.artist_uid+"/"+id+"/"+name+".mp3";
    const ref = this.storage.ref(path);
    let task = this.storage.upload(path, (<HTMLInputElement>document.getElementById("preview_track")).files[0]);
  
  }
  fullFileUpload(id,name) {
    let path = "/musics/"+this.artist_uid+"/"+id+"/"+name+".mp3";
      const ref = this.storage.ref(path);
      let task = this.storage.upload(path, (<HTMLInputElement>document.getElementById("full_track")).files[0]);
    
    }

  close_edit_modal()
  {
    document.getElementById("edit_modal").style.display =  "none";
  
  }
  
  
  async approve_newartist(uid)
  {
    let any_track_approve = false;
    this.api.get_artist_request_track(uid).then((result_track) => {
      let total_track:any;
      total_track = result_track;
      for(let i = 0; i<total_track.length;i++)
      {
        let each_track = total_track[i];
        console.log(each_track["track_approve"]);
        if(each_track["track_approve"] == true)
        {
          any_track_approve = true;
        }
      }
      
    
  
    });
    if(any_track_approve == false)
    {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Track is not approve!',
        message: 'Please approve track before approve the artist',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            
            }
          }, {
            text: 'OK',
            handler: () => {
            
            }
          }
        ]
      });
      await alert.present();
    }
    else
    {

    
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Approve this artist?',
        message: 'Confirm to approve this artist request?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            
            }
          }, {
            text: 'OK',
            handler: () => {
              this.api.approve_newartist(uid).then((user_stat) => {
                this.ngOnInit();
              }, (err) => {
                      
              });
            }
          }
        ]
      });
      await alert.present();
    }

    

  }
  async reject_newartist(uid)
  {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Reject this artist?',
      message: 'Confirm to reject this artist request?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
           
          }
        }, {
          text: 'OK',
          handler: () => {
            this.api.reject_newartist(uid).then((user_stat) => {
             
            }, (err) => {
                    
            });
          }
        }
      ]
    });

    await alert.present();
  }

  /*******  TRACK HANDLING PART ********/

  selected_track_to_play(num,source)
  {
    
    var audio = <HTMLVideoElement>document.getElementById("audio_player"+num);
    audio.src=source;
    audio.play();
  }

  close_music_modal()
  {
    document.getElementById("track_Modal").style.display =  "none";
    var audio = <HTMLVideoElement>document.getElementById("audio_player");
    audio.pause();
    audio.src="";
    var audio_preview = <HTMLVideoElement>document.getElementById("audio_player_preview");
    audio_preview.pause();
    audio_preview.src="";
  }

  listen_track(uid,user)
  {
    
    document.getElementById("track_Modal").style.display =  "block";
   
      this.api.get_artist_request_track(uid).then((result_track) => {
        this.track_info = result_track;
      
        for(let i = 0; i < this.track_info.length; i++)
        {
          let track_id = this.track_info[i];
         
          this.api.getTrackLink(uid,track_id["trackid"]).then((result_tracklink) => {
            let track_list:any;
            track_list = result_tracklink;
          
           track_id["track"] =result_tracklink;
           }, (err) => {
            
           });
           
        }
      
       this.selected_track_info = this.track_info[0];
       this.selected_artist = user;
    
      });
  }

  async approve_newtrack()
  {
   
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Approve this track?',
      message: 'Confirm to approve this track request?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
           
          }
        }, {
          text: 'OK',
          handler: () => {
            //this.selected_track_info.track_approve =true;
         
            this.api.approve_tracks(this.selected_artist,this.selected_track_info).then((user_stat) => {
              this.ngOnInit();
              this.close_music_modal();
            }, (err) => {
                    
            });
          }
        }
      ]
    });

    await alert.present();
   
  }

 
  getFileList() {
    const ref = this.storage.ref('').child('musics').child('test');
    let myurlsubscription = ref.listAll().subscribe((data) => {
      for (let i = 0; i < data.items.length; i++) {
        let name = data.items[i].name;
        let path = "/musics/test/"+data.items[i].name;
       
        let newref = this.storage.ref(path);
      
        newref.getDownloadURL().subscribe((data) => {
          this.filelist.push({
            name: name,
            link: data
          });
        }, (error) => {
          // Handle error here
          // Show popup with errors or just console.error
          console.error(error);
        });
      }
      console.log(this.filelist);
    });
  }
  audioPlay(e) {
      let eAudio = document.getElementsByTagName('audio')
      if (eAudio && eAudio.length > 0) {
      for (var i = 0; i < eAudio.length; i++) {
        if(e.target !== eAudio[i]){
          eAudio[i].pause(); 
        }
      }
    }
  }
  reupload_artist()
  {
   document.getElementById("artist_cover").click();
  }

  fileChanged(event) {
    const files = event.target.files;
    console.log(files);
    const imgData = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // this.imageURL = reader.result;
      const form = new FormData();
      form.append('image', imgData);
      this.upload_track_cover = reader.result as string;
      const randomId = Math.random().toString(36).substring(2);
      //let ref = this.storage.ref(randomId);
      //let task = ref.put(event.target.files[0]);
      this.storage.upload('/users/a5N5KNuJr1SbtBOtzryOnZjzc1i1/profile_image/abc', event.target.files[0]);  
  /* uploadProgress = this.task.snapshotChanges()
    .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));*/
      /*this.loadCtrL.create({
        message: 'Please Wait...',
        spinner: 'lines'
      }).then(elementEl => {
        elementEl.present();
        this.httpClient.post('https://api.imgbb.com/1/upload?key=' + this.imgBBKey, form).subscribe(res => {
          elementEl.dismiss();
          console.log(res);
          if (res['status'] === 200) {
            this.imageURL = res['data'].display_url;
          }
        }, (err) => {
          elementEl.dismiss();
          if (err) {
            this.presentAlert('err: ' + err['error'].error.code, err['error'].error.message);
          }
        });
      });*/
    };
    //this.selected_artist.image.artist_cover_image = URL.createObjectURL(files);//event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
  }



  //Submit New
  submit_new_track()
  {
    this.selected_track = null;
    document.getElementById("edit_modal").style.display =  "block";
    console.log(this.track);
   
  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      //console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
      this.showCropper = true;
      console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
      console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
      console.log('Load failed');
  }

  rotateLeft() {
      this.canvasRotation--;
      this.flipAfterRotate();
  }

  rotateRight() {
      this.canvasRotation++;
      this.flipAfterRotate();
  }

  private flipAfterRotate() {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
          ...this.transform,
          flipH: flippedV,
          flipV: flippedH
      };
  }


  flipHorizontal() {
      this.transform = {
          ...this.transform,
          flipH: !this.transform.flipH
      };
  }

  flipVertical() {
      this.transform = {
          ...this.transform,
          flipV: !this.transform.flipV
      };
  }

  resetImage() {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
  }

  zoomOut() {
      this.scale -= .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  zoomIn() {
      this.scale += .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  toggleContainWithinAspectRatio() {
      this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
      this.transform = {
          ...this.transform,
          rotate: this.rotation
      };
  }
}
