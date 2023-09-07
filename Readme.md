# Setup

## 1. System Requirements (for Ubuntu 20.04 LTS)

- Minimum 8GB RAM
- Docker and Docker-compose installed ( Docker version 19.03.13, build 4484c46d9d, Docker-compose version 1.27.4, build 40524192)

## 2. Setup

- Project structure

```
- <Project_name>
    |--- asset-management-system
    |--- backend-service
    |--- core
    |--- web
    |--- docker

```

## 3. Run project with docker

- Go to _<Project_name>/docker_

```
docker compose up
```

After accessing http://localhost/

To stop running

```
cd <Project_name>/docker
docker compose down
```

## 4. Run project on localhost

- Go to _<Project_name>/docker_

```
docker-compose -f docker-compose.prod.yml up -d
```

In Terminal 1 to run frontend project

```
cd web
yarn
yarn start
```

In Terminal 2 to run backend service

```
cd backend-service
npm i
nx run-many --target=serve --all --maxParallel=10
```

In Terminal 3 to run core service

```
cd core
pip3 install -r requirements.txt
uvicorn main:app —host 0.0.0.0
```

In Terminal 4 to run asset management system

```
cd asset-management-system
npm i
npm run start:dev
```

After accessing http://localhost/3011

## 4. Init data

### Create an admin account

- Import template data from this link: https://drive.google.com/drive/folders/102PpTu8yiQR2vq1EwkCH4sClVm75YETD?usp=sharing
- The data of cve, cpe, cwe must be imported
- Import the account.user file to get the default account

for admin

```
- Email: admin@gmail.com
- Password: 12345678
```

for user

```
- Email: user@gmail.com
- Password: 12345678
```
