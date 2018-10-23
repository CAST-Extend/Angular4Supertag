from cast.application import ApplicationLevelExtension, ReferenceFinder
import logging

class ApplicationExtension(ApplicationLevelExtension):

    #initialization of variables
    nbProgramScanned = 0
    nbProgramInViolationForCancelStmt = 0
    
    def scan_program(self, application, program):
        logging.debug("INIT scan_program : program id: >" +str(program.id))
        #initialization
        isInViolationForbraces = False
        
        # one RF for multiples patterns
        rfCall = ReferenceFinder()
        rfCall.add_pattern('COMMENTEDline',before = '', element = r'^......\*.*$', after = '')     # requires application_1_4_7 or above
        rfCall.add_pattern('CANCELstatement', before='', element = "[cC][aA][nN][cC][eE][lL][ \r\n\t]+.*", after='')
               
        # search all patterns in current program
        try:
            references = [reference for reference in rfCall.find_references_in_file(program)]
        except FileNotFoundError:
            logging.warning("Wrong file or file path, from Vn-1 or previous " + str(program))
        else:
            # for debugging and traversing the results
            for reference in references:
                logging.debug("DONE: reference found: >" +str(reference))
                if  reference.pattern_name=='CANCELstatement':
                    logging.debug(" ! Found braces statement :" + str(reference.value)) 
                    # this is a violation - put the program in violation
                    isInViolationForbraces = True
                    program.save_violation('Angular_CustomMetrics.ControlstructuresUsecurlybraces', reference.bookmark)
        
            # reporting the violations for statistics / logging purpose - outside of the reference loop
            if isInViolationForCANCEL == True:
                self.nbProgramInViolationForCancelStmt += 1
             
    def end_application(self, application):
         
        logging.debug("running code at the end of an application in Angular4")
        #declare ownership for 1 diags (this call also performs the required init cleaning)
        application.declare_property_ownership('Angular_CustomMetrics.ControlstructuresUsecurlybraces',['AngularJS_Class'])
         
        
        files = application.get_files(['AngularJS_Class'])
          
        #looping through Angular programs
        for o in files:
            logging.debug("inside loop")
            # check if file is analyzed source code, or if it generated (Unknown)
            if not o.get_path():
                continue
            # check if file is a program , skip the copybooks (for the moment at least)
            if not (o.get_path().endswith('.ts')):
                continue
            #cast.analysers.log.debug("file found: >" + str(o.get_path()))
            logging.debug("file found: >" + str(o.get_path()))
            self.scan_program(application, o)               
            self.nbProgramScanned += 1
         
#         # Final reporting in ApplicationPlugins.castlog
        
        logging.info("STATISTICS for AIA expectation: Number of programs with violation for control struct braces statement: " + str(self.nbProgramInViolationForCancelStmt))