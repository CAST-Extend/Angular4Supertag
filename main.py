'''
Created on Sep 18, 2018

@author: Bindu_Rajanna
'''


from lxml.doctestcompare import strip
from _ast import Or
from sqlalchemy.sql.expression import true
import cast.analysers.ua
import cast.analysers.log as Print
#import xml.etree.ElementTree as ET
from cast.analysers import CustomObject, Bookmark, create_link
import re
from numpy.core.defchararray import endswith, lower
# from pydoc import classname
import cast.application
from pyodbc import lowercase

CondType_Rule = ''
Act_invalid = []
CondType_Rule = []


class AngularExtension(cast.analysers.ua.Extension):

    def __init__(self):
        self.k = 1
        self.filename = ""
        self.file = ""
        self.name = ""

    def start_analysis(self):
        Print.info("Start Analysis!")
        pass

    def start_file(self, file):
        Print.info("Start f!" + str(file))
        contentList = []
        SuperCount = 0
        self.filename = file.get_path()
        self.file = file
        Print.info("###############printing file name############")
        Print.info("FileName--" + str(self.filename))
        file_ref = open(self.filename, encoding='UTF_8')
        # contentList=[];
        for i in file_ref:
            contentList.append(str(i).lstrip())
        Print.info("contentList >> " + str(contentList))
        fList = contentList

        Print.info("Flist >> " + str(fList))

        switchcnt=0
        supercnt=0
        for line in range(0, len(fList)):
            
            if fList[line].startswith("super"):
                supercnt=supercnt+1
                AngularJS_Super = CustomObject()
                self.saveObject(AngularJS_Super, str(self.filename), self.filename + str(self.filename),
                                "AngularJS_Super", self.file, self.filename + "AngularJS_Super"+str(supercnt))
                AngularJS_Super.save()
                AngularJS_Super.save_position(Bookmark(self.file, line + 1, 1, line + 1, -1))

                SuperCount = SuperCount + 1
               
                AngularJS_Super.save_violation("Angular_CustomMetrics.SupershouldInvokedonce",
                                               Bookmark(file, 1, 1, -1, -1), additional_bookmarks=None)
                Print.info(" Super violation saved")
                break
                
            if fList[line].startswith("switch"):
                switchcnt=switchcnt+1
                AngularJS_Switch = CustomObject()
                self.saveObject(AngularJS_Switch, str(self.filename), self.filename + str(self.filename),
                                "AngularJS_Switch", self.file, self.filename + "AngularJS_Switch"+str(switchcnt))
                AngularJS_Switch.save()
                
                for line_Num in range(line+1, len(fList)):
                    if (fList[line_Num].startswith("//")):
                        pass
                    else:                    
                        if "default:" in fList[line_Num+1]:
                            AngularJS_Switch.save_violation("Angular_CustomMetrics.switchrule",
                                               Bookmark(file, 1, 1, -1, -1), additional_bookmarks=None)
                            Print.debug("switch violation saved")
                        break                  
                
        
        

    def end_file(self, file):
        Print.info("end file")
        # cast.analysers.log.debug("End file!")
        pass

    def end_analysis(self):
        Print.info("end analysis")
        # self.intermediate_file_Functions.write(str(finalData));
        pass

    def saveObject(self, obj_reference, name, fullname, obj_type, parent, guid):
        obj_reference.set_name(name)
        cast.analysers.log.debug("Obj_Name--------!" + str(name))
        obj_reference.set_fullname(fullname)
        obj_reference.set_type(obj_type)
        cast.analysers.log.debug("Obj_Type--------!" + str(obj_type))
        obj_reference.set_parent(parent)
        cast.analysers.log.debug("Obj_parent--------!" + str(parent))
        obj_reference.set_guid(guid)
        cast.analysers.log.debug("Obj_guid--------!" + str(guid))
        Print.info('Angular  object  Saved ' + name)
        pass
