import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isIframe = false;
  loginDisplay = false

  constructor(  private authService: MsalService)
  {
    
  }
  
  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    debugger
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }
}