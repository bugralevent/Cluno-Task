![](https://github.com/bugralevent/Cluno-Task/workflows/Node%20CI/badge.svg)
# Description

[Github](https://github.com/bugralevent/cluno-task) Cluno-task repository.
## Libraries
#### This project uses NestJS, ExpressJS and Mongoose libraries.
###### There are two options to store the data, in memory or MongoDB. (Default = In Memory)
###### In order to run it with MongoDB, you have to pass DB_ADAPTER environment variable as `mongodb`.
###### Default web server port is 3000. Can be changed with PORT environment variable.
##### Adapters
There are 2 data adapters in this project, in memory and MongoDB. In memory is written for more performance tried to avoid cpu intensive loops, mostly with `O(n)` time complexity loops but sacrifices memory by creating indexes.
###### Postman Collection
There is an exported Postman Collection with all possible requests.
###### Tests
Tests are written with Jest, with all possible cases with pricing sort and visible controls.

## List Offers (Port = 3000)

```
POST /listOffers HTTP/1.1
Host: localhost:3000
Content-Type: application/json
User-Agent: PostmanRuntime/7.20.1
Accept: */*
Cache-Control: no-cache
Postman-Token: 6c09c671-c840-4b1e-af11-b4aa967ade11,b393c18b-d874-440d-8659-c7b98512f7e5
Host: localhost:3000
Accept-Encoding: gzip, deflate
Content-Length: 88
Cookie: ss-opt=temp; X-UAId=6; ss-id=ubJqF7bsyvELIHdLc5Uu; ss-pid=ECyL79W0mpNunqwHZlxz
Connection: keep-alive
cache-control: no-cache

{
	"priceStart": 100,
	"priceEnd": 290,
	"portfolio": "0001",
	"make": ["Opel", "BMW"]
}
```

## Detail of an Offer (Port = 3000)
```
GET /details/115 HTTP/1.1
Host: localhost:3000
User-Agent: PostmanRuntime/7.20.1
Accept: */*
Cache-Control: no-cache
Postman-Token: b5b7814e-0000-4f24-9a3a-6e0103d43086,009e03be-873b-4b40-a1a6-b98371faa89a
Host: localhost:3000
Accept-Encoding: gzip, deflate
Cookie: ss-opt=temp; X-UAId=6; ss-id=ubJqF7bsyvELIHdLc5Uu; ss-pid=ECyL79W0mpNunqwHZlxz
Connection: keep-alive
cache-control: no-cache


```


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test 
```


## Stay in touch

- Author - [Bugra Levent Condal](https://github.com/bugralevent)
- LinkedIn - [@bugraleventcondal](https://www.linkedin.com/in/bugraleventcondal/)
