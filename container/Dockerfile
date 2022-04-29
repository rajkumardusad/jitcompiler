# Create from ubuntu image
FROM ubuntu:20.04

# Label
LABEL maintainer="compiler@jitcompiler.com"

# Create user
RUN useradd -ms /bin/bash compiler

# Change default shell to bash
SHELL ["/bin/bash", "-c"]

# Update the image to the latest packages
RUN apt-get update
RUN apt-get upgrade -y

# Install required packages
RUN apt-get install software-properties-common -y
RUN apt-get install zip unzip curl wget tar -y
# Install sdkman
RUN curl -s "https://get.sdkman.io" | bash
RUN chmod a+x "$HOME/.sdkman/bin/sdkman-init.sh"

# Install php
RUN add-apt-repository ppa:ondrej/php
RUN apt-get install php8.0 php8.0-curl -y
# Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install nodejs -y
# Install bhailang
RUN npm install -g npm@latest
RUN npm i -g bhailang
# Install python
RUN apt-get install python python3-pip -y
RUN pip install numpy
# Install C
RUN apt-get install gcc -y
# Install C++
RUN apt-get install g++ -y
# Install objective-c
RUN apt-get install gobjc gnustep gnustep-devel -y
# Install perl
RUN apt-get install perl -y
# Install ruby
RUN apt-get install ruby-full -y
# Install golang
RUN apt-get install golang -y
# Install java
RUN apt-get install default-jre -y
RUN apt-get install default-jdk -y
# Install kotlin
RUN source "$HOME/.sdkman/bin/sdkman-init.sh" && sdk install kotlin
# Install dart
RUN apt-get install apt-transport-https -y
RUN wget -qO- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/dart.gpg
RUN echo 'deb [signed-by=/usr/share/keyrings/dart.gpg arch=amd64] https://storage.googleapis.com/download.dartlang.org/linux/debian stable main' | tee /etc/apt/sources.list.d/dart_stable.list
RUN apt-get update -y
RUN apt-get install dart -y
# Install crystal
RUN curl -fsSL https://crystal-lang.org/install.sh | bash
# Install C#
RUN apt-get install mono-complete -y
# Install VB.Net
RUN apt-get install mono-vbnc -y
# Install F#
RUN apt-get install fsharp -y
# Install lua
RUN apt-get install lua5.3 -y
# Install haskell
RUN apt-get install haskell-platform -y
# Install cobol
RUN apt-get install open-cobol -y
# Install nim
RUN apt-get install nim -y
# Install swift
RUN apt-get install binutils gnupg2 libc6-dev libcurl4 libedit2 libgcc-9-dev libpython2.7 libsqlite3-0 libstdc++-9-dev libxml2 libz3-dev pkg-config tzdata uuid-dev zlib1g-dev -y
RUN wget https://swift.org/builds/swift-5.6-release/ubuntu2004/swift-5.6-RELEASE/swift-5.6-RELEASE-ubuntu20.04.tar.gz
RUN tar xvzf swift-5.6-RELEASE-ubuntu20.04.tar.gz
RUN mv swift-5.6-RELEASE-ubuntu20.04 /usr/share/swift
RUN echo "export PATH=/usr/share/swift/usr/bin:$PATH" >> ~/.bashrc
RUN echo "export PATH=/usr/share/swift/usr/bin:$PATH" >> /home/compiler/.bashrc
# Install assembly
RUN apt-get install nasm -y
# Install fortran
RUN apt-get install gfortran -y
# Install scala
RUN apt-get install scala -y
# Install groovy
# RUN apt-get install groovy -y
RUN source "$HOME/.sdkman/bin/sdkman-init.sh" && sdk install groovy
# Install julia
RUN apt-get install julia -y
# Install rlang
RUN apt-get install r-base -y
# Install rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y
RUN cp -r ~/.cargo ~/.rustup /home/compiler
RUN echo '. "$HOME/.cargo/env"' >> /home/compiler/.bashrc
# Install deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
RUN echo 'export DENO_INSTALL="$HOME/.deno"' >> ~/.bashrc
RUN echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> ~/.bashrc
RUN cp -r ~/.deno /home/compiler
RUN echo 'export DENO_INSTALL="$HOME/.deno"' >> /home/compiler/.bashrc
RUN echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> /home/compiler/.bashrc
# Install erlang
RUN DEBIAN_FRONTEND=noninteractive apt-get install erlang -y
# Install elixir
RUN apt-get install elixir -y
# Install lisp
RUN apt-get install sbcl -y
# Install tcl
RUN apt-get install tcl -y
# Install smalltalk
RUN apt-get install gnu-smalltalk -y
# Install prolog
RUN apt-get install swi-prolog -y
# Install pascal
RUN apt-get install fp-compiler -y
# Install ocaml
RUN apt-get install ocaml-nox -y
# Install SQlite3
RUN apt-get install sqlite3 -y
# Install MySQL/MariaDB
# RUN apt-get install mysql-server -y
RUN apt-get install mariadb-server -y
# RUN service mysql start
# RUN mysql -e "create user compiler@localhost"
RUN echo "[mysql]" > /home/compiler/.my.cnf
RUN echo "user=compiler" >> /home/compiler/.my.cnf
RUN echo "password=" >> /home/compiler/.my.cnf
RUN chmod 0644 /home/compiler/.my.cnf

# Update packages
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get clean -y
RUN apt-get autoclean -y
RUN apt-get autoremove -y

# Set default workdir
WORKDIR /tmp
