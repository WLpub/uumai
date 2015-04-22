var mongojs = require("mongojs");

var db_name = process.env.OPENSHIFT_APP_NAME || "mydb";

var connection_string = '10.182.111.82:27017/'+ db_name;
// if OPENSHIFT env variables are present, use the available connection info:

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var db = mongojs(connection_string, [db_name]);
exports.mongojs=mongojs;
exports.db = db;