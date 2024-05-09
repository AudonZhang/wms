# wms

A warehouse management system that use Angular for the frontend, Python Flask for the backend, and MySQL for the database.

## Dependencies:

- python: 3.10.12
- node.js: 20.11.1
- npm: 10.2.4
- Angular: 16.1.1

## Installation Steps

1. Clone the Repository
   <br>`git clone https://github.com/AudonZhang/wms.git`
   <br>`cd wms`
2. Install Dependencies
   <br>`pip install -r requirements.txt`
   <br>`cd frontend`
   <br>`npm install`
   <br>`cd ..`
3. Initialize MySQL
   <br>`cd dataInsert`
   <br>`python3 sql.py`
   <br>`cd ..`
4. Start the backend
   <br>`cd backend`
   <br>`flask run`
5. Start the frontend(new Terminal cd wms)
   <br>`cd frontend`
   <br>`ng serve`
6. Use the system
   <br>Access http://127.0.0.1:4200 in your browser and enter the user ID and password from dataInsert/sql.py
