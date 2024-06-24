# protonBaaS
A extendable BaaS(Backend as a Service) based on nodejs ecosystem.

### The directory contains source code structure:
```
/-
└───/core(the backend logic package)
└───/ui  (the frontend logic package)
└───dockerfile(to run as standalone using docker)
```

## Steps to run:-
### 1. As for development
- The **ui package** contains npm script for dev and build.As necessary run the script

- The **core package** contains npm script for dev and prod.As necessary run the script.

    - Make a **.env** file in the **core package** which should contain following environment variable:-

        - DB_URL=your monogodb database url.(preffer to use **mongodb atlas url** as locally you have to set mongodb database as a replica)
        - DB_NAME=your database name.
        - PORT=port number for application to run on.
        - SECRET_KEY=hexadecimal secret key
            - To make secret key run in nodejs repl --> 
            ```
            require('crypto').randomBytes(48, function(err, buffer) { var token = buffer.toString('hex'); console.log(token); });
            ```
- So to run as development:-
    - Step 1] - Run npm run dev from **core package**(Make sure your mongodb server is up and running).(This will start backend server)
    - Step 2] - Run npm run dev from **ui package**.(This will start the ui server).
    - Step 3] - Now dev environment is set and hot reload is enable so you can make changes to the code as need.

---
### 2. As for distribution

- #### Manually
    - Step 1] - Run npm run build from **ui package**.(This will build a dist in core package)
    - Step 2] - Setup the .env file as mentioned above
    - Step 3] - The core package is ready.Now you can run it as mentioned in prod script of **core package**.

- #### With Docker
    - Download the source code and be inside the **protonBaaS directory** to follow the bellow steps.
    - Step 1] - Install Docker locally.
    - Step 2] - Make a **.env** file in the **core package** which should contain following environment variable:-

        - DB_URL=your monogodb database url.(preffer to use **mongodb atlas url** as locally you have to set mongodb database as a replica.)
        - DB_NAME=your database name.
        - PORT=port number for application to run on.
        - SECRET_KEY=hexadecimal secret key
            - To make secret key run in nodejs repl --> 
            ```
            require('crypto').randomBytes(48, function(err, buffer) { var token = buffer.toString('hex'); console.log(token); });
    - Step 2] - run->```docker build -t protonbaas .```
    - Step 3] - run-> ```docker run -dp port:port protonbaas```
        - eg:- docker run -dp 8080:8080 protonbaas.
        
    Your appliction is ready to be access.Inspect the container to see access points

Any query DM:-
https://www.linkedin.com/in/sahilgomes2003/
    
