const express = require("express");
const router = express.Router();
const { languages } = require("../services/supported-languages");

// Home page
router.get("/", function (req, res, next) {
  res.render("index", {
    appName: "JIT Compiler",
    title: "JIT Compiler - Online Code Compiler",
    description:
      "JIT Compiler offers free online code compiler to everyone, you can compile and run more than 40+ programming languages in your browser just-in-time using jitcompiler. Our online compiler has a user friendly text editor with live auto-suggestion and syntax highlighting features.",
    keywords:
      "JITCompiler, jit compiler, online compiler, free online compiler, code compiler, best online compiler, online c compiler, online c++ compiler, online java compiler, online javascript compiler, online php compiler, online python compiler, online go compiler, online golang compiler, online rust compiler, online ruby compiler, online swift compiler, online dart compiler, online c# compiler, online c-sharp compiler, online kotlin compiler, online scala compiler, online assembly compiler, online objective c compiler, online elixir compiler, online erlang compiler, online code playground, compiler",
  });
});

router.get("/terms-of-service", function (req, res, next) {
  res.render("terms", {
    appName: "JIT Compiler",
    title: "Terms of service - JIT Compiler",
    description:
      "JITCompiler is a free online code execution platform for students and developers. JITCompiler supports almost every most popular programming languages. You can compile and execute languages like C/C++, Java, Python, JavaScript, Golang, Dart, Ruby, PHP, Typescript, Swift, Kotlin etc.",
    keywords:
      "JITCompiler, jit compiler, online compiler, free online compiler, code compiler, best online compiler, online c compiler, online c++ compiler, online java compiler, online javascript compiler, online php compiler, online python compiler, online go compiler, online golang compiler, online rust compiler, online ruby compiler, online swift compiler, online dart compiler, online c# compiler, online c-sharp compiler, online kotlin compiler, online scala compiler, online assembly compiler, online objective c compiler, online elixir compiler, online erlang compiler, online code playground, compiler",
  });
});

router.get("/privacy-policy", function (req, res, next) {
  res.render("privacy", {
    appName: "JIT Compiler",
    title: "Privacy policy - JIT Compiler",
    description:
      "JITCompiler is a free online code execution platform for students and developers. JITCompiler supports almost every most popular programming languages. You can compile and execute languages like C/C++, Java, Python, JavaScript, Golang, Dart, Ruby, PHP, Typescript, Swift, Kotlin etc.",
    keywords:
      "JITCompiler, jit compiler, online compiler, free online compiler, code compiler, best online compiler, online c compiler, online c++ compiler, online java compiler, online javascript compiler, online php compiler, online python compiler, online go compiler, online golang compiler, online rust compiler, online ruby compiler, online swift compiler, online dart compiler, online c# compiler, online c-sharp compiler, online kotlin compiler, online scala compiler, online assembly compiler, online objective c compiler, online elixir compiler, online erlang compiler, online code playground, compiler",
  });
});

router.get("/contact", function (req, res, next) {
  res.render("contact", {
    appName: "JIT Compiler",
    title: "Contact US - JIT Compiler",
    description:
      "JITCompiler is a free online code execution platform for students and developers. JITCompiler supports almost every most popular programming languages. You can compile and execute languages like C/C++, Java, Python, JavaScript, Golang, Dart, Ruby, PHP, Typescript, Swift, Kotlin etc.",
    keywords:
      "JITCompiler, jit compiler, online compiler, free online compiler, code compiler, best online compiler, online c compiler, online c++ compiler, online java compiler, online javascript compiler, online php compiler, online python compiler, online go compiler, online golang compiler, online rust compiler, online ruby compiler, online swift compiler, online dart compiler, online c# compiler, online c-sharp compiler, online kotlin compiler, online scala compiler, online assembly compiler, online objective c compiler, online elixir compiler, online erlang compiler, online code playground, compiler",
  });
});

// Online code compiler
router.get("/compiler", function (req, res, next) {
  // Check requested language is supported or not
  let language = req.query.lang?.toLowerCase();
  let data = {};
  if (!languages[language]) {
    data = {
      appName: "JIT Compiler",
      title: "Online Code Compiler - JIT Compiler",
      description:
        "Online code compiler, we can compile and run more than 40+ programming languages in your browser just-in-time using jitcompiler. Our online compiler has a user friendly text editor with live auto-suggestion and syntax highlighting features.",
      keywords:
        "JITCompiler, jit compiler, online compiler, free online compiler, code compiler, best online compiler, online c compiler, online c++ compiler, online java compiler, online javascript compiler, online php compiler, online python compiler, online go compiler, online golang compiler, online rust compiler, online ruby compiler, online swift compiler, online dart compiler, online c# compiler, online c-sharp compiler, online kotlin compiler, online scala compiler, online assembly compiler, online objective c compiler, online elixir compiler, online erlang compiler, online code playground, compiler",
      language: "javascript",
      languages: languages,
    };
  } else {
    data = {
      appName: "JIT Compiler",
      languages: languages,
      ...languages[language],
    };
  }

  res.render("compiler", data);
});

// Online compilers
router.get("/compiler/:language", function (req, res, next) {
  // Check requested language is supported or not
  let language = req.params["language"].toLowerCase();
  if (!languages[language]) {
    // 404 page not found
    return next();
  }

  let data = {
    appName: "JIT Compiler",
    languages: languages,
    ...languages[language],
  };

  res.render("online-compilers", data);
});

module.exports = router;
