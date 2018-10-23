import re
import cast.analysers.log as Print
from lxml.doctestcompare import strip
from cast.analysers import CustomObject,Bookmark,create_link
import cast.analysers.ua

from _ast import Or
from sqlalchemy.sql.expression import true
from numpy.core.defchararray import endswith
from pydoc import classname
import cast.application
class TSParse():
    
    def __init__(self):
        self.tags_found =[]
        Print.debug("Running..")
        self.filename=""
        self.file = "" 
        self.name=""
    def findIndex(self,content,tag,index):
        for i in content:
            if re.search(tag,i):
                return index+1;
            index+=1;       
        return -1;
    def getComponetList(self,contentList,tag,filename):
        #Print.debug("filename----" + str(filename))
        componentList=[];
        l=self.findIndex(contentList,tag,0);
        #Print.debug("Contentlist----" + str(contentList))
        #Print.debug("Tag----" + str(tag))
        lengthX=len(contentList);
        if re.search(tag,contentList[l-1]):
            index=contentList[l-1].find("[")
            contentListNew=contentList[l-1].split("[");
            for i in contentListNew[1].split(","):
                if i!="":
                    #componentList.append({i:filename})
                    componentList.append(i)      
        for i in range(l,lengthX):
            if re.search("]",contentList[i]):
                contentListLast=contentList[i].split("]");
                for j in contentListLast:
                    if j!="":
                        j=strip(j)
                        splitList=j.split(",")
                        for k in splitList:
                            if k!="":
                                #componentList.append({k:filename}); 
                                componentList.append(k);   
                break;
            else:
                if contentList[i]!="":
                    contentList[i]=strip(contentList[i])
                    splitList=contentList[i].split(",")
                    for j in splitList:
                        if j!="":
                     
                            #componentList.append({j:filename})
                            componentList.append(j);
        #Print.debug("Component Dict--" + str(componentList))    
        return componentList;   
    def getClassName(self,contentList,exportClass,filename):
        funcList=[]
        
        Print.debug("Export Class name---") 
        className=[];
        exportclassName=[]
        lengthX=len(contentList);
        ClassFunctions={}
        l=0;
        tsListValue=[];
        while l!=-1: 

            l=self.findIndex(contentList[l+1:lengthX],exportClass,l);
    
            if l > 0:
                classNameList=[];
                className=[];
        
                classNameList=contentList[l].split(" ");
                Print.debug("classNameList"+str(contentList[l]))
 
                for i in classNameList:
                        if i!="":
                            i=strip(i)
                            className.append(i)
                for j in className:
                    if j == "export":
                        indexOfExport = className.index(j)
                        indexOfClassName= indexOfExport+2
                        compName=className[indexOfClassName]
                        tsListValue.append(compName)
                        funcList=self.getFunctionNames(contentList,l, lengthX)
                        Print.debug("Angelin kuttty"+str(funcList))
                        tsListValue.append(self.getConstructornames(contentList,filename));
                        Print.debug("****tsListValue" + str(tsListValue))

        return tsListValue,funcList;       
        
    def getFunctionNames(self,contentList,pos,lengthX):
        l=pos
        funcList=[]
        while l<lengthX | l!=-1:
            funcNum=self.findIndex(contentList[l+1:lengthX],"[a-zA-Z]+[(].*[)](.*)[\s]*[{]",l+1)
            listOfException=["if","else if","while","for",".","","{","}","ngOnInit"]
            if len(contentList[funcNum-1].split("."))==1:
                funcName=contentList[funcNum-1].split("(")[0].strip();
                if funcName not in listOfException:
                    funcList.append(funcName);               
                
            l=funcNum
        Print.debug("FuncNum"+str(funcNum))
        return funcList;
    pass  
    def getConstructornames(self,contentList,filename):
        l=0;
        index = 0
        componentList=[]
        componentVariable=[]
        constructorDict={}
        
        constFuncDict={}
        lengthX=len(contentList);
        pos=self.findIndex(contentList[l+1:lengthX],"constructor[\s]*[(][\s]*",l+1)
        endpos=self.findIndex(contentList[pos:lengthX],"\)",pos)
        for i in range(pos,endpos):
            if re.search("private" or "public",contentList[i]):
                ConstructorListNew=contentList[i].split("private");
                #Print.debug(str(ConstructorListNew))
                for j in ConstructorListNew:
                    if j!="" and re.search(":",j):
                        componentList=j.split(":")
                        constructorDict.update({componentList[0].strip():componentList[1].replace(",","").strip()})
                        componentVariable.append(componentList[0].strip()) 
        funcList=[];
        classNameFunctionList={};
        for i in range(0,lengthX): 
            
            for x in componentVariable:   
                if re.search("this." + x + "[.][a-zA-Z]*[(]",contentList[i]):  
                    funcList.append(contentList[i].strip())
                    splitList=[]
                    Print.debug("okat"+str(contentList[i].split(x)[1].split("(")));
                    if constructorDict[x] not in classNameFunctionList:
                        classNameFunctionList.update({constructorDict[x]:[]})
                    classNameFunctionList[constructorDict[x]].append(contentList[i].split(x)[1].split("(")[0].replace(".",""))
 
        return classNameFunctionList
    

if __name__ == '__main__':
    pass   
    