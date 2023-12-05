npx sequelize-cli init:models --force
npx sequelize-cli init:migrations --force

npx sequelize-cli model:generate --name Colony --attributes id:integer

npx sequelize-cli model:generate --name Species --attributes id:string,name:string

npx sequelize-cli model:generate --name Bird --attributes id:string,colonyId:integer,speciesId:string

npx sequelize-cli model:generate --name GPSTrack --attributes id:integer,dateTime:date,longitude:float,\
latitude:float,altitude:float,unix:bigint,year:integer,maxDepth:float,coverageRatio:float,\
birdId:string,isDive0m:boolean,isDive1m:boolean,isDive2m:boolean,isDive3m:boolean,isDive4m:boolean,isDive5m:boolean