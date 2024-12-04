module.exports = {
  apps: [{
    name: "API-NOTIFICATION-PUSH",
    script: "npm",
    args: "start",
    watch: false,
    cron_restart: "0 0 1,15 * *",
  }],
};