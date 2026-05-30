const fs = require('fs');
const express = require('express');
const helper = require('./helper');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;
const dataPath = path.join(__dirname, 'data');
const armiesPath = path.join(dataPath, 'armies');
const referencesPath = path.join(dataPath, 'references');
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');

function ensureArmiesDirectory() {
  fs.mkdirSync(armiesPath, { recursive: true });
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());

app.post('/api/save-army-data', (req, res) => {
  ensureArmiesDirectory();

  const data = req.body.armyData;
  const armyUrl = req.body.armyName;

  fs.writeFile(
    path.join(armiesPath, `${armyUrl}.json`),
    JSON.stringify(data),
    err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving data');
      }

      res.send('Data saved successfully');
    }
  );
});

app.get('/api/get-army-data', (req, res) => {
  ensureArmiesDirectory();

  const armyUrl = req.query.armyName;

  const filePath = path.join(armiesPath, `${armyUrl}.json`);
  if (fs.existsSync(filePath)) {
    // read file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(404).send('File not found');
      }

      res.send(data);
    });
  } else {
    // handle file not found error
    res.status(200).send();
  }
});

app.get('/api/get-state-list', (req, res) => {
  const filePaths = {
    armyMap: path.join(referencesPath, 'STATE_MAP.json'),
    armyData: path.join(referencesPath, 'STATE_ID.json'),
    currency: path.join(referencesPath, 'CURRENCY.json'),
  };

  const data = {};

  for (const [key, filePath] of Object.entries(filePaths)) {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      data[key] = JSON.parse(fileData);
    }
  }

  res.send(data);
});

app.post('/api/add-new-state', (req, res) => {
  const filePaths = {
    armyMap: path.join(referencesPath, 'STATE_MAP.json'),
    armyData: path.join(referencesPath, 'STATE_ID.json'),
    currency: path.join(referencesPath, 'CURRENCY.json'),
  };
  for (const [key, filePath] of Object.entries(filePaths)) {
    if (fs.existsSync(filePath)) {
      fs.writeFile(filePath, JSON.stringify(req.body[key]), err => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error saving data');
        }
      });
    }
  }
  res.send('Data saved successfully');
});
app.post('/api/delete-state', (req, res) => {
  const filePaths = {
    armyMap: path.join(referencesPath, 'STATE_MAP.json'),
    armyData: path.join(referencesPath, 'STATE_ID.json'),
    currency: path.join(referencesPath, 'CURRENCY.json'),
  };

  for (const [key, filePath] of Object.entries(filePaths)) {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading file');
        }

        // Parse the JSON data
        let jsonData = JSON.parse(data);

        // Check if the key exists in the JSON object
        if (jsonData.hasOwnProperty(req.body[key])) {
          // Remove the key and its property
          delete jsonData[req.body[key]];

          // Convert the updated JSON data back to a string
          const updatedData = JSON.stringify(jsonData, null, 2);

          // Write the updated contents back to the file
          fs.writeFile(filePath, updatedData, 'utf8', err => {
            if (err) {
              console.error(err);
              return res.status(500).send('Error updating file');
            }
          });
        }
      });
    }
  }

  res.send('Data deleted successfully');
});

app.post('/api/replenish-all-units', (req, res) => {
  ensureArmiesDirectory();

  const files = fs.readdirSync(armiesPath); // get list of files in folder

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(armiesPath, file);

      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      jsonData.forEach(item => {
        item.Size = helper.replenishUnit(
          item.Tier,
          item.localStatus,
          item.Size
        );
      });

      fs.writeFileSync(filePath, JSON.stringify(jsonData)); // write updated JSON data back to file
    }
  });

  res.send('JSON files updated!');
});

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
