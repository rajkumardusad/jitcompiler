const path = require("path");
const os = require("os");
const fs = require("fs");
const { languages } = require("./supported-languages");
const config = require("../config/config");

// Get file execution details like class name, module name from source code
function getFileDetailFromCode(language, code) {
  let details = {};
  if (language == "java") {
    // Get java package and class name
    let srcCode = code.split("\n");
    let packageName = "";
    let className = "";
    let matchPackage = false;
    let matchClass = false;
    let isMainClass = false;
    let ignore = false;
    for (line of srcCode) {
      let tmpLine = line.trim();
      if (ignore == true) {
        // Ignoring multi line comments
        // Matching ending multi line comment
        if (tmpLine.match(/\*\//)) {
          ignore = false;
        } else {
          continue;
        }
      } else {
        // Find single line comment
        if (tmpLine.match(/^\/\//)) {
          continue;
        }
        // Find starting multi line comment
        if (tmpLine.match(/^\/\*/)) {
          // Check multi line comment is end or not
          if (!tmpLine.match(/\*\//)) {
            ignore = true;
            continue;
          } else {
            // Remove comments
            tmpLine = tmpLine.replace(/\/\*.*\*\//g, "");
          }
        }
        if (tmpLine.match(/\/\*/) && !tmpLine.match(/\*\//)) {
          ignore = true;
          continue;
        }
      }
      // Match package name
      if (matchPackage == false) {
        let match = tmpLine.match(/package.*/);
        if (match && match.length > 0) {
          matchPackage = true;
        }
      }
      // Match class name
      if (isMainClass == false) {
        let match = tmpLine.match(/class.*/);
        if (match && match.length > 0) {
          matchClass = true;
          className = "";
        }
      }

      // Get package name
      if (matchPackage == true && packageName == "") {
        packageName = tmpLine
          .replace(/package/, "")
          .replace(/;.*/g, "")
          .replace(/\/\*.*\*\/|\/\/.*/g, "")
          .trim();
      }
      // Get class name
      if (matchClass == true && className == "") {
        className = tmpLine
          .replace(/class/, "")
          .replace(/{.*/g, "")
          .replace(/\/\*.*\*\/|\/\/.*/g, "")
          .trim();
      }
      if (className.length > 0) {
        // Check is main class
        tmpLine = tmpLine
          .replace(/{/g, "")
          .replace(/\/\*.*\*\/|\/\/.*/g, "")
          .replace(/\s+/g, " ");
        let match = tmpLine.match(
          /public(\s)+static(\s)+void(\s)+main(\s)*\((\s)*String(\s)+args(\s)*\[(\s)*\](\s)*\).*/
        );
        if (match && match.length > 0) {
          isMainClass = true;
        }
      }
      if (isMainClass == true) {
        break;
      }
    }
    // Get package name
    if (packageName) {
      details.packageName = packageName;
    }
    // Get class name
    if (className) {
      details.className = className;
    } else {
      details.className = "main";
    }
  } else if (language == "scala") {
    // Get scala object name
    let srcCode = code.split("\n");
    let objectName = "";
    let matchObject = false;
    let isMainObject = false;
    let ignore = false;
    for (line of srcCode) {
      let tmpLine = line.trim();
      if (ignore == true) {
        // Ignoring multi line comments
        // Matching ending multi line comment
        if (tmpLine.match(/\*\//)) {
          ignore = false;
        } else {
          continue;
        }
      } else {
        // Find single line comment
        if (tmpLine.match(/^\/\//)) {
          continue;
        }
        // Find starting multi line comment
        if (tmpLine.match(/^\/\*/)) {
          // Check multi line comment is end or not
          if (!tmpLine.match(/\*\//)) {
            ignore = true;
            continue;
          } else {
            // Remove comments
            tmpLine = tmpLine.replace(/\/\*.*\*\//g, "");
          }
        }
        if (tmpLine.match(/\/\*/) && !tmpLine.match(/\*\//)) {
          ignore = true;
          continue;
        }
      }

      // Match object name
      if (isMainObject == false) {
        let match = tmpLine.match(/def.*/);
        if (match && match.length > 0) {
          matchObject = true;
          objectName = "";
        }
      }

      if (matchObject == true && objectName == "") {
        objectName = tmpLine
          .replace(/object/, "")
          .replace(/{.*/g, "")
          .replace(/\/\*.*\*\/|\/\/.*/g, "")
          .trim();
      }
      if (objectName.length > 0) {
        // Check is main object
        tmpLine = tmpLine
          .replace(/{/g, "")
          .replace(/\/\*.*\*\/|\/\/.*/g, "")
          .replace(/\s+/g, " ");
        let match = tmpLine.match(
          /def(\s)+main(\s)*\((\s)*args:(\s)+Array(\s)*\[(\s)*String(\s)*\](\s)*\).*/
        );
        if (match && match.length > 0) {
          isMainObject = true;
        }
      }
      if (isMainObject == true) {
        break;
      }
    }
    // Get object name
    if (objectName) {
      details.objectName = objectName;
    } else {
      details.objectName = "main";
    }
  } else if (language == "erlang") {
    // Get erlang module name
    let srcCode = code.split("\n");
    let moduleName = "";
    for (line of srcCode) {
      let tmpLine = line.trim();
      // Ignoring single line comment
      if (tmpLine.match(/^%/)) {
        continue;
      }
      // Match module name
      let match = tmpLine.match(/-module.*/);
      if (match && match.length > 0) {
        if (moduleName == "") {
          moduleName = tmpLine
            .replace(/-module.*\(/, "")
            .replace(/\).*/g, "")
            .trim();
        }
        break;
      }
    }
    // Get module name
    if (moduleName) {
      details.moduleName = moduleName;
    } else {
      details.moduleName = "main";
    }
  }
  return details;
}

// Create linux command to compile and run program
function compileCode(executionDetail) {
  // Command max execution time 50 seconds if process is running after 50 seconds then terminate process in 2 seconds
  let timeout = "timeout -k 2 50";
  // Command to execute
  let cmd = [];

  // Create temp directory
  let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tmp-"));
  fs.chmodSync(tmpDir, 0o777);

  // Create program file inside tmp dir
  let executeFileName = "";
  let outputFileName = "";
  let fileData = {};
  // Check code execution mode
  if (executionDetail.executionMode.toLowerCase() == "code") {
    // Create files for different languages
    if (executionDetail.language == "java") {
      fileData = getFileDetailFromCode(
        executionDetail.language,
        executionDetail.code
      );
      // Create java package directory
      if (fileData.packageName) {
        fs.mkdirSync(path.join(tmpDir, fileData.packageName), {
          recursive: true,
        });
        fs.chmodSync(path.join(tmpDir, fileData.packageName), 0o777);
      }
      // Create program file
      if (fileData.className) {
        executeFileName = `${fileData.className}.${
          languages[executionDetail.language].fileExtension
        }`;
        outputFileName = fileData.className;
        fs.writeFileSync(
          path.join(tmpDir, executeFileName),
          executionDetail.executeCode
        );
      } else {
        executeFileName = `main.${
          languages[executionDetail.language].fileExtension
        }`;
        outputFileName = "main";
        fs.writeFileSync(
          path.join(tmpDir, executeFileName),
          executionDetail.executeCode
        );
      }
    } else if (executionDetail.language == "scala") {
      fileData = getFileDetailFromCode(
        executionDetail.language,
        executionDetail.code
      );
      // Create program file
      if (fileData.objectName) {
        executeFileName = `${fileData.objectName}.${
          languages[executionDetail.language].fileExtension
        }`;
        outputFileName = fileData.objectName;
        fs.writeFileSync(
          path.join(tmpDir, executeFileName),
          executionDetail.executeCode
        );
      } else {
        executeFileName = `main.${
          languages[executionDetail.language].fileExtension
        }`;
        outputFileName = "main";
        fs.writeFileSync(
          path.join(tmpDir, executeFileName),
          executionDetail.executeCode
        );
      }
    } else if (executionDetail.language == "erlang") {
      fileData = getFileDetailFromCode(
        executionDetail.language,
        executionDetail.code
      );
      // Create program file
      if (fileData.moduleName) {
        executeFileName = `${fileData.moduleName}.${
          languages[executionDetail.language].fileExtension
        }`;
        outputFileName = fileData.moduleName;
        fs.writeFileSync(
          path.join(tmpDir, executeFileName),
          executionDetail.executeCode
        );
      } else {
        executeFileName = `main.${
          languages[executionDetail.language].fileExtension
        }`;
        outputFileName = "main";
        fs.writeFileSync(
          path.join(tmpDir, executeFileName),
          executionDetail.executeCode
        );
      }
    } else {
      executeFileName = `main.${
        languages[executionDetail.language].fileExtension
      }`;
      outputFileName = "main";
      fs.writeFileSync(
        path.join(tmpDir, executeFileName),
        executionDetail.executeCode
      );
    }
  } else {
    executeFileName = executionDetail.executeFile;
    outputFileName =
      executeFileName.split(".").shift() ?? executionDetail.executeFile;
    if (executionDetail.language == "java") {
      fileData = getFileDetailFromCode(
        executionDetail.language,
        executionDetail.files.find(function (e) {
          return e.fileName == executeFileName;
        })?.sourceCode ?? ""
      );
      if (fileData.packageName) {
        fs.mkdirSync(path.join(tmpDir, fileData.packageName), {
          recursive: true,
        });
        fs.chmodSync(path.join(tmpDir, fileData.packageName), 0o777);
      }
    } else if (executionDetail.language == "scala") {
      fileData = getFileDetailFromCode(
        executionDetail.language,
        executionDetail.files.find(function (e) {
          return e.fileName == executeFileName;
        })?.sourceCode ?? ""
      );
    } else if (executionDetail.language == "erlang") {
      fileData = getFileDetailFromCode(
        executionDetail.language,
        executionDetail.files.find(function (e) {
          return e.fileName == executeFileName;
        })?.sourceCode ?? ""
      );
    }
    executionDetail.files.forEach(function (e) {
      fs.writeFileSync(path.join(tmpDir, e.fileName), e.sourceCode);
    });
  }

  // Create stdin file to provide stdin to child process
  if (executionDetail.stdin) {
    fs.writeFileSync(path.join(tmpDir, ".stdin"), executionDetail.stdin);
  }

  // Set execution command for languages
  if (executionDetail.language == "c" || executionDetail.language == "cpp") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}' -lm`
    );
    cmd.push(
      `${timeout} ./a.out ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "csharp") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } -out:'${outputFileName}' '${executeFileName}'`
    );
    cmd.push(
      `${timeout} mono '${outputFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "rust") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}'`
    );
    cmd.push(
      `${timeout} ./'${outputFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "typescript") {
    cmd.push(
      `NO_COLOR=true ${timeout} ${
        languages[executionDetail.language].compiler
      } run --no-check '${executeFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "java") {
    // Execute java package program
    if (fileData.packageName) {
      cmd.push(`javac -d . '${executeFileName}'`);
      cmd.push(
        `${timeout} java '${fileData.packageName}.${outputFileName}' ${
          executionDetail.args
            ? executionDetail.args.replace(/\r?\n|\r/g, " ")
            : ""
        }`
      );
    } else {
      cmd.push(
        `${timeout} ${
          languages[executionDetail.language].compiler
        } '${executeFileName}'`
      );
      cmd.push(
        `${timeout} java '${outputFileName}' ${
          executionDetail.args
            ? executionDetail.args.replace(/\r?\n|\r/g, " ")
            : ""
        }`
      );
    }
  } else if (executionDetail.language == "kotlin") {
    // cmd.push(`${timeout} ${languages[executionDetail.language].compiler} '${executeFileName}' -include-runtime -d ${outputFileName}.jar`);
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}' -d ${outputFileName}.jar`
    );
    cmd.push(
      `${timeout} java -jar '${outputFileName}.jar' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "scala") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}'`
    );
    cmd.push(
      `${timeout} scala '${outputFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "assembly") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } -f elf64 '${executeFileName}'`
    );
    cmd.push(`${timeout} ld -s -o '${outputFileName}' '${outputFileName}.o'`);
    cmd.push(
      `${timeout} ./'${outputFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "fortran") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}'`
    );
    cmd.push(
      `${timeout} ./a.out ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "objective-c") {
    // cmd.push(`${timeout} ${languages[executionDetail.language].compiler} '${executeFileName}' $(gnustep-config --objc-flags) $(gnustep-config --base-libs)`);
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}' -MMD -MP -DGNUSTEP -DGNUSTEP_BASE_LIBRARY=1 -DGNU_GUI_LIBRARY=1 -DGNU_RUNTIME=1 -DGNUSTEP_BASE_LIBRARY=1 -fno-strict-aliasing -fexceptions -fobjc-exceptions -D_NATIVE_OBJC_EXCEPTIONS -pthread -fPIC -Wall -DGSWARN -DGSDIAGNOSE -Wno-import -g -O2 -fgnu-runtime -fconstant-string-class=NSConstantString -I. -I/home/compiler/GNUstep/Library/Headers -I/usr/local/include/GNUstep -I/usr/include/GNUstep -rdynamic -shared-libgcc -pthread -fexceptions -fgnu-runtime -L/home/compiler/GNUstep/Library/Libraries -L/usr/local/lib -L/usr/lib -lgnustep-base -lobjc -lm`
    );
    cmd.push(
      `${timeout} ./a.out ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "lisp") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } --script '${executeFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "erlang") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}'`
    );
    cmd.push(
      `${timeout} erl -noshell -s '${outputFileName}' start -s init stop ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "nim") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } c -r --hints:off '${executeFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "cobol") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } -x -free '${executeFileName}' -o '${outputFileName}'`
    );
    cmd.push(
      `${timeout} ./'${outputFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "pascal") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } -vw '${executeFileName}'`
    );
    cmd.push(
      `${timeout} ./'${outputFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "vb") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}'`
    );
    cmd.push(
      `${timeout} mono '${outputFileName}.exe' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "fsharp") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}'`
    );
    cmd.push(
      `${timeout} mono '${outputFileName}.exe' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "sqlite3") {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } mydb.db < '${executeFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else if (executionDetail.language == "mysql") {
    cmd.push(
      `${timeout} ${languages[executionDetail.language].compiler} --table ${path
        .parse(tmpDir)
        .base.replace(/-/g, "")} < '${executeFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  } else {
    cmd.push(
      `${timeout} ${
        languages[executionDetail.language].compiler
      } '${executeFileName}' ${
        executionDetail.args
          ? executionDetail.args.replace(/\r?\n|\r/g, " ")
          : ""
      }`
    );
  }

  // Create linux command for execution
  // Command for docker container
  const command = `sudo docker exec -i --user ${config.container.user} -w /compiler/${
    path.parse(tmpDir).base
  } -e ${config.container.env} ${config.container.name} bash -c "${cmd.join(
    " && "
  )}${executionDetail.stdin ? " < .stdin" : ""}"`;
  // Command for linux user
  // const command = `sudo runuser -l compiler -c "${cmd.join(' && ')}" ${(executionDetail.stdin ? '< ./.stdin' : '')}`;

  return {
    command: command,
    tmpDir: tmpDir,
  };
}

module.exports = {
  getFileDetailFromCode: getFileDetailFromCode,
  compileCode: compileCode,
};
