import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { TranslateService } from "ng2-translate";
import { NgForm } from '@angular/forms';
import { IdprestapiService } from '../idprestapi.service';
import { IdpService } from '../idp-service.service';
import { IdpdataService} from '../idpdata.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class CodeComponent implements OnInit {

  loginData = {
    grant_type: 'password',
    username: '',
    password: '',
    client_id: 'idpclient'
  };
  backgroundImage = '/../assets/images/Login_page_BG.png';
  username='';
  password='';
  pipelineData:any
  constructor(

    public translate: TranslateService,
    private restApiService: IdprestapiService,
    private idpservice: IdpService,
    private router: Router,
    private IdpdataService:IdpdataService,
    private _cookieService:CookieService

  ) {

    translate.addLangs(["english", "french", "spanish"]);
    translate.setDefaultLang("english");

    let browserLang = translate.getBrowserLang();
    let language = browserLang.match(/english|french/) ? browserLang : 'english';
    this.IdpdataService.language = language;
    translate.use(language);

  }

  ngOnInit() {

    this.idpservice.initMain();

    // this.restApiService.getData()
    // .then(response=>{
    //   if(response){
    //   this.IdpdataService.devServerURL=response.json().idpresturl;
    //   this.IdpdataService.IDPDashboardURL=response.json().idpdashboardurl;
    //   this.IdpdataService.IDPLink=response.json().IDPLink;
    //   this.IdpdataService.geUrl=response.json().geUrl;
    //   this.IdpdataService.geFlag=response.json().geFlag;
    // }
    // else{
    //   console.log('no response properties');
    // }
    //
    // })


  }

  getDetails(){
    this.idpservice.getDetails();
    this.router.navigate(['/previousConfig']);
    // this.restApiService.getUserName().then(response=>{
    //   if (response) {
    //     console.log(response);
    //     var userDetails = JSON.parse(response.json().resource);
    //     this.IdpdataService.idpUserName = userDetails.user_id;
    //     this.IdpdataService.roles = userDetails.roles;
    //     this.IdpdataService.permissions = userDetails.permissions;
    //     console.log(this.IdpdataService.idpUserName);
    //     this.router.navigate(['/previousConfig'])
    //
    //   }
    // });
  }

  setLanguage(data: any) {
    this.IdpdataService.language = data;
  }


  authenticateUser(form: any) {
    let username = form.value.username;
    let password = form.value.password;
    this.loginData = {
      grant_type: 'password',
      username: username,
      password: password,
      client_id: 'idpclient'
    }
    console.log(this.loginData);
    this.obtainAccessToken(this.loginData);
  //this.router.navigate(['/createConfig'])

    //console.log(this.loginData);
    //this.obtainAccessToken(this.loginData);
  }

  obtainAccessToken(params: any) {
      //localStorage.setItem('currentUser','settingnewcookie');
      //let expireDate = new Date (new Date().getTime() + (1000 * data.data.expires_in));
      //this._cookieService.put('access_token','emptyCookiefortesting', {'expires': expireDate});

    //this.restApiService.obtainAccessToken(params);
    this.restApiService.obtainAccessToken(params)
      .then(response=>{
        if(response){
          //this.IdpdataService.access_token=response.json().access_token

           let expireDate = new Date (new Date().getTime() + (1000 * response.json().expires_in));
          this._cookieService.put('access_token',response.json().access_token,{'expires': expireDate});
          this.getDetails();

        //  this.router.navigate(['/createConfig']);
      }
      else{
        console.log('No token');
      }
      });
  }



}
