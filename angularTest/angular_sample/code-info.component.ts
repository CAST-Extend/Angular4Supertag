import { Component, OnInit, TemplateRef } from '@angular/core';
import { IdprestapiService } from '../idprestapi.service';
import { IdpService } from '../idp-service.service';
import { IdpdataService } from '../idpdata.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-code-info',
  templateUrl: './code-info.component.html',
  styleUrls: ['./code-info.component.css']
})
export class CodeInfoComponent implements OnInit {
  @ViewChild('modalforAlert') button;
  @ViewChild('modalforDel') DelScm;
  @ViewChild('modalforreset') resetCodeInfo;
  /*constructor start*/
  constructor(
    private IdpdataService: IdpdataService,
    private IdpService: IdpService,
    private IdprestapiService: IdprestapiService,
    private router: Router
  ) {



    //this.codeInfo.category = 'Standard';
    if (this.IdpdataService.data.basicInfo.engine === 'urbanCode') {
      //if (this.IdpdataService.data.basicInfo.engine ) {
      this.technologyData = {
        'Standard': {
          'JAVA/J2EE(Ant based)': 'J2EE/Ant',
          'JAVA/J2EE(Maven based)': 'J2EE/Maven'
        },
        'Package': {
          'IBM Maximo': 'IBM Maximo',
        },
        'Mobile': {
          'Mobile First': 'Mobile First'
        }
      };
      console.log(this.technologyData);
    }
    if (this.IdpdataService.data.basicInfo.engine !== 'urbanCode') {
      this.technologyData = {
        'Standard': {
          'JAVA/J2EE(Ant based)': 'J2EE/Ant',
          'JAVA/J2EE(Maven based)': 'J2EE/Maven',
          '.Net(C# based)': 'dotNetCsharp',
          '.Net(VB .Net based)': 'dotNetVb',
          'Node JS': 'nodeJs',
          //'BigData' : 'bigData',
          'Go': 'go',
          'AngularJs':'angular',
          'MsSql':'mssql'
        },
        'Package': {
          'Siebel': 'siebel',
          'Database Deployment': 'dbDeploy',
          'Catalog': 'catalog',
          'TIBCO': 'tibco',
          'IBM BPM': 'IBMBPM',
          'IBM Integration Bus/Message Queue': 'iib',
          'IBM Sterling OMS': 'IBMSterlingOMS',
          'Pega': 'pega',
          'Oracle EBS': 'oracleEBS',
          'Mule ESB': 'Mule ESB',
          'IBM SI':'ibmsi'
        },

        'Mobile': {
          'Android(Ant based)': 'Android(Ant based)',
          'Android(Gradle based)': 'Android(Gradle based)',
          'iOS(Objective C)': 'iOS(Objective C)',
          'iOS(Swift)': 'iOS(Swift)',
          'mWeb': 'mWeb'
        }

      };
    }

    if (this.codeInfo.scm.length === 0) {
      this.addItem();
    }

    // this.IdprestapiService.getIDPDropdownProperties().subscribe(response => {
    //   this.IdpdataService.IDPDropdownProperties = response;
    //   this.SCMList = this.IdpdataService.IDPDropdownProperties.SCMList;
    //   this.categoryList = this.IdpdataService.IDPDropdownProperties.categoryList;
    //   this.buildConfList = this.IdpdataService.IDPDropdownProperties.buildConfList;
    //   this.codeScriptList = this.IdpdataService.IDPDropdownProperties.codeScriptList;
    //   this.repoList = this.IdpdataService.IDPDropdownProperties.repoList;
    //
    // });

    this.getList = this.IdprestapiService.getIDPDropdownProperties();
    this.SCMList = this.getList.SCMList;
    this.categoryList = this.getList.categoryList;
    this.buildConfList = this.getList.buildConfList;
    this.codeScriptList = this.getList.codeScriptList;
    this.repoList = this.getList.repoList;

    if (this.formStatusObject.operation === "copy" || this.formStatusObject.operation === "edit") {
      this.checkCheckBox();

    }

    if(this.codeInfo.category!==undefined && this.codeInfo.category!==""){
      this.setDataKeys();
    }

    //this.tempObjectcode.buildIntervalCheck=null;
    // this.codeInfo.buildScript[0].tool = '';
    // this.codeInfo.buildScript[1].tool = '';

    //console.log(this.repoList);
  }
  /*constructor end*/
  formStatusObject = this.IdpdataService.data.formStatus;
  codeInfo: any = this.IdpdataService.data.code;
  buildInfo: any = this.IdpdataService.data.buildInfo;
  deployInfo : any = this.IdpdataService.data.deployInfo;
  categoryList: any;
  SCMList: any;
  repoList: any;
  buildConfList: any;
  codeScriptList: any;
  tempObjectcode: any = this.IdpdataService.data.checkboxStatus.codeInfo;
  SCMList_IBM: any = [{ 'name': 'Process Server', 'value': 'processServer' }, { 'name': 'File System', 'value': 'fileSystem' }];
  technologyData: any;
  shellScript: any = [];
  batchScript: any = [];
  antScript: any = [];
  SCMData: any = [
    { 'value': 'GIT', 'tech': ['JAVA/J2EE(Maven based)', '.Net(C# based)'] },
    { 'value': 'SVN', 'tech': ['PEGA', 'NET1'] },
    { 'value': 'TFS', 'tech': ['PEGA', '.Net(C# based)'] }
  ];
  //keys for technologyData object
  technologyDatakeys: any = [];
  index: any;
  getList:any;
  // setTempObjectcode(data,i) {
  //   if ( data!==undefined && data!==null && data!=='')  {
  //     if(this.tempObjectcode.scm===undefined){
  //       this.tempObjectcode.scm=[];
  //
  //     }
  //     this.tempObjectcode.scm[i].directory = 'on';
  //
  //   }
  //
  // }

  setDataKeys(){
    this.technologyDatakeys = Object.keys(this.technologyData[this.codeInfo.category]);
    console.log(this.technologyDatakeys );

  }

  checkFileFormat(){
    if(this.codeInfo.buildScript[2].type==='xml'){
      for(var i=0;i<this.deployInfo.deployEnv.length;i++){
        this.deployInfo.deployEnv[i].envFlag="off";
        if(this.deployInfo.deployEnv[i].deploySteps!==undefined){
          this.deployInfo.deployEnv[i].deploySteps=[];
        }

      }

    }

  }

  setIbmStatus(){
    this.IdpdataService.data.formStatus.buildInfo.ibmsiTypeStatus='1';
  }

  checkCheckBox(){



    if(this.tempObjectcode.scm===undefined){
      this.tempObjectcode.scm=[];

    }

    for(var i = 0 ; i<this.codeInfo.scm.length;i++){
      if(this.tempObjectcode.scm[i]===undefined){
        this.tempObjectcode.scm[i]={};
      }
      if(this.codeInfo.scm[i].exclude!==undefined && this.codeInfo.scm[i].exclude!==null && this.codeInfo.scm[i].exclude!==""){
        this.tempObjectcode.scm[i].directory="on";
      }
      else{
        this.tempObjectcode.scm[i].directory="off";
      }
    }

  }

  clearDir(i){
    this.codeInfo.scm[i].exclude="";
    return "off";
  }
  setRepositoryBrowser(data, i) {
    if (!data) {
      this.codeInfo.scm[i].repositoryBrowser = '';
      return false;
    }
    return false;
  }
  setScmType(data, i) {
    if (!data) {
      this.codeInfo.scm[i].type = '';
      return false;
    }
    else {
      //this.codeInfo.scm[i].type='';
      return false;
    }
  }
  setbuidScirptvalueZero() {
    this.codeInfo.buildScript[0].scriptFilePath = '';
    this.codeInfo.buildScript[0].targets = '';
    return null;
  }
  setbuidScirptvalueOne() {
    this.codeInfo.buildScript[1].scriptFilePath = '';
    this.codeInfo.buildScript[1].targets = '';
    return null;
  }
  cleanPathchg(runtype, index) {
    if (runtype == null) {
      this.codeInfo.buildScript[index].scriptFilePath = null;
    }
    else if (runtype == "shellScript") {
      this.codeInfo.buildScript[index].scriptFilePath = this.shellScript[index];
    }
    else if (runtype == "batchScript") {
      this.codeInfo.buildScript[index].scriptFilePath = this.batchScript[index];
    }
    else if (runtype == "ant") {
      this.codeInfo.buildScript[index].scriptFilePath = this.antScript[index];
    }
  }

  cleanPath(runtype, index) {

    if (runtype === null) {
      this.codeInfo.buildScript[index].scriptFilePath = null;
    }
    else if (runtype === "shellScript") {
      this.shellScript[index] = this.codeInfo.buildScript[index].scriptFilePath;
      console.log("Shell" + this.shellScript);
    }
    else if (runtype === "batchScript") {
      this.batchScript[index] = this.codeInfo.buildScript[index].scriptFilePath;
      console.log("batch" + this.batchScript);
    }
    else if (runtype === "ant") {
      this.antScript[index] = this.codeInfo.buildScript[index].scriptFilePath;
      console.log("ant" + this.antScript);
    }
  }

