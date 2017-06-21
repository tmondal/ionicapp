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
    }

    onprofileScroll(ev){
 
        ev.domWrite(() => {
            this.updateParallaxHeader(ev);
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
}
