class Compiler {
  #element;
  #elementType = "id";
  #options = {
    title: "",
    accessToken: "",
    code: "",
    language: "",
    theme: "light",
    themeToggle: true,
    copyToClipboard: true,
    executable: true,
    readOnly: false,
    lineNumbers: true,
    lineWrapping: false,
    height: "auto",
  };
  #editors = [];
  #loadedAssetsUrl = new Set();
  #supportedLanguages = {
    javascript: {
      url: ["https://codemirror.net/mode/javascript/javascript.js"],
      mode: "text/javascript",
    },
    typescript: {
      url: ["https://codemirror.net/mode/javascript/javascript.js"],
      mode: "text/typescript",
    },
    c: {
      url: ["https://codemirror.net/mode/clike/clike.js"],
      mode: "text/x-csrc",
    },
    cpp: {
      url: ["https://codemirror.net/mode/clike/clike.js"],
      mode: "text/x-c++src",
    },
    java: {
      url: ["https://codemirror.net/mode/clike/clike.js"],
      mode: "text/x-java",
    },
    csharp: {
      url: ["https://codemirror.net/mode/clike/clike.js"],
      mode: "text/x-csharp",
    },
    go: {
      url: ["https://codemirror.net/mode/go/go.js"],
      mode: "text/x-go",
    },
    fortran: {
      url: ["https://codemirror.net/mode/fortran/fortran.js"],
      mode: "text/x-fortran",
    },
    groovy: {
      url: ["https://codemirror.net/mode/groovy/groovy.js"],
      mode: "text/x-groovy",
    },
    html: {
      url: [
        "https://codemirror.net/mode/xml/xml.js",
        "https://codemirror.net/mode/javascript/javascript.js",
        "https://codemirror.net/mode/css/css.js",
        "https://codemirror.net/mode/htmlmixed/htmlmixed.js"
      ],
      mode: "text/html",
    },
    perl: {
      url: ["https://codemirror.net/mode/perl/perl.js"],
      mode: "text/x-perl",
    },
    python: {
      url: ["https://codemirror.net/mode/python/python.js"],
      mode: "text/x-python",
    },
    rust: {
      url: ["https://codemirror.net/mode/rust/rust.js"],
      mode: "text/x-rustsrc",
    },
    ruby: {
      url: ["https://codemirror.net/mode/ruby/ruby.js"],
      mode: "text/x-ruby",
    },
    shell: {
      url: ["https://codemirror.net/mode/shell/shell.js"],
      mode: "text/x-sh",
    },
    php: {
      url: [
        "https://codemirror.net/mode/htmlmixed/htmlmixed.js",
        "https://codemirror.net/mode/clike/clike.js",
        "https://codemirror.net/mode/php/php.js"
      ],
      mode: "text/x-php",
    },
    swift: {
      url: ["https://codemirror.net/mode/swift/swift.js"],
      mode: "text/x-swift",
    },
    dart: {
      url: ["https://codemirror.net/mode/dart/dart.js"],
      mode: "application/dart",
    }
  };

  constructor(element, options={}) {
    this.#getCompilerOptions(options);
    this.#getComlilerInstance(element);

    // Load enternal dependency
    let self = this;
    (async function() {
      await self.#loadStyle([
        "https://codemirror.net/lib/codemirror.css",
        "https://codemirror.net/theme/monokai.css",
        "/embed.css"
      ]);
      await self.#loadScript(["https://codemirror.net/lib/codemirror.js"]);
      await self.#loadScript([
        "https://codemirror.net/addon/selection/active-line.js",
        "https://codemirror.net/addon/edit/matchbrackets.js"
      ]);

      await self.#createCompilerInstance();
    }());
  }

  /**
    * Get compiler options.
    */
  #getCompilerOptions(options) {
    // Get all data attributes of editor
    for(const key of Object.keys(this.#options)) {
      if(options.hasOwnProperty(key)) {
        this.#options[key] = options[key];
      }
    }
  }

  /**
    * Get compiler instance.
    */
  #getComlilerInstance(element) {
    // Create compiler editor element
    if(typeof element === "string") {
      if(element[0] === "#") {
        this.#element = document.getElementById(element.substring(1));
      } else if(element[0] === ".") {
        this.#elementType = "class";
        this.#element = document.getElementsByClassName(element.substring(1));
      }
    } else {
      throw new Error("Invalid compiler instance, please provide element class or id");
    }
  }

  /**
    * Create compiler instance.
    */
  async #createCompilerInstance() {
    if(this.#elementType == "class") {
      // Create code editor with codemirror
      let index = 0;
      for(const e of this.#element) {
        // Get editor options from compiler instance
        if(e.children[0].value) {
          this.#options.code = e.children[0].value;
        }
        for(const key of Object.keys(this.#options)) {
          if(e.getAttribute("data-" + key)) {
            this.#options[key] = e.getAttribute("data-" + key);
          }
        }

        this.#options.lineNumbers = this.#options.lineNumbers == true || this.#options.lineNumbers == "true" ? true : false;

        this.#options.lineWrapping = this.#options.lineWrapping == true || this.#options.lineWrapping == "true" ? true : false;

        this.#options.readOnly = this.#options.readOnly == true || this.#options.readOnly == "true" ? true : false;

        this.#options.executable = this.#options.executable == true || this.#options.executable == "true" ? true : false;

        this.#options.readOnly = this.#options.executable == false || this.#options.executable == "false" ? true : this.#options.readOnly;

        this.#options.themeToggle = this.#options.themeToggle == true || this.#options.themeToggle == "true" ? true : false;

        this.#options.copyToClipboard = this.#options.copyToClipboard == true || this.#options.copyToClipboard == "true" ? true : false;

        // Set language mode
        this.#options.language = this.#options.language.toLowerCase();
        if(this.#supportedLanguages.hasOwnProperty(this.#options.language)) {
          await this.#loadScript(this.#supportedLanguages[this.#options.language].url);
        }

        // Create code editor with codemirror
        e.style.height = "auto";
        e.innerHTML = this.#createEditor(this.#options, index);
        let editor = CodeMirror.fromTextArea(document.getElementById(`compiler-code-snippet-${index}`), {
          lineNumbers: this.#options.lineNumbers,
          styleActiveLine: (this.#options.readOnly == true ? false : true),
          lineWrapping: this.#options.lineWrapping,
          matchBrackets: true,
          mode: this.#supportedLanguages[this.#options.language].mode,
          readOnly: (this.#options.readOnly == true ? "nocursor" : false),
          theme: (this.#options.theme == "dark" ? "monokai" : "default")
        });
        editor.setSize("100%", "100%");
        this.#editors[`editor${index}`] = {
          token: this.#options.token,
          language: this.#options.language,
          editor: editor
        };
        index++;
      }
    } else {
      let index = 0;
      // Get editor options from compiler instance
      if(!this.#options.code && this.#element.children[0].value) {
        this.#options.code = this.#element.children[0].value;
      }
      for(const key of Object.keys(this.#options)) {
        if(this.#element.getAttribute("data-" + key)) {
          this.#options[key] = this.#element.getAttribute("data-" + key);
        }
      }

      this.#options.lineNumbers = this.#options.lineNumbers == true || this.#options.lineNumbers == "true" ? true : false;

      this.#options.lineWrapping = this.#options.lineWrapping == true || this.#options.lineWrapping == "true" ? true : false;

      this.#options.readOnly = this.#options.readOnly == true || this.#options.readOnly == "true" ? true : false;

      this.#options.executable = this.#options.executable == true || this.#options.executable == "true" ? true : false;

      this.#options.readOnly = this.#options.executable == false || this.#options.executable == "false" ? true : this.#options.readOnly;

      this.#options.themeToggle = this.#options.themeToggle == true || this.#options.themeToggle == "true" ? true : false;

      this.#options.copyToClipboard = this.#options.copyToClipboard == true || this.#options.copyToClipboard == "true" ? true : false;

      // Set language mode
      this.#options.language = this.#options.language.toLowerCase();
      if(this.#supportedLanguages.hasOwnProperty(this.#options.language)) {
        await this.#loadScript(this.#supportedLanguages[this.#options.language].url);
      }

      // Create code editor with codemirror
      this.#element.style.height = "auto";
      this.#element.innerHTML = this.#createEditor(this.#options, index);
      let editor = CodeMirror.fromTextArea(document.getElementById(`compiler-code-snippet-${index}`), {
        lineNumbers: this.#options.lineNumbers,
        styleActiveLine: (this.#options.readOnly == true ? false : true),
        lineWrapping: this.#options.lineWrapping,
        matchBrackets: true,
        mode: this.#supportedLanguages[this.#options.language].mode,
        readOnly: (this.#options.readOnly == true ? "nocursor" : false),
        theme: (this.#options.theme == "dark" ? "monokai" : "default")
      });
      editor.setSize("100%", "100%");
      this.#editors[`editor${index}`] = {
        token: this.#options.token,
        language: this.#options.language,
        editor: editor
      };
    }

    // Attach event listeners
    let self = this;

    // Execute code
    const codes = document.getElementsByClassName("execute-code");
    for(const e of codes) {
      e.addEventListener("click", function(e) {
        let editor = this.getAttribute("data-editor");let outputContainer = document.getElementById(this.getAttribute("data-coutContainer"));
        let output = document.getElementById(outputContainer.getAttribute("data-coutBody"));
        let outputTime = document.getElementById(outputContainer.getAttribute("data-coutTime"));
        if(outputContainer.style.display == "none" || outputContainer.style.display == "") {
          outputContainer.style.display = "block";
        }
        if(outputTime.style.display == "none" || outputTime.style.display == "") {
          outputTime.style.display = "inline-block";
        }
        let that = this;
        // Show loader
        that.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="block animate-spin" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>';
        output.innerHTML = "";
        outputTime.innerHTML = "";

        fetch("http://jitcompiler.com/api/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            language: self.#editors[editor].language,
            executionMode: 'code',
            executeCode: self.#editors[editor].editor.getValue()
          })
        }).then(function(res) {
          return res.json();
        }).then(function(res) {
          if(res.stdout) {
            if(self.#editors[editor].language == "html") {
              let iframe = document.createElement("iframe");
              output.appendChild(iframe);
              iframe = iframe.contentWindow || ( iframe.contentDocument.document || iframe.contentDocument);
              let innerHTML = res.stdout.replace(/\n/g, "<br />");
              if(res.stderr) {
                innerHTML += res.stderr.replace(/\n/g, "<br />");
              }
              if(res.error) {
                innerHTML += res.error.replace(/\n/g, "<br />");
              }
              iframe.document.open();
              iframe.document.write(innerHTML);
              iframe.document.close();
            } else {
              output.innerHTML = res.stdout.replace(/\n/g, "<br />");
            }
          }
          if(res.stderr) {
            output.innerHTML += res.stderr.replace(/\n/g, "<br />");
          }
          if(res.error) {
            output.innerHTML += res.error.replace(/\n/g, "<br />");
          }
          outputTime.innerHTML = "Time: " + self.#msToTime(res.executionTime);
          // Hide loader
          that.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="block" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>';
        }).catch(function(error) {
alert(error);
          output.innerHTML = "Something went wrong";
          // Hide loader
          that.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="block" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>';
        });
      });
    }

    // Copy Code
    const copyCodes = document.getElementsByClassName("copy-code");
    for(const e of copyCodes) {
      e.addEventListener("click", async function(e) {
        // Show loader
        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>';
        let editor = this.getAttribute("data-editor");
        // Copy code to clipboard
        self.#copyToClipboard(self.#editors[editor].editor.getValue());
        // Hide loader
        await self.#sleep(2000);
        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/></svg>';
      });
    }

    // Edit Code
    const editCodes= document.getElementsByClassName("edit-code");
    for(const e of editCodes) {
      e.addEventListener("click", function(e) {
        let editor = this.getAttribute("data-editor");
        // Copy code to clipboard
        self.#editors[editor].editor.focus();
      });
    }

    // Set Theme
    const compilerThemes = document.getElementsByClassName("compiler-theme");
    for(const e of compilerThemes) {
      e.addEventListener("click", function(e) {
        const compilerThemes = document.getElementsByClassName("compiler-theme");
        if(self.#elementType == "class") {
          for(const element of self.#element) {
            if(element.classList.contains("dark")) {
              element.classList.remove("dark");
              for(const key of Object.keys(self.#editors)) {
                self.#editors[key].editor.setOption("theme", "default");
              }
              for(const theme of compilerThemes) {
                theme.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>';
              }
            } else {
              element.classList.add("dark");
              for(const key of Object.keys(self.#editors)) {
                self.#editors[key].editor.setOption("theme", "monokai");
              }
              for(const theme of compilerThemes) {
                theme.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16"><path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>';
              }
            }
          }
        } else {
          if(self.#element.classList.contains("dark")) {
            self.#element.classList.remove("dark");
            for(const key of Object.keys(self.#editors)) {
              self.#editors[key].editor.setOption("theme", "default");
            }
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>';
          } else {
            self.#element.classList.add("dark");
            for(const key of Object.keys(self.#editors)) {
              self.#editors[key].editor.setOption("theme", "monokai");
            }
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16"><path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>';
          }
        }
      });
    }

  }

  /**
   * Create editor ui element.
   */
  #createEditor(options, index) {
        return `
<div class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md font-sans leading-5">
  <div class="h-12 lg:h-14 flex items-center justify-between mx-3 md:mx-4">
    <div class="w-28 md:w-52 flex-shrink-0">
      <h2 class="text-base dark:text-gray-200 font-bold truncate">${options.title}</h2>
    </div>
    <div class="flex flex-shrink-0 items-center gap-2">
      <span class="${options.themeToggle == true && options.theme == "dark" ? "" : "hidden"} w-9 h-8 flex items-center justify-center bg-white dark:bg-gray-700 focus:bg-gray-100 focus:outline-none border dark:border-transparent border-gray-100 dark:text-gray-200 rounded-md compiler-theme"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16"><path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg></span>
      <span class="${options.themeToggle == true && options.theme == "light" ? "" : "hidden"} w-9 h-8 flex items-center justify-center bg-white dark:bg-gray-700 focus:bg-gray-100 focus:outline-none border dark:border-transparent border-gray-100 dark:text-gray-200 rounded-md compiler-theme"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/> </svg></span>

      <span class="${options.readOnly == true ? "hidden" : ""} w-9 h-8 flex items-center justify-center bg-white dark:bg-gray-700 focus:bg-gray-100 focus:outline-none border dark:border-transparent border-gray-100 dark:text-gray-200 rounded-md edit-code" data-editor="editor${index}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></span>

      <span class="${options.copyToClipboard == true ? "" : "hidden"} w-9 h-8 flex items-center justify-center bg-white dark:bg-gray-700 focus:bg-gray-100 focus:outline-none border dark:border-transparent border-gray-100 dark:text-gray-200 rounded-md copy-code" data-editor="editor${index}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/></svg></span>

      <span class="${options.executable == true ? "" : "hidden"} w-9 h-8 flex items-center justify-center bg-white dark:bg-gray-700 focus:bg-gray-100 focus:outline-none border dark:border-transparent border-gray-100 dark:text-gray-200 rounded-md execute-code" data-editor="editor${index}" data-coutContainer="cout-${index}-container"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="block" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg></span>
    </div>
  </div>
  <div class="w-full" style="height: ${options.height}">
    <textarea id="compiler-code-snippet-${index}">${options.code}</textarea>
  </div>
  <div class="h-8 flex items-center px-3 md:px-4">
    <p class="text-xs text-gray-600 dark:text-gray-400 opacity-95">Powered by <a href="http://jitcompiler.com" class="no-underline text-xs text-blue-600">jitcompiler.com</a></p>
  </div>
</div>
<div class="hidden bg-white dark:bg-gray-800 mt-3 md:mt-4 border border-gray-100 dark:border-gray-700 rounded-md font-sans" id="cout-${index}-container" data-coutBody="cout-${index}-body" data-coutTime="cout-${index}-time">
  <div class="h-12 lg:h-14 flex items-center justify-between mx-3 md:mx-4">
    <div class="w-full flex items-center justify-between flex-shrink-0">
      <h2 class="text-base dark:text-gray-200 font-bold truncate">Output</h2>
      <span class="hidden text-sm dark:text-gray-200" id="cout-${index}-time"></span>
    </div>
  </div>
  <div class="max-h-56 overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-gray-200 p-3 md:p-4 rounded-b-md text-base" id="cout-${index}-body">
  </div>
</div>`;
  }

  // Load all external script dependencies
  async #loadScript(urls) {
    let self = this;
    function load(url) {
      return new Promise(function(resolve, reject) {
        if(self.#loadedAssetsUrl.has(url)) {
          resolve();
        } else {
          let script = document.createElement("script");
          script.onload = resolve;
          script.onerror = reject;
          script.src = url;
          document.head.appendChild(script);
        }
      });
    }
    let promises = [];
    for(const url of urls) {
      promises.push(load(url));
    }
    await Promise.all(promises);
    for(const url of urls) {
      self.#loadedAssetsUrl.add(url);
    }
  }

  // Load all external css dependencies
  async #loadStyle(urls) {
    let self = this;
    function load(url) {
      return new Promise(function(resolve, reject) {
        if(self.#loadedAssetsUrl.has(url)) {
          resolve();
        } else {
          let link = document.createElement("link");
          link.href = url;
          link.rel = "stylesheet";
          link.type = "text/css";
          link.onload = resolve;
          link.onerror = reject;
          document.head.appendChild(link);
        }
      });
    }
    let promises = [];
    for(const url of urls) {
      promises.push(load(url));
    }
    await Promise.all(promises);
    for(const url of urls) {
      self.#loadedAssetsUrl.add(url);
    }
  }

  // Sleep function
  #sleep(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  }

  // Copy code to clipboard
  #copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    dummy.style.display = "none";
    document.body.removeChild(dummy);
  }

  // Convert milliseconds to seconds and minutes, hours
  #msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days";
  }
}