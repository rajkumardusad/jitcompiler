const express = require("express");
const router = express.Router();
const fs = require("fs");
const os = require("os");
const path = require("path");
const { performance } = require("perf_hooks");
const { exec, execSync } = require("child_process");
const pidusage = require("pidusage");
const Joi = require("joi");
const { languages } = require("../services/supported-languages");
const { compileCode } = require("../services/compiler");
const config = require("../config/config");

// Code execution api
router.post("/execute", function (req, res, next) {
  // Validation schema
  const schema = Joi.object({
    language: Joi.string().trim().max(30).required(),
    executionMode: Joi.string()
      .lowercase()
      .trim()
      .valid("file", "code")
      .required(),
    executeFile: Joi.alternatives().conditional("executionMode", [
      {
        is: "file",
        then: Joi.string().trim().max(255).required(),
        otherwise: Joi.optional(),
      },
    ]),
    files: Joi.alternatives().conditional("executionMode", [
      {
        is: "file",
        then: Joi.array()
          .items(
            Joi.object({
              fileName: Joi.string().trim().max(255).required(),
              sourceCode: Joi.string().required(),
            })
          )
          .required(),
        otherwise: Joi.optional(),
      },
    ]),
    code: Joi.alternatives().conditional("executionMode", [
      { is: "code", then: Joi.string().required(), otherwise: Joi.optional() },
    ]),
    stdin: Joi.string().min(0).max(1024).optional(),
    args: Joi.string().min(0).max(1024).optional(),
  });

  // Response schema
  let response = {
    stdout: null, // Code output
    stderr: null, // Code error
    error: null, // Any error while code execution
    executionTime: null, // Total execution time in ms
    memoryUsage: null, // Total memory usage of process in bytes
    statusCode: null, // Process status code
  };

  // Validate user input
  const { error, value } = schema.validate(req.body);
  if (error) {
    response.error = error.details;
    return res.status(400).json(response);
  }

  // Check requested language is supported or not
  if (!languages[req.body.language]) {
    // Calculate execution time
    let executionStartedAt = performance.now();
    response.error = req.body.language + " is not supported";
    response.executionTime = performance.now() - executionStartedAt;
    return res.json(response);
  }

  // Render HTML/CSS code
  if (req.body.language == "html") {
    // calculate execution time
    let executionStartedAt = performance.now();
    // Check code execution mode
    if (req.body.executionMode.toLowerCase() == "code") {
      response.stdout = req.body.executeCode;
    } else {
      response.stdout =
        req.body.files.find(function (e) {
          return e.fileName == req.body.executeFile;
        })?.sourceCode ?? "";
    }
    response.executionTime = performance.now() - executionStartedAt;
    return res.json(response);
  }

  // Child process configuration options
  let options = {
    encoding: "utf8",
    // Max execution time 55 seconds
    timeout: 55000,
    // Max size 50 MB
    maxBuffer: 1024 * 1024 * 50,
    killSignal: "SIGTERM",
    // Current working directory tmp dir
    cwd: os.tmpdir(),
    shell: "/bin/bash",
    env: null,
  };

  // Command max execution time 50 seconds if process is running after 50 seconds then terminate process in 2 seconds
  let timeout = "timeout -k 2 50";

  // Calculate process execution time
  let executionStartedAt = performance.now();
  // Execute code
  const { command, tmpDir } = compileCode(req.body);

  // Create tmp db for dbs
  let dbName = path.parse(tmpDir).base.replace(/-/g, "");
  try {
    if (req.body.language == "mysql") {
      execSync(
        `sudo docker exec -i ${config.container.name} bash -c "${timeout} ${
          languages[req.body.language].compiler
        } -e 'create database ${dbName};'"`
      );
      execSync(
        `sudo docker exec -i ${config.container.name} bash -c "${timeout} ${
          languages[req.body.language].compiler
        } -e 'grant all privileges on ${dbName}.* to compiler@localhost;'"`
      );
    }
  } catch (err) {
    // Error response
    response.executionTime = performance.now() - executionStartedAt;
    response.statusCode = err.status;
    if (err.signal || err.status == 124) {
      response.error = "Sorry maximum execution time limit exceeded.";
    }
    if (response.stderr == null) {
      response.stderr = err.stderr;
    } else {
      response.stderr += err.stderr;
    }
    return res.json(response);
  }

  // Set child process current working directory
  options.cwd = tmpDir;
  const child = exec(command, options);

  // Get memory usage of process
  pidusage(child.pid, function (err, stats) {
    if (!err && stats.memory) {
      response.memoryUsage = stats.memory;
    }
  });

  child.stdout.on("data", function (stdout) {
    if (response.stdout == null) {
      response.stdout = stdout;
    } else {
      response.stdout += stdout;
    }
  });
  child.stderr.on("data", function (stderr) {
    if (response.stderr == null) {
      response.stderr = stderr;
    } else {
      response.stderr += stderr;
    }
  });
  child.on("close", function (status, signal) {
    response.executionTime = performance.now() - executionStartedAt;
    if (signal || status == 124) {
      response.error = "Sorry maximum execution time limit exceeded.";
    }
    response.statusCode = status;

    // Delete tmp db for dbs
    try {
      if (req.body.language == "mysql") {
        execSync(
          `sudo docker exec -i ${config.container.name} bash -c "${timeout} ${
            languages[req.body.language].compiler
          } -e 'drop database ${dbName};'"`
        );
      }
    } catch (err) {
      // Error response
      response.executionTime = performance.now() - executionStartedAt;
      response.statusCode = err.status;
      if (err.signal || err.status == 124) {
        response.error = "Sorry maximum execution time limit exceeded.";
      }
      if (response.stderr == null) {
        response.stderr = err.stderr;
      } else {
        response.stderr += err.stderr;
      }
      return res.json(response);
    }

    // Remove tmp dir
    fs.rm(tmpDir, { force: true, recursive: true }, function (err) {
      if (!err) {
        // Tmp dir not deleted
      }
    });
    return res.json(response);
  });
});

// Supported programming languages api
router.get("/languages", function (req, res, next) {
  let response = [];
  for (const [key, value] of Object.entries(languages)) {
    response.push({
      languageName: value.languageName,
      language: value.language,
      version: value.version,
      fileExtension: value.fileExtension,
      fileName: value.fileName,
      defaultCode: value.defaultCode,
    });
  }
  return res.json(response);
});

module.exports = router;
