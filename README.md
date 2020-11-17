# Student Teacher Assignment 👨‍🎓👨‍🏫

## Prerequisites 
StudentTeacher requires Docker and Postman to run.

- Install [Docker](https://docs.docker.com/get-docker/)
- Install [Postman](https://www.postman.com/downloads/)

## Usage
1. To get started, run `docker-compose up` in your CLI which will build the image and start the service. 
2. Once the service is up, launch Postman
3. You will be able to run the APIs in Postman by selecting ```GET``` or ```POST``` and entering ```http://localhost:8080/``` followed by the API endpoint for each of the APIs .

## APIs
#### 1. (Extra) Create a teacher 
- Endpoint: ```POST /api/add-teacher```
- Request body example:
```
{
  "email": "teacherken@gmail.com"
}
```

#### 2. (Extra) Create a student 
- Endpoint: ```POST /api/add-student```
- Request body example 1 (default student is not suspended unless stated):
```
{
  "email": "studenthon@gmail.com"
}
```
- Request body example 2 (suspend student upon creation)
```
{
  "email": "studenthon@gmail.com",
  "suspended": true
}
```

#### 3. As a teacher, I want to register one or more students to a specified teacher.
- Endpoint: ```POST /api/register```
- Request body:
```
{
  "teacher": "teacherken@gmail.com"
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```

#### 4. As a teacher, I want to retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).
- Endpoint: ```GET /api/commonstudents```
- Request example 1: ```GET /api/commonstudents?teacher=teacherken%40gmail.com```
- Request example 2: ```GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com```

#### 5. As a teacher, I want to suspend a specified student.
- Endpoint: ```POST /api/suspend```
- Request body:
```
{
  "student" : "studentmary@gmail.com"
}
```

#### 6. As a teacher, I want to retrieve a list of students who can receive a given notification.
- Endpoint: ```POST /api/retrievefornotifications```
- Request body example 1:
```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```

## Testing
Unit tests can be run by entering the following command into your CLI:
```
docker-compose run web npm test
```