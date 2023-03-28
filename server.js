const request = require('request');
const connection = require('./connection');
const express = require('express');
const mysql =require('mysql');
const https = require('https');
const cors = require("cors");
const dotenv = require('dotenv');
const app = express();


const port = 4000; // Or any other port number you want to use
 dotenv.config();
app.use(express.json());
app.use(cors());
app.post('/api/generate', (req, res) => {
  const imageGenerationUrl = 'https://api.openai.com/v1/images/generations';
  const taglineGenerationUrl = 'https://api.openai.com/v1/completions';

  const imageGenerationOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.BEARER_TOKEN
    }
  };

  const taglineGenerationOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.BEARER_TOKEN,
    },
  };

  const imageData = JSON.stringify({
    prompt: req.body.imagePrompt,
    n: 1,
    size: '1024x1024'
  });

  const taglineData = JSON.stringify({
    model: 'text-davinci-001',
    prompt: req.body.taglinePrompt,
    temperature: 0.4,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  let imageResult = '';
  let imageRequest = https.request(imageGenerationUrl, imageGenerationOptions, (apiRes) => {
    apiRes.setEncoding('utf8');
    apiRes.on('data', (chunk) => {
      imageResult += chunk;
    });

    apiRes.on('end', () => {
      let taglineResult = '';
      let taglineRequest = https.request(taglineGenerationUrl, taglineGenerationOptions, (apiRes) => {
        apiRes.setEncoding('utf8');
        apiRes.on('data', (chunk) => {
          taglineResult += chunk;
        });

        apiRes.on('end', () => {
          const response = {
            imageResult: JSON.parse(imageResult),
            taglineResult: JSON.parse(taglineResult)
          };
          res.setHeader('Content-Type', 'application/json');
          res.send(response);
          // res.data(response.data);
          var imge=response.imageResult.data[0].url;
          console.log(imge);
          var newg = response.taglineResult.choices[0].text;
          console.log(newg);
          var desc = JSON.stringify(newg)
          // var desc = JSON.parse(newg);
          // try
        // connection.query('INSERT INTO fb_table(link,desc) VALUES('${imge,newg}')');
        const query = `INSERT INTO fb_table (link,desc) VALUES ('${imge}','${desc}')`;
       
        connection.query(query, (error, results, ) => {
          if (error) throw error;
          console.log('Data inserted successfully');
          connection.end();
        });
        //   const query = `INSERT INTO fb_table (desc) VALUES ('${newg}')`;
        // connection.query(query, (error, results, ) => {
        //   if (error) throw error;
        //   console.log('Data inserted successfully');
        //   connection.end();
        // });
  
           
          
        });
      });
      
      

      taglineRequest.on('error', (e) => {
        console.error(e);
      });

      taglineRequest.write(taglineData);
      taglineRequest.end();
    });
  });

  imageRequest.on('error', (e) => {
    console.error(e);
  });

  imageRequest.write(imageData);
  imageRequest.end();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//         console.log(`Inserted ${results.affectedRows} row(s)`);
//       });
//     });

//     connection.end();
//   }
// });
