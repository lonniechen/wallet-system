# wallet-system

This project is a trial on wallet system, implementing with nestjs framework and a bit of domain driven design

## Getting Started
Prerequisites: Node v10.15.3 (or above), NPM v6.9.0 (or above)

run the command line below in project root to install (which might take a while)

```bash
npm install
```

and below command to run the service

```bash
npm run dev
```

for unit test, please run 

```bash
npm run test:unit
```

more details can be found in /package.json

total time spent on this project: 8 hours
planning: 30 mins
coding: 3 hours
writting test and debugging: 4 hours
documentation: 30 mins 

the project is bootstrap in /src/main.ts, with dependencies being managed by '*.module.ts' files;

the API entry point is in /src/api/wallet/wallet.controller.ts

also there is a Postman collection in the /postman/ folder, which can be imported to Postman and used to trigger API call if the project is running locally


## Remark
Due to time limitation, there's some compromised practises in this project:

1. for the ease of development, in-memory storage is implemented to save the time of setting up database

2. also use in-memory lock instead of database lock / middleware to handle concurrent issue

3. test coverage focus on the Wallet class and WalletService


## Enhancement:
There are some directions for future enhancements:

1. Transactions like deposite, withdraw, transfer should be catergorized in another controller (TransactionController) or service to maintain a well defined system architecture (microservice)

2. Also, transactions should be kept in storage, so that wallet balance can be reconciled with historical records

3. Authentication and encoding/masking during transmission are needed as wallet system should be secured under highest priority

4. Middleware like cache (redis) can be introduced to handle concurrent issues in distributed system; message queue (Kafka) can help to reduce the perforance loss and maintain eventual consistency

5.The usage of in-memory storage can be removed, use real database instead; and dependency injection can help to improve the efficiency of unit test

6. API design and relvant HTTP status code should be revisited; swagger can help to provide API doc

7. Loggers are not fully utilised; Metrics like prometheus can keep track on key indicators so that risks/performance bottlenecks can be captured

8. Improve test coverage and bring in Integration Test