  selectedTech() {
    if (this.codeInfo.technology !== undefined && this.codeInfo.technology !== null) {
      if (this.codeInfo.technology === 'dotNetCsharp' || this.codeInfo.technology === 'dotNetVb') {
        this.buildInfo.buildtool = 'msBuild';
        this.IdpdataService.data.buildInfo.buildtool = this.buildInfo.buildtool;
        this.IdpdataService.data.formStatus.buildInfo.buildToolStatus = '1';

      } if (this.codeInfo.technology === 'J2EE/Ant') {
        this.buildInfo.buildtool = 'ant';
        this.IdpdataService.data.buildInfo.buildtool = this.buildInfo.buildtool;
        this.IdpdataService.data.formStatus.buildInfo.buildToolStatus = '1';

      } if (this.codeInfo.technology === 'J2EE/Maven') {
        this.buildInfo.buildtool = 'maven';
        this.IdpdataService.data.buildInfo.buildtool = this.buildInfo.buildtool;
        this.IdpdataService.data.formStatus.buildInfo.buildToolStatus = '1';

      } if (this.codeInfo.technology !== 'dotNetCsharp' && this.codeInfo.technology !== 'dotNetVb' && this.codeInfo.technology !== 'J2EE/Ant' && this.codeInfo.technology !== 'J2EE/Maven') {
        this.buildInfo.buildtool = this.codeInfo.technology;
        this.IdpdataService.data.buildInfo.buildtool = this.buildInfo.buildtool;
        this.IdpdataService.data.formStatus.buildInfo.buildToolStatus = '1';

      } if(this.codeInfo.technology===''){
        this.IdpdataService.data.formStatus.buildInfo.buildToolStatus ='0';
      }
      if (this.IdpdataService.data.formStatus.operation !== "copy" && this.IdpdataService.data.formStatus.operation !== "edit") {
        this.clearViews();
      }


    }
  }

  clearBroserFields(i){
    this.codeInfo.scm[i].browserUrl='';
    this.codeInfo.scm[i].projectName='';
    this.codeInfo.scm[i].version='';


  }

  addItem() {
    this.codeInfo.scm.push({
    });
    if(this.tempObjectcode.scm==undefined){
      console.log("scm in tempObjectcode")
      this.tempObjectcode.scm=[];
    }
    this.tempObjectcode.scm.push({});
  }

  clearcase(index) {
    this.codeInfo.scm[index].snapshotViewName = "";
    this.codeInfo.scm[index].configSpec = "";
    this.codeInfo.scm[index].vobName = "";
    this.codeInfo.scm[index].developmentStreamName = "";
  }

  deleteItem(index) {
    this.index = index;
    this.DelScm.nativeElement.click();
  }
  deleteItemConfirm() {
    this.codeInfo.scm.splice(this.index, 1);
  }
  clearViews() {
    this.IdpdataService.data.buildInfo = {
      'buildtool': this.buildInfo.buildtool,
      'castAnalysis': {},
      'artifactToStage': {},
      'modules': []
    };
    this.IdpdataService.data.checkboxStatus.buildInfo = {};
    this.IdpdataService.data.checkboxStatus.deployInfo = {};
    this.IdpdataService.data.checkboxStatus.testInfo = {};

    this.IdpdataService.data.deployInfo = this.IdpdataService.data.backUp.deployInfo;
    this.IdpdataService.data.testInfo = this.IdpdataService.data.backUp.testInfo;
  }
  resetCodeInfoConfirm() {
    var tech = this.codeInfo.technology;
    var cat= this.codeInfo.category;

			  if(this.IdpdataService.data.formStatus.operation !== "edit" && this.IdpdataService.data.formStatus.operation !== "copy"){
				  this.codeInfo={
	                'category': '',
	                'technology': '',
	                'scm':[],
                  'buildScript': [{'tool':''}, {'tool':''},{}]
	            };
              this.IdpdataService.data.formStatus.buildInfo.buildToolStatus ='0';
			  }
			  else{
				  this.codeInfo={
			                'category': cat,
			                'technology': tech,
			                'scm':[],
                      'buildScript': [{'tool':''}, {'tool':''},{}]
			            };
			  }
			  this.IdpdataService.data.code = this.codeInfo;
        this.IdpdataService.data.checkboxStatus.codeInfo = {};
			  this.addItem();

        this.tempObjectcode=this.IdpdataService.data.checkboxStatus.codeInfo;
  		  console.log(this.tempObjectcode);
        console.log(this.codeInfo);



  }
  resetData() {
    this.resetCodeInfo.nativeElement.click();
  }


  go() {
    this.IdpdataService.data.code = this.codeInfo;
    this.IdpdataService.data.masterJson['code'] = this.codeInfo;
    console.log(this.IdpdataService.data);
    //window.location.href='#/build/';
    this.router.navigate(['/createConfig/buildInfo']);

  };
  ngOnInit() {
    if (this.IdpdataService.data.formStatus.basicInfo.appNameStatus === '0') {
      this.button.nativeElement.click();
    }
  }
  redirectToBasicInfo() {
    this.router.navigate(['/createConfig/basicInfo']);
  }












}
