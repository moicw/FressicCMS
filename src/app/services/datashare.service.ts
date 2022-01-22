import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatashareService {
  public isUserLoggedIn: BehaviorSubject<string> = new BehaviorSubject<string>("unknown");
  constructor() { }
}
