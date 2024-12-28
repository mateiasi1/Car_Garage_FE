# Online Car Garage
To start this application, follow the next steps:

## Prerequisites
1. Have docker desktop installed

## When building for the first time
### Steps
1. If you want to avoid having user permissions with Docker (Optional) 
   - In your WSL or linux environment run export GID=1000
   - If not already set run export UID=1000 (Optional)
2. Open a terminal
3. Navigate to the api folder and create a .env file (check .env.example)
4. cd into the docker folder ``cd docker``
5. Run ``docker compose up -d --build``
6. sh/bash into the api container ``docker exec -it cargarage-api bash`` 
(or use your api container name instead of cargarage-api if you changed it)
7. Run ``composer install`` to install the packages
8. Run ``php bin/console doctrine:migrations:migrate`` to run the migrations
9. Run ``php bin/console doctrine:fixtures:load`` to run the data seeders

## When starting up the environment
### Steps
1. Open a terminal
2. cd into the docker folder
3. Run ``docker compose up``
4. If new migrations have been added run ``php bin/console doctrine:migrations:migrate`` (optional)

### Some things you might want to consider:
- In your ``C:\`` drive ``Windows\System32\drivers\etc`` file make sure you map localhost to our configuration
- For ease of use, just add these as new lines in your file

``127.0.0.1 caritp-client client.caritp.testdev``

``127.0.0.1 caritp-api api.caritp.testdev``

After you ran the steps check docker desktop to see if all containers are up and running.
Open a browser and:
- navigate to ``http:\\client.caritp.testdev`` to check the client app.
- api can be found at ``http:\\api.caritp.testdev``
