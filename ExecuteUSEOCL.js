//================ DRAFT SCRIPT ======================
// Type your code at the end of this file. 
// To execute your code select "Execute draft script" from the "tool" menu 
var	staruml = new ActiveXObject("StarUML.StarUMLApplication");
staruml.log( "=== DraftScript STARTING " ) ;

var	metamodel = staruml.MetaModel;
var	project = staruml.GetProject(); // project object
//var	projectName = project.Title; // project name
//var documentFileName = staruml.ProjectManager.ProjectDocument.FileName; //full name (with path)

var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
//	filesystem.FolderExists(folderName))
//	folder = filesystem.CreateFolder(folderName);
//	filesystem.CopyFolder(sourcoldername, targetfoldername);
//	file = filesystem.CreateTextFile(filename, true, false);
//  file.WriteLine("<HTML>");
//  file.WriteLine("<HTML>");
//  file.Close();


// Geting arguments from the command line of the form
// WScript thisscript.js arg0 arg1 arg2
// .Length
// staruml.log("Arg1:"+WScript.Arguments.Item(0)) ;


//******************************************************
//     PUT YOUR CODE HERE
//******************************************************

staruml.log("Bonjour tout le monde") ;
staruml.Visible = 1 ;
staruml.log( typeof staruml ) ;
for (property in staruml)  {
  staruml.log( staruml.property ) ;
}
/* var xl = new ActiveXObject("Excel.Application");
xl.Visible = 1 ;
staruml.log( xl.Worksheets("Sheet1").Range("A1").Value ) ;

*/


/*
To create an instance of the TextStream object you can use the CreateTextFile or OpenTextFile methods of the FileSystemObject object, or you can use the OpenAsTextStream method of the File object.
The TextStream object's properties and methods are described below:
Properties

Property	Description
AtEndOfLine	Returns true if the file pointer is positioned immediately before the end-of-line marker in a TextStream file, and false if not
AtEndOfStream	Returns true if the file pointer is at the end of a TextStream file, and false if not
Column	Returns the column number of the current character position in an input stream
Line	Returns the current line number in a TextStream file
Methods

Close	Closes an open TextStream file
Read	Reads a specified number of characters from a TextStream file and returns the result
ReadAll	Reads an entire TextStream file and returns the result
ReadLine	Reads one line from a TextStream file and returns the result
Skip	Skips a specified number of characters when reading a TextStream file
SkipLine	Skips the next line when reading a TextStream file
Write	Writes a specified text to a TextStream file
WriteLine	Writes a specified text and a new-line character to a TextStream file
WriteBlankLines	Writes a specified number of new-line character to a TextStream file

set fs=Server.CreateObject("Scripting.FileSystemObject")
set f=fs.CreateTextFile("c:\test.txt")
f.write("Hello World!")
f.close
*/
function getFileContent(/*String!*/ filename) {
  var file=fileSystem.OpenTextFile(filename,/*ForReading*/ 1, /*DoNotCreate*/false) ;
  var text=file.ReadAll() ;
  file.Close() ;
  return text ;
}
  
// Response.Write("The text in the file is: " & x)



//------------------ Shell -----------------------------------------
// Shell.Application
// var shell = new ActiveXObject("Shell.Application") ;
// shell.ShellExecute("cmd arg1 arg2 ...")




// var shell = new ActiveXObject("WScript.Shell");
// shell.Run("\"C:\\Program Files\\Internet Explorer\\IExplore.exe\"http://toto.com");
// shell.Run("C:\\DEV\\use-3.0.4\\bin\\use.bat -nogui quit.soil")

var useoclFile = "CyberHotel-Residences.use" ;
var soilFile = "quit.soil" ;
var useoclExecutable = "C:\\DEV\\use-3.0.4\\bin\\use.bat"
var outfile ="cmd-out.txt" ;
var errfile ="cmd-err.txt" ;


var shell = new ActiveXObject("WScript.Shell") ;
var cmd = useoclExecutable+" -nogui "+useoclFile+" "+soilFile ;
//var cmd = "C:\\DEV\\use-3.0.4\\bin\\use.bat" ;
staruml.log("launching use ocl: "+cmd) ;
var errcode = shell.Run("%comspec% /c "+cmd+" 1>"+outfile+" 2>"+errfile,0,true) ;
staruml.log("   exit code: "+errcode) ;

if (errcode==0) {
  // no error
} else if (errcode==1) {
  // some error 
  
  var errors=getFileContent(errfile) ;
  var errorLines = errors.split("\n") ;

  var sourcelines=getFileContent(useoclFile).split("\n") ;   
  
  // extract error code from useocl output
  for (var i=0 ; i<errorLines.length; i++) {
    // staruml.log(errorLines[i]) ;
    pieces=errorLines[i].match(/:line ([0-9]+):([0-9]+) (.*)$/) ;
    if (pieces!=null) {
      lineno=pieces[1] ;
      columnno=pieces[2] ;
      message=pieces[3] ;
      staruml.log(lineno+" - "+columnno+" - "+message) ;
      staruml.log(sourcelines[lineno-1]) ;
    }  
  }
} else {
  staruml.log("ERROR: cannot execute "+cmd) ;
}


/*
----------------- Execute 
var shell = new ActiveXObject("WScript.Shell") ;
var exec = shell.Exec("C:\\DEV\\use-3.0.4\\bin\\use.bat -nogui CyberHotel-Residences.use quit.soil")

To be translated from vb
while (! exec.StdOut.AtEndOfStream) {
 strLine = objExecObject.StdOut.ReadLine()
 Wscript.Echo "out: " & strLine
Loop

Do Until objExecObject.StdErr.AtEndOfStream
 strLine = objExecObject.StdErr.ReadLine()
 Wscript.Echo "err: " & strLine
Loop
*/



////////////////////////////////////////////////
// getAllRecursiveElements : 
//
function getAllRecursiveElements(isDeep, rootElem, filterType) {
  // 1.get elem's type
  var rootElemPathname = rootElem.pathname;
  
  // 2.get all elements whose type is filterType in MetaClass
  var metaClass = app.MetaModel.FindMetaClass(filterType);
  var count = metaClass.getInclusiveInstanceCount();
  
  var elemArray = new Array();
  var rc = rootElemPathname.split("::").length;
  
  for (var i = 0; i < count; i++) {
    var elem = metaClass.getInclusiveInstanceAt(i);
  
    // 3.0 in case of filterType
    if (elem.IsKindOf(filterType)) {
      if (elem.pathname.indexOf(rootElemPathname + "::") == 0) {
        // 3.1 in case of recursive option
        if (isDeep) {
          // 3.insertion sort by name
          elemArray = insertElementArray(elem, elemArray);
        }
  
        // 3.2 in case of not recursive option
        else {
          // 3.2.1 if no. of separator of pathname of selected element == no. of separator of pathname of rootElem + 1
          if (elem.pathname.split("::").length == (rc+1)) {
            elemArray = insertElementArray(elem, elemArray);
          }
          // 3.2.2 unless
          else {
            // do nothing
          }
        }
      }
    }
  }
  
  return elemArray;
}

/////////////////////////////////////////////////
// IsItemTrue : 
//
function IsItemTrue(wholeConds) {
  var cond = true;
  
  try
  {
    if ((wholeConds != "") && (wholeConds != null)) {
      eval("var cond = "+ wholeConds);
      return cond;
    } else {
      return true;
    }
  }
  catch (ex)
  {
    log(GetErrorPos()+": Error exists in "+wholeConds+" condition argument.");
    throw ex;
  }
}

////////////////////////////////////////////////
// createFile :
//
function createFile(path) {
  notify('Creating file '+ path + '...');
  return fileObject.CreateTextFile(path, true, false);
}

/////////////////////////////////////////////////
// deleteFile :
//
function deleteFile(path) {
  notify('Deleting file '+ path + '...');
  fileObject.DeleteFile(path, false);
}

/////////////////////////////////////////////////
// createFolder :
//
function createFolder(path) {
  notify('Creating folder '+ path + '...');
  return fileObject.CreateFolder(path);
}

/////////////////////////////////////////////////
// deleteFolder :
//
function deleteFolder(path) {
  notify('Deleting folder '+ path + '...');
  fileObject.deleteFolder(path);
}

/////////////////////////////////////////////////
// fileExists :
//
function fileExists(path) {
  return fileObject.FileExists(path);
}

/////////////////////////////////////////////////
// fileExists :
//
function folderExists(path) {
  return fileObject.FolderExists(path);
}

/////////////////////////////////////////////////
// fileBegin :
//
function fileBegin(path) {
  fileExceptionOccurred = false;
  
  try
  {
    var cs;
    if (fileExists(path)) {
      cs = fileObject.CreateTextFile(path, true, false);
    } else {
      var ep = path.lastIndexOf("\\");
      if (ep > -1) {
        var folder = path.substr(0, ep);
        if (!folderExists(folder))
            createFolder(folder);
      }
  
      cs = createFile(path);
    }
  
    outputStreamStack.push(os);
    os = cs;
  }
  catch (ex)
  {
    fileExceptionOccurred = true;
  }
}

/////////////////////////////////////////////////
// fileEnd :
//
function fileEnd() {
  if (!fileExceptionOccurred)  {
    os.close();
    os = outputStreamStack.pop();
  } else {
    // ...?
  }
}

