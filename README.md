# Cloud-Native-Data-Intesive-Applications

This project is part of the course 17647 - Data Intensive and Scalable Systems taught by Prof. Paulo Merson, at Carnegie Mellon University. 
The project uses design strategies and patterns commonly used in distributed systems like - Circuit Breaker & Backend For Frontend to implement a Book Management System. 

The system includes five services - 
1. Book BFF - Takes the requests for book service from the frontend and processes it. 
2. Book backend - Takes care of the database interactions (CRUD operations) for books. 
3. Customer BFF - Takes requests for customer service from the frontend and processes it. 
4. Customer backend - Takes care of the databse interactions (CRUD operations) for customers. 
5. CRM (Customer Relationship Management) - Registers a new customer and sends a welcome email once the registration is done. 

The technologies used are as follows - 
1. Javascript
2. NodeJS
3. MySQL (AWS RDS)
4. AWS compute (EC2)
5. Docker
6. JWT
7. BFF pattern
8. Single responsibility principle
9. Kubernetes and EKS
10. Kafka MSK
11. Circuit breaker


The architecture of the system is as mentioned below - 

<img width="1000" alt="Screen Shot 2022-11-17 at 9 50 05 AM" src="https://user-images.githubusercontent.com/38894750/202522449-0b1a12c9-4f9f-4829-81cb-f2969b8a2c21.png">

