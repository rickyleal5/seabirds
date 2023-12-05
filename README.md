# Seabirds

Visualization of GPS data of seabirds from a dataset on Dryad.

**Dataset:**

[*"Data from: Predicting animal behaviour using deep learning: GPS data alone accurately predict diving in seabirds"*](https://datadryad.org/stash/dataset/doi:10.5061/dryad.t7ck5) by Browning, Ella et al.

```
Browning, Ella et al. (2017). Data from: Predicting animal behaviour using deep learning: GPS data alone accurately predict diving in seabirds [Dataset]. Dryad. https://doi.org/10.5061/dryad.t7ck5
```

### Project summary

This project runs a [Node.js](https://nodejs.org/en) program that streams the data in the dataset files to a [TimescaleDB](https://www.timescale.com/) database. The database structure is created using [Sequelize](https://sequelize.org/) models that represent the tables in the database. The data visualizations are displayed on interactive dashboards made on [Grafana](https://grafana.com/grafana/). Both Grafana and TimescaleDB run in [Docker](https://www.docker.com/) containers. Unit testing is done using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) and can be run locally or on a CI/CD workflow using [GitHub Actions](https://github.com/features/actions).


#### Database schema

![Database schema](/images/database-schema.png)

### Demo

**Click on the image** to watch the demo video on YouTube
[![Demo](/images/seabirds-demo.png)](https://www.youtube.com/watch?v=8Ca58DS2OXA)


This demo ran on a VM usuing Ubuntu v22.04.3 64bit (ubuntu-22.04.3-desktop-amd64.iso) on Oracle VM VirtualBox with 3024MB of base memory, 3 processors and 45GB of storage.


### Run it

**Pre-requisites:**

- Node.js - 18.0.0
- npm - 9.8.1
- nvm - 0.39.5
- Docker - 24.0.7, build afdd53b
- Docker compose - v2.21.0

**Steps**

1. Download the dataset from Dryad. Unzip the gps.zip file and store the files in the directory called *gps*.

2. Start containers, install packages and load the data:
```console
npm run docker:up
npm i
npm run start
```

3. To access Grafana, open on your browser: [localhost:3000](http://localhost:3000)
```
Username: admin
Password: admin
```
4. Interact with the dashboards on Grafana.

5. To stop the containers:
```console
npm run docker:down
```