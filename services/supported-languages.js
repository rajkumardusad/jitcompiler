// All supported programming languages
const supportedLanguages = {
  javascript: {
    languageName: "JavaScript",
    language: "javascript",
    version: "16.3.0",
    compiler: "node",
    fileExtension: "js",
    fileName: "index.js",
    defaultCode:
      '// A hello world program in javascript\nconsole.log("Hello, World!");\n',
    title: "Online JavaScript Compiler - JIT Compiler",
    description:
      "Online javascript compiler in your browser. Write, compile and run javascript code online using jitcompiler. Online Javascript Compiler, Online Javascript Editor, Online Javascript IDE, Execute Javascript Online, Compile Javascript Online, Run Javascript Online",
    keywords:
      "Online Javascript Compiler, Javascript Online Compiler, Run Javascript Online, Compile Javascript Online, Online Nodejs Compiler, Nodejs Online Compiler, jitcompiler, online compiler, free online compiler",
  },
  typescript: {
    languageName: "TypeScript",
    language: "typescript",
    version: "4.3.2",
    compiler: "deno",
    fileExtension: "ts",
    fileName: "index.ts",
    defaultCode:
      '// A hello world program in typescript\nconsole.log("Hello, World!");\n',
    title: "Online TypeScript Compiler - JIT Compiler",
    description:
      "Online typescript compiler in your browser. Write, compile and run typescript code online using jitcompiler. Online TypeScript Compiler, Online TypeScript Editor, Online TypeScript IDE, Execute TypeScript Online, Compile TypeScript Online, Run TypeScript Online",
    keywords:
      "Online TypeScript Compiler, TypeScript Online Compiler, Run TypeScript Online, Compile TypeScript Online, Online Deno Compiler, Deno Online Compiler, jitcompiler, online compiler, free online compiler",
  },
  php: {
    languageName: "PHP",
    language: "php",
    version: "8.0.7",
    compiler: "php",
    fileExtension: "php",
    fileName: "index.php",
    defaultCode:
      '<?php\n// A hello world program in php\necho "Hello, World!";\n',
    title: "Online PHP Compiler - JIT Compiler",
    description:
      "Online php compiler in your browser. Write, compile and run php code online using jitcompiler. Online PHP Compiler, Online PHP Editor, Online PHP IDE, Execute PHP Online, Compile PHP Online, Run PHP Online",
    keywords:
      "Online PHP Compiler, PHP Online Compiler, Run PHP Online, Compile PHP Online, jitcompiler, online compiler, free online compiler",
  },
  python2: {
    languageName: "Python2",
    language: "python2",
    version: "2.7.17",
    compiler: "python2",
    fileExtension: "py",
    fileName: "main.py",
    defaultCode: '# A hello world program in python\nprint("Hello, World!")\n',
    title: "Online Python2 Compiler - JIT Compiler",
    description:
      "Online python2 compiler in your browser. Write, compile and run python2 code online using jitcompiler. Online Python2 Compiler, Online Python2 Editor, Online Python2 IDE, Execute Python2 Online, Compile Python2 Online, Run Python2 Online",
    keywords:
      "Online Python2 Compiler, Python2 Online Compiler, Run Python2 Online, Compile Python2 Online, jitcompiler, online compiler, free online compiler",
  },
  python3: {
    languageName: "Python3",
    language: "python3",
    version: "3.6.9",
    compiler: "python3",
    fileExtension: "py",
    fileName: "main.py",
    defaultCode: '# A hello world program in python\nprint("Hello, World!")\n',
    title: "Online Python3 Compiler - JIT Compiler",
    description:
      "Online python3 compiler in your browser. Write, compile and run python3 code online using jitcompiler. Online Python3 Compiler, Online Python3 Editor, Online Python3 IDE, Execute Python3 Online, Compile Python3 Online, Run Python3 Online",
    keywords:
      "Online Python3 Compiler, Python3 Online Compiler, Run Python3 Online, Compile Python3 Online, jitcompiler, online compiler, free online compiler",
  },
  c: {
    languageName: "C",
    language: "c",
    version: "8.1.0",
    compiler: "gcc",
    fileExtension: "c",
    fileName: "main.c",
    defaultCode:
      '#include<stdio.h>\n\nint main() {\n  // A hello world program in c\n  printf("Hello, World!");\n  return 0;\n}\n',
    title: "Online C Compiler - JIT Compiler",
    description:
      "Online c compiler in your browser. Write, compile and run c code online using jitcompiler. Online C Compiler, Online C Editor, Online C IDE, Execute C Online, Compile C Online, Run C Online",
    keywords:
      "Online C Compiler, C Online Compiler, Run C Online, Compile C Online, jitcompiler, online compiler, free online compiler",
  },
  cpp: {
    languageName: "C++",
    language: "cpp",
    version: "9.3.0",
    compiler: "g++",
    fileExtension: "cpp",
    fileName: "main.cpp",
    defaultCode:
      '#include<iostream>\nusing namespace std;\n\nint main() {\n  // A hello world program in c++\n  cout << "Hello, World!";\n  return 0;\n}\n',
    title: "Online C++ Compiler - JIT Compiler",
    description:
      "Online c++ compiler in your browser. Write, compile and run c++ code online using jitcompiler. Online C++ Compiler, Online C++ Editor, Online C++ IDE, Execute C++ Online, Compile C++ Online, Run C++ Online",
    keywords:
      "Online C++ Compiler, C++ Online Compiler, Run C++ Online, Compile C++ Online, jitcompiler, online compiler, free online compiler",
  },
  csharp: {
    languageName: "C#",
    language: "csharp",
    version: "4.6.2",
    compiler: "mcs",
    fileExtension: "cs",
    fileName: "main.cs",
    defaultCode:
      'namespace HelloWorld {\n  class Hello {\n    static void Main(string[] args) {\n      // A hello world program in C#\n      System.Console.WriteLine("Hello, World!");\n    }\n  }\n}\n',
    title: "Online C# Compiler - JIT Compiler",
    description:
      "Online c# compiler in your browser. Write, compile and run c# code online using jitcompiler. Online C# Compiler, Online C# Editor, Online C# IDE, Execute C# Online, Compile C# Online, Run C# Online",
    keywords:
      "Online C# Compiler, C# Online Compiler, Run C# Online, Compile C# Online, jitcompiler, online compiler, free online compiler",
  },
  java: {
    languageName: "Java",
    language: "java",
    version: "11.0.11",
    compiler: "javac",
    fileExtension: "java",
    fileName: "HelloWorld.java",
    defaultCode:
      'package Hello;\n\nclass HelloWorld {\n  public static void main(String args[]) {\n    // A hello world program in java\n    System.out.println("Hello, World!");\n  }\n}\n',
    title: "Online Java Compiler - JIT Compiler",
    description:
      "Online java compiler in your browser. Write, compile and run java code online using jitcompiler. Online Java Compiler, Online Java Editor, Online Java IDE, Execute Java Online, Compile Java Online, Run Java Online",
    keywords:
      "Online Java Compiler, Java Online Compiler, Run Java Online, Compile Java Online, jitcompiler, online compiler, free online compiler",
  },
  perl: {
    languageName: "Perl",
    language: "perl",
    version: "5",
    compiler: "perl",
    fileExtension: "pl",
    fileName: "main.pl",
    defaultCode: '# A hello world program in perl\nprint("Hello, World!")\n',
    title: "Online Perl Compiler - JIT Compiler",
    description:
      "Online perl compiler in your browser. Write, compile and run perl code online using jitcompiler. Online Perl Compiler, Online Perl Editor, Online Perl IDE, Execute Perl Online, Compile Perl Online, Run Perl Online",
    keywords:
      "Online Perl Compiler, Perl Online Compiler, Run Perl Online, Compile Perl Online, jitcompiler, online compiler, free online compiler",
  },
  shell: {
    languageName: "Shell",
    language: "shell",
    version: "4.4.19",
    compiler: "sh",
    fileExtension: "sh",
    fileName: "main.sh",
    defaultCode:
      '#!/bin/sh\n# A hello world program in shell script\necho "Hello, World!"\n',
    title: "Online Shell Script Compiler - JIT Compiler",
    description:
      "Online shell compiler in your browser. Write, compile and run shell code online using jitcompiler. Online Shell Compiler, Online Shell Editor, Online Shell IDE, Execute Shell Online, Compile Shell Online, Run Shell Online",
    keywords:
      "Online Shell Compiler, Shell Online Compiler, Run Shell Online, Compile Shell Online, jitcompiler, online compiler, free online compiler",
  },
  golang: {
    languageName: "Golang",
    language: "golang",
    version: "1.10.4",
    compiler: "go run",
    fileExtension: "go",
    fileName: "main.go",
    defaultCode:
      'package main\nimport "fmt"\n\nfunc main() {\n // A hello world program in golang\n fmt.Println("Hello, World!")\n}\n',
    title: "Online Golang Compiler - JIT Compiler",
    description:
      "Online golang compiler in your browser. Write, compile and run golang code online using jitcompiler. Online Golang Compiler, Online Golang Editor, Online Golang IDE, Execute Golang Online, Compile Golang Online, Run Golang Online",
    keywords:
      "Online Golang Compiler, Golang Online Compiler, Run Golang Online, Compile Golang Online, jitcompiler, online compiler, free online compiler",
  },
  ruby: {
    languageName: "Ruby",
    language: "ruby",
    version: "2.5.1",
    compiler: "ruby",
    fileExtension: "rb",
    fileName: "main.rb",
    defaultCode: '# A hello world program in ruby\nputs "Hello, World!"\n',
    title: "Online Ruby Compiler - JIT Compiler",
    description:
      "Online ruby compiler in your browser. Write, compile and run ruby code online using jitcompiler. Online Ruby Compiler, Online Ruby Editor, Online Ruby IDE, Execute Ruby Online, Compile Ruby Online, Run Ruby Online",
    keywords:
      "Online Ruby Compiler, Ruby Online Compiler, Run Ruby Online, Compile Ruby Online, jitcompiler, online compiler, free online compiler",
  },
  html: {
    languageName: "HTML/CSS",
    language: "html",
    version: "5",
    compiler: null,
    fileExtension: "html",
    fileName: "index.html",
    defaultCode:
      "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello, World</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>\n",
    title: "Online HTML/CSS Editor - JIT Compiler",
    description:
      "Online html compiler in your browser. Write, compile and run html code online using jitcompiler. Online HTML Compiler, Online HTML Editor, Online HTML IDE, Execute HTML Online, Compile HTML Online, Run HTML Online",
    keywords:
      "Online HTML Compiler, HTML Online Compiler, Run HTML Online, Compile HTML Online, jitcompiler, online compiler, free online compiler",
  },
  dart: {
    languageName: "Dart",
    language: "dart",
    version: "2.13.3",
    compiler: "dart",
    fileExtension: "dart",
    fileName: "main.dart",
    defaultCode:
      'void main() {\n  // A hello world program in dart\n  print("Hello, World!");\n}\n',
    title: "Online Dart Compiler - JIT Compiler",
    description:
      "Online dart compiler in your browser. Write, compile and run dart code online using jitcompiler. Online Dart Compiler, Online Dart Editor, Online Dart IDE, Execute Dart Online, Compile Dart Online, Run Dart Online",
    keywords:
      "Online Dart Compiler, Dart Online Compiler, Run Dart Online, Compile Dart Online, jitcompiler, online compiler, free online compiler",
  },
  swift: {
    languageName: "Swift",
    language: "swift",
    version: "5.4.1",
    compiler: "swift",
    fileExtension: "swift",
    fileName: "main.swift",
    defaultCode: '// A hello world program in swift\nprint("Hello, World!")\n',
    title: "Online Swift Compiler - JIT Compiler",
    description:
      "Online swift compiler in your browser. Write, compile and run swift code online using jitcompiler. Online Swift Compiler, Online Swift Editor, Online Swift IDE, Execute Swift Online, Compile Swift Online, Run Swift Online",
    keywords:
      "Online Swift Compiler, Swift Online Compiler, Run Swift Online, Compile Swift Online, jitcompiler, online compiler, free online compiler",
  },
  rust: {
    languageName: "Rust",
    language: "rust",
    version: "1.5.1",
    compiler: "rustc",
    fileExtension: "rs",
    fileName: "main.rs",
    defaultCode:
      '// A hello world program in rust\nfn main() {\n  println!("Hello, World!");\n}\n',
    title: "Online Rust Compiler - JIT Compiler",
    description:
      "Online rust compiler in your browser. Write, compile and run rust code online using jitcompiler. Online Rust Compiler, Online Rust Editor, Online Rust IDE, Execute Rust Online, Compile Rust Online, Run Rust Online",
    keywords:
      "Online Rust Compiler, Rust Online Compiler, Run Rust Online, Compile Rust Online, jitcompiler, online compiler, free online compiler",
  },
  assembly: {
    languageName: "Assembly",
    language: "assembly",
    version: "2.14.02",
    compiler: "nasm",
    fileExtension: "asm",
    fileName: "main.asm",
    defaultCode:
      "# A hello world program in assembly language\nsection  .text\nglobal  _start\n_start:\n  mov edx,len\n  mov ecx,msg\n  mov ebx,1\n  mov eax,4\n  int 0x80\n  mov eax,1\n  int 0x80\nsection .data\nmsg db 'Hello, World!',0xa\nlen equ $ - msg\n",
    title: "Online Assembly Language Compiler - JIT Compiler",
    description:
      "Online assembly compiler in your browser. Write, compile and run assembly code online using jitcompiler. Online Assembly Compiler, Online Assembly Editor, Online Assembly IDE, Execute Assembly Online, Compile Assembly Online, Run Assembly Online",
    keywords:
      "Online Assembly Compiler, Assembly Online Compiler, Run Assembly Online, Compile Assembly Online, jitcompiler, online compiler, free online compiler",
  },
  fortran: {
    languageName: "Fortran",
    language: "fortran",
    version: "9.3.0",
    compiler: "gfortran",
    fileExtension: "f90",
    fileName: "main.f90",
    defaultCode:
      "! A hello world program in fortran\nprogram hello\n  print *, 'Hello, World!'\nend program hello\n",
    title: "Online Fortran Compiler - JIT Compiler",
    description:
      "Online fortran compiler in your browser. Write, compile and run fortran code online using jitcompiler. Online Fortran Compiler, Online Fortran Editor, Online Fortran IDE, Execute Fortran Online, Compile Fortran Online, Run Fortran Online",
    keywords:
      "Online Fortran Compiler, Fortran Online Compiler, Run Fortran Online, Compile Fortran Online, jitcompiler, online compiler, free online compiler",
  },
  groovy: {
    languageName: "Groovy",
    language: "groovy",
    version: "3.0.4",
    compiler: "groovy",
    fileExtension: "groovy",
    fileName: "main.groovy",
    defaultCode:
      '// A hello world program in groovy\nprintln "Hello, World!"\n',
    title: "Online Groovy Compiler - JIT Compiler",
    description:
      "Online groovy compiler in your browser. Write, compile and run groovy code online using jitcompiler. Online Groovy Compiler, Online Groovy Editor, Online Groovy IDE, Execute Groovy Online, Compile Groovy Online, Run Groovy Online",
    keywords:
      "Online Groovy Compiler, Groovy Online Compiler, Run Groovy Online, Compile Groovy Online, jitcompiler, online compiler, free online compiler",
  },
  kotlin: {
    languageName: "Kotlin",
    language: "kotlin",
    version: null,
    compiler: "kotlinc",
    fileExtension: "kt",
    fileName: "main.kt",
    defaultCode:
      '// A hello world program in kotlin\nfun main() {\n  println("Hello, World!")\n}\n',
    title: "Online Kotlin Compiler - JIT Compiler",
    description:
      "Online kotlin compiler in your browser. Write, compile and run kotlin code online using jitcompiler. Online Kotlin Compiler, Online Kotlin Editor, Online Kotlin IDE, Execute Kotlin Online, Compile Kotlin Online, Run Kotlin Online",
    keywords:
      "Online Kotlin Compiler, Kotlin Online Compiler, Run Kotlin Online, Compile Kotlin Online, jitcompiler, online compiler, free online compiler",
  },
  haskell: {
    languageName: "Haskell",
    language: "haskell",
    version: "8.6.5",
    compiler: "runghc",
    fileExtension: "hs",
    fileName: "main.hs",
    defaultCode:
      '-- A hello world program in haskell\nmain::IO()\nmain = putStrLn "Hello, World!"\n',
    title: "Online Haskell Compiler - JIT Compiler",
    description:
      "Online haskell compiler in your browser. Write, compile and run haskell code online using jitcompiler. Online Haskell Compiler, Online Haskell Editor, Online Haskell IDE, Execute Haskell Online, Compile Haskell Online, Run Haskell Online",
    keywords:
      "Online Haskell Compiler, Haskell Online Compiler, Run Haskell Online, Compile Haskell Online, jitcompiler, online compiler, free online compiler",
  },
  julia: {
    languageName: "Julia",
    language: "julia",
    version: "1.0.4",
    compiler: "julia",
    fileExtension: "jl",
    fileName: "main.jl",
    defaultCode: '# A hello world program in julia\nprintln("Hello, World!")\n',
    title: "Online Julia Compiler - JIT Compiler",
    description:
      "Online julia compiler in your browser. Write, compile and run julia code online using jitcompiler. Online Julia Compiler, Online Julia Editor, Online Julia IDE, Execute Julia Online, Compile Julia Online, Run Julia Online",
    keywords:
      "Online Julia Compiler, Julia Online Compiler, Run Julia Online, Compile Julia Online, jitcompiler, online compiler, free online compiler",
  },
  lua: {
    languageName: "Lua",
    language: "lua",
    version: "5.3.3",
    compiler: "lua",
    fileExtension: "lua",
    fileName: "main.lua",
    defaultCode: '-- A hello world program in lua\nprint("Hello, World!")\n',
    title: "Online Lua Compiler - JIT Compiler",
    description:
      "Online lua compiler in your browser. Write, compile and run lua code online using jitcompiler. Online Lua Compiler, Online Lua Editor, Online Lua IDE, Execute Lua Online, Compile Lua Online, Run Lua Online",
    keywords:
      "Online Lua Compiler, Lua Online Compiler, Run Lua Online, Compile Lua Online, jitcompiler, online compiler, free online compiler",
  },
  "objective-c": {
    languageName: "Objective-C",
    language: "objective-c",
    version: "7.5.0",
    compiler: "gcc",
    fileExtension: "m",
    fileName: "main.m",
    defaultCode:
      '#import<Foundation/Foundation.h>\n// A hello world program in objective-c\nint main(int argc, const char * argv[]) {\n  NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];\n  NSLog(@"Hello, World!");\n  [pool drain];\n  return 0;\n}\n',
    title: "Online Objective-C Compiler - JIT Compiler",
    description:
      "Online objective-c compiler in your browser. Write, compile and run objective-c code online using jitcompiler. Online Objective-C Compiler, Online Objective-C Editor, Online Objective-C IDE, Execute Objective-C Online, Compile Objective-C Online, Run Objective-C Online",
    keywords:
      "Online Objective-C Compiler, Objective-C Online Compiler, Run Objective-C Online, Compile Objective-C Online, jitcompiler, online compiler, free online compiler",
  },
  elixir: {
    languageName: "Elixir",
    language: "elixir",
    version: "1.9.1",
    compiler: "elixir",
    fileExtension: "exs",
    fileName: "main.exs",
    defaultCode:
      '# A hello world program in elixir\nIO.puts("Hello, World!")\n',
    title: "Online Elixir Compiler - JIT Compiler",
    description:
      "Online elixir compiler in your browser. Write, compile and run elixir code online using jitcompiler. Online Elixir Compiler, Online Elixir Editor, Online Elixir IDE, Execute Elixir Online, Compile Elixir Online, Run Elixir Online",
    keywords:
      "Online Elixir Compiler, Elixir Online Compiler, Run Elixir Online, Compile Elixir Online, jitcompiler, online compiler, free online compiler",
  },
  lisp: {
    languageName: "Lisp",
    language: "lisp",
    version: "2.0.1",
    compiler: "sbcl",
    fileExtension: "lisp",
    fileName: "main.lisp",
    defaultCode:
      ';; A hello world program in lisp\n(write-line "Hello, World!")\n',
    title: "Online Lisp Compiler - JIT Compiler",
    description:
      "Online lisp compiler in your browser. Write, compile and run lisp code online using jitcompiler. Online Lisp Compiler, Online Lisp Editor, Online Lisp IDE, Execute Lisp Online, Compile Lisp Online, Run Lisp Online",
    keywords:
      "Online Lisp Compiler, Lisp Online Compiler, Run Lisp Online, Compile Lisp Online, jitcompiler, online compiler, free online compiler",
  },
  erlang: {
    languageName: "Erlang",
    language: "erlang",
    version: "10.6.4",
    compiler: "erlc",
    fileExtension: "erl",
    fileName: "main.erl",
    defaultCode:
      '% A hello world program in erlang\n-module(main).\n-export([start/0]).\nstart() ->\n  io:fwrite("Hello, World!").\n',
    title: "Online Erlang Compiler - JIT Compiler",
    description:
      "Online erlang compiler in your browser. Write, compile and run erlang code online using jitcompiler. Online Erlang Compiler, Online Erlang Editor, Online Erlang IDE, Execute Erlang Online, Compile Erlang Online, Run Erlang Online",
    keywords:
      "Online Erlang Compiler, Erlang Online Compiler, Run Erlang Online, Compile Erlang Online, jitcompiler, online compiler, free online compiler",
  },
  scala: {
    languageName: "Scala",
    language: "scala",
    version: "2.11.12",
    compiler: "scalac",
    fileExtension: "scala",
    fileName: "Hello.scala",
    defaultCode:
      'object Hello {\n  def main(args: Array[String]) = {\n    // A hello world program in scala\n    println("Hello, World!");\n  }\n}\n',
    title: "Online Scala Compiler - JIT Compiler",
    description:
      "Online scala compiler in your browser. Write, compile and run scala code online using jitcompiler. Online Scala Compiler, Online Scala Editor, Online Scala IDE, Execute Scala Online, Compile Scala Online, Run Scala Online",
    keywords:
      "Online Scala Compiler, Scala Online Compiler, Run Scala Online, Compile Scala Online, jitcompiler, online compiler, free online compiler",
  },
  crystal: {
    languageName: "Crystal",
    language: "crystal",
    version: "1.2.1",
    compiler: "crystal",
    fileExtension: "cr",
    fileName: "main.cr",
    defaultCode: '# A hello world program in crystal\nputs "Hello, World!"\n',
    title: "Online Crystal Compiler - JIT Compiler",
    description:
      "Online crystal compiler in your browser. Write, compile and run crystal code online using jitcompiler. Online Crystal Compiler, Online Crystal Editor, Online Crystal IDE, Execute Crystal Online, Compile Crystal Online, Run Crystal Online",
    keywords:
      "Online Crystal Compiler, Crystal Online Compiler, Run Crystal Online, Compile Crystal Online, jitcompiler, online compiler, free online compiler",
  },
  nim: {
    languageName: "Nim",
    language: "nim",
    version: "1.0.6",
    compiler: "nim",
    fileExtension: "nim",
    fileName: "main.nim",
    defaultCode: '# A hello world program in nim\necho "Hello, World!"\n',
    title: "Online Nim Compiler - JIT Compiler",
    description:
      "Online nim compiler in your browser. Write, compile and run nim code online using jitcompiler. Online Nim Compiler, Online Nim Editor, Online Nim IDE, Execute Nim Online, Compile Nim Online, Run Nim Online",
    keywords:
      "Online Nim Compiler, Nim Online Compiler, Run Nim Online, Compile Nim Online, jitcompiler, online compiler, free online compiler",
  },
  tcl: {
    languageName: "TCL",
    language: "tcl",
    version: "8.6",
    compiler: "tclsh",
    fileExtension: "scala",
    fileName: "main.tcl",
    defaultCode:
      '#!/usr/bin/tclsh\n# A hello world program in tcl\nputs "Hello, World!"\n',
    title: "Online TCL Compiler - JIT Compiler",
    description:
      "Online tcl compiler in your browser. Write, compile and run tcl code online using jitcompiler. Online TCL Compiler, Online TCL Editor, Online TCL IDE, Execute TCL Online, Compile TCL Online, Run TCL Online",
    keywords:
      "Online TCL Compiler, TCL Online Compiler, Run TCL Online, Compile TCL Online, jitcompiler, online compiler, free online compiler",
  },
  r: {
    languageName: "R",
    language: "r",
    version: "3.6.3",
    compiler: "Rscript",
    fileExtension: "r",
    fileName: "main.r",
    defaultCode:
      '# A hello world program in r\nprint("Hello, World!", quote=FALSE)\n',
    title: "Online R Compiler - JIT Compiler",
    description:
      "Online rlang compiler in your browser. Write, compile and run rlang code online using jitcompiler. Online Rlang Compiler, Online Rlang Editor, Online Rlang IDE, Execute Rlang Online, Compile Rlang Online, Run Rlang Online",
    keywords:
      "Online Rlang Compiler, Rlang Online Compiler, Run Rlang Online, Compile Rlang Online, jitcompiler, online compiler, free online compiler",
  },
  cobol: {
    languageName: "Cobol",
    language: "cobol",
    version: "2.2.0",
    compiler: "cobc",
    fileExtension: "cbl",
    fileName: "main.cbl",
    defaultCode:
      'IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO-WORLD.\n*> A hello world program in cobol\nPROCEDURE DIVISION.\n  DISPLAY "Hello, World!".\n  STOP RUN.\n',
    title: "Online Cobol Compiler - JIT Compiler",
    description:
      "Online cobol compiler in your browser. Write, compile and run cobol code online using jitcompiler. Online Cobol Compiler, Online Cobol Editor, Online Cobol IDE, Execute Cobol Online, Compile Cobol Online, Run Cobol Online",
    keywords:
      "Online Cobol Compiler, Cobol Online Compiler, Run Cobol Online, Compile Cobol Online, jitcompiler, online compiler, free online compiler",
  },
  pascal: {
    languageName: "Pascal",
    language: "pascal",
    version: "2.2.0",
    compiler: "fpc",
    fileExtension: "pas",
    fileName: "main.pas",
    defaultCode:
      "program HelloWorld;\nuses crt;\n(* A hello world program in pascal *)\nbegin\n  writeln('Hello, World!');\nend. \n",
    title: "Online Pascal Compiler - JIT Compiler",
    description:
      "Online pascal compiler in your browser. Write, compile and run pascal code online using jitcompiler. Online Pascal Compiler, Online Pascal Editor, Online Pascal IDE, Execute Pascal Online, Compile Pascal Online, Run Pascal Online",
    keywords:
      "Online Pascal Compiler, Pascal Online Compiler, Run Pascal Online, Compile Pascal Online, jitcompiler, online compiler, free online compiler",
  },
  ocaml: {
    languageName: "Ocaml",
    language: "ocaml",
    version: "4.05.0",
    compiler: "ocaml",
    fileExtension: "ml",
    fileName: "main.ml",
    defaultCode:
      '(** A hello world program in falcon *)\nprint_string "Hello, World!";;\n',
    title: "Online Ocaml Compiler - JIT Compiler",
    description:
      "Online ocaml compiler in your browser. Write, compile and run ocaml code online using jitcompiler. Online Ocaml Compiler, Online Ocaml Editor, Online Ocaml IDE, Execute Ocaml Online, Compile Ocaml Online, Run Ocaml Online",
    keywords:
      "Online Ocaml Compiler, Ocaml Online Compiler, Run Ocaml Online, Compile Ocaml Online, jitcompiler, online compiler, free online compiler",
  },
  smalltalk: {
    languageName: "SmallTalk",
    language: "smalltalk",
    version: "3.2.5",
    compiler: "gst",
    fileExtension: "sm",
    fileName: "main.sm",
    defaultCode:
      "\"A hello world program in smalltalk\"\n Transcript show: 'Hello, World!'.\n",
    title: "Online SmallTalk Compiler - JIT Compiler",
    description:
      "Online smalltalk compiler in your browser. Write, compile and run smalltalk code online using jitcompiler. Online Smalltalk Compiler, Online Smalltalk Editor, Online Smalltalk IDE, Execute Smalltalk Online, Compile Smalltalk Online, Run Smalltalk Online",
    keywords:
      "Online Smalltalk Compiler, Smalltalk Online Compiler, Run Smalltalk Online, Compile Smalltalk Online, jitcompiler, online compiler, free online compiler",
  },
  bhailang: {
    languageName: "BhaiLang",
    language: "bhailang",
    version: "0.0",
    compiler: "bhailang",
    fileExtension: "bhai",
    fileName: "main.bhai",
    defaultCode:
      '// A hello world program in bhailang\nhi bhai\n  bol bhai "Hello, Bhai!";\nbye bhai\n',
    title: "Online BhaiLang Compiler - JIT Compiler",
    description:
      "Online bhailang compiler in your browser. Write, compile and run bhailang code online using jitcompiler. Online Bhailang Compiler, Online Bhailang Editor, Online Bhailang IDE, Execute Bhailang Online, Compile Bhailang Online, Run Bhailang Online",
    keywords:
      "Online Bhailang Compiler, Bhailang Online Compiler, Run Bhailang Online, Compile Bhailang Online, jitcompiler, online compiler, free online compiler",
  },
  vb: {
    languageName: "VB.NET",
    language: "vb",
    version: "0.0.0.5943",
    compiler: "vbnc",
    fileExtension: "vb",
    fileName: "main.vb",
    defaultCode:
      '\'A hello world program in vb.net\nModule VBModule\n  Sub Main()\n    Console.WriteLine("Hello, World!")\n  End Sub\nEnd Module\n',
    title: "Online VB.NET Compiler - JIT Compiler",
    description:
      "Online vb.net compiler in your browser. Write, compile and run vb.net code online using jitcompiler. Online VB.NET Compiler, Online VB.NET Editor, Online VB.NET IDE, Execute VB.NET Online, Compile VB.NET Online, Run VB.NET Online",
    keywords:
      "Online VB.NET Compiler, VB.NET Online Compiler, Run VB.NET Online, Compile VB.NET Online, jitcompiler, online compiler, free online compiler",
  },
  fsharp: {
    languageName: "F#",
    language: "fsharp",
    version: "4.0",
    compiler: "fsharpc",
    fileExtension: "fs",
    fileName: "main.fs",
    defaultCode:
      '(* A hello world program in fsharp *)\nprintfn "Hello, World!"',
    title: "Online Fsharp Compiler - JIT Compiler",
    description:
      "Online fsharp compiler in your browser. Write, compile and run fsharp code online using jitcompiler. Online Fsharp Compiler, Online Fsharp Editor, Online Fsharp IDE, Execute Fsharp Online, Compile Fsharp Online, Run Fsharp Online",
    keywords:
      "Online Fsharp Compiler, Fsharp Online Compiler, Run Fsharp Online, Compile Fsharp Online, jitcompiler, online compiler, free online compiler",
  },
  sqlite3: {
    languageName: "SQLite3",
    language: "sqlite3",
    version: "3.31.1",
    compiler: "sqlite3",
    fileExtension: "sql",
    fileName: "main.sql",
    defaultCode:
      '-- Create table\nCREATE TABLE brands(id integer, name text);\n\n-- Insert data in table\nINSERT INTO brands VALUES(1, "Apple");\nINSERT INTO brands VALUES(2, "Google");\n\n-- Select data from table\nSELECT * FROM brands;\n',
    title: "Online SQLite3 Compiler - JIT Compiler",
    description:
      "Online sqlite3 compiler in your browser. Write, compile and run sqlite3 code online using jitcompiler. Online Sqlite3 Compiler, Online Sqlite3 Editor, Online Sqlite3 IDE, Execute Sqlite3 Online, Compile Sqlite3 Online, Run Sqlite3 Online",
    keywords:
      "Online Sqlite3 Compiler, Sqlite3 Online Compiler, Run Sqlite3 Online, Compile Sqlite3 Online, jitcompiler, online compiler, free online compiler",
  },
  mysql: {
    languageName: "MySQL",
    language: "mysql",
    version: "8.0.28",
    compiler: "mysql",
    fileExtension: "sql",
    fileName: "main.sql",
    defaultCode:
      '-- Create table\nCREATE TABLE brands(id int, name text);\n\n-- Insert data in table\nINSERT INTO brands VALUES(1, "Apple");\nINSERT INTO brands VALUES(2, "Google");\n\n-- Select data from table\nSELECT * FROM brands;\n',
    title: "Online MySQL Compiler - JIT Compiler",
    description:
      "Online mysql compiler in your browser. Write, compile and run mysql code online using jitcompiler. Online MySQL Compiler, Online MySQL Editor, Online MySQL IDE, Execute MySQL Online, Compile MySQL Online, Run MySQL Online",
    keywords:
      "Online MySQL Compiler, MySQL Online Compiler, Run MySQL Online, Compile MySQL Online, jitcompiler, online compiler, free online compiler",
  },
};

const sortedLanguages = Object.keys(supportedLanguages)
  .sort()
  .reduce(function (obj, key) {
    obj[key] = supportedLanguages[key];
    return obj;
  }, {});

module.exports = { languages: sortedLanguages };
