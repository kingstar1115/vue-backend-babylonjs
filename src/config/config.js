const db_config = {
  dev: {
    host: "localhost",
    user: "root",
    port: "3309",
    password: "",
    database: "vuedb",
  },
  dev_cli: {
    host: "212.192.31.62",
    user: "root",
    port: "3309",
    password: "rootroot",
    database: "vuedb",
  },
};

module.exports = db_config.dev_cli;
