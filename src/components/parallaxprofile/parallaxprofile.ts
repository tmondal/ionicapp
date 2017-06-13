import { Directive , ElementRef, Renderer} from '@angular/core';



@Directive({
  selector: '[parallaxprofile]' ,
  host: {
  	'(ionScroll)': 'onprofileScroll($event)'
  }
})
export class Parallaxprofile {

	header: any;
    translateAmt: any;

    contact: any;
 	myleague: any;
 	participate: any;
 	myposts: any;

    constructor(public element: ElementRef, public renderer: Renderer){
 
    }
 
    ngOnInit(){
 
        let content = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
        this.header = content.getElementsByClassName('parallaxheader')[0];
        this.contact = content.getElementsByClassName('contact')[0];
        this.myleague = content.getElementsByClassName('myleagues')[0];
        this.participate = content.getElementsByClassName('participate')[0];
        this.myposts = content.getElementsByClassName('myposts')[0];
    }

    onprofileScroll(ev){
 
        ev.domWrite(() => {
            this.updateParallaxHeader(ev);
            this.updateContact(ev);
            this.updateLeague(ev);
            this.updateParticipate(ev);
            this.updateMyposts(ev);
        });
 
    }
 
    updateParallaxHeader(ev){
 
        if(ev.scrollTop >= 0){
            this.translateAmt = ev.scrollTop / 2;
        } else {
            this.translateAmt = 0;
        }
 
        this.renderer.setElementStyle(this.header, 'webkitTransform', 'translate3d(0,'+this.translateAmt+'px,0)');
 
    }
     updateContact(ev){
 
        if(ev.scrollTop >= 0){
            this.translateAmt = - ev.scrollTop;
        } else {
            this.translateAmt = 0;
        }
 
        this.renderer.setElementStyle(this.contact, 'webkitTransform', 'translate3d(0,'+this.translateAmt+'px,0)');
 
    }
    updateLeague(ev){
 
        if(ev.scrollTop >= 0){
            this.translateAmt = - ev.scrollTop * 1.2;
        } else {
            this.translateAmt = 0;
        }
 
        this.renderer.setElementStyle(this.myleague, 'webkitTransform', 'translate3d(0,'+this.translateAmt+'px,0)');
 
    }
    updateParticipate(ev){
 
        if(ev.scrollTop >= 0){
            this.translateAmt = - ev.scrollTop * 1.4;
        } else {
            this.translateAmt = 0;
        }
 
        this.renderer.setElementStyle(this.participate, 'webkitTransform', 'translate3d(0,'+this.translateAmt+'px,0)');
 
    }
    updateMyposts(ev){
 
        if(ev.scrollTop >= 0){
            this.translateAmt = - ev.scrollTop * 1.55;
        } else {
            this.translateAmt = 0;
        }
 
        this.renderer.setElementStyle(this.myposts, 'webkitTransform', 'translate3d(0,'+this.translateAmt+'px,0)');
    }

}
