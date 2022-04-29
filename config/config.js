require("dotenv").config();

let config = {
  container: {
    name: process.env.CONTAINER_NAME ?? "compiler-container",
    user: process.env.CONTAINER_USER ?? "compiler",
    env:
      process.env.CONTAINER_ENV ??
      "PATH=/home/compiler/.sdkman/candidates/kotlin/current/bin:/home/compiler/.deno/bin:/home/compiler/.cargo/bin:/usr/share/swift/usr/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
  },
};

module.exports = config;
