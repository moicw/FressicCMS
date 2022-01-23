import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { take } from 'rxjs/operators';
import { VariablesService } from './variables.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private db: AngularFirestore,private http: HttpClient, private auth:AngularFireAuth,private storage:AngularFireStorage, private variable:VariablesService) { }
  base_path = "https://fressicentertainment.com";
  appsecret = "6f34565d8423f6c4a5674efef65ea4dda88ab2ea0edcb448e46e1088e7d284bb";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  /*************** API Handle Error ***************/
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  
   /*************** Data Insertion ***************/
   sendemail(email, subject,content){
    let data = {
      "appsecret": this.appsecret,
      "email": email,
      "subject":subject,
      "content":content
    }

  
    return this.http
      .post(this.base_path+"/rest/external/sendemail.php", data, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
 
   
  }
  sendemail_data(email, subject,content){
   
    return new Promise((resolve, reject) => {
     
      this.sendemail(email, subject, content)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
      
  }

  check_login_state()
  {
    
    return new Promise((resolve, reject) => {
     
      this.auth.authState.pipe(take(1)).subscribe(res => {
        let state ={
          "is_loggedin":false
        }
        if (res && res.uid) {
          state.is_loggedin = true;
          
         
        } else {
          state.is_loggedin = false;
         
        }
        resolve(state);
      }, (err) => {
        reject(err);
      });
    });
  }
  logout()
  {
    this.auth.signOut();

  }
  login(email, password)
  {
    return new Promise((resolve, reject) => {
     
      this.auth.signInWithEmailAndPassword(email,password).then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
      
        this.db.collection("users").doc(user.uid).valueChanges({ idField: 'uid' }).pipe(take(1)).subscribe(users => {
        
          /*let message = {
            "status":"1",
            "user_info":""
          }
          message.user_info =JSON.stringify(users);*/
          resolve(users);
          
        });
      
      }, (error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        let message = {
          "status":"2",
          "error":""
        }
        
        if(errorCode = "auth/user-not-found")
          message.error = "User Not Found"
        reject(message);
      });
    });
    
  }

  get_dashboard()
  {
    return new Promise((resolve, reject) => {
     
      this.db.collection("users").valueChanges().pipe(take(1)).subscribe(users => {
      
      
        let total_users = users.length;
        let total_artist = 0;
        let new_artist_request = 0;
        let total_tracks = 0;
        users.forEach(element => {
          if(element.hasOwnProperty('artist_verify'))
          {
           if(element["artist_verify"] == true)
             total_artist++;
           else if(element["artist_verify"] == false)
            new_artist_request++;
          }
          total_tracks = 0;
         
        });
        let json_val:any = {
         "total_users":total_users,
         "total_artist":total_artist,
         "new_artist_request":new_artist_request,
         "total_tracks":total_tracks
        };
        resolve(json_val);
      
      }, (err) => {
        reject(err);
      });
    });
    
  }

  get_artist_request()
  {
   
    return new Promise((resolve, reject) => {
     
      this.db.collection("users",ref => ref.where('artist_verify', '==', true).limit(this.variable.p_limit)).valueChanges({ idField: 'uid' }).pipe(take(1)).subscribe(users => {
      
        resolve(users);
      
      }, (err) => {
        reject(err);
      });
    });
    
  }
  read_artist(uid)
  {
   
    return new Promise((resolve, reject) => {
     
      this.db.collection("users").doc(uid).valueChanges({ idField: 'uid' }).pipe(take(1)).subscribe(users => {

        resolve(users);
        
      });
    });
    
  }
  get_artist_request_next(snapshot)
  {
   
    return new Promise((resolve, reject) => {
     
      this.db.collection("users",ref => ref.startAt(snapshot)).valueChanges({ idField: 'uid' }).pipe(take(1)).subscribe(users => {
      
        resolve(users);
      
      }, (err) => {
        reject(err);
      });
    });
    
  }
  
  
  get_artist_request_track(uid)
  {
    return new Promise((resolve, reject) => {
     
      this.db.collection("users/"+uid+"/track").valueChanges({ idField: 'trackid' }).pipe(take(1)).subscribe(tracks => {
      
        resolve(tracks);
      
      }, (err) => {
        reject(err);
      });
    });
    
  }
  get_new_request_track(uid)
  {
    return new Promise((resolve, reject) => {
     
      this.db.collection("track_new_request").valueChanges({ idField: 'trackid' }).pipe(take(1)).subscribe(tracks => {
      
        resolve(tracks);
      
      }, (err) => {
        reject(err);
      });
    });
    
  }
  //This is the function you call (put it in ngOnInit or something of the like) to get the filenames
  getTrackLink(uid,trackid) {
    return new Promise((resolve, reject) => {
     
    let filelist = []
    let track={
      audio:"",
      cover:"",
      preview:""
    }
    const ref = this.storage.ref('').child('musics').child(uid).child(trackid);
    let myurlsubscription = ref.listAll().subscribe((data) => {
      for (let i = 0; i < data.items.length; i++) {
        let name = data.items[i].name;
        let path = "/musics/"+uid+"/"+trackid+"/"+data.items[i].name;
       
        let newref = this.storage.ref(path);
      
        newref.getDownloadURL().subscribe((data) => {
          filelist.push({
            name: name,
            link: data
          });
          if(name == "audio.mp3")
              track.audio = data;
          if(name == "preview.mp3")
              track.preview = data;
          if(name == "cover_image.jpg")
              track.cover = data;
          
        }, (err) => {
          // Handle error here
          // Show popup with errors or just console.error
          reject(err);
        });
       
        
      }
      
     
      //console.log(filelist);
    
    });
    
    resolve(track);
    //return filelist;
     
    });


  
  }
  getUserLink(uid) {
    return new Promise((resolve, reject) => {
     
    let filelist = []
    let image={
      artist_cover_image:"",
      profile_image:""
    }
    const ref = this.storage.ref('').child('users').child(uid).child("profile_image");
    let myurlsubscription = ref.listAll().subscribe((data) => {
      for (let i = 0; i < data.items.length; i++) {
        let name = data.items[i].name;
        let path = "/users/"+uid+"/profile_image/"+data.items[i].name;
       
        let newref = this.storage.ref(path);
      
        newref.getDownloadURL().subscribe((data) => {
          filelist.push({
            name: name,
            link: data
          });
          
          if(name == "artist_cover_image.jpg")
            image.artist_cover_image = data;
          if(name == "profile_image.jpg")
            image.profile_image = data;
        
          
        }, (err) => {
          // Handle error here
          // Show popup with errors or just console.error
          reject(err);
        });
       
        
      }
      
     
      //console.log(filelist);
    
    });
    
    resolve(image);
    //return filelist;
     
    });


  
  }
  delete_new_request(musicid,authorid)
  {

    return new Promise((resolve, reject) => {
     
      this.db.collection('track_new_request')
      .doc(musicid)
      .delete()
      .then(res => {
        this.db.collection('users').doc(authorid).collection('track').doc(musicid).set(
          {
            track_reject: true
          }, { merge: true }
        ).then(response => {
          console.log(response);
          resolve(response);
        }).catch(error => {
          console.log(error);
        });
       })
      .catch((error) => {
         console.error('Error removing document: ', error);
      });
    });
    
   
  }
  approve_new_request(track,author)
  {

    return new Promise((resolve, reject) => {
     
      this.db.collection('track_new_request')
      .doc(track.track_id)
      .delete()
      .then(res => {
        console.log(author);
        let name_keyword=[];
        let author_name = author.name;
        
        for (let i = 1; i <= author_name.length; i++) { 
          name_keyword.push(author_name.toLowerCase().substring(0, i)); 
        } 
        let track_keyword=[];
        let track_name = track.track_title;
        
        for (let i = 1; i <= track_name.length; i++) { 
          track_keyword.push(track_name.toLowerCase().substring(0, i)); 
        } 
        
    
        
      
        this.db.collection('artist_musics').doc(author.id).collection('musics').doc(track.trackid).set(
          {
            audioURL: track.track.audio,
            authorID: author.uid,
            authorName: author.name,
            authorNameKeyword: name_keyword,
            musicID: track.trackid,
            previewURL: track.track.preview,
            songName: track.track_title,
            songNameKeyword: track_keyword,
          }
        ).then(response => {
          this.db.collection('users').doc(author.uid).collection('track').doc(track.trackid).set(
            {
              track_approve: true
            }, { merge: true }
          ).then(response => {
            console.log(response);
            resolve(response);
          }).catch(error => {
            console.log(error);
          });
        }).catch(error => {
          console.log(error);
        });
        })
      .catch((error) => {
         console.error('Error removing document: ', error);
      });
    });
    
   
  }
  //Models for Input fields
  nameValue: string;
  placeValue: string;

  //Data object for listing items
  tableData: any[] = [];

  //Save first document in snapshot of items received
  firstInResponse: any = [];

  //Save last document in snapshot of items received
  lastInResponse: any = [];

  //Keep the array of first document of previous pages
  prev_strt_at: any = [];

  load_newartistlist() {

    return new Promise((resolve, reject) => {
     
      this.db.collection('users', ref => ref
      .limit(this.variable.p_limit)
      .where('artist_verify', '==', false)
      .where('artist_reject', '==', false)
    ).snapshotChanges().pipe(take(1))
      .subscribe(response => {
        let array_json:any = [];
        if (!response.length) {
          console.log("No Data Available");
          return false;
        }
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;
        
        this.tableData = [];
        for (let item of response) {
          let data_json:any = [];
          data_json["id"] = item.payload.doc.id;
          data_json["data"] = item.payload.doc.data();
          this.tableData.push(data_json);
        }
        array_json["lastResponse"] = response[response.length - 1].payload.doc;
        array_json["data"] = this.tableData;//response[response.length - 1].payload.doc;
        //Initialize values
        this.prev_strt_at = [];
       
       resolve(array_json);
      
      
      }, error => {
        reject(error)
      });
    });
    
  }
  load_approvedartistlist() {

    return new Promise((resolve, reject) => {
     
      this.db.collection('users', ref => ref
      .limit(this.variable.p_limit)
      .where('artist_verify', '==', true)
      .where('artist_reject', '==', false)
      .where('type', '==', "Artist")
    ).snapshotChanges().pipe(take(1))
      .subscribe(response => {
        let array_json:any = [];
        if (!response.length) {
          console.log("No Data Available");
          return false;
        }
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;
        
        this.tableData = [];
        for (let item of response) {
          let data_json:any = [];
          data_json["id"] = item.payload.doc.id;
          data_json["data"] = item.payload.doc.data();
          this.tableData.push(data_json);
        }
        array_json["lastResponse"] = response[response.length - 1].payload.doc;
        array_json["data"] = this.tableData;//response[response.length - 1].payload.doc;
        //Initialize values
        this.prev_strt_at = [];
       
       resolve(array_json);
      
      
      }, error => {
        reject(error)
      });
    });
    
  }
  // Add item in Collection
  approve_tracks(author,track) {
   
    return new Promise((resolve, reject) => {
      console.log(author);
      let name_keyword=[];
      let author_name = author.data.name;
      
      for (let i = 1; i <= author_name.length; i++) { 
        name_keyword.push(author_name.toLowerCase().substring(0, i)); 
      } 
      let track_keyword=[];
      let track_name = track.track_title;
      
      for (let i = 1; i <= track_name.length; i++) { 
        track_keyword.push(track_name.toLowerCase().substring(0, i)); 
      } 
      /*let abc =  {
        audioURL: track.track.audio,
        authorID: author.id,
        authorName: author.data.name,
        authorNameKeyword: name_keyword,
        musicID: track.trackid,
        previewURL: track.track.preview,
        songName: track.track_title,
        songNameKeyword: track_keyword,
      }*/
  
      
     
      this.db.collection('artist_musics').doc(author.id).collection('musics').doc(track.trackid).set(
        {
          audioURL: track.track.audio,
          authorID: author.id,
          authorName: author.data.name,
          authorNameKeyword: name_keyword,
          musicID: track.trackid,
          previewURL: track.track.preview,
          songName: track.track_title,
          songNameKeyword: track_keyword,
        }
      ).then(response => {
        this.db.collection('users').doc(author.id).collection('track').doc(track.trackid).set(
          {
            track_approve: true
          }, { merge: true }
        ).then(response => {
          console.log(response);
          resolve(response);
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      });
    });
  }

  approve_newartist(id)
  {
    return new Promise((resolve, reject) => {
    this.db.collection('users').doc(id).set(
      {
        artist_verify: true,
        type: "Artist"
      }, { merge: true }
    ).then(response => {
      this.db.collection('artists').doc(id).set(
        {
        
        }, { merge: true }
      ).then(response => {
        console.log(response);
        resolve(response);
      }).catch(error => {
        console.log(error);
      });
      
    }).catch(error => {
      console.log(error);
    });
  });
  
   
  }
  reject_newartist(id)
  {
      return new Promise((resolve, reject) => {
      this.db.collection('users').doc(id).set(
        {
          artist_reject: true
        }, { merge: true }
      ).then(response => {
        console.log(response);
        resolve(response);
      }).catch(error => {
        console.log(error);
      });
    });
  }

  edit_author(author) {
   
    return new Promise((resolve, reject) => {
      console.log(author);
      
     
      this.db.collection('users').doc(author.id).set(
        author.data
      ).then(response => {
        console.log(response);
        resolve(response);
      }).catch(error => {
        console.log(error);
      });
    });
  }
  //Show previous set 
  prevPage() {
   
    this.db.collection('users', ref => ref
      .orderBy('name', 'desc')
      .startAt(this.get_prev_startAt())
      .endBefore(this.firstInResponse)
      .limit(5)
    ).get()
      .subscribe(response => {
        this.firstInResponse = response.docs[0];
        this.lastInResponse = response.docs[response.docs.length - 1];
        
        this.tableData = [];
        for (let item of response.docs) {
          this.tableData.push(item.data());
        }

        //Maintaing page no.
      

        //Pop not required value in array
        this.pop_prev_startAt(this.firstInResponse);

        //Enable buttons again
    
      }, error => {
      
      });
  }

  nextPage(lastResponse) {
    return new Promise((resolve, reject) => {
      this.db.collection('users', ref => ref
      .limit(3)
      .where('artist_verify', '==', false)
      .where('artist_reject', '==', false)
      .startAfter(lastResponse)
    ).snapshotChanges().pipe(take(1))
      .subscribe(response => {
        let array_json:any = [];
        if (!response.length) {
          return;
        }

        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;
        this.tableData = [];
        for (let item of response) {
          let data_json:any = [];
          data_json["id"] = item.payload.doc.id;
          data_json["data"] = item.payload.doc.data();
          this.tableData.push(data_json);
        }
        array_json["lastResponse"] = response[response.length - 1].payload.doc;
        array_json["data"] = this.tableData;//response[response.length - 1].payload.doc;
        //Initialize values
        this.prev_strt_at = [];
       
       resolve(array_json);
       

        //this.push_prev_startAt(this.firstInResponse);

       
      }, error => {
       
      });

      
    });
    
  }
  nextApprovedArtistPage(lastResponse) {
    return new Promise((resolve, reject) => {
      this.db.collection('users', ref => ref
      .limit(3)
      .where('artist_verify', '==', true)
      .where('artist_reject', '==', false)
      .where('type', '==', "Artist")
      .startAfter(lastResponse)
    ).snapshotChanges().pipe(take(1))
      .subscribe(response => {
        let array_json:any = [];
        if (!response.length) {
          return;
        }

        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;
        this.tableData = [];
        for (let item of response) {
          let data_json:any = [];
          data_json["id"] = item.payload.doc.id;
          data_json["data"] = item.payload.doc.data();
          this.tableData.push(data_json);
        }
        array_json["lastResponse"] = response[response.length - 1].payload.doc;
        array_json["data"] = this.tableData;//response[response.length - 1].payload.doc;
        //Initialize values
        this.prev_strt_at = [];
       
       resolve(array_json);
       

        //this.push_prev_startAt(this.firstInResponse);

       
      }, error => {
       
      });

      
    });
    
  }
  //Add document
  push_prev_startAt(prev_first_doc) {
    this.prev_strt_at.push(prev_first_doc);
  }

  //Remove not required document 
  pop_prev_startAt(prev_first_doc) {
    this.prev_strt_at.forEach(element => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }

  //Return the Doc rem where previous page will startAt
  get_prev_startAt() {
    /*if (this.prev_strt_at.length > (this.pagination_clicked_count + 1))
      this.prev_strt_at.splice(this.prev_strt_at.length - 2, this.prev_strt_at.length - 1);
    return this.prev_strt_at[this.pagination_clicked_count - 1];*/
  }

  //Date formate
  readableDate(time) {
    var d = new Date(time);
    return d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
  }

 // Add item in Collection
 add_new_track(author,track) {
   
  return new Promise((resolve, reject) => {
   console.log(track);
   console.log(author);
    /*let abc =  {
      others_genre: track.track_others,
      track_author: author,
      track_added: "",
      track_approve: false,
      track_genre: track.track_genre,
      track_language: track.track_language,
      track_lyric: track.track_lyric,
      track_reject: false,
      track_title: track.track_title
    }

    console.log(abc)*/
    let today = new Date().toLocaleDateString()

   
    this.db.collection('track_new_request').doc(track.track_id).set(
      {
        others_genre: track.others_genre,
        track_id: track.track_id,
        track_author: author,
        track_added: today,
        track_approve: false,
        track_genre: track.track_genre,
        track_language: track.track_language,
        track_lyric: track.track_lyric,
        track_reject: false,
        track_title: track.track_title
      }, { merge: true }
    ).then(response => {
      console.log(response);
      this.db.collection('users').doc(author).collection('track').doc(track.track_id).set(
        {
          others_genre: track.others_genre,
          track_id: track.track_id,
          track_author: author,
          track_added: today,
          track_approve: false,
          track_genre: track.track_genre,
          track_language: track.track_language,
          track_lyric: track.track_lyric,
          track_reject: false,
          track_title: track.track_title
        }, { merge: true }
      ).then(response => {
        resolve(response);
       
      }).catch(error => {
        resolve(error);
      });
     
    }).catch(error => {
      resolve(error);
    });
  });
}
}
