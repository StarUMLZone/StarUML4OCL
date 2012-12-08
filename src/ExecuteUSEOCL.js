var	staruml = new ActiveXObject("StarUML.StarUMLApplication");
var	metamodel = staruml.MetaModel;
var	project = staruml.GetProject(); // project object
var	projectName = project.Title; // project name
var documentFileName = staruml.ProjectManager.ProjectDocument.FileName; //full name (with path)
var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
var shell = new ActiveXObject("WScript.Shell") ;

var tmpDir = "tmp\\" ;
var useFile = tmpDir+"model.use" ;
var useoclExecutable = "C:\\DEV\\use-3.0.4\\bin\\use.bat" ;
var outfile = tmpDir+"cmd-out.txt" ;
var errfile = tmpDir+"cmd-err.txt" ;

errcode = executeUseCommand(useFile,"tmp\\quit.soil") ;

if (errcode==0) {
  // no error
} else if (errcode==1) {
  // some errors 
  var results=parseUseResults(useFile,outfile,errfile) ;
  
} else {
  staruml.log("ERROR: cannot execute "+cmd) ;
}

function parseUseResults(useFile,outfile,errfile) {
  var errors=getFileContent(errfile) ;
  var errorLines = errors.split("\n") ;

  var parsedErrors = [] ;
  var sourcelines=getFileContent(useFile).split("\n") ;   
  
  // extract error code from useocl output
  for (var i=0 ; i<errorLines.length; i++) {
    // staruml.log(errorLines[i]) ;
    pieces=errorLines[i].match(/:line ([0-9]+):([0-9]+) (.*)$/) ;
    if (pieces!=null) {
      var line=pieces[1] ;
      var col=pieces[2] ;
      var message=pieces[3] ;
      var source=sourcelines[line-1] ;
      parsedErrors.push( {
        "line"    : line ,
        "col"     : col ,
        "message" : message,
        "source"  : source } ) ;
      staruml.log(line+" - "+col+" - "+message) ;
    }  
  }
  return { "errors" : parsedErrors } ;  
}


function executeUseCommand(/*String!*/useFile,/*String!*/soilFile) {
  var cmd = useoclExecutable+" -nogui "+useFile+" "+soilFile ;
  staruml.log("launching use ocl: "+cmd) ;
  var errcode = shell.Run("%comspec% /c "+cmd+" 1>"+outfile+" 2>"+errfile,0,true) ;
  staruml.log("   exit code: "+errcode) ;
  return errcode ;
}


function getFileContent(/*String!*/ filename) {
  var file=fileSystem.OpenTextFile(filename,/*ForReading*/ 1, /*DoNotCreate*/false) ;
  var text=file.ReadAll() ;
  file.Close() ;
  return text ;
}


