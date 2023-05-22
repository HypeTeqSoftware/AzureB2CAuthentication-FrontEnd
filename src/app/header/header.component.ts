import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest, PopupRequest, InteractionType, AuthenticationResult } from '@azure/msal-browser';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { b2cPolicies } from 'src/app/auth-config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  responseFromAPI : string = "";



  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http : HttpClient
  ) {}


  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;


    /**
     * You can subscribe to MSAL events as shown below. For more info,
     * visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/events.md
     */
    this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  async login(userFlowRequest?: RedirectRequest | PopupRequest) {
    debugger
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        debugger
        await this.authService.loginPopup({...this.msalGuardConfig.authRequest, ...userFlowRequest} as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
            debugger
            console.log(response)
          });
      } else {
        debugger
       await this.authService.loginPopup(userFlowRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
            debugger
            console.log(response)
          });
      }
    } else {
      debugger
      if (this.msalGuardConfig.authRequest){
        debugger
        await  this.authService.loginRedirect({...this.msalGuardConfig.authRequest, ...userFlowRequest} as RedirectRequest).subscribe((res:any)=>{
          debugger
          console.log(res)

        });
      } else {
        await this.authService.loginRedirect(userFlowRequest).subscribe((res:any)=>{
          debugger
          console.log(res)
        });
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  editProfile() {
    debugger
    let editProfileFlowRequest = {
      scopes: ["openid"],
      authority: b2cPolicies.authorities.editProfile.authority,
    };



    this.login(editProfileFlowRequest);
  }


  passwordReset() {
    debugger
    let passwordReseteFlowRequest = {
      scopes: ["openid"],
      authority: b2cPolicies.authorities.passwordReset.authority,
    };
    this.login(passwordReseteFlowRequest);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }


  APICall()
  {

      debugger
      var APIUrl = "https://localhost:44322/api" // your API Call
      var endpoints = "login"
      const url = `${APIUrl}/${endpoints}`;
      return this.http.get(url,{responseType: 'text'}).subscribe((res:any)=>{
        this.responseFromAPI = res;
    })
  }


}
