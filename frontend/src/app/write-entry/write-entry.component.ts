import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { AuthenticationService } from '../authentication.service';

import { Entry } from '../entry';

@Component({
  selector: 'app-write-entry',
  templateUrl: './write-entry.component.html',
  styleUrls: ['./write-entry.component.css']
})
export class WriteEntryComponent implements OnInit {

	entry: Entry;
	error: string;
  posting: boolean;
	allowChangeName: boolean;

  constructor(
  	private http:Http,
  	private location:Location,
    private auth:AuthenticationService
  ) {}

  ngOnInit() {
    this.allowChangeName = true;

  	this.entry = this.getNewEntry();
    let user = this.auth.getCurrentUser();
    if( !user ) return;
    this.entry.Signature = user.username;
    this.allowChangeName = false;
  }

  onSubmit() {
		this.posting = true;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http
    .post('/json/entries', this.entry, options)
    .map(res => res.json())
	  .subscribe( entry => {
      console.log('Posted entry.', this.entry)
    	this.entry = this.getNewEntry();
			this.posting = false;
      this.location.go('');
    }, error => {
      console.error('Unable to post entry.', error)
      this.error = error;
			this.posting = false;
    });

	  return false;
  }


  getNewEntry(){
    let entry = new Entry();
    entry.Signature = '#';
    entry.Enheter = 0;
    entry.Status = 0;
    return entry;
  }
}
