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

    - Make a .env file in the **core package** which should contain following environment variable:-

        - DB_URL=your monogodb database url.(preffer to use **mongodb atlas url** as in local u have to set mongodb database as replica as well)
        - DB_NAME=your database name
        - SECRET_KEY=hexadecimal secret key
            - To make secret key run in nodejs repl --> 
            ```
            require('crypto').randomBytes(48, function(err, buffer) { var token = buffer.toString('hex'); console.log(token); });
            ```
- So to run as development:-
    - Step 1] - Run npm run dev from **core package**(Make sure your mongodb server is up and running).(This will start backend server)
    - Step 2] - Run npm run dev from **ui package**.(This will start the ui server).
    - Step 3] - Acesss the UI.

---
### 2. As for distribution

- #### Manually
    - Step 1] - Run npm run build from **ui package**.(This will build a dist in core package)
    - Step 2] - Setup the .env file as mentioned above
    - Step 3] - The core package is ready.Now you can run it as mentioned in prod script of **core package**.

- #### With Docker
    - Support on way
