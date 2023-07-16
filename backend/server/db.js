const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin1234@',
  database: 'blog_posts',
});

module.exports = connection;
