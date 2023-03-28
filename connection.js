
const mysql =require('mysql');
var mysqlConnection = mysql.createConnection({
    host: 'nanoshel.cuzlniri5zxa.ap-south-1.rds.amazonaws.com',
    user: 'root',
    password: 'poiuytrewq',
    database: 'fb_post'
});
mysqlConnection.connect((err)=>{
    if(err){
        console.log('Error in connection');
    }else{
        console.log('Connected Successfully');
    }
});
module.exports = mysqlConnection;