# NSMusicS-GO Music-Server
The goal of NSMusicS is to achieve internationalization+cloud native+streaming music services+professional audio+cross platform data interoperability, and integrate all well-known streaming media servers into NSMusicS to embrace the future of cloud native music and become a representative work in the Github cloud native music field

A Go (Golang) Backend Clean Architecture project with Gin, MongoDB, JWT Authentication Middleware, Test, and Docker.

## local debug run
 - modify: .env
   - DB_HOST=localhost
   - DB_PORT=27017
   - if $not local MongoDB_DATA_VOLUME
     - modify: docker-compose-local-windows.ps1 
       - $env:MongoDB_DATA_VOLUME = "C:\Users\Public\Documents\NSMusicS-GO\MongoDB"
       - $env:SQLITE_DATA_VOLUME = "C:\Users\Public\Documents\NSMusicS-GO\Sqlite"
       - $env:MUSIC_DATA_VOLUME = "E:\0_Music"
     - run: docker-compose-local-windows.ps1
     - await create: $env:MongoDB_DATA_VOLUME...
   - else if $have local MongoDB_DATA_VOLUME
     - run: docker-compose-mongodb.yaml
 - go install github.com/air-verse/air@latest
 - run: air
   
## docker build run
 - modify: .env
   - DB_HOST=mongodb
   - DB_USER=jiuge01
   - DB_PASS=jiuge01
 - modify: docker-compose.yaml
   - web: volumes
   - mongodb: volumes
 - run: docker-compose.yaml