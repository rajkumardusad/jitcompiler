// Initialize ace editor
ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
// Set custom theme color
editor.container.classList.add("dark:bg-gray-900");
$(".ace_gutter > .ace_layer").addClass("border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800");

// Set editor font size
var fontSize = "16px";
if (window.innerWidth >= 768) {
  fontSize = "17px";
} else if (window.innerWidth >= 1024) {
  fontSize = "18px";
}
editor.setOptions({
  fontSize: fontSize,
  autoScrollEditorIntoView: true,
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
  showPrintMargin: false,
});

$(document).ready(function () {
  // Check process is executing or not
  let process = null;
  // Store all supported languages
  let languages = {};
  // Store compiler sate
  let compilerState = [];
  // Store current sate
  let currentState = {};

  // Get compiler state from local storage
  if (localStorage.getItem("compilerState")) {
    compilerState = JSON.parse(localStorage.getItem("compilerState"));
  }

  // Initialize compiler state
  $(async function () {
    // Get all supported languages
    if (Object.keys(languages).length == 0) {
      await $.ajax({
        url: "/api/languages",
        method: "get",
        success: function (res) {
          // $("#languages").html("");
          res.forEach(function (data) {
            languages[data.language] = data;
            // $("#languages").append(`
            //   <a class="block px-5 py-2.5" href="/compiler/${data.language}">${data.languageName}</a>
            // `);
          });
        }
      });
    }

    // Set current language
    let language = $("#language").data("language");

    // Check language state is exists in local storage or not
    let compilerStateForLanguage = compilerState.find(function (e) {
      return e.language == language;
    });
    if (compilerStateForLanguage) {
      currentState = compilerStateForLanguage;
    } else {
      currentState.language = language;
      currentState.currentFileName = null;
      currentState.currentFileCode = null;
      currentState.stdin = null;
      currentState.args = null;
      currentState.files = [];
    }
    $("#language").text(languages[language].languageName);
    $("#output").hide();
    $("#output").html("");
    $("#output-time").html("");
    $("#frame").hide();

    // Set file and source code for selected language
    let fileName = "";
    let sourceCode = "";
    if (currentState.currentFileName) {
      fileName = currentState.currentFileName;
      sourceCode = currentState.currentFileCode;
    } else {
      if (currentState.files.length > 0) {
        fileName = currentState.files[0].fileName;
        sourceCode = currentState.files[0].sourceCode;
      } else if (languages[language]) {
        fileName = languages[language].fileName;
        sourceCode = languages[language].defaultCode;
        currentState.files = currentState.files.filter(function (e) {
          return e.fileName != fileName;
        });
        currentState.files.push({
          fileName: fileName,
          sourceCode: sourceCode
        });
      }
      currentState.currentFileName = fileName;
      currentState.currentFileCode = sourceCode;
    }
    changeMode(fileName, sourceCode);
    $(".download").data("fileName", fileName);
    $("#execute").data("fileName", fileName);

    // Set user input
    if (currentState.stdin) {
      $("#stdin").val(currentState.stdin);
    }
    if (currentState.args) {
      $("#args").val(currentState.args);
    }

    // Set files
    $(".file-container").empty();
    currentState.files.forEach(function (e) {
      $(".file-container").append(`
            <div class="flex items-center px-1 py-2 border-t-2 ${(e.fileName == currentState.currentFileName ? 'border-blue-600' : 'border-transparent')} text-sm font-normal cursor-pointer file" data-file="${e.fileName}">
              <span class="pl-2">${e.fileName}</span>
              <button class="px-2 h-full delete-file"><i class="fas fa-times fa-sm"></i></button>
            </div>
      `);
    });
  });

  // Execute sourceCode
  $("#execute").click(function () {
    // Process is already execution so ignore current execution request
    if (process) {
      return false;
    }
    let fileName = $(this).data("fileName");
    let language = $("#language").data("language");

    // Save compiler state to local storage
    currentState.language = language;
    currentState.currentFileName = fileName;
    currentState.currentFileCode = editor.getValue();
    currentState.stdin = $("#stdin").val();
    currentState.args = $("#args").val();
    currentState.files = currentState.files.map(function (e) {
      if (e.fileName == fileName) {
        return { ...e, sourceCode: editor.getValue() };
      }
      return e;
    });

    // Update compiler state
    let findState = compilerState.find(function (e) {
      return e.language == currentState.language;
    });
    if (findState) {
      compilerState = compilerState.map(function (e) {
        if (e.language == currentState.language) {
          return currentState;
        }
        return e;
      });
    } else {
      compilerState.push(currentState);
    }
    localStorage.setItem("compilerState", JSON.stringify(compilerState));

    if (language == "html") {
      let iframe = document.getElementById("frame");
      iframe.style.display = "block";
      iframe = iframe.contentWindow || (iframe.contentDocument.document || iframe.contentDocument);
      iframe.document.open();
      iframe.document.write(editor.getValue());
      iframe.document.close();
    } else {
      process = $.ajax({
        url: "/api/execute",
        method: "post",
        data: JSON.stringify({
          language: language,
          executionMode: 'file',
          executeFile: fileName,
          files: currentState.files,
          stdin: $("#stdin").val(),
          args: $("#args").val()
        }),
        dataType: "json",
        contentType: "application/json",
        beforeSend: function () {
          $("#output-time").empty();
          $("#memory-usage").empty();
          $("#output").hide();
          $("#output").empty();
          $(".execute-icon").addClass("hidden");
          $(".loading-icon").removeClass("hidden");
        },
        success: function (res) {
          $(".execute-icon").removeClass("hidden");
          $(".loading-icon").addClass("hidden");
          $("#output").show();
          if (res.stdout) {
            $("#output").append(res.stdout.replace(/\n/g, "<br />"));
          }
          if (res.stderr) {
            $("#output").append(res.stderr.replace(/\n/g, "<br />"));
          }
          if (res.error) {
            $("#output").append(res.error.replace(/\n/g, "<br />"));
          }
          $("#output-time").html("Time: " + msToTime(res.executionTime));
          $("#memory-usage").html("Mem: " + formatBytes(res.memoryUsage ?? 0));
          process = null;
        },
        error: function (error) {
          $("#output-time").empty();
          $("#memory-usage").empty();
          $(".execute-icon").removeClass("hidden");
          $(".loading-icon").addClass("hidden");
          $("#output").show();
          $("#output").text(error.statusText);
          process = null;
        }
      });
    }
  });

  // Shortcut key for code execution
  $(document).keypress(function (e) {
    // Run sourceCode on ctrl+enter
    if ((e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10)) {
      $("#execute").click();
    }
  });

  // Download sourceCode
  $(".download").click(function () {
    download($(this).data("fileName"), editor.getValue());
  });

  $(".output").click(function () {
    if ($("#output-container").hasClass("hidden")) {
      $(this).removeClass("border-transparent").addClass("border-blue-600");
      $("#input-container").addClass("hidden");
      $(".user-input").removeClass("border-blue-600").addClass("border-transparent");
      $("#output-container").removeClass("hidden");
      editor.clearSelection();
    }
  });

  $(".user-input").click(function () {
    if ($("#input-container").hasClass("hidden")) {
      $(this).removeClass("border-transparent").addClass("border-blue-600");
      $("#output-container").addClass("hidden");
      $(".output").removeClass("border-blue-600").addClass("border-transparent");
      $("#input-container").removeClass("hidden");
      editor.clearSelection();
    }
  });

  // Change file
  $(".file-container").on("click", ".file", function () {
    let fileName = $(this).data("file");
    let previousFileName = currentState.currentFileName;
    let previousFileCode = editor.getValue();
    if (fileName) {
      $(".file").removeClass("border-blue-600").addClass("border-transparent");
      $(this).removeClass("border-transparent").addClass("border-blue-600");

      // Get file details
      let sourceCode = "";
      if (currentState.currentFileName == fileName) {
        sourceCode = currentState.currentFileCode;
      } else {
        let file = currentState.files.find(function (e) {
          return e.fileName == fileName;
        });
        sourceCode = file?.sourceCode ?? null;
      }

      changeMode(fileName, sourceCode);
      $(".download").data("fileName", fileName);
      $("#execute").data("fileName", fileName);

      currentState.currentFileName = fileName;
      currentState.currentFileCode = sourceCode;
      currentState.files = currentState.files.map(function (e) {
        if (e.fileName == previousFileName) {
          return { ...e, sourceCode: previousFileCode };
        }
        return e;
      });

      // Update compiler state
      let findState = compilerState.find(function (e) {
        return e.language == currentState.language;
      });
      if (findState) {
        compilerState = compilerState.map(function (e) {
          if (e.language == currentState.language) {
            return currentState;
          }
          return e;
        });
      } else {
        compilerState.push(currentState);
      }
      localStorage.setItem("compilerState", JSON.stringify(compilerState));
    }
  });

  // Create new file
  $(".create-new-file").click(function () {
    let fileName = "";
    let promptText = "Enter file name";
    while (true) {
      fileName = prompt(promptText, fileName);
      if (fileName === false) {
        return;
      }
      if (fileName == "") {
        promptText = `Please enter file name`;
        continue;
      }
      /*
            if(fileName.split(".").pop().toLowerCase() != languages[currentState.language].fileExtension) {
              promptText = `File ${fileName} invalid extension!`;
              continue;
            }
      */
      // Check file is already exists or not
      let file = currentState.files.find(function (e) {
        return e.fileName == fileName;
      });
      if (file) {
        promptText = `File ${fileName} already exists!`;
        continue;
      }
      break;
    }
    // Create new file
    if (fileName) {
      $(".file-container").append(`
            <div class="flex items-center px-1 py-2 border-t-2 border-transparent text-sm font-normal cursor-pointer file" data-file="${fileName}">
              <span class="pl-2">${fileName}</span>
              <button class="px-2 h-full delete-file"><i class="fas fa-times fa-sm"></i></button>
            </div>
      `);

      // Store new file details
      currentState.files.push({
        fileName: fileName,
        sourceCode: languages[currentState.language].defaultCode
      });

      // Update compiler state
      let findState = compilerState.find(function (e) {
        return e.language == currentState.language;
      });
      if (findState) {
        compilerState = compilerState.map(function (e) {
          if (e.language == currentState.language) {
            return currentState;
          }
          return e;
        });
      } else {
        compilerState.push(currentState);
      }
      localStorage.setItem("compilerState", JSON.stringify(compilerState));
    }
  });

  // Delete file
  $(".file-container").on("click", ".delete-file", function (e) {
    e.stopPropagation();
    let fileName = $(this).parent().data("file");
    if (confirm(`Do you want to delete ${fileName}?`)) {
      $(this).parent().remove();

      // Delete file details
      currentState.files = currentState.files.filter(function (e) {
        return e.fileName != fileName;
      });

      if (currentState.currentFileName == fileName) {
        let fileName = "";
        let sourceCode = "";
        if (currentState.files.length > 0) {
          fileName = currentState.files[0].fileName;
          sourceCode = currentState.files[0].sourceCode;
        } else if (languages[currentState.language]) {
          fileName = languages[currentState.language].fileName;
          sourceCode = languages[currentState.language].defaultCode;
          currentState.files.push({
            fileName: fileName,
            sourceCode: sourceCode
          });
          $(".file-container").append(`
            <div class="flex items-center px-1 py-2 border-t-2 border-transparent text-sm font-normal cursor-pointer file" data-file="${fileName}">
              <span class="pl-2">${fileName}</span>
              <button class="px-2 h-full delete-file"><i class="fas fa-times fa-sm"></i></button>
            </div>
          `);
        }
        currentState.currentFileName = fileName;
        currentState.currentFileCode = sourceCode;

        $(".file").each(function (i, e) {
          if ($(e).data("file") == fileName) {
            $(e).click();
          }
        });
      }

      // Update compiler state
      let findState = compilerState.find(function (e) {
        return e.language == currentState.language;
      });
      if (findState) {
        compilerState = compilerState.map(function (e) {
          if (e.language == currentState.language) {
            return currentState;
          }
          return e;
        });
      } else {
        compilerState.push(currentState);
      }
      localStorage.setItem("compilerState", JSON.stringify(compilerState));
    }
  });

  $("#orientation").click(function () {
    // Check split view enabled or not
    if (window.innerWidth < 768) {
      // Desable split view orientation for mobile devices
      return;
    }

    // Get split view orientation from local storage
    let orientation = (window.innerWidth >= 768 ? "vertical" : "horizontal");
    if (localStorage.getItem("orientation")) {
      orientation = (window.innerWidth >= 768 ? localStorage.getItem("orientation") : "horizontal");
    }
    // Toggle orientation mode
    if (window.innerWidth >= 768) {
      orientation = (orientation == "horizontal" ? "vertical" : "horizontal");
    }
    localStorage.setItem("orientation", orientation);
    // Change split view ui
    if (orientation == "horizontal") {
      $("#split-view").removeClass("md:flex-row").addClass("md:flex-col");
      $("#resizer").removeClass("md:flex-col md:w-3 md:h-full").addClass("md:flex-row md:w-full md:h-3");
    } else {
      $("#split-view").removeClass("md:flex-col").addClass("md:flex-row");
      $("#resizer").removeClass("md:flex-row md:w-full md:h-3").addClass("md:flex-col md:w-3 md:h-full");
    }

    // Resize code split view
    resizeWindow();
  });

  // Resize code split view
  resizeWindow();
  // Resize code split view on window resize event
  window.addEventListener("resize", resizeWindow);
});

