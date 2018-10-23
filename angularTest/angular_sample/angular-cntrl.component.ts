import { Component, OnInit } from '@angular/core';
import { IdpService } from '../../idp-service.service';
import { IdpdataService } from '../../idpdata.service';
import { IdprestapiService } from '../../idprestapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-angular-cntrl',
  templateUrl: './angular-cntrl.component.html',
  styleUrls: ['./angular-cntrl.component.css']
})
export class AngularCntrlComponent implements OnInit {

  constructor(private IdpdataService: IdpdataService,
    private IdpService: IdpService,
    private IdprestapiService: IdprestapiService,
    private router: Router
  ) {
    super();
    if (this.buildInfo.modules.length === 0) {

      this.tempObject.modules = [{'codeAnalysis':''}];
      this.module = {
        'relativePath': '',
        'jsonPath': '',
        'moduleName': '',
        'npmProxy': '',
        'buildValue': '',
        'unitTesting': 'off',
        'codeCoverage': 'off',
        'codeAnalysis': [],
        'unitTestTool': [],
        'codeCoverageTool': []
      };
      console.log(this.buildInfo.modules);
      this.buildInfo.modules.push(this.module);

      console.log(this.buildInfo.modules[0].codeAnalysis);

    }
        

   if (this.formStatusObject.operation === "edit") 
      this.checkCheckBox();
    
   if (this.formStatusObject.operation === "copy") {
      this.checkCheckBox();
      }
    
    this.IdpdataService.data.buildInfo = this.buildInfo;
    this.IdpdataService.data.checkboxStatus.buildInfo = this.tempObject;


  }

  ngOnInit() {
  }



  //Temporary Object for checkboxes
  tempObject = this.IdpdataService.data.checkboxStatus.buildInfo;
  formStatusObject = this.IdpdataService.data.formStatus;
  buildInfo: any = this.IdpdataService.data.buildInfo;
  module: any;


  codeAnalysisCheckbox() {
    if (this.tempObject.modules[0].codeAnalysis === 'on') {
      if (this.buildInfo.modules[0].codeAnalysis[0] == 'off' || this.buildInfo.modules[0].codeAnalysis[0] == undefined) {
        this.IdpdataService.pa = false;
      }
      else {
        this.IdpdataService.pa = true;
      }


    }
    else if (this.tempObject.modules[0].codeAnalysis === 'off') {
      //this.buildInfo.modules[0].codeAnalysis = ['off','off'];
      //console.log(this.buildInfo.modules[0].codeAnalysis);
      this.IdpdataService.pa = true;
    }
  }

  codeAnalysisCheck() {
    if (this.buildInfo.modules[0].codeAnalysis[0] === 'off') {
      this.IdpdataService.pa = false;
    }
    else {
      this.IdpdataService.pa = true;
    }
  }

  checkCompile() {
    console.log(this.tempObject.modules[0].build);
    if (this.tempObject.modules[0].build == 'on') {
      if (this.buildInfo.modules[0].buildValue == null || this.buildInfo.modules[0].buildValue == undefined || this.buildInfo.modules[0].buildValue == '') {
        this.IdpdataService.compMove = false;
      }
      else {
        this.IdpdataService.compMove = true;
      }
    }
    if (this.tempObject.modules[0].build == 'off') {
      this.IdpdataService.compMove = true;
    }
  }





  checkCheckBox() {


    if (this.tempObject.modules === undefined) {
      this.tempObject.modules = [];
    }


    for (var i = 0; i < this.buildInfo.modules.length; i++) {
      var codeAnalysis = "off";
      var compile = "off";
      var build = "off";




      if (this.buildInfo.modules[i].jsonPath !== null && this.buildInfo.modules[i].jsonPath !== undefined &&
        this.buildInfo.modules[i].jsonPath !== '') {
        compile = 'on';
      }

      if (this.buildInfo.modules[i].buildValue !== null && this.buildInfo.modules[i].buildValue !== undefined &&
        this.buildInfo.modules[i].buildValue !== '') {
        build = 'on';
      }

      if (this.buildInfo.modules[i].codeAnalysis.length !== 0) {
        codeAnalysis = "on";
      }


      this.tempObject.modules.push({
        "codeAnalysis": codeAnalysis,
        "compile": compile,
        "build": build
      });


    }
  }

  jsonPathEmpty(){
    this.buildInfo.modules[0].jsonPath='';
    return false;
  }

  compileOff(){
    this.buildInfo.modules[0].codeAnalysis[1]='off';
    this.tempObject.modules[0].build='off';
    this.tempObject.modules[0].codeAnalysis='off';
    this.buildInfo.modules[0].noViolations='off';
    this.buildInfo.modules[0].allUnitTestPass='off';
    return false;
  }

  buildOn() {
    this.tempObject.modules[0].build='on';
    return false;
  }

  compMoveTrue(){
    this.IdpdataService.compMove=true;
    return false;
  }

  compMoveFalse() {
    this.IdpdataService.compMove=false;
    return false;
  }

  buildValueEmpty(){
    this.buildInfo.modules[0].buildValue='';
    return 'off';
  }

  noViolationsOff() {
    this.buildInfo.modules[0].noViolations='off';
    return false;
  }

  codeAnalysisOff() {
    this.buildInfo.modules[0].codeAnalysis=[];
    this.buildInfo.modules[0].noViolations='off';
    this.IdpdataService.pa=true;
    return false;
  }

  paTrue() {
    this.IdpdataService.pa=true;
    return false;
  }
  paFalse() {
    this.IdpdataService.pa=false;
    return false;
  }

  unitTestingOff() {
    this.buildInfo.modules[0].unitTesting='off';
    return false;
  }

  unitTestToolOff(){
    this.buildInfo.modules[0].unitTestTool[0]='off';
    this.buildInfo.modules[0].codeCoverage='off';
    this.buildInfo.modules[0].codeCoverageTool[0]='off';
    return 'off';
  }

  allUnitTestPassOff() {
    this.buildInfo.modules[0].allUnitTestPass='off';
    return false;
  }

  unitTestProjectNameEmpty() {
    this.buildInfo.modules[0].unitTestProjectName='';
    return 'off';
  }

  unitTrue() {
    this.IdpdataService.unit=true;
    return false;
  }

  unitFalse() {
    this.IdpdataService.unit=false;
    return false;
  }

  codeCoverageToolOff() {
  this.buildInfo.modules[0].codeCoverageTool[0]='off';
  return 'off';
 }

 codeTrue() {
   this.IdpdataService.code=true;
   return false;
 }

 codeFalse(){
   this.IdpdataService.code=false;
   return false;
 }

 codeCoverageOff() {
   this.buildInfo.modules[0].codeCoverage='off';
   this.buildInfo.modules[0].codeCoverageTool[0]='off';
   return false;
 }

 clearAll() {
   this.tempObject.modules[0].build = 'off';
   this.buildInfo.modules[0].buildValue='';
   this.tempObject.modules[0].codeAnalysis='off';
   this.buildInfo.modules[0].codeAnalysis[0]='off';
   this.buildInfo.modules[0].noViolations='off';
   this.buildInfo.modules[0].unitTesting='off';
   this.buildInfo.modules[0].unitTestTool[0]='off';
   this.buildInfo.modules[0].codeCoverage='off';
   this.buildInfo.modules[0].codeCoverageTool[0]='off';
   return 'off';
 }
}
