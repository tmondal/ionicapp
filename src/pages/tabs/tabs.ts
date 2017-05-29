import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { ParticipatingPage } from '../participating/participating';
import { OrganizingPage } from '../organizing/organizing';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = HomePage;
	tab2Root = ParticipatingPage;
	tab3Root = OrganizingPage;

	constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