// Change editor language at run time
function changeMode(fileName, sourceCode) {
  let modelist = ace.require("ace/ext/modelist");
  let mode = modelist.getModeForPath(fileName).mode;
  editor.session.setMode(mode);
  editor.setValue(sourceCode);
  editor.clearSelection();
  editor.focus();
}

// Download file
function download(fileName, sourceCode) {
  let element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(sourceCode));
  element.setAttribute('download', fileName);
  element.style.display = "none";
  element.click();
  element.remove();
}

// Convert time milliseconds to seconds and minutes, hours
function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Min";
  else if (hours < 24) return hours + " Hrs";
  else return days + " Days"
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function resizeWindow() {
  // Query the element
  const resizer = document.getElementById("resizer");
  const leftSide = resizer.previousElementSibling;
  const rightSide = resizer.nextElementSibling;

  // The current position of mouse
  let x = 0;
  let y = 0;
  let leftWidth = 0;
  let leftHeight = 0;
  let orientation = (window.innerWidth >= 768 ? "vertical" : "horizontal");
  let newLeftWidth = 0;
  let newLeftHeight = 0;

  // Set initial width
  // Get initial data from local storage
  if (localStorage.getItem("leftWidth")) {
    leftWidth = localStorage.getItem("leftWidth");
  } else {
    leftWidth = 70;
  }
  if (localStorage.getItem("leftHeight")) {
    leftHeight = localStorage.getItem("leftHeight");
  } else {
    leftHeight = 65;
  }
  if (localStorage.getItem("orientation")) {
    orientation = (window.innerWidth >= 768 ? localStorage.getItem("orientation") : "horizontal");
  }

  if (orientation == "vertical") {
    leftSide.style.width = `${leftWidth}%`;
    leftSide.style.height = "100%";
    // Change split view ui
    $("#split-view").removeClass("md:flex-col").addClass("md:flex-row");
    $("#resizer").removeClass("md:flex-row md:w-full md:h-3").addClass("md:flex-col md:w-3 md:h-full");
  } else {
    leftSide.style.width = "100%";
    leftSide.style.height = `${leftHeight}%`;
    // Change split view ui
    $("#split-view").removeClass("md:flex-row").addClass("md:flex-col");
    $("#resizer").removeClass("md:flex-col md:w-3 md:h-full").addClass("md:flex-row md:w-full md:h-3");
  }

  resizer.style.cursor = (orientation == "vertical" ? "col-resize" : "row-resize");

  // Handle the mousedown event
  // that's triggered when user drags the resizer
  function mouseDownHandler(e) {
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;
    leftWidth = leftSide.getBoundingClientRect().width;
    leftHeight = leftSide.getBoundingClientRect().height;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  function mouseMoveHandler(e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    // Calculate new width in percentage
    if (orientation == "vertical") {
      newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;

      // Prevent 15% width from resize
      if (newLeftWidth >= 15 && newLeftWidth <= 85) {
        leftSide.style.width = `${newLeftWidth}%`;
      }
    } else {
      // Calculate new height
      newLeftHeight = ((leftHeight + dy) * 100) / resizer.parentNode.getBoundingClientRect().height;

      // Prevent 15% height from resize
      if (newLeftHeight >= 15 && newLeftHeight <= 85) {
        leftSide.style.height = `${newLeftHeight}%`;
      }
    }

    document.body.style.cursor = (orientation == "vertical" ? "col-resize" : "row-resize");
    leftSide.style.userSelect = 'none';
    leftSide.style.pointerEvents = 'none';

    rightSide.style.userSelect = 'none';
    rightSide.style.pointerEvents = 'none';
  }

  // Handle mouse leave event
  function mouseUpHandler() {
    document.body.style.removeProperty('cursor');

    leftSide.style.removeProperty('user-select');
    leftSide.style.removeProperty('pointer-events');

    rightSide.style.removeProperty('user-select');
    rightSide.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    // Resize editor
    editor.resize();

    // Store data in local storage
    if (newLeftWidth >= 15 && newLeftWidth <= 85) {
      localStorage.setItem("leftWidth", newLeftWidth);
    }
    if (newLeftHeight >= 15 && newLeftHeight <= 85) {
      localStorage.setItem("leftHeight", newLeftHeight);
    }
  }

  // Handle the touch event
  // that's triggered when user drags the resizer
  function touchStartHandler(e) {
    // Get the current mouse position
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    leftWidth = leftSide.getBoundingClientRect().width;
    leftHeight = leftSide.getBoundingClientRect().height;

    // Attach the listeners to `document`
    document.addEventListener('touchmove', touchMoveHandler);
    document.addEventListener('touchend', touchEndHandler);
    document.addEventListener('touchcancel', touchEndHandler);
  }

  function touchMoveHandler(e) {
    // How far the mouse has been moved
    const dx = e.touches[0].clientX - x;
    const dy = e.touches[0].clientY - y;

    // Calculate new width in percentage
    if (orientation == "vertical") {
      newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;

      // Prevent 15% width from resize
      if (newLeftWidth >= 15 && newLeftWidth <= 85) {
        leftSide.style.width = `${newLeftWidth}%`;
      }
    } else {
      // Calculate new height
      newLeftHeight = ((leftHeight + dy) * 100) / resizer.parentNode.getBoundingClientRect().height;

      // Prevent 15% height from resize
      if (newLeftHeight >= 15 && newLeftHeight <= 85) {
        leftSide.style.height = `${newLeftHeight}%`;
      }
    }

    document.body.style.cursor = (orientation == "vertical" ? "col-resize" : "row-resize");
    leftSide.style.userSelect = 'none';
    leftSide.style.pointerEvents = 'none';

    rightSide.style.userSelect = 'none';
    rightSide.style.pointerEvents = 'none';
  }

  // Handle mouse leave event
  function touchEndHandler() {
    document.body.style.removeProperty('cursor');

    leftSide.style.removeProperty('user-select');
    leftSide.style.removeProperty('pointer-events');

    rightSide.style.removeProperty('user-select');
    rightSide.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('touchmove', touchMoveHandler);
    document.removeEventListener('touchend', touchEndHandler);
    document.removeEventListener('touchcancel', touchEndHandler);

    // Resize editor
    editor.resize();

    // Store data in local storage
    if (newLeftWidth >= 15 && newLeftWidth <= 85) {
      localStorage.setItem("leftWidth", newLeftWidth);
    }
    if (newLeftHeight >= 15 && newLeftHeight <= 85) {
      localStorage.setItem("leftHeight", newLeftHeight);
    }
  }

  // Attach the handler
  resizer.addEventListener('mousedown', mouseDownHandler);
  resizer.addEventListener('touchstart', touchStartHandler);
}
