
export class IdpService {
  constructor(
    private IdprestapiService: IdprestapiService,
    private router: Router,
    private IdpdataService: IdpdataService,
    private _cookieService: CookieService


  getDetails() {

    this.IdprestapiService.getUserName()
      .then(response => {
        if (response) {
          console.log(response);
          var userDetails = JSON.parse(response.json().resource);
          this.IdpdataService.idpUserName = userDetails.user_id;
          console.log(this.IdpdataService.idpUserName);
          this.IdpdataService.roles = userDetails.roles;
          this.IdpdataService.permissions = userDetails.permissions;
          let permission = '';
          for (var i = 0; i < this.IdpdataService.roles.length; i++) {

            if(this.IdpdataService.role.indexOf(this.IdpdataService.roles[i])===-1){
              this.IdpdataService.role = this.IdpdataService.role + this.IdpdataService.roles[i] + ' ';
            }

            //this.IdpdataService.role = this.IdpdataService.role + this.IdpdataService.roles[i] + ' ';
          }
          //console.log(this.IdpdataService.role);
          if (document.getElementById('idpUserName')) {
            document.getElementById('idpUserName').title = this.IdpdataService.role;
          }
          for (var j = 0; j < this.IdpdataService.permissions.length; j++) {
            permission = this.IdpdataService.permissions[j];
        }
      });

    //this.IdpdataService.initMain=true;

  }
}
