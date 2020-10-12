import {
    Component,
    ViewChild,
    OnInit,
    ComponentFactoryResolver,
    ApplicationRef,
    Injector,
    OnDestroy,
    AfterViewInit,
    Input
} from '@angular/core';
import {CdkPortal, DomPortalOutlet} from '@angular/cdk/portal';

/**
 * This component template wrap the projected content
 * with a 'cdkPortal'.
 */

@Component({
    selector: 'app-window',
    template: `
        <ng-container *cdkPortal>
            <ng-content></ng-content>
        </ng-container>
    `
})
export class WindowComponent implements AfterViewInit, OnDestroy {
    @Input() title: string;
    @ViewChild(CdkPortal) portal: CdkPortal;

    private externalWindow = null;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private applicationRef: ApplicationRef,
        private injector: Injector) {
    }

    ngAfterViewInit() {
        this.externalWindow = window.open(
            '', '_blank',
            'width=screen.width,height=screen.height,toolbar=0,location=0, directories=0, status=0, menubar=0'
        );

        const host = new DomPortalOutlet(
            this.externalWindow.document.body,
            this.componentFactoryResolver,
            this.applicationRef,
            this.injector
        );
        this.externalWindow.document.title = this.title;
        document.querySelectorAll('link, style').forEach(htmlElement => {
            this.externalWindow.document.head.appendChild(htmlElement.cloneNode(true));
        });
        host.attach(this.portal);
    }

    ngOnDestroy() {
        this.externalWindow.close();
    }
}
