import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Organizing page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-organizing',
  templateUrl: 'organizing.html'
})
export class OrganizingPage {

	userservice: any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {}

}